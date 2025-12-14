---
layout: post

toc: true

title: "[AI 기초] Transformer 아키텍처 - Self-Attention과 DB Self Join 비유"

date: 2025-12-13 10:30:00 +0900

comments: true

categories: [AI 기초]

tags: [AI, LLM, Transformer, ChatGPT, Deep Learning]


---

### 1. Transformer 개요

#### 아키텍처 구조

- Embedding Layer: 토큰을 벡터로 변환
- Self-Attention: 모든 토큰 간 관계 계산
- Feed Forward Network: 비선형 변환

#### DB 쿼리 관점에서의 Transformer

```sql
-- Transformer = 복잡한 SELECT 쿼리
WITH token_embeddings AS (
    -- Step 1: 토큰을 벡터로 변환 (Embedding)
    SELECT token_id, embedding_vector
    FROM tokens
),
attention_scores AS (
    -- Step 2: Self-Attention (Self-Join)
    SELECT 
        t1.token_id AS query_token,
        t2.token_id AS key_token,
        CALCULATE_ATTENTION(t1.embedding, t2.embedding) AS attention_weight
    FROM token_embeddings t1
    CROSS JOIN token_embeddings t2
),
attended_vectors AS (
    -- Step 3: 가중 평균 계산
    SELECT 
        query_token,
        SUM(attention_weight * t2.embedding_vector) AS attended_vector
    FROM attention_scores a
    JOIN token_embeddings t2 ON a.key_token = t2.token_id
    GROUP BY query_token
)
SELECT * FROM attended_vectors;
```

------

### 2. Self-Attention: DB Self-Join 패턴

#### 개념 정의

- 문장 내 모든 토큰 간의 연관성(Weight)을 계산하는 과정
- DB Self-Join과 동일한 패턴
- 모든 토큰이 서로 N:N 관계로 연결되어 맥락 파악

#### DB Self-Join 비유

```sql
-- Self-Attention = Self-Join
SELECT 
    t1.token_id AS current_token,
    t2.token_id AS related_token,
    t1.embedding AS query_vector,
    t2.embedding AS key_vector,
    t2.value_vector AS value_vector,
    COSINE_SIMILARITY(t1.embedding, t2.embedding) AS attention_weight
FROM tokens t1
CROSS JOIN tokens t2
ORDER BY t1.token_id, attention_weight DESC;
```

#### 실제 동작 예시

```sql
-- 입력 문장: "Java는 객체지향 언어이고, Spring은 Java 프레임워크다"

-- "Spring" 토큰에 대한 Attention 계산
SELECT 
    'Spring' AS query_token,
    t2.token AS key_token,
    CALCULATE_ATTENTION('Spring', t2.token) AS attention_score
FROM tokens t2
WHERE t2.token IN ('Java', '프레임워크', '객체지향', '언어')
ORDER BY attention_score DESC;

-- 결과:
-- query_token | key_token | attention_score
-- Spring      | Java      | 0.85
-- Spring      | 프레임워크 | 0.72
-- Spring      | 객체지향   | 0.41
-- Spring      | 언어      | 0.15
```

> **Note:** Self-Attention은 모든 토큰 쌍에 대해 유사도를 계산하여 관계 파악

------

### 3. Q, K, V (Query, Key, Value): WHERE, INDEX, SELECT 패턴

#### 개념 정의

- **Query (Q)**: WHERE 절의 검색 조건 (찾고자 하는 것)
- **Key (K)**: INDEX 컬럼 (검색 대상의 식별자)
- **Value (V)**: SELECT 되는 실제 컬럼 값 (내용)
- 동작: Q와 K가 일치(유사도 높음)하면, 해당 V를 가져옴

#### DB 쿼리 비유

```sql
-- 일반 SELECT 쿼리
SELECT value_column                    -- Value (V)
FROM tokens
WHERE key_column = 'search_condition'   -- Query (Q) = WHERE 조건
  AND key_column IN (                   -- Key (K) = INDEX 컬럼
      SELECT indexed_column 
      FROM tokens 
      WHERE indexed_column LIKE '%pattern%'
  );

-- Self-Attention의 Q, K, V
SELECT 
    t1.token AS query_token,            -- Query (Q): 찾고자 하는 토큰
    t2.token AS key_token,              -- Key (K): 검색 대상 토큰
    t2.value_vector AS value_vector,    -- Value (V): 실제 내용
    COSINE_SIMILARITY(t1.query_vector, t2.key_vector) AS similarity
FROM tokens t1
CROSS JOIN tokens t2
WHERE COSINE_SIMILARITY(t1.query_vector, t2.key_vector) > threshold
ORDER BY similarity DESC;
```

#### Q, K, V 동작 과정

```sql
-- Step 1: Query 생성 (WHERE 조건 생성)
-- "Spring" 토큰이 다른 토큰들과의 관계를 찾고자 함
WITH query_vector AS (
    SELECT embedding AS query
    FROM tokens
    WHERE token = 'Spring'
)

-- Step 2: Key와의 유사도 계산 (INDEX 스캔)
SELECT 
    t.token AS key_token,
    COSINE_SIMILARITY(q.query, t.embedding) AS similarity
FROM query_vector q
CROSS JOIN tokens t
ORDER BY similarity DESC
LIMIT 3;

-- Step 3: Value 추출 (SELECT 실제 값)
-- 유사도가 높은 토큰의 Value를 가져옴
SELECT 
    key_token,
    value_vector,
    similarity
FROM (
    -- 위 쿼리 결과
) ranked_tokens
WHERE similarity > 0.5;
```

#### 실제 예시

