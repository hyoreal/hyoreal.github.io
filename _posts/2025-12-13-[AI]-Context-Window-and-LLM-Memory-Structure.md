---
layout: post

toc: true

title: "[AI] 개발자가 꼭 알아야 할 LLM의 메모리 구조 - Context Window 완벽 이해"

date: 2025-12-13 18:50:00 +0900

comments: true

categories: [AI, Machine Learning]

tags: [AI, LLM, Context Window, RAG, ChatGPT, Deep Learning]


---

### LLM의 메모리, 어떻게 작동할까? 🧠

ChatGPT나 Claude 같은 LLM을 사용하다 보면 이런 경험 있으셨나요?

- 대화 초반에 했던 질문을 나중에 다시 물어보면 "잊어버린" 것처럼 답변
- 긴 문서를 입력하면 "입력이 너무 깁니다" 에러 발생
- 최신 정보를 물어보면 엉뚱한 답변 (환각)

이 모든 현상은 LLM의 **메모리 구조**와 **Context Window**에서 비롯됩니다. 오늘은 개발자 관점에서 이를 완벽히 이해해보겠습니다!

------

### 1. Stateless - LLM은 HTTP 요청과 같다 🔄

#### HTTP의 Stateless와 LLM의 Stateless

```java
// HTTP 요청 - Stateless
@RestController
public class UserController {
    
    @GetMapping("/user/{id}")
    public User getUser(@PathVariable Long id) {
        // 이전 요청을 기억하지 않음
        // 매번 독립적인 요청
        return userService.findById(id);
    }
}

// LLM도 동일
public class LLM {
    
    public String generate(String prompt) {
        // 이전 대화를 기억하지 않음
        // 매번 독립적인 요청
        return model.predict(prompt);
    }
}
```

#### LLM은 기본적으로 상태를 저장하지 않는다

**핵심 개념:**
- LLM은 **모델 자체에는 대화 내용을 저장하지 않습니다**
- 매 요청마다 **완전히 새로운 요청**으로 처리됩니다
- 마치 HTTP 요청이 이전 요청을 모르는 것과 동일합니다

```java
// 첫 번째 요청
String response1 = llm.generate("내 이름은 김철수야");
// 응답: "안녕하세요, 김철수님!"

// 두 번째 요청 (완전히 독립적)
String response2 = llm.generate("내 이름이 뭐였지?");
// 응답: "죄송하지만, 이름을 알려주신 적이 없습니다."
// ❌ 이전 대화를 전혀 기억하지 못함!
```

#### 그렇다면 대화가 어떻게 이어지나?

**비밀: 모든 대화 내역을 매번 다시 보내준다!**

```java
public class ChatService {
    private List<Message> conversationHistory = new ArrayList<>();
    
    public String chat(String userMessage) {
        // 1. 사용자 메시지 추가
        conversationHistory.add(new Message("user", userMessage));
        
        // 2. 전체 대화 내역을 컨텍스트로 구성
        String context = buildContext(conversationHistory);
        
        // 3. LLM에 전체 컨텍스트와 함께 요청
        String response = llm.generate(context);
        
        // 4. AI 응답 저장
        conversationHistory.add(new Message("assistant", response));
        
        return response;
    }
    
    private String buildContext(List<Message> history) {
        StringBuilder context = new StringBuilder();
        for (Message msg : history) {
            context.append(msg.role).append(": ").append(msg.content).append("\n");
        }
        return context.toString();
    }
}
```

**실제 동작 예시:**

```
// 첫 번째 요청
Input: "내 이름은 김철수야"
LLM에 전달: "내 이름은 김철수야"
Output: "안녕하세요, 김철수님!"

// 두 번째 요청
Input: "내 이름이 뭐였지?"
LLM에 전달: 
"""
user: 내 이름은 김철수야
assistant: 안녕하세요, 김철수님!
user: 내 이름이 뭐였지?
"""
Output: "김철수님이라고 하셨습니다."
✅ 이전 대화를 포함해서 보내니 기억하는 것처럼 보임!
```

