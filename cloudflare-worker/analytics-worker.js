/**
 * Cloudflare Worker: Google Analytics API Proxy
 * 
 * 이 파일을 Cloudflare Workers에 배포하세요.
 * 
 * 환경변수 설정 필요:
 * - GOOGLE_SERVICE_ACCOUNT_KEY: Google 서비스 계정 JSON 키
 * - GA_PROPERTY_ID: GA4 속성 ID (숫자만, 예: 123456789)
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        /* CORS 헤더 설정 */
        const corsHeaders = {
            'Access-Control-Allow-Origin': 'https://hyoreal.github.io',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300' /* 5분 캐시 */
        };

        /* CORS preflight */
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);

            /* /api/stats - 방문자 통계 */
            if (url.pathname === '/api/stats') {
                const data = await fetchVisitorStats(accessToken, env.GA_PROPERTY_ID);
                return new Response(JSON.stringify(data), { headers: corsHeaders });
            }

            /* /api/popular - 인기 게시글 */
            if (url.pathname === '/api/popular') {
                const data = await fetchPopularPosts(accessToken, env.GA_PROPERTY_ID);
                return new Response(JSON.stringify(data), { headers: corsHeaders });
            }

            /* /api/all - 모든 데이터 (방문자 + 인기 게시글) */
            if (url.pathname === '/api/all') {
                const [stats, popular] = await Promise.all([
                    fetchVisitorStats(accessToken, env.GA_PROPERTY_ID),
                    fetchPopularPosts(accessToken, env.GA_PROPERTY_ID)
                ]);
                return new Response(JSON.stringify({ ...stats, popularPosts: popular }), { headers: corsHeaders });
            }

            return new Response(JSON.stringify({ error: 'Not Found' }), {
                status: 404,
                headers: corsHeaders
            });
        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: corsHeaders
            });
        }
    }
};

/**
 * Google OAuth 액세스 토큰 획득
 */
async function getAccessToken(serviceAccountKey) {
    const key = JSON.parse(serviceAccountKey);
    const jwt = await createJWT(key);

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    if (!response.ok) {
        throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * JWT 생성 (서비스 계정 인증용)
 */
async function createJWT(key) {
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: key.client_email,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
    };

    const encodedHeader = base64urlEncode(JSON.stringify(header));
    const encodedPayload = base64urlEncode(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const signature = await signRS256(signatureInput, key.private_key);

    return `${signatureInput}.${signature}`;
}

/**
 * Base64 URL 인코딩
 */
function base64urlEncode(str) {
    const base64 = btoa(str);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * RS256 서명
 */
async function signRS256(data, privateKeyPem) {
    const pemContents = privateKeyPem
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');

    const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        encoder.encode(data)
    );

    return base64urlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * GA API 리포트 실행
 */
async function runGAReport(token, propertyId, body) {
    const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`GA API error: ${error}`);
    }

    return response.json();
}

/**
 * 방문자 통계 조회
 */
async function fetchVisitorStats(token, propertyId) {
    /* 오늘 방문자 수 */
    const todayResponse = await runGAReport(token, propertyId, {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }]
    });

    /* 전체 방문자 수 (사이트 시작일부터) */
    const totalResponse = await runGAReport(token, propertyId, {
        dateRanges: [{ startDate: '2023-01-01', endDate: 'today' }],
        metrics: [{ name: 'totalUsers' }]
    });

    return {
        todayVisitors: parseInt(todayResponse.rows?.[0]?.metricValues?.[0]?.value || '0'),
        totalVisitors: parseInt(totalResponse.rows?.[0]?.metricValues?.[0]?.value || '0'),
        updatedAt: new Date().toISOString()
    };
}

/**
 * 인기 게시글 조회
 */
async function fetchPopularPosts(token, propertyId) {
    const response = await runGAReport(token, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 20
    });

    return response.rows
        ?.filter(row => row.dimensionValues[0].value.startsWith('/posts/'))
        .slice(0, 5)
        .map(row => ({
            url: row.dimensionValues[0].value,
            title: row.dimensionValues[1].value.replace(' | hyoreal', ''),
            views: parseInt(row.metricValues[0].value)
        })) || [];
}
