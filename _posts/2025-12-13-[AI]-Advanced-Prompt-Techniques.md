---
layout: post

toc: true

title: "[AI 실전] Zero-shot, Few-shot, CoT 비교 및 선택 가이드"

date: 2025-12-13 11:10:00 +0900

comments: true

categories: [AI, Prompt Engineering]

tags: [AI, Prompt, Few-Shot, Chain-of-Thought]


---

### 1. 기법 비교 요약

| 구분 | Zero-shot | Few-shot | Chain of Thought (CoT) |
|------|-----------|----------|------------------------|
| **특징** | 빠르고 간단함 | 출력 형식 준수 필요, 일관성 유지 | 논리적 추론 필요, 복잡한 계산 |
| **예시 필요** | ❌ 불필요 | ✅ 2~5개 | ❌ 불필요 |
| **복잡도** | 낮음 | 중간 | 높음 |
| **정확도** | 낮음 | 높음 | 매우 높음 |
| **일관성** | 낮음 | 매우 높음 | 높음 |
| **토큰 수** | 적음 | 중간 | 많음 |
| **비용** | 낮음 | 중간 | 높음 |
| **지연 시간** | 빠름 | 중간 | 느림 |
| **적합한 작업** | 단순 지식 검색, 짧은 번역 | 데이터 추출, 스타일 모방, JSON 포맷팅 | 알고리즘 설계, 아키텍처 제안, 복잡한 비즈니스 로직 |

------

### 2. 선택 가이드 (Decision Tree)

#### 의사결정 로직

```
작업이 주어짐
    │
    ▼
┌─────────────────────┐
│ 단순 지식 질문인가?  │
│ (검색, 번역, 설명)   │
└────┬─────────────────┘
     │
     ├─ YES → Zero-shot
     │         예: "JPA 영속성 컨텍스트 설명해줘"
     │
     └─ NO
        │
        ▼
   ┌─────────────────────┐
   │ 특정 포맷/JSON이     │
   │ 필요한가?            │
   └────┬─────────────────┘
        │
        ├─ YES → Few-shot
        │         예: "우리 팀 API Response 형식으로 작성해줘"
        │         (예시 2~3개 제공)
        │
        └─ NO
           │
           ▼
      ┌─────────────────────┐
      │ 단계별 추론이       │
      │ 필요한가?            │
      └────┬─────────────────┘
           │
           ├─ YES → Chain of Thought
           │         예: "주문 취소 로직 구현해줘"
           │         "단계별로 생각해봐:"
           │
           └─ NO
              │
              ▼
         ┌─────────────────────┐
         │ 매우 복잡하고 긴    │
         │ 작업인가?            │
         └────┬─────────────────┘
              │
              └─ YES → CoT + Few-shot (혼합)
                       예: "우리 팀 스타일로 복잡한 로직 구현해줘"
                       (Few-shot 예시 + CoT 단계별 사고)
```

#### 코드로 표현한 선택 로직

```java
public class PromptTechniqueSelector {
    
    public PromptTechnique selectTechnique(Task task) {
        
        // 1. Zero-shot: 단순 지식 질문
        if (task.isSimpleKnowledgeQuery()) {
            return PromptTechnique.ZERO_SHOT;
            // 예시: "JPA 영속성 컨텍스트 설명해줘"
        }
        
        // 2. Few-shot: 특정 포맷/JSON 필요
        if (task.requiresSpecificFormat() || task.needsJSONStructure()) {
            return PromptTechnique.FEW_SHOT;
            // 예시: "우리 팀 API Response 형식으로 작성해줘"
        }
        
        // 3. CoT: 단계별 추론 필요
        if (task.requiresStepByStepReasoning()) {
            return PromptTechnique.CHAIN_OF_THOUGHT;
            // 예시: "주문 취소 로직 구현해줘 (단계별로 생각해봐)"
        }
        
        // 4. 혼합: 매우 복잡하고 긴 작업
        if (task.isVeryComplex() && task.requiresConsistency()) {
            return PromptTechnique.COT_WITH_FEW_SHOT;
            // 예시: "우리 팀 스타일로 복잡한 로직 구현해줘"
        }
        
        return PromptTechnique.ZERO_SHOT; // default
    }
}
```

------

### 3. Cost & Latency 고려사항

#### 토큰 수 비교

| 기법 | 입력 토큰 | 출력 토큰 | 총 토큰 | 상대 비용 |
|------|----------|----------|---------|----------|
| Zero-shot | 50~200 | 100~500 | 150~700 | 1x (기준) |
| Few-shot | 500~2000 | 100~500 | 600~2500 | 3~4x |
| CoT | 200~500 | 500~3000 | 700~3500 | 4~5x |
| CoT + Few-shot | 1000~3000 | 500~3000 | 1500~6000 | 8~10x |

#### 실무 팁: Iterative Approach

