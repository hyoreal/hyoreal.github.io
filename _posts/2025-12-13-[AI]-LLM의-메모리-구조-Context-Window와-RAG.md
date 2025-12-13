---
layout: post

toc: true

title: "[AI 기초] LLM의 메모리 구조: Context Window와 RAG (feat. HTTP Stateless)"

date: 2025-12-13 18:57:00 +0900

comments: true

categories: [AI, Deep Learning]

tags: [AI, LLM, Context Window, RAG, Stateless, Vector Database, HTTP]


---

### LLM은 기억력이 없어요, HTTP처럼 Stateless입니다

ChatGPT와 대화하다 보면 이런 착각을 하게 돼요:
- "오, AI가 내 이전 질문을 기억하네!"
- "대화 맥락을 이해하고 있어!"

하지만 사실은... **LLM은 아무것도 기억하지 못합니다**. 😱

HTTP가 Stateless(무상태)인 것처럼, LLM도 Stateless예요. 우리가 대화를 이어갈 수 있는 건 **매 요청마다 전체 대화 히스토리를 다시 전송**하기 때문입니다.

오늘은 개발자 관점에서 LLM의 메모리 구조를 파헤쳐보겠습니다!

------

### 1. Stateless (무상태성) - HTTP와 똑같아요 🔄

#### LLM은 세션을 유지하지 않습니다

```java
// HTTP의 Stateless 특성
@RestController
public class UserController {
    
    // 각 요청은 독립적! 이전 요청을 기억하지 못함
    @GetMapping("/user")
    public User getUser(HttpServletRequest request) {
        // 세션이 없으면 이전 요청을 알 수 없음
        // 쿠키나 토큰으로 상태를 매번 전달해야 함
    }
}
```

LLM도 마찬가지예요!

```java
// LLM의 Stateless 특성
public class ChatGPT {
    
    /**
     * 각 요청은 완전히 독립적!
     * 이전 대화를 기억하지 못함
     */
    public String chat(String userMessage) {
        // ❌ 이전 대화 내용을 모름
        // ❌ 세션 메모리 없음
        // ❌ 상태 저장 안 됨
        
        return generateResponse(userMessage);
    }
}
```

------

#### 그럼 어떻게 대화가 이어질까?

**비밀: 매 요청마다 전체 대화 히스토리를 다시 보내는 거예요!**

```java
// 실제 ChatGPT API 호출 방식
public class ChatService {
    
    private List<Message> conversationHistory = new ArrayList<>();
    
    public String chat(String userMessage) {
        // 1. 사용자 메시지를 히스토리에 추가
        conversationHistory.add(new Message("user", userMessage));
        
        // 2. 전체 대화 히스토리를 API에 전송!
        ChatRequest request = ChatRequest.builder()
            .model("gpt-4")
            .messages(conversationHistory) // ← 전체 대화를 매번 전송!
            .build();
        
        String response = openAI.sendRequest(request);
        
        // 3. AI 응답도 히스토리에 추가
        conversationHistory.add(new Message("assistant", response));
        
        return response;
    }
}
```

#### 실제 동작 과정

```
┌─────────────────────────────────────────────────┐
│ 첫 번째 요청                                     │
└─────────────────────────────────────────────────┘
사용자 → "Java란 뭐야?"

API 요청:
{
  "messages": [
    {"role": "user", "content": "Java란 뭐야?"}
  ]
}

AI 응답: "Java는 객체지향 프로그래밍 언어입니다."

┌─────────────────────────────────────────────────┐
│ 두 번째 요청 (전체 히스토리 포함!)                │
└─────────────────────────────────────────────────┘
사용자 → "그럼 Spring은?"

API 요청:
{
  "messages": [
    {"role": "user", "content": "Java란 뭐야?"},          // ← 이전 대화
    {"role": "assistant", "content": "Java는..."},      // ← 이전 응답
    {"role": "user", "content": "그럼 Spring은?"}       // ← 새 질문
  ]
}

AI 응답: "Spring은 Java 프레임워크입니다."

┌─────────────────────────────────────────────────┐
│ 세 번째 요청 (계속 누적!)                         │
└─────────────────────────────────────────────────┘
사용자 → "버전은?"

API 요청:
{
  "messages": [
    {"role": "user", "content": "Java란 뭐야?"},
    {"role": "assistant", "content": "Java는..."},
    {"role": "user", "content": "그럼 Spring은?"},
    {"role": "assistant", "content": "Spring은..."},
    {"role": "user", "content": "버전은?"}              // ← 새 질문
  ]
}
```

