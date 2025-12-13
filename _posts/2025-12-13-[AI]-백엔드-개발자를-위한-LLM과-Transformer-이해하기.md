---
layout: post

toc: true

title: "[AI] 백엔드 개발자를 위한 LLM과 Transformer 이해하기"

date: 2025-12-13 19:05:00 +0900

comments: true

categories: [AI, Machine Learning]

tags: [AI, LLM, Transformer, ChatGPT, Deep Learning]


---

### LLM, 개발자 관점에서 이해하기

최근 ChatGPT, Claude 같은 LLM(Large Language Model)이 개발 생태계를 빠르게 변화시키고 있어요. 하지만 "대충 엄청 큰 모델"이라는 것 외에 실제로 어떻게 동작하는지 궁금하지 않으셨나요?

저는 3년차 Java 백엔드 개발자로서, LLM의 작동 원리를 개발 용어와 비유로 이해해보았습니다. DB, 함수, 메모리 같은 익숙한 개념으로 설명해드릴게요!

------

### 1. Token (토큰) - 왜 글자 단위가 아니라 토큰 단위일까? 🔤

#### 개발자가 생각하는 첫 번째 의문

"텍스트를 처리한다면 `char[]` 배열처럼 글자 단위로 처리하면 되는 거 아닌가?"

하지만 LLM은 **토큰(Token)** 단위로 처리합니다.

```java
// 글자 단위 (비효율적)
String text = "안녕하세요";
char[] chars = text.toCharArray(); 
// 결과: ['안','녕','하','세','요'] - 5개 처리

// 토큰 단위 (효율적)
List<String> tokens = tokenize(text); 
// 결과: ["안녕", "하세요"] - 2개 처리
```

#### 왜 토큰 단위로 처리할까?

**1) 메모리 효율성 - DB 인덱싱과 유사**

데이터베이스에서 `Full Table Scan`보다 `Index Scan`이 효율적인 것처럼, 토큰화는 처리 단위를 줄여줍니다.

- 글자 단위: "데이터베이스" = 6개 문자 처리
- 토큰 단위: "데이터베이스" = 1개 토큰 처리

자주 사용되는 단어는 하나의 토큰으로 등록되어 있어, 매번 글자를 조합할 필요가 없어요.

**2) 의미 단위 처리 - 객체 지향과 유사**

```java
// 글자 단위 - 의미 없음
char[] chars = {'J', 'a', 'v', 'a'}; // 각각 독립적

// 토큰 단위 - 의미 있음
String token = "Java"; // 하나의 프로그래밍 언어 개념
```

"Java"라는 단어는 프로그래밍 언어라는 **개념**을 가지고 있습니다. 글자 'J', 'a', 'v', 'a'를 따로 처리하면 이 의미를 잃어버려요.

**3) 다국어 지원**

```
한글: "안녕하세요" → 1-2개 토큰
영어: "Hello" → 1개 토큰
중국어: "你好" → 1개 토큰
```

모든 언어를 효율적으로 처리할 수 있어요.

#### 실제 토큰화 예시

```
입력: "ChatGPT는 정말 똑똑해!"
토큰: ["Chat", "GPT", "는", " 정말", " 똑", "똑", "해", "!"]
       (약 8개 토큰)
```

여기서 중요한 점은 **공백도 토큰의 일부**라는 거예요. " 정말"처럼 앞에 공백이 포함됩니다.

------

### 2. Next Token Prediction - 어떻게 문장이 되나? 🔮

#### LLM의 핵심: 다음 토큰 예측

LLM은 결국 **"다음에 올 토큰을 예측하는 함수"**입니다.