```java
// 1단계: Zero-shot으로 시작 (최소 비용)
String result1 = llm.generate("User API 만들어줘");
// → 기본 코드 생성 (150 토큰)

// 2단계: 결과가 마음에 안들면 Few-shot으로 개선
if (!isSatisfied(result1)) {
    String result2 = llm.generate("""
        다음 스타일로 개선해줘:
        [예시 1]
        [예시 2]
        [내 코드] """ + result1);
    // → 개선된 코드 (800 토큰)
}

// 3단계: 복잡한 로직이면 CoT 추가
if (requiresComplexLogic(result2)) {
    String result3 = llm.generate("""
        이 코드를 단계별로 검토하고 개선해줘:
        [코드] """ + result2 + """
        
        1. 요구사항 분석
        2. 예외 케이스 정리
        3. 최종 개선 코드
        """);
    // → 완성도 높은 코드 (2000 토큰)
}
```

#### 비용 최적화 전략

- **처음엔 Zero-shot으로 시도**: 빠르고 저렴하게 프로토타입 생성
- **실패 시 Few-shot으로 고도화**: 일관성과 정확도 향상
- **복잡한 작업은 CoT 적용**: 체계적 접근으로 버그 감소
- **반복 개선보다는 처음부터 적절한 기법 선택**: 총 비용 절감

------

### 4. 실전 예시

#### Zero-shot 적합 사례

```java
// ✅ 적합: 단순 지식 검색
String prompt = "JPA 영속성 컨텍스트가 뭔지 설명해줘";
// → 빠르고 정확한 설명 (150 토큰)

// ✅ 적합: 짧은 번역
String prompt2 = "다음 문장을 영어로 번역해줘: '안녕하세요'";
// → 즉시 번역 (100 토큰)
```

#### Few-shot 적합 사례

```java
// ✅ 적합: JSON 포맷팅
String prompt = """
다음 예시를 참고하여 동일한 형식으로 작성해줘:

[예시 1]
입력: "사용자 정보 조회"
출력: {
    "success": true,
    "data": {"id": 1, "name": "홍길동"},
    "timestamp": "2024-01-15T10:30:00"
}

[예시 2]
입력: "주문 목록 조회"
출력: {
    "success": true,
    "data": [{"id": 1, "amount": 10000}],
    "timestamp": "2024-01-15T10:31:00"
}

[내 작업]
입력: "상품 상세 조회"
출력: ?
""";
// → 일관된 JSON 형식 (800 토큰)
```

#### CoT 적합 사례

```java
// ✅ 적합: 복잡한 비즈니스 로직
String prompt = """
주문 취소 로직을 구현해줘.

단계별로 생각해봐:
1. 비즈니스 요구사항 분석 (재고 복구, 결제 취소, 포인트 복구)
2. 예외 상황 정리 (배송 시작, 기한 초과)
3. 데이터 정합성 (트랜잭션 범위)
4. 최종 코드 작성
""";
// → 완성도 높은 코드 (2000 토큰)
```

#### 혼합 사용 사례

```java
// ✅ 적합: 복잡하고 일관성도 중요한 작업
String prompt = """
우리 팀의 에러 핸들링 패턴으로 작성해줘.

[예시 1: UserService]
@Service
public class UserService {
    public UserDto createUser(SignupRequest request) {
        try {
            // 비즈니스 로직
            return UserDto.from(user);
        } catch (DuplicateEmailException e) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL, e);
        }
    }
}

[내 작업]
PaymentService의 결제 처리 메서드를 만들어줘.

단계별로 생각해봐:
1. 어떤 검증이 필요한가?
2. 어떤 예외가 발생할 수 있는가?
3. 위 예시 패턴을 따라 코드 작성
""";
// → Few-shot 일관성 + CoT 완성도 (2500 토큰)
```

------

### 5. 선택 체크리스트

작업 전 다음 질문으로 기법 선택:

1. **단순 지식 질문인가?** → Zero-shot
2. **특정 포맷/JSON이 필요한가?** → Few-shot
3. **단계별 추론이 필요한가?** → CoT
4. **복잡하고 일관성도 중요한가?** → CoT + Few-shot

------

> 참고 자료
> - Chain-of-Thought Prompting Paper: https://arxiv.org/abs/2201.11903
> - Few-shot Learning: https://arxiv.org/abs/2005.14165
> - OpenAI Prompt Engineering: https://platform.openai.com/docs/guides/prompt-engineering
> - Prompt Engineering Guide: https://www.promptingguide.ai/

------

> 참고 자료
> - Chain-of-Thought Prompting Paper: https://arxiv.org/abs/2201.11903
> - Few-shot Learning: https://arxiv.org/abs/2005.14165
> - OpenAI Prompt Engineering: https://platform.openai.com/docs/guides/prompt-engineering
> - Prompt Engineering Guide: https://www.promptingguide.ai/