매번 **전체 대화를 다시 읽어야** 맥락을 이해할 수 있어요!

------

#### HTTP Session과 비교

| 비교 항목 | HTTP (Stateless) | LLM (Stateless) |
|----------|------------------|-----------------|
| **상태 저장** | 서버는 기억 못 함 | 모델은 기억 못 함 |
| **상태 유지 방법** | 쿠키, 토큰 전송 | 전체 대화 히스토리 전송 |
| **매 요청마다** | 인증 토큰 포함 | 전체 대화 포함 |
| **비용** | 토큰 크기 작음 | 대화 길어지면 비용 증가! |

```java
// HTTP: 작은 토큰만 전송
GET /api/user
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// 토큰 크기: ~200 bytes

// LLM: 전체 대화 히스토리 전송
POST https://api.openai.com/v1/chat/completions
{
  "messages": [
    // 100개의 이전 메시지들...
  ]
}
// 요청 크기: 수십 KB ~ 수백 KB!
```

------

### 2. Context Window - RAM 용량과 같아요 💾

#### Context Window란?

**LLM이 한 번에 처리할 수 있는 토큰의 최대 개수**를 의미해요.

```java
// 컴퓨터의 RAM처럼 고정된 크기
public class LLM {
    
    private static final int MAX_CONTEXT_WINDOW = 8192; // GPT-4 기준
    
    public String process(List<Token> tokens) {
        if (tokens.size() > MAX_CONTEXT_WINDOW) {
            throw new ContextWindowOverflowException(
                "토큰 수가 " + MAX_CONTEXT_WINDOW + "를 초과했습니다!"
            );
        }
        
        return generateResponse(tokens);
    }
}
```

#### 비유: Fixed Size Buffer (고정 크기 버퍼)

```java
// 고정 크기 버퍼와 유사
public class FixedSizeBuffer<T> {
    
    private final int capacity;
    private Queue<T> buffer;
    
    public FixedSizeBuffer(int capacity) {
        this.capacity = capacity;
        this.buffer = new LinkedList<>();
    }
    
    public void add(T item) {
        if (buffer.size() >= capacity) {
            // 버퍼가 가득 차면 가장 오래된 것 제거 (FIFO)
            buffer.poll(); // ← 오래된 대화가 삭제됨!
        }
        buffer.offer(item);
    }
}
```

#### 실제 Context Window 크기 비교

| 모델 | Context Window | 예상 용량 (A4 기준) |
|------|----------------|---------------------|
| **GPT-3.5** | 4,096 tokens | 약 3페이지 |
| **GPT-4** | 8,192 tokens | 약 6페이지 |
| **GPT-4-32K** | 32,768 tokens | 약 24페이지 |
| **Claude 2** | 100,000 tokens | 약 75페이지 |
| **GPT-4 Turbo** | 128,000 tokens | 약 96페이지 (책 1권!) |

```java
// 토큰 계산 예시
String conversation = """
    사용자: Java란 뭐야?
    AI: Java는 객체지향 프로그래밍 언어입니다...
    사용자: Spring은?
    AI: Spring은 Java 프레임워크입니다...
    ... (100번 반복)
    """;

int tokenCount = tokenizer.count(conversation);
// 결과: 약 5,000 tokens

if (tokenCount > 4096) {
    System.out.println("⚠️ GPT-3.5는 처리 불가!");
    System.out.println("✅ GPT-4는 처리 가능!");
}
```

------

#### Context Window Overflow - 메모리 부족 에러!

```java
// RAM Overflow와 유사
public class ConversationManager {
    
    private static final int MAX_TOKENS = 8192;
    private List<Message> history = new ArrayList<>();
    
    public void addMessage(Message message) {
        history.add(message);
        
        int currentTokens = calculateTotalTokens(history);
        
        // Context Window 초과 시 오래된 메시지 삭제
        while (currentTokens > MAX_TOKENS) {
            System.out.println("⚠️ Context Window 초과! 오래된 대화 삭제 중...");
            
            // FIFO: 가장 오래된 메시지 제거
            history.remove(0); // ← "Java란 뭐야?" 질문이 삭제됨!
            
            currentTokens = calculateTotalTokens(history);
        }
    }
}
```

#### 실제 발생하는 문제

