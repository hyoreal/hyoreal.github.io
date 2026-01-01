# Cloudflare Worker 설정 가이드

## 1. Cloudflare 계정 설정

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. 회원가입 또는 로그인
3. Workers & Pages 클릭

## 2. Worker 생성

1. **Create Application** 클릭
2. **Create Worker** 선택
3. 이름 입력: `hyoreal-analytics`
4. **Deploy** 클릭

## 3. 코드 배포

1. 생성된 Worker 클릭
2. **Quick Edit** 클릭
3. `cloudflare-worker/analytics-worker.js` 내용 복사/붙여넣기
4. **Save and Deploy** 클릭

## 4. 환경변수 설정

Worker 설정 → Settings → Variables:

| Variable Name | Value |
|--------------|-------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | GitHub Secret과 동일한 JSON 키 |
| `GA_PROPERTY_ID` | GA4 속성 ID (예: `123456789`) |

## 5. 블로그 설정

`_config.yml`에 Worker URL 추가:

```yaml
# Cloudflare Worker URL
analytics_worker_url: 'https://hyoreal-analytics.YOUR_SUBDOMAIN.workers.dev'
```

## 6. 테스트

브라우저에서 테스트:
- `https://hyoreal-analytics.xxx.workers.dev/api/stats` → 방문자 통계
- `https://hyoreal-analytics.xxx.workers.dev/api/popular` → 인기 게시글