```java
public class LLMGenerator {
    
    // 1. 다음 토큰 예측 (확률 기반)
    public Token predictNext(List<Token> context) {
        // 이전 모든 토큰을 보고 다음 토큰의 확률 분포 계산
        Map<Token, Double> probabilities = calculateProbabilities(context);
        
        // 예: {"는": 0.35, "을": 0.25, "가": 0.20, ...}
        return sampleFromDistribution(probabilities);
    }
    
    // 2. 문장 생성 (반복 호출)
    public String generateText(String prompt) {
        List<Token> tokens = tokenize(prompt);
        
        // 종료 토큰이 나오거나 최대 길이에 도달할 때까지 반복
        while (!isEndToken(tokens.getLast()) && tokens.size() < maxLength) {
            Token next = predictNext(tokens); // 다음 토큰 예측
            tokens.add(next);
        }
        
        return detokenize(tokens);
    }
}
```

#### 실제 작동 과정

```
사용자 입력: "Java는"

Step 1: predictNext(["Java", "는"])
→ 확률 분포: {" 객체": 0.40, " 프로그래밍": 0.25, " 언어": 0.20, ...}
→ 선택: " 객체" (확률 40%)
→ 현재 상태: "Java는 객체"

Step 2: predictNext(["Java", "는", " 객체"])
→ 확률 분포: {"지향": 0.60, "의": 0.25, ...}
→ 선택: "지향" (확률 60%)
→ 현재 상태: "Java는 객체지향"

Step 3: predictNext(["Java", "는", " 객체", "지향"])
→ 확률 분포: {" 프로그래밍": 0.70, " 언어": 0.20, ...}
→ 선택: " 프로그래밍" (확률 70%)
→ 현재 상태: "Java는 객체지향 프로그래밍"

...반복...
```

#### 핵심 포인트

- `while` 루프처럼 한 번에 하나씩 순차적으로 생성
- 이전 **모든 토큰(컨텍스트)**을 보고 다음 토큰 결정
- DB의 `Cursor`처럼 앞으로만 진행 (한 번 생성한 토큰은 수정 불가)

#### 그렇다면 왜 매번 다른 답변이 나올까?

```java
// Temperature 파라미터로 무작위성 조절
public Token sampleFromDistribution(Map<Token, Double> probs, double temperature) {
    if (temperature == 0.0) {
        // 항상 가장 확률 높은 토큰 선택 (결정적)
        return probs.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .get().getKey();
    } else {
        // 확률 분포에 따라 무작위 선택 (확률적)
        return weightedRandomSample(probs, temperature);
    }
}
```

- `temperature = 0.0`: 항상 동일한 답변 (가장 확률 높은 토큰만 선택)
- `temperature > 0.0`: 확률적으로 선택 → 매번 다른 답변 가능

------

### 3. Transformer Architecture - 메모리와 함수의 조합 🏗️

#### Transformer의 전체 구조

```java
public class Transformer {
    
    // 1. Embedding Layer: 토큰 → 벡터
    // "Java" → [0.2, 0.5, -0.3, ...] (512차원 벡터)
    private EmbeddingLayer embedding;
    
    // 2. Self-Attention: 핵심 메커니즘!
    // "모든 토큰 간의 관계 파악"
    private MultiHeadAttention attention;
    
    // 3. Feed Forward Network: 일반적인 신경망
    private FeedForwardNetwork ffn;
    
    public Vector[] forward(Token[] tokens) {
        // Step 1: 토큰을 벡터로 변환
        Vector[] embeddings = embedding.encode(tokens);
        
        // Step 2: Self-Attention (가장 중요!)
        Vector[] attended = attention.process(embeddings);
        
        // Step 3: Feed Forward
        Vector[] output = ffn.process(attended);
        
        return output;
    }
}
```

#### Self-Attention - DB의 Self Join과 유사

Self-Attention은 **"문장 내 모든 단어 간의 관계를 계산"**하는 메커니즘입니다.

```sql
-- SQL로 비유하면 자기 자신과 Join하는 것과 유사
SELECT 
    t1.word AS current_word,
    t2.word AS related_word,
    CALCULATE_SIMILARITY(t1, t2) AS attention_score
FROM tokens t1
CROSS JOIN tokens t2
WHERE CALCULATE_SIMILARITY(t1, t2) > threshold;
```