```
사용자: "내 이름은 김개발이야."
AI: "안녕하세요, 개발님!"

...(8000 토큰 분량의 대화)...

사용자: "내 이름이 뭐였지?"
AI: "죄송하지만 대화 기록에서 찾을 수 없네요."

← 초반 대화가 Context Window에서 삭제됨!
```

이건 AI가 바보라서가 아니라, **메모리 용량 부족** 때문이에요!

```java
// Stack Overflow와 비교
public void recursiveFunction(int depth) {
    if (depth > MAX_STACK_SIZE) {
        throw new StackOverflowError("재귀 깊이 초과!");
    }
    recursiveFunction(depth + 1);
}

// Context Window Overflow
public String chat(List<Message> history) {
    int tokens = countTokens(history);
    if (tokens > MAX_CONTEXT_WINDOW) {
        throw new ContextWindowOverflowException("대화 길이 초과!");
    }
    return generate(history);
}
```

------

#### Token Limit과 Cost(비용)의 관계

```java
// 대화가 길어질수록 비용 증가!
public class CostCalculator {
    
    private static final double INPUT_COST_PER_1K = 0.03;  // $0.03/1K tokens
    private static final double OUTPUT_COST_PER_1K = 0.06; // $0.06/1K tokens
    
    public double calculateCost(List<Message> history, String newQuestion) {
        // 입력 비용: 전체 히스토리 + 새 질문
        int inputTokens = countTokens(history) + countTokens(newQuestion);
        double inputCost = (inputTokens / 1000.0) * INPUT_COST_PER_1K;
        
        // 출력 비용: AI 응답
        int outputTokens = 500; // 예상
        double outputCost = (outputTokens / 1000.0) * OUTPUT_COST_PER_1K;
        
        return inputCost + outputCost;
    }
}
```

**비용 시뮬레이션:**

```
1번째 요청:
  입력: 10 tokens
  비용: $0.0003

10번째 요청:
  입력: 100 tokens (누적된 대화)
  비용: $0.003

100번째 요청:
  입력: 5,000 tokens (누적된 대화)
  비용: $0.15

→ 같은 질문인데 100배 비싼 요금! 😱
```

**실전 팁: 불필요한 히스토리 제거**

```java
public class OptimizedChatService {
    
    public String chat(String userMessage) {
        // 중요한 컨텍스트만 유지
        List<Message> essentialHistory = extractEssentialMessages(history);
        
        // 불필요한 대화는 요약
        String summary = summarizeOldConversations(history);
        
        // 최적화된 요청
        List<Message> optimizedMessages = new ArrayList<>();
        optimizedMessages.add(new Message("system", summary)); // 요약
        optimizedMessages.addAll(essentialHistory);            // 중요한 것만
        optimizedMessages.add(new Message("user", userMessage));
        
        return callAPI(optimizedMessages);
    }
}
```

------

### 3. RAG (Retrieval Augmented Generation) - 오픈북 테스트 📚

#### Context Window의 한계를 극복하는 방법

Context Window가 작으면 어떻게 해야 할까요?
- 긴 문서를 읽을 수 없음
- 대량의 코드베이스를 이해할 수 없음
- 회사 내부 데이터를 참조할 수 없음

**해결책: RAG (Retrieval Augmented Generation)**

#### 개발자 비유: 오픈북 테스트

```java
// Close Book 테스트 (일반 LLM)
public String answerQuestion(String question) {
    // 오직 암기한 지식(학습 데이터)만으로 답변
    return generateFromMemory(question);
}

// Open Book 테스트 (RAG)
public String answerQuestionWithRAG(String question) {
    // 1. 관련 자료를 먼저 찾아옴 (Retrieval)
    List<String> relevantDocs = searchDatabase(question);
    
    // 2. 찾은 자료와 함께 질문
    String prompt = String.format("""
        다음 자료를 참고해서 답변해주세요:
        
        [참고 자료]
        %s
        
        [질문]
        %s
        """, String.join("\n", relevantDocs), question);
    
    // 3. 자료 기반으로 답변 생성 (Augmented Generation)
    return generate(prompt);
}
```

#### RAG = DB SELECT + LLM Generate