#### HTTP Session과 비교

```java
// HTTP - Session으로 상태 유지
@GetMapping("/cart")
public Cart getCart(HttpSession session) {
    // Session에 저장된 장바구니 조회
    return (Cart) session.getAttribute("cart");
}

// LLM - 대화 내역을 매번 포함
public String chat(List<Message> history, String newMessage) {
    history.add(newMessage);
    // 전체 history를 매번 전달
    return llm.generate(buildContext(history));
}
```

**차이점:**

| 구분 | HTTP Session | LLM Context |
|------|-------------|-------------|
| **저장 위치** | 서버 메모리/Redis | 클라이언트 (애플리케이션) |
| **상태 유지** | 세션 ID로 자동 조회 | 매번 전체 내역 전달 |
| **비용** | 세션 저장 비용 | 토큰 수에 비례한 API 비용 |
| **만료** | 세션 타임아웃 | Context Window 초과 시 잘림 |

------

### 2. Context Window - 제한된 메모리 📦

#### Context Window란?

**LLM이 한 번에 처리할 수 있는 최대 토큰 수**

```java
public class LLM {
    private final int MAX_CONTEXT_WINDOW = 8192; // 예: GPT-3.5
    
    public String generate(String prompt) {
        List<Token> tokens = tokenize(prompt);
        
        if (tokens.size() > MAX_CONTEXT_WINDOW) {
            throw new ContextWindowExceededException(
                "입력 토큰 수(" + tokens.size() + ")가 " +
                "최대 허용치(" + MAX_CONTEXT_WINDOW + ")를 초과했습니다."
            );
        }
        
        return model.predict(tokens);
    }
}
```

#### 주요 모델의 Context Window

| 모델 | Context Window | 비유 |
|------|---------------|------|
| GPT-3.5 | 4K ~ 16K tokens | 짧은 보고서 (~12페이지) |
| GPT-4 | 8K ~ 128K tokens | 중편 소설 (~96페이지) |
| Claude 3 | 200K tokens | 장편 소설 (~150페이지) |
| Gemini 1.5 Pro | 1M tokens | 해리포터 전권 |

```java
// 대략적인 토큰 계산
1 토큰 ≈ 0.75 단어 (영어)
1 토큰 ≈ 0.5 ~ 1 글자 (한글)

예시:
"안녕하세요" → 약 2-3 토큰
"Hello, how are you?" → 약 5 토큰
```

#### Token Limit 초과 시 문제: Queue 자료구조와 유사

**FIFO (First In, First Out) 방식으로 오래된 대화 삭제**

```java
public class ContextWindowManager {
    private final int MAX_TOKENS = 4096;
    private Deque<Message> messageQueue = new LinkedList<>();
    
    public String chat(String userMessage) {
        // 1. 새 메시지 추가
        messageQueue.addLast(new Message("user", userMessage));
        
        // 2. 토큰 수 계산
        int totalTokens = calculateTotalTokens(messageQueue);
        
        // 3. Context Window 초과 시 오래된 메시지 제거
        while (totalTokens > MAX_TOKENS && messageQueue.size() > 1) {
            Message removed = messageQueue.removeFirst(); // FIFO
            System.out.println("오래된 메시지 제거: " + removed.content);
            totalTokens = calculateTotalTokens(messageQueue);
        }
        
        // 4. LLM 호출
        String context = buildContext(messageQueue);
        String response = llm.generate(context);
        
        messageQueue.addLast(new Message("assistant", response));
        
        return response;
    }
}
```

**실제 동작 예시:**

```
Context Window: 100 토큰

대화 1: "Java란?" (10 토큰)
대화 2: "Spring이란?" (15 토큰)
대화 3: "Docker란?" (20 토큰)
대화 4: "Kubernetes란?" (25 토큰)
대화 5: "CI/CD란?" (35 토큰)

현재 토큰 수: 10 + 15 + 20 + 25 + 35 = 105 토큰
❌ Context Window 초과!

→ 가장 오래된 대화 1 제거 (FIFO)
→ 남은 토큰 수: 15 + 20 + 25 + 35 = 95 토큰
✅ 정상 처리

문제점: "Java란?" 질문을 다시 물어보면 기억하지 못함!
```

