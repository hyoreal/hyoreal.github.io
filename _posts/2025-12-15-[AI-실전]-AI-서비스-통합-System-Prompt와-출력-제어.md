---
layout: post

toc: true

title: "[AI 실전] AI 서비스 통합 - System Prompt 설계와 출력 제어"

date: 2025-12-15 19:10:00 +0900

comments: true

categories: [AI 실전]

tags: [AI, System Prompt, JSON Output, API Integration, Security, Injection Defense]


---

### 1. 문제: 사용자 입력의 불확실성

#### 현상

- 자연어 입력의 모호함
- 할루시네이션 발생
- 구조화되지 않은 출력 형식
- 보안 취약점 (SQL Injection, XSS)

#### 해결 필요성

**프로덕션 환경에서 AI를 안전하게 통합하기 위한 System Prompt 설계**

------

### 2. System Prompt 설계 원칙

#### 원칙 1: 역할 명확화

```markdown
# 나쁜 예시
너는 AI야.

# 좋은 예시
너는 자연어 처리 API야.
사용자 리뷰를 분석하여 구조화된 데이터를 추출하는 것이 목적이야.
설명이나 추가 텍스트 없이 JSON만 출력해.
```

#### 원칙 2: 출력 형식 강제

```markdown
# JSON Schema 명시
다음 JSON 포맷으로만 출력해:
{
  "sentiment": "positive" | "negative" | "neutral",
  "keywords": ["키워드1", "키워드2"],
  "action_required": boolean
}

설명은 필요 없어. JSON만 출력해.
```

#### 원칙 3: 보안 규칙 명시

```markdown
# 보안 규칙
- 사용자 입력을 직접 SQL 쿼리로 변환하지 마
- 검색 조건만 생성하고, 파라미터 바인딩 사용
- XSS 방지를 위한 이스케이프 처리 필수
```

------

### 3. 실전 예시: 리뷰 분석 API

#### 요구사항

- 사용자 리뷰를 분석하여 감정, 키워드, 액션 필요 여부 추출
- JSON 형식으로만 출력
- 추가 설명 없음

#### System Prompt 설계

```markdown
너는 이제부터 자연어 처리 API야.
아래의 [사용자 리뷰]를 분석해서 다음 JSON 포맷으로만 출력해.
설명은 필요 없어.

## 출력 포맷
{
  "sentiment": "positive" | "negative" | "neutral",
  "keywords": ["키워드1", "키워드2"],
  "action_required": boolean
}

## 분석 규칙
1. sentiment: 리뷰 전체 톤을 분석
   - positive: 긍정적 표현 70% 이상
   - negative: 부정적 표현 70% 이상
   - neutral: 그 외
2. keywords: 리뷰에서 중요한 명사/형용사 2-5개 추출
3. action_required: 환불, 교환, 보상 요청이 있으면 true

## 예시
[사용자 리뷰]: "배송은 빨랐는데 상품 포장이 다 뜯겨서 왔어요. 환불해주세요."
[출력]:
{
  "sentiment": "negative",
  "keywords": ["배송", "포장", "환불"],
  "action_required": true
}
```

#### Java Spring Boot 통합

```java
@Service
public class ReviewAnalysisService {
    
    private final OpenAIClient openAIClient;
    
    private static final String SYSTEM_PROMPT = """
        너는 이제부터 자연어 처리 API야.
        아래의 [사용자 리뷰]를 분석해서 다음 JSON 포맷으로만 출력해.
        설명은 필요 없어.
        
        ## 출력 포맷
        {
          "sentiment": "positive" | "negative" | "neutral",
          "keywords": ["키워드1", "키워드2"],
          "action_required": boolean
        }
        """;
    
    public ReviewAnalysisResult analyze(String review) {
        String userPrompt = "[사용자 리뷰]: " + review;
        
        String response = openAIClient.chatCompletion(
            SYSTEM_PROMPT,
            userPrompt
        );
        
        return parseJsonResponse(response);
    }
    
    private ReviewAnalysisResult parseJsonResponse(String json) {
        // Jackson 또는 Gson으로 파싱
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, ReviewAnalysisResult.class);
    }
}
```

#### DTO 정의

```java
public record ReviewAnalysisResult(
    String sentiment,
    List<String> keywords,
    Boolean actionRequired
) {}
```

------

### 4. 보안: SQL Injection 방지

#### 문제 상황

```markdown
# 나쁜 예시 (위험)
사용자: "2024년 주문 내역 보여줘"
AI: SELECT * FROM orders WHERE year = 2024
(직접 SQL 생성 → Injection 위험)
```