```java
@Service
public class RAGService {
    
    @Autowired
    private VectorDatabase vectorDB; // 벡터 DB
    
    @Autowired
    private OpenAIClient openAI; // LLM
    
    /**
     * RAG 방식의 질의응답
     */
    public String answerWithRAG(String question) {
        // Step 1: Retrieval (검색)
        // → DB에서 SELECT하는 것과 동일!
        List<Document> relevantDocs = vectorDB.search(
            query = question,
            limit = 3  // 가장 관련 높은 3개 문서
        );
        
        // Step 2: Augmentation (증강)
        // → 찾은 데이터를 프롬프트에 추가
        String augmentedPrompt = buildPromptWithContext(question, relevantDocs);
        
        // Step 3: Generation (생성)
        // → LLM이 참고 자료 기반으로 답변
        return openAI.generate(augmentedPrompt);
    }
    
    private String buildPromptWithContext(String question, List<Document> docs) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("다음 문서들을 참고하여 질문에 답변해주세요:\n\n");
        
        for (Document doc : docs) {
            prompt.append("---\n");
            prompt.append(doc.getContent()).append("\n");
        }
        
        prompt.append("\n질문: ").append(question);
        
        return prompt.toString();
    }
}
```

------

#### RAG 동작 과정 - SQL과 비교

```sql
-- 일반 SQL 쿼리
SELECT answer
FROM knowledge_base
WHERE question = '스프링부트 설정 방법은?';

-- RAG 방식 (유사도 검색)
SELECT content, similarity_score
FROM vector_embeddings
ORDER BY COSINE_SIMILARITY(embedding, question_embedding) DESC
LIMIT 3;
```

**실제 RAG 프로세스:**

```
┌─────────────────────────────────────────────────┐
│ 사용자 질문                                      │
└─────────────────────────────────────────────────┘
"우리 프로젝트에서 JWT 인증은 어떻게 구현했어?"

┌─────────────────────────────────────────────────┐
│ Step 1: Retrieval (검색)                        │
└─────────────────────────────────────────────────┘
Vector DB에서 관련 문서 검색:
1. SecurityConfig.java (유사도: 0.92)
2. JwtTokenProvider.java (유사도: 0.87)
3. JwtAuthenticationFilter.java (유사도: 0.85)

┌─────────────────────────────────────────────────┐
│ Step 2: Augmentation (증강)                     │
└─────────────────────────────────────────────────┘
프롬프트 구성:
"""
다음 코드를 참고하여 답변해주세요:

[SecurityConfig.java]
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(...) {
        // JWT 필터 설정
    }
}

[JwtTokenProvider.java]
...

질문: 우리 프로젝트에서 JWT 인증은 어떻게 구현했어?
"""

┌─────────────────────────────────────────────────┐
│ Step 3: Generation (생성)                       │
└─────────────────────────────────────────────────┘
LLM 답변:
"이 프로젝트에서는 Spring Security와 JWT를 활용하여
인증을 구현했습니다. SecurityConfig에서 필터 체인을 설정하고,
JwtTokenProvider로 토큰을 생성/검증합니다..."
```

------

#### RAG의 장점

```java
// Without RAG - 학습 데이터에만 의존
public String answer(String question) {
    // ❌ 2023년 이후 정보 모름
    // ❌ 회사 내부 코드 모름
    // ❌ 최신 라이브러리 버전 모름
    
    return generateFromTrainingData(question);
}

// With RAG - 외부 데이터 참조 가능
public String answerWithRAG(String question) {
    // ✅ 실시간 데이터 검색 가능
    // ✅ 회사 내부 문서 참조 가능
    // ✅ 최신 정보 활용 가능
    
    List<String> docs = searchLatestDocuments(question);
    return generateWithContext(question, docs);
}
```

| 구분 | 일반 LLM | RAG |
|------|----------|-----|
| **지식 범위** | 학습 데이터만 | 외부 DB 참조 가능 |
| **최신성** | 학습 시점까지만 | 실시간 데이터 가능 |
| **정확성** | 환각(Hallucination) 가능 | 근거 기반 답변 |
| **비용** | 모델 크기에 비례 | 검색 비용 추가 |
| **커스터마이징** | 재학습 필요 | 문서만 추가하면 됨 |

------

#### 우리가 쓰는 `@Codebase`가 바로 RAG!