#### 실제 예시

```
문장: "Java는 객체지향 언어이고, Spring은 Java 프레임워크다"

"Spring"을 처리할 때 Attention 계산:
┌────────┬─────────────┬──────────────┐
│ 단어    │ 관련 단어    │ Attention 점수│
├────────┼─────────────┼──────────────┤
│ Spring │ Java        │ 0.85 (높음)  │
│ Spring │ 프레임워크   │ 0.72 (높음)  │
│ Spring │ 객체지향     │ 0.41 (중간)  │
│ Spring │ 언어        │ 0.15 (낮음)  │
└────────┴─────────────┴──────────────┘

→ "Spring"의 의미를 이해할 때 "Java"와 "프레임워크"를 크게 참고함
```

#### 왜 Attention이 중요한가?

**Before (RNN 시절):**
```java
// 순차적 처리 - 병렬화 불가
String context = "";
for (Token token : tokens) {
    context = processSequentially(context, token); // 이전 결과 필요
}
```

**After (Transformer):**
```java
// 병렬 처리 - GPU 활용 최적화
Vector[] results = tokens.parallelStream()
    .map(token -> attention.process(token, allTokens)) // 독립적 처리
    .toArray(Vector[]::new);
```

Attention 덕분에 모든 토큰을 **동시에 병렬 처리**할 수 있어, GPU를 효율적으로 활용할 수 있어요!

------

### 4. Hallucination (환각) - 왜 거짓말을 하나? 🌀

#### 개발자의 버그 vs LLM의 환각

```java
// 개발자의 버그 (결정적 Deterministic)
public int divide(int a, int b) {
    return a / b; // b가 0이면 항상 에러 발생 (재현 가능)
}

// LLM의 Hallucination (확률적 Probabilistic)
public Token predictNext(List<Token> context) {
    Map<Token, Double> probs = calculateProbabilities(context);
    // "가장 확률 높은" 토큰을 선택하지만, 반드시 "정확한" 것은 아님
    return sampleFromDistribution(probs);
}
```

#### 환각이 발생하는 이유

**1) 학습 데이터의 한계 - Cache Miss와 유사**

```java
// Cache와 유사한 개념
Cache<String, String> trainingData = new HashMap<>();
// 2023년까지의 데이터만 학습

String query = "2024년 1월 출시된 Java 신기능은?";
// Cache Miss! → 비슷한 패턴으로 "추론"해서 답변 생성
// 결과: 존재하지 않는 기능을 "그럴듯하게" 지어냄
```

**2) 확률 기반 생성 - Best Effort Delivery**

```java
// 항상 최선의 선택이 아님
Map<Token, Double> probabilities = {
    "정확한_토큰": 0.30,
    "비슷한_토큰": 0.25,
    "그럴듯한_토큰": 0.20,  // ← 이게 선택되면 환각!
    "관련없는_토큰": 0.15,
    ...
};

Token next = sampleFromDistribution(probabilities);
// 30% 확률로만 정확한 토큰이 선택됨
```

**3) 컨텍스트 길이 제한 - Memory Overflow**

```java
// 메모리 제한과 유사
int MAX_CONTEXT_LENGTH = 8192; // tokens

if (inputTokens.size() > MAX_CONTEXT_LENGTH) {
    // 오래된 컨텍스트는 "잊어버림"
    inputTokens = inputTokens.subList(
        inputTokens.size() - MAX_CONTEXT_LENGTH,
        inputTokens.size()
    );
}
```

긴 대화를 나누다 보면 초반 내용을 잊어버리는 이유가 이거예요.

#### 버그 vs 환각 비교표