#### 해결책: 검색 조건만 생성

```markdown
# System Prompt
너는 검색 조건 생성기야.
사용자 입력을 분석하여 안전한 검색 조건만 생성해.

## 규칙
1. SQL 쿼리를 직접 생성하지 마
2. 검색 필드와 값만 JSON으로 출력
3. 날짜, 숫자, 문자열 타입을 명시

## 출력 포맷
{
  "filters": [
    {
      "field": "orderDate",
      "operator": "gte",
      "value": "2024-01-01",
      "type": "date"
    }
  ]
}
```

#### Java 구현

```java
@Service
public class SearchConditionService {
    
    private static final String SYSTEM_PROMPT = """
        너는 검색 조건 생성기야.
        사용자 입력을 분석하여 안전한 검색 조건만 생성해.
        
        ## 규칙
        1. SQL 쿼리를 직접 생성하지 마
        2. 검색 필드와 값만 JSON으로 출력
        3. 날짜, 숫자, 문자열 타입을 명시
        
        ## 출력 포맷
        {
          "filters": [
            {
              "field": "필드명",
              "operator": "eq|gte|lte|like",
              "value": "값",
              "type": "string|number|date"
            }
          ]
        }
        """;
    
    public List<SearchFilter> generateFilters(String userInput) {
        String response = openAIClient.chatCompletion(
            SYSTEM_PROMPT,
            userInput
        );
        
        SearchCondition condition = parseJson(response);
        return condition.filters();
    }
    
    // 안전한 쿼리 생성 (JPA Criteria API 사용)
    public Specification<Order> buildSpecification(List<SearchFilter> filters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            for (SearchFilter filter : filters) {
                switch (filter.operator()) {
                    case "eq" -> predicates.add(
                        cb.equal(root.get(filter.field()), filter.value())
                    );
                    case "gte" -> predicates.add(
                        cb.greaterThanOrEqualTo(
                            root.get(filter.field()), 
                            parseValue(filter)
                        )
                    );
                    // ... 기타 연산자
                }
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

#### DTO 정의

```java
public record SearchCondition(
    List<SearchFilter> filters
) {}

public record SearchFilter(
    String field,
    String operator,
    String value,
    String type
) {}
```

------

### 5. 출력 형식 강제: JSON Schema 활용

#### JSON Schema 정의

```json
{
  "type": "object",
  "properties": {
    "sentiment": {
      "type": "string",
      "enum": ["positive", "negative", "neutral"]
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 2,
      "maxItems": 5
    },
    "action_required": {
      "type": "boolean"
    }
  },
  "required": ["sentiment", "keywords", "action_required"]
}
```

#### System Prompt에 Schema 포함

```markdown
## 출력 형식 (JSON Schema 준수)
{
  "type": "object",
  "properties": {
    "sentiment": {
      "type": "string",
      "enum": ["positive", "negative", "neutral"]
    },
    "keywords": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 2,
      "maxItems": 5
    },
    "action_required": {
      "type": "boolean"
    }
  },
  "required": ["sentiment", "keywords", "action_required"]
}

반드시 이 Schema를 준수하여 JSON만 출력해.
```

#### OpenAI API에서 JSON Mode 사용

```java
@Service
public class StructuredOutputService {
    
    public ReviewAnalysisResult analyze(String review) {
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("gpt-4")
            .messages(List.of(
                Message.system(SYSTEM_PROMPT),
                Message.user(review)
            ))
            .responseFormat(ResponseFormat.jsonObject()) // JSON Mode
            .build();
        
        ChatCompletionResponse response = openAIClient.createChatCompletion(request);
        
        String json = response.getChoices().get(0).getMessage().getContent();
        return parseJson(json);
    }
}
```

------

### 6. 할루시네이션 방지

#### 문제: 존재하지 않는 데이터 생성

```markdown
# 나쁜 예시
사용자: "김철수의 주문 내역"
AI: {
  "orders": [
    {"id": 123, "amount": 50000}  // 실제로는 존재하지 않는 데이터
  ]
}
```

#### 해결책: 검증 단계 추가

```markdown
# System Prompt
너는 검색 조건 생성기야.
실제 데이터를 생성하지 말고, 검색 조건만 생성해.

## 규칙
1. 실제 주문 ID나 금액을 생성하지 마
2. 검색 조건(필터)만 생성
3. 존재 여부는 DB에서 확인