#### Stack과 Queue 비교

```java
// Queue 방식 (실제 LLM)
Deque<Message> queue = new LinkedList<>();
queue.addLast(msg1); // 대화 1
queue.addLast(msg2); // 대화 2
queue.addLast(msg3); // 대화 3
// 초과 시: queue.removeFirst() → 대화 1 제거 (FIFO)

// Stack 방식 (만약 이렇다면?)
Stack<Message> stack = new Stack<>();
stack.push(msg1); // 대화 1
stack.push(msg2); // 대화 2
stack.push(msg3); // 대화 3
// 초과 시: stack.pop() → 대화 3 제거 (LIFO)
// ❌ 최신 대화를 삭제하므로 말이 안됨!
```

#### Context Window 초과의 실전 문제

```java
public class ChatApplication {
    
    public void longConversation() {
        ChatService chat = new ChatService(4096); // 4K 토큰 제한
        
        // 초반 대화
        chat.send("내 이름은 김개발이야");
        chat.send("나는 백엔드 개발자야");
        chat.send("Java와 Spring을 사용해");
        
        // ... 긴 대화 계속 ...
        // (100개 메시지 후)
        
        // ❌ 초반 정보가 Context Window에서 밀려남
        chat.send("내 이름이 뭐였지?");
        // 응답: "죄송하지만, 이름을 말씀하신 적이 없는 것 같습니다."
        
        // ❌ 초반 대화 내용 완전히 손실!
    }
}
```

------

### 3. RAG (Retrieval-Augmented Generation) - 외부 DB 조회 🔍

#### RAG란? "DB 조회 + LLM 생성"

**전통적인 방식 (Context Window만 사용):**

```java
public String answerQuestion(String question) {
    // 모든 지식이 Context Window 안에 있어야 함
    String context = getAllKnowledge(); // ❌ 불가능!
    return llm.generate(context + question);
}
```

**RAG 방식 (DB 조회 + LLM):**

```java
public String answerQuestionWithRAG(String question) {
    // 1. 질문 관련 문서를 DB에서 검색
    List<Document> relevantDocs = vectorDB.search(question, topK=3);
    
    // 2. 검색된 문서를 Context로 구성
    String context = buildContext(relevantDocs);
    
    // 3. Context + 질문을 LLM에 전달
    String prompt = String.format("""
        다음 문서를 참고하여 질문에 답변해주세요:
        
        [문서]
        %s
        
        [질문]
        %s
        """, context, question);
    
    return llm.generate(prompt);
}
```

#### 개발 패턴과의 비교

**일반 웹 애플리케이션:**

```java
@Service
public class BoardService {
    
    @Autowired
    private BoardRepository repository;
    
    public Board getBoard(Long id) {
        // 1. DB 조회
        Board board = repository.findById(id)
            .orElseThrow(() -> new NotFoundException());
        
        // 2. 비즈니스 로직 처리
        board.increaseViewCount();
        
        // 3. 결과 반환
        return board;
    }
}
```

**RAG 시스템:**

```java
@Service
public class RAGService {
    
    @Autowired
    private VectorDatabase vectorDB; // DB 역할
    
    @Autowired
    private LLMClient llmClient; // 비즈니스 로직 역할
    
    public String answer(String question) {
        // 1. Vector DB 조회
        List<Document> docs = vectorDB.search(question)
            .orElseThrow(() -> new DocumentNotFoundException());
        
        // 2. LLM으로 답변 생성 (비즈니스 로직)
        String context = buildContext(docs);
        String answer = llmClient.generate(context + question);
        
        // 3. 결과 반환
        return answer;
    }
}
```

#### RAG의 구체적인 동작 과정