```sql
-- 문장: "Java는 객체지향 언어이고, Spring은 Java 프레임워크다"

-- "Spring"의 Q, K, V 계산
SELECT 
    'Spring' AS query,
    t.token AS key,
    t.value_vector AS value,
    DOT_PRODUCT(
        (SELECT embedding FROM tokens WHERE token = 'Spring'),
        t.embedding
    ) / (
        NORM((SELECT embedding FROM tokens WHERE token = 'Spring')) * 
        NORM(t.embedding)
    ) AS attention_weight
FROM tokens t
ORDER BY attention_weight DESC;

-- 결과:
-- query  | key        | attention_weight | value (의미)
-- Spring | Java       | 0.85             | 프로그래밍 언어
-- Spring | 프레임워크  | 0.72             | 개발 도구
-- Spring | 객체지향    | 0.41             | 프로그래밍 패러다임
```

> **Note:** Q와 K의 유사도가 높을수록 해당 V의 가중치가 커짐

------

### 4. Multi-Head Attention: Parallel Processing 패턴

#### 개념 정의

- 여러 개의 Attention을 병렬로 수행
- 각 Head는 서로 다른 관점(조건)으로 Join 수행
- 다양한 문맥 정보를 수집하여 종합

#### Parallel Processing 비유

```sql
-- Single-Head Attention (단일 스레드)
SELECT 
    query_token,
    key_token,
    CALCULATE_ATTENTION(query, key) AS attention
FROM tokens
WHERE attention > threshold;

-- Multi-Head Attention (멀티 스레드)
-- Head 1: 문법적 관계 파악
WITH head1 AS (
    SELECT 
        query_token,
        key_token,
        CALCULATE_ATTENTION_GRAMMAR(query, key) AS attention
    FROM tokens
    WHERE attention > threshold
),
-- Head 2: 의미적 관계 파악
head2 AS (
    SELECT 
        query_token,
        key_token,
        CALCULATE_ATTENTION_SEMANTIC(query, key) AS attention
    FROM tokens
    WHERE attention > threshold
),
-- Head 3: 위치적 관계 파악
head3 AS (
    SELECT 
        query_token,
        key_token,
        CALCULATE_ATTENTION_POSITION(query, key) AS attention
    FROM tokens
    WHERE attention > threshold
)
-- 모든 Head 결과를 결합 (Concatenate)
SELECT 
    query_token,
    key_token,
    CONCAT(head1.attention, head2.attention, head3.attention) AS multi_head_attention
FROM head1
JOIN head2 USING (query_token, key_token)
JOIN head3 USING (query_token, key_token);
```

#### 멀티 스레드 처리 패턴

```java
// Multi-Head Attention = Parallel Stream Processing
public class MultiHeadAttention {
    
    public Vector[] process(Vector[] embeddings) {
        // 여러 Head를 병렬로 처리
        List<Vector[]> headResults = IntStream.range(0, numHeads)
            .parallel()  // 병렬 처리
            .mapToObj(headIndex -> {
                // 각 Head는 서로 다른 관점으로 Attention 계산
                return calculateAttention(
                    embeddings, 
                    headIndex  // Head별로 다른 가중치
                );
            })
            .collect(Collectors.toList());
        
        // 모든 Head 결과를 결합
        return concatenate(headResults);
    }
}
```

#### 실제 동작 예시

```sql
-- 8개의 Head가 병렬로 동작
-- 각 Head는 서로 다른 관점으로 Self-Join 수행

-- Head 1: 주어-서술어 관계
SELECT query_token, key_token, attention_score
FROM attention_head1
WHERE attention_score > 0.5;

-- Head 2: 형용사-명사 관계
SELECT query_token, key_token, attention_score
FROM attention_head2
WHERE attention_score > 0.5;

-- ... (Head 3 ~ Head 8)

-- 최종 결과: 모든 Head의 정보를 결합
SELECT 
    query_token,
    CONCAT_ATTENTIONS(
        head1.attention,
        head2.attention,
        ...
        head8.attention
    ) AS final_attention
FROM attention_head1 head1
JOIN attention_head2 head2 USING (query_token, key_token)
-- ... (나머지 Head들 JOIN)
```

> **Note:** Multi-Head Attention은 여러 관점의 정보를 병렬로 수집하여 더 풍부한 문맥 파악 가능

### 5. 핵심 정리

#### Transformer 아키텍처 요약

| 개념 | DB 쿼리 비유 | 설명 |
|------|------------|------|
| **Self-Attention** | Self-Join | 모든 토큰 간 관계를 CROSS JOIN으로 계산 |
| **Query (Q)** | WHERE 절 | 찾고자 하는 조건 |
| **Key (K)** | INDEX 컬럼 | 검색 대상의 식별자 |
| **Value (V)** | SELECT 컬럼 | 실제 추출되는 내용 |
| **Multi-Head Attention** | Parallel Processing | 여러 관점의 JOIN을 병렬로 수행 |

#### Self-Attention 동작 요약

```sql
-- Self-Attention = Self-Join + 가중 평균
SELECT 
    t1.token AS query_token,
    SUM(
        COSINE_SIMILARITY(t1.embedding, t2.embedding) * t2.value_vector
    ) AS attended_vector
FROM tokens t1
CROSS JOIN tokens t2
GROUP BY t1.token;
```

> **Note:** Transformer는 Self-Attention을 통해 문장 내 모든 토큰 간의 관계를 한 번에 파악함

------

> 참고 자료
> - Attention Is All You Need (Transformer 논문): https://arxiv.org/abs/1706.03762
> - OpenAI GPT-3 Paper: https://arxiv.org/abs/2005.14165
> - Illustrated Transformer: https://jalammar.github.io/illustrated-transformer/