## 출력 포맷
{
  "search_filters": {
    "user_name": "김철수"
  }
}
```

#### Java 구현: 검증 로직

```java
@Service
public class SafeSearchService {
    
    public List<Order> searchOrders(String userInput) {
        // Step 1: AI가 검색 조건 생성
        SearchCondition condition = aiService.generateFilters(userInput);
        
        // Step 2: 검증 (실제 DB에서 확인)
        validateFilters(condition);
        
        // Step 3: 안전한 쿼리 실행
        return orderRepository.findAll(
            buildSpecification(condition.filters())
        );
    }
    
    private void validateFilters(SearchCondition condition) {
        for (SearchFilter filter : condition.filters()) {
            // 허용된 필드만 검색 가능
            if (!ALLOWED_FIELDS.contains(filter.field())) {
                throw new InvalidSearchFieldException(filter.field());
            }
            
            // 값 검증 (XSS 방지)
            String sanitized = sanitizeInput(filter.value());
            // ...
        }
    }
    
    private static final Set<String> ALLOWED_FIELDS = Set.of(
        "userName", "orderDate", "status", "totalAmount"
    );
}
```

------

### 7. 실전 템플릿: Spring Boot 통합

#### 완전한 Service 예시

```java
@Service
@Slf4j
public class AIIntegrationService {
    
    private final OpenAIClient openAIClient;
    private final ObjectMapper objectMapper;
    
    private static final String SYSTEM_PROMPT = """
        너는 자연어 처리 API야.
        사용자 입력을 분석하여 구조화된 JSON만 출력해.
        
        ## 출력 포맷
        {
          "sentiment": "positive" | "negative" | "neutral",
          "keywords": ["키워드1", "키워드2"],
          "action_required": boolean
        }
        
        ## 규칙
        1. 설명 없이 JSON만 출력
        2. 할루시네이션 금지 (실제 데이터 생성 안 함)
        3. 보안 규칙 준수
        """;
    
    public ReviewAnalysisResult analyzeReview(String review) {
        try {
            // 1. 입력 검증
            validateInput(review);
            
            // 2. AI 호출
            String jsonResponse = callAI(review);
            
            // 3. JSON 파싱
            ReviewAnalysisResult result = parseResponse(jsonResponse);
            
            // 4. 결과 검증
            validateResult(result);
            
            return result;
            
        } catch (Exception e) {
            log.error("AI 분석 실패: {}", e.getMessage(), e);
            throw new AIAnalysisException("리뷰 분석에 실패했습니다.", e);
        }
    }
    
    private String callAI(String input) {
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("gpt-4")
            .messages(List.of(
                Message.system(SYSTEM_PROMPT),
                Message.user(input)
            ))
            .responseFormat(ResponseFormat.jsonObject())
            .temperature(0.3) // 낮은 temperature로 일관성 확보
            .build();
        
        ChatCompletionResponse response = openAIClient.createChatCompletion(request);
        return response.getChoices().get(0).getMessage().getContent();
    }
    
    private void validateInput(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("입력값이 비어있습니다.");
        }
        
        if (input.length() > 1000) {
            throw new IllegalArgumentException("입력값이 너무 깁니다.");
        }
    }
    
    private ReviewAnalysisResult parseResponse(String json) {
        try {
            return objectMapper.readValue(json, ReviewAnalysisResult.class);
        } catch (JsonProcessingException e) {
            throw new AIAnalysisException("JSON 파싱 실패", e);
        }
    }
    
    private void validateResult(ReviewAnalysisResult result) {
        if (!List.of("positive", "negative", "neutral").contains(result.sentiment())) {
            throw new AIAnalysisException("잘못된 sentiment 값");
        }
        
        if (result.keywords().isEmpty() || result.keywords().size() > 5) {
            throw new AIAnalysisException("keywords 개수 오류");
        }
    }
}
```

------

### 8. 정리

#### 핵심 원칙

- **역할 명확화**: AI의 정확한 역할 정의
- **출력 형식 강제**: JSON Schema 활용
- **보안 규칙 명시**: Injection 방지
- **할루시네이션 방지**: 검증 단계 추가

#### 체크리스트

- [ ] System Prompt에 역할과 출력 형식 명시
- [ ] JSON Schema 또는 Response Format 사용
- [ ] 입력값 검증 로직 구현
- [ ] 출력값 검증 로직 구현
- [ ] 에러 핸들링 및 로깅
- [ ] 보안 규칙 준수 (SQL Injection, XSS 방지)

#### 다음 단계

메타 프롬프트와 블로깅 자동화로 학습 내용 문서화