```java
// Cursor AI의 @Codebase 기능 = RAG 시스템!

// 일반 질문 (Context 없음)
"JPA N+1 문제 해결 방법 알려줘"
→ 일반적인 답변 제공

// @Codebase 사용 (RAG!)
"@Codebase 우리 프로젝트에서 JPA N+1 문제 어떻게 해결했어?"

→ Step 1: 프로젝트 코드베이스에서 관련 파일 검색
    - UserRepository.java (Fetch Join 사용)
    - OrderService.java (EntityGraph 사용)

→ Step 2: 검색된 코드와 함께 프롬프트 구성

→ Step 3: 프로젝트 코드 기반으로 답변 생성
    "이 프로젝트에서는 @EntityGraph와 Fetch Join을 
     활용하여 N+1 문제를 해결했습니다. 
     UserRepository.java의 15번째 줄을 보시면..."
```

------

#### RAG 시스템 구현 예시 (Spring Boot)

```java
@RestController
@RequestMapping("/api/chat")
public class RAGController {
    
    @Autowired
    private VectorStoreService vectorStore;
    
    @Autowired
    private OpenAIService openAI;
    
    @PostMapping("/ask")
    public ResponseEntity<String> askWithRAG(@RequestBody ChatRequest request) {
        String question = request.getQuestion();
        
        // 1. 벡터 DB에서 관련 문서 검색
        List<Document> relevantDocs = vectorStore.similaritySearch(
            question, 
            topK = 3
        );
        
        // 2. 프롬프트 구성
        String systemPrompt = """
            당신은 우리 회사의 기술 문서를 참고하여 답변하는 AI입니다.
            다음 문서들을 기반으로 정확하게 답변해주세요.
            문서에 없는 내용은 추측하지 말고 "문서에서 찾을 수 없습니다"라고 답변하세요.
            """;
        
        String context = relevantDocs.stream()
            .map(doc -> "[" + doc.getTitle() + "]\n" + doc.getContent())
            .collect(Collectors.joining("\n\n---\n\n"));
        
        String fullPrompt = systemPrompt + "\n\n[참고 문서]\n" + context 
            + "\n\n[질문]\n" + question;
        
        // 3. LLM 호출
        String answer = openAI.chat(fullPrompt);
        
        return ResponseEntity.ok(answer);
    }
}
```

------

#### Vector Database - 코드 검색을 위한 특수 DB

```java
// 일반 DB: 정확히 일치하는 키워드 검색
SELECT * FROM documents
WHERE content LIKE '%JWT 인증%';
// → "JWT 인증" 문자열이 정확히 포함된 것만 검색

// Vector DB: 의미가 유사한 것 검색
SELECT * FROM vector_embeddings
ORDER BY COSINE_SIMILARITY(
    embedding, 
    EMBED('JWT 인증은 어떻게 구현하나요?')
) DESC;
// → "인증", "토큰", "보안" 등 의미적으로 관련된 것도 검색!
```

**Vector Embedding 예시:**

```java
// 텍스트를 벡터로 변환
String text = "Spring Boot JWT 인증 구현";
float[] embedding = embeddingModel.encode(text);
// 결과: [0.23, -0.45, 0.67, ..., 0.12] (1536차원 벡터)

// 유사도 계산
float similarity = cosineSimilarity(
    embedding1, // "JWT 인증"
    embedding2  // "토큰 기반 인증"
);
// 결과: 0.89 (매우 유사!)
```

------

### 4. 정리: LLM의 메모리 구조 한눈에 보기

```java
/**
 * LLM의 메모리 구조 완전 정리
 */
public class LLMMemoryStructure {
    
    // 1. Stateless: HTTP처럼 상태를 저장하지 않음
    private boolean hasMemory = false; // 항상 false!
    
    // 2. Context Window: 고정된 크기의 버퍼
    private static final int CONTEXT_WINDOW_SIZE = 8192;
    private FixedSizeBuffer<Token> contextWindow = 
        new FixedSizeBuffer<>(CONTEXT_WINDOW_SIZE);
    
    // 3. RAG: 외부 지식 참조
    @Autowired
    private VectorDatabase externalKnowledge;
    
    public String chat(String question, List<Message> history) {
        // Stateless: 매번 전체 히스토리 전달 필요
        if (history.isEmpty()) {
            throw new IllegalArgumentException(
                "히스토리를 전달하지 않으면 맥락을 알 수 없습니다!"
            );
        }
        
        // Context Window: 토큰 수 제한
        int totalTokens = countTokens(history) + countTokens(question);
        if (totalTokens > CONTEXT_WINDOW_SIZE) {
            // 오래된 메시지 제거
            history = trimOldMessages(history, CONTEXT_WINDOW_SIZE);
        }
        
        // RAG: 외부 지식 참조 (선택적)
        List<String> relevantDocs = externalKnowledge.search(question);
        String augmentedPrompt = buildPrompt(question, relevantDocs);
        
        return generate(augmentedPrompt);
    }
}
```