```java
public class RAGSystem {
    
    private VectorDatabase vectorDB;
    private LLMClient llm;
    
    // 1. 문서 저장 (색인 단계)
    public void indexDocuments(List<String> documents) {
        for (String doc : documents) {
            // 문서를 임베딩 벡터로 변환
            float[] vector = embeddingModel.encode(doc);
            
            // Vector DB에 저장
            vectorDB.insert(new Document(doc, vector));
        }
    }
    
    // 2. 질문 답변 (검색 + 생성 단계)
    public String answerQuestion(String question) {
        // Step 1: 질문을 벡터로 변환
        float[] queryVector = embeddingModel.encode(question);
        
        // Step 2: 유사한 문서 검색 (코사인 유사도)
        List<Document> similarDocs = vectorDB.searchSimilar(
            queryVector, 
            topK = 3  // 상위 3개 문서
        );
        
        // Step 3: 검색된 문서를 Context로 구성
        StringBuilder context = new StringBuilder();
        for (Document doc : similarDocs) {
            context.append(doc.content).append("\n\n");
        }
        
        // Step 4: Prompt 구성
        String prompt = String.format("""
            아래 문서를 참고하여 질문에 정확히 답변하세요.
            문서에 없는 내용은 "문서에서 찾을 수 없습니다"라고 답하세요.
            
            [참고 문서]
            %s
            
            [질문]
            %s
            
            [답변]
            """, context.toString(), question);
        
        // Step 5: LLM 생성
        return llm.generate(prompt);
    }
}
```

#### 실제 사용 예시

```java
// 회사 내부 문서 검색 시스템
public class CompanyRAG {
    
    public static void main(String[] args) {
        RAGSystem rag = new RAGSystem();
        
        // 1. 회사 문서 색인
        List<String> companyDocs = Arrays.asList(
            "우리 회사의 휴가 정책: 연차는 입사 1년차부터 15일 제공됩니다.",
            "재택근무 규정: 주 2회까지 재택근무 가능합니다.",
            "복지 제도: 점심 식사 지원, 야근 택시비, 건강검진 등"
        );
        rag.indexDocuments(companyDocs);
        
        // 2. 질문하기
        String question = "연차는 몇 일인가요?";
        String answer = rag.answerQuestion(question);
        
        System.out.println(answer);
        // 출력: "입사 1년차부터 연차 15일이 제공됩니다."
        // ✅ 문서 기반 정확한 답변!
        
        // 3. 문서에 없는 내용 질문
        String question2 = "내년 회사 전망은?";
        String answer2 = rag.answerQuestion(question2);
        
        System.out.println(answer2);
        // 출력: "죄송하지만, 제공된 문서에서 해당 정보를 찾을 수 없습니다."
        // ✅ 환각 방지!
    }
}
```

#### RAG의 장점

```java
// RAG 없이 (순수 LLM)
String answer1 = llm.generate("우리 회사 연차는 몇 일인가요?");
// ❌ "일반적으로 15일입니다" (추측, 환각 가능성)

// RAG 사용
List<Document> docs = vectorDB.search("연차");
String answer2 = llm.generate(docs + "우리 회사 연차는 몇 일인가요?");
// ✅ "귀사의 휴가 정책 문서에 따르면 15일입니다" (문서 기반 정확한 답변)
```

#### DB 쿼리와 비교

```sql
-- 전통적인 DB 쿼리
SELECT content 
FROM documents 
WHERE title LIKE '%연차%' 
   OR content LIKE '%휴가%';

-- Vector DB 유사도 검색
SELECT content, similarity_score
FROM documents
ORDER BY cosine_similarity(embedding, query_vector) DESC
LIMIT 3;
```

**차이점:**

| 구분 | 전통적 DB | Vector DB (RAG) |
|------|----------|----------------|
| **검색 방식** | 키워드 매칭 | 의미 기반 유사도 |
| **쿼리** | SQL | 벡터 유사도 계산 |
| **결과** | 정확히 일치하는 문서 | 의미상 유사한 문서 |
| **예시** | "휴가" 검색 시 "휴가"만 | "휴가" 검색 시 "연차", "방학"도 찾음 |

------

### 4. Context Window 관리 전략 💡