| 구분 | 개발자의 버그 | LLM의 환각 |
|------|--------------|-----------|
| **발생 원인** | 로직 오류, 코딩 실수 | 확률 기반 추론, 학습 데이터 부족 |
| **재현성** | 항상 재현 가능 | 매번 다를 수 있음 (확률적) |
| **해결법** | 코드 수정 | 프롬프트 개선, 검증 로직 추가 |
| **예측 가능성** | 디버깅으로 찾을 수 있음 | 확률적으로만 감소 가능 |
| **책임 소재** | 개발자 | 모델 학습 방식의 본질적 한계 |

#### 환각을 줄이는 방법 (개발자의 해결책)

```java
public class LLMWithValidation {
    
    public String generateWithValidation(String prompt) {
        String response = llm.generate(prompt);
        
        // 1. RAG (Retrieval-Augmented Generation)
        // "DB에서 실제 사실을 먼저 검색"
        List<String> facts = database.retrieveRelevantFacts(prompt);
        if (!isConsistentWithFacts(response, facts)) {
            response = regenerateWithFacts(prompt, facts);
        }
        
        // 2. Confidence Score 확인
        double confidence = llm.getConfidence();
        if (confidence < 0.7) {
            response += "\n(참고: 이 답변의 신뢰도는 낮습니다)";
        }
        
        // 3. 외부 검증 API 호출
        if (requiresFactCheck(response)) {
            boolean isValid = externalAPI.verify(response);
            if (!isValid) {
                response = "정확한 정보를 제공할 수 없습니다.";
            }
        }
        
        return response;
    }
}
```

**실전 팁:**
- 중요한 정보는 반드시 **외부 소스로 검증**
- 프롬프트에 "정확한 정보만 답변하고, 모르면 모른다고 말해줘" 명시
- RAG(Retrieval-Augmented Generation)로 실제 데이터 기반 답변 유도

------

### 5. 정리: LLM은 결국 "확률 기반 함수"

```java
// LLM의 본질
public class LLM {
    
    /**
     * 주어진 입력(프롬프트)을 받아서
     * 확률적으로 다음 토큰을 예측하는 함수
     * 
     * @param prompt 사용자 입력
     * @return 생성된 텍스트 (확률 기반)
     */
    public String generate(String prompt) {
        List<Token> tokens = tokenize(prompt);
        
        while (!isDone(tokens)) {
            // 1. Transformer로 다음 토큰 확률 계산
            Map<Token, Double> probs = transformer.calculateProbabilities(tokens);
            
            // 2. 확률 분포에서 샘플링
            Token next = sampleFromDistribution(probs);
            
            // 3. 토큰 추가
            tokens.add(next);
        }
        
        return detokenize(tokens);
    }
}
```

#### 핵심 개념 요약

| 개념 | 개발자 비유 | 한 줄 설명 |
|------|------------|-----------|
| **Token** | DB Index | 의미 단위로 텍스트를 쪼갬 |
| **Next Token Prediction** | while 루프 | 한 번에 하나씩 순차 생성 |
| **Transformer** | Self Join + 병렬처리 | 모든 단어 간 관계 파악 |
| **Attention** | 가중치 계산 | 어떤 단어가 중요한지 계산 |
| **Hallucination** | Cache Miss | 없는 정보를 그럴듯하게 지어냄 |

------

### 마치며

LLM은 마법이 아니라 **확률 기반의 거대한 함수**입니다. 

- 토큰 단위로 처리하고 (효율성)
- 다음 토큰을 예측하며 (순차 생성)
- Attention으로 문맥을 파악하지만 (Self-Join)
- 때때로 환각을 일으킵니다 (확률의 한계)

개발자로서 LLM API를 사용할 때 이런 원리를 이해하면, 더 효과적인 프롬프트를 작성하고 결과를 검증할 수 있어요!

------

> 참고 자료
> - Attention Is All You Need (Transformer 논문): https://arxiv.org/abs/1706.03762
> - OpenAI GPT-3 Paper: https://arxiv.org/abs/2005.14165
> - Illustrated Transformer: https://jalammar.github.io/illustrated-transformer/