------

#### 핵심 비유 정리

| LLM 개념 | 개발자 비유 | 한 줄 설명 |
|----------|------------|-----------|
| **Stateless** | HTTP Request/Response | 매 요청마다 전체 히스토리 전송 필요 |
| **Context Window** | RAM 용량, Fixed Buffer | 한 번에 처리 가능한 토큰 수 제한 |
| **Context Overflow** | Stack Overflow, OOM | 용량 초과 시 오래된 대화 삭제 |
| **RAG** | DB SELECT + 오픈북 테스트 | 외부 데이터를 먼저 검색 후 답변 |
| **Vector Database** | Index Scan with 유사도 | 의미 기반 검색 (키워드가 아닌 의미) |

------

### 실전 적용: 효율적인 LLM 사용법

#### 1. 불필요한 히스토리 정리

```java
@Service
public class ChatOptimizationService {
    
    /**
     * 중요한 메시지만 유지하여 토큰 절약
     */
    public List<Message> optimizeHistory(List<Message> history) {
        List<Message> optimized = new ArrayList<>();
        
        // 시스템 프롬프트는 항상 유지
        optimized.add(history.get(0));
        
        // 최근 10개 메시지만 유지
        int start = Math.max(1, history.size() - 10);
        optimized.addAll(history.subList(start, history.size()));
        
        return optimized;
    }
}
```

#### 2. 대화 요약으로 Context Window 절약

```java
public String summarizeOldConversations(List<Message> oldMessages) {
    // 오래된 대화를 요약하여 1개 메시지로 압축
    String longHistory = oldMessages.stream()
        .map(Message::getContent)
        .collect(Collectors.joining("\n"));
    
    String summaryPrompt = "다음 대화를 3문장으로 요약해줘:\n" + longHistory;
    String summary = llm.generate(summaryPrompt);
    
    // 요약본으로 대체
    // 원본: 5000 tokens → 요약: 100 tokens
    return summary;
}
```

#### 3. RAG로 Context Window 한계 극복

```java
@Service
public class DocumentQAService {
    
    /**
     * 긴 문서를 Context Window에 다 넣을 수 없을 때
     */
    public String answerFromLongDocument(String question, String longDocument) {
        // ❌ 나쁜 방법: 전체 문서를 프롬프트에 포함
        // → Context Window 초과 가능!
        
        // ✅ 좋은 방법: 문서를 작은 청크로 분할 후 RAG
        
        // 1. 문서를 청크로 분할
        List<String> chunks = splitIntoChunks(longDocument, chunkSize = 500);
        
        // 2. 각 청크를 Vector DB에 저장
        for (String chunk : chunks) {
            vectorDB.store(chunk);
        }
        
        // 3. 질문과 관련된 청크만 검색
        List<String> relevantChunks = vectorDB.search(question, topK = 3);
        
        // 4. 관련 청크만 사용하여 답변 생성
        String prompt = buildPrompt(question, relevantChunks);
        return llm.generate(prompt);
        
        // 결과: 전체 문서(10,000 tokens) → 관련 부분만(1,500 tokens)
    }
}
```

------

### 마치며

LLM의 메모리 구조를 이해하면:

1. **Stateless 특성**: HTTP처럼 매 요청마다 컨텍스트를 전달해야 함
2. **Context Window**: RAM처럼 고정된 용량, 초과 시 오래된 것 삭제
3. **RAG**: DB SELECT + 오픈북 테스트로 외부 지식 참조

개발자로서 이 구조를 이해하면:
- API 비용을 최적화할 수 있고
- Context Window를 효율적으로 관리할 수 있으며
- RAG를 활용한 더 정확한 시스템을 구축할 수 있습니다!

지금 사용하는 `@Codebase` 기능도 RAG의 실전 활용 사례랍니다. 🚀

------

> 참고 자료
> - OpenAI API Documentation: https://platform.openai.com/docs/guides/chat
> - RAG 개념: https://arxiv.org/abs/2005.11401
> - Vector Database 비교: https://www.pinecone.io/learn/vector-database/
> - LangChain RAG Tutorial: https://python.langchain.com/docs/use_cases/question_answering/