#### 전략 1: Sliding Window (Queue 방식)

```java
public class SlidingWindowChat {
    private final int MAX_TOKENS = 4096;
    private Deque<Message> messages = new LinkedList<>();
    
    public String chat(String userMessage) {
        messages.addLast(new Message("user", userMessage));
        
        // 오래된 메시지 제거
        while (calculateTokens(messages) > MAX_TOKENS) {
            messages.removeFirst(); // FIFO
        }
        
        String response = llm.generate(buildContext(messages));
        messages.addLast(new Message("assistant", response));
        
        return response;
    }
}
```

**장점**: 구현 간단  
**단점**: 초반 중요 정보 손실

#### 전략 2: 요약 (Summarization)

```java
public class SummarizationChat {
    private String summary = "";
    private List<Message> recentMessages = new ArrayList<>();
    
    public String chat(String userMessage) {
        recentMessages.add(new Message("user", userMessage));
        
        // 토큰 수가 많아지면 요약
        if (calculateTokens(recentMessages) > 2048) {
            summary = llm.summarize(summary + buildContext(recentMessages));
            recentMessages.clear();
        }
        
        // 요약 + 최근 메시지
        String context = summary + "\n\n" + buildContext(recentMessages);
        String response = llm.generate(context);
        
        recentMessages.add(new Message("assistant", response));
        return response;
    }
}
```

**장점**: 중요 정보 유지  
**단점**: 요약 과정에서 정보 손실 가능

#### 전략 3: RAG + Context Window

```java
public class RAGWithContextWindow {
    private VectorDatabase longTermMemory; // 장기 메모리
    private Deque<Message> shortTermMemory; // 단기 메모리 (Context Window)
    
    public String chat(String userMessage) {
        // 1. 장기 메모리에서 관련 정보 검색
        List<Document> relevantHistory = longTermMemory.search(userMessage);
        
        // 2. 단기 메모리 (최근 대화)
        shortTermMemory.addLast(new Message("user", userMessage));
        while (calculateTokens(shortTermMemory) > 2048) {
            Message old = shortTermMemory.removeFirst();
            longTermMemory.insert(old); // 장기 메모리로 이동
        }
        
        // 3. 장기 메모리 + 단기 메모리 결합
        String context = buildContext(relevantHistory) + "\n\n" + 
                        buildContext(shortTermMemory);
        
        String response = llm.generate(context);
        shortTermMemory.addLast(new Message("assistant", response));
        
        return response;
    }
}
```

**장점**: 오래된 정보도 검색 가능  
**단점**: Vector DB 인프라 필요

------

### 5. 실전 팁: Context Window 최적화 ⚡

#### 1) 토큰 수 계산하기

```java
public class TokenCounter {
    
    // 간단한 추정 (정확하지 않음)
    public int estimateTokens(String text) {
        // 영어: 단어 수 * 1.3
        // 한글: 글자 수 * 0.7
        int words = text.split("\\s+").length;
        return (int) (words * 1.3);
    }
    
    // 정확한 계산 (OpenAI Tiktoken 사용)
    public int countTokens(String text, String model) {
        Encoding encoding = Encoding.forModel(model);
        return encoding.encode(text).size();
    }
}
```

#### 2) 시스템 메시지 활용

```java
public String chat(String userMessage) {
    String systemMessage = """
        당신은 친절한 AI 어시스턴트입니다.
        간결하게 답변하세요. (최대 100 토큰)
        """;
    
    String prompt = systemMessage + "\n\n" + 
                   buildContext(messages) + "\n\n" + 
                   userMessage;
    
    return llm.generate(prompt);
}
```

#### 3) 중요 정보 우선 유지

```java
public class PriorityContextWindow {
    private Message systemPrompt; // 항상 유지
    private List<Message> pinnedMessages = new ArrayList<>(); // 고정 메시지
    private Deque<Message> recentMessages = new LinkedList<>(); // 최근 대화
    
    public String chat(String userMessage) {
        recentMessages.addLast(new Message("user", userMessage));
        
        // 토큰 계산 우선순위
        int usedTokens = 0;
        usedTokens += calculateTokens(systemPrompt); // 1순위
        usedTokens += calculateTokens(pinnedMessages); // 2순위
        
        // 남은 공간에 최근 대화 채우기
        int availableTokens = MAX_TOKENS - usedTokens;
        while (calculateTokens(recentMessages) > availableTokens) {
            recentMessages.removeFirst();
        }
        
        // Context 구성
        String context = systemPrompt.content + "\n\n" +
                        buildContext(pinnedMessages) + "\n\n" +
                        buildContext(recentMessages);
        
        return llm.generate(context);
    }
}
```

------

### 6. 정리: LLM 메모리의 본질 📝

#### LLM 메모리 구조 정리

```java
// LLM 메모리 = 3가지 계층
public class LLMMemorySystem {
    
    // 1. 모델 가중치 (읽기 전용, 학습 시 고정)
    private ModelWeights weights; // "ROM" 같은 존재
    
    // 2. Context Window (휘발성, 요청마다 초기화)
    private ContextWindow context; // "RAM" 같은 존재
    
    // 3. 외부 저장소 (영구 저장, 검색 가능)
    private VectorDatabase externalMemory; // "HDD/SSD" 같은 존재
    
    public String generate(String prompt) {
        // Step 1: 외부 메모리에서 관련 정보 로드 (RAG)
        List<Document> relevant = externalMemory.search(prompt);
        
        // Step 2: Context Window에 로드
        context.load(relevant);
        context.load(prompt);
        
        // Step 3: 모델 가중치로 추론
        String response = weights.predict(context);
        
        // Step 4: Context Window는 요청 종료 시 소멸
        context.clear(); // Stateless!
        
        return response;
    }
}
```

#### 컴퓨터 메모리와 비교

| 구분 | 컴퓨터 | LLM |
|------|-------|-----|
| **ROM** | BIOS, 펌웨어 | 모델 가중치 (학습된 지식) |
| **RAM** | 실행 중 데이터 | Context Window (현재 대화) |
| **HDD/SSD** | 영구 저장소 | Vector DB (RAG) |
| **휘발성** | 전원 꺼지면 RAM 삭제 | 요청 끝나면 Context 삭제 |
| **비휘발성** | HDD는 영구 보존 | Vector DB는 영구 보존 |

#### 핵심 개념 한 줄 정리

```java
/**
 * LLM 메모리의 3대 원칙
 */
public interface LLMMemoryPrinciples {
    
    // 1. Stateless: 매 요청은 독립적 (HTTP와 동일)
    void principle1() {
        // LLM은 이전 대화를 자동으로 기억하지 않는다
        // 애플리케이션이 명시적으로 전달해야 한다
    }
    
    // 2. Context Window: 제한된 메모리 (Queue 자료구조)
    void principle2() {
        // 한 번에 처리할 수 있는 토큰 수가 제한적
        // 초과 시 오래된 정보부터 FIFO로 제거
    }
    
    // 3. RAG: 외부 DB 조회로 메모리 확장
    void principle3() {
        // Vector DB에 정보 저장
        // 필요할 때 검색하여 Context에 로드
        // DB 조회 + LLM 생성의 조합
    }
}
```

------

### 마치며

LLM의 메모리 구조를 이해하면:

1. **왜 대화가 길어지면 초반 내용을 잊는지** (Context Window 제한)
2. **왜 최신 정보를 모르는지** (학습 데이터 시점 고정)
3. **RAG가 왜 필요한지** (외부 지식 활용)

를 명확히 알 수 있습니다!

다음 포스팅에서는 **실전: RAG 시스템 구현하기 (Spring Boot + Vector DB)**를 다뤄보겠습니다. 🚀

------

> 참고 자료
> - OpenAI API Documentation: https://platform.openai.com/docs
> - Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks: https://arxiv.org/abs/2005.11401
> - LangChain Documentation: https://python.langchain.com/docs/get_started/introduction
> - Vector Database Explained: https://www.pinecone.io/learn/vector-database/

