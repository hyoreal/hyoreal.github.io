---
layout: post

toc: true

title: "[AI 기초] Context Window와 RAG - LLM 메모리 구조 및 Stateless 특성"

date: 2025-12-13 10:20:00 +0900

comments: true

categories: [AI 기초]

tags: [AI, LLM, Context Window, RAG, Stateless, Vector Database, HTTP]


---

### 1. Stateless 특성: REST API와 동일한 구조

#### 개념 정의

- LLM은 상태를 저장하지 않음
- 이전 대화를 기억하지 못함
- REST API와 동일한 Stateless 아키텍처

#### REST API와의 비교

```java
// REST API: Stateless
@RestController
public class UserController {
    
    @GetMapping("/user")
    public User getUser(HttpServletRequest request) {
        // 이전 요청 정보 없음
        // 쿠키/토큰을 매 요청마다 Body에 포함해야 함
        String token = request.getHeader("Authorization");
        return userService.findByToken(token);
    }
}

// LLM: Stateless
public class LLMService {
    
    public String chat(String userMessage, List<Message> history) {
        // 이전 대화 정보 없음
        // 전체 대화 히스토리를 매 요청마다 Body에 포함해야 함
        ChatRequest request = ChatRequest.builder()
            .messages(history) // ← 전체 대화를 Body에 담아 전송
            .build();
        return llm.generate(request);
    }
}
```

#### 상태 유지 방법

**REST API**
- 쿠키/토큰을 매 요청마다 Header에 포함
- 서버는 세션 저장소에서 상태 조회

**LLM**
- 전체 대화 히스토리를 매 요청마다 Body에 포함
- LLM은 히스토리를 읽어 맥락 파악

#### 실제 동작 과정

```java
// 1번째 요청
POST /v1/chat/completions
{
  "messages": [
    {"role": "user", "content": "Java란 뭐야?"}
  ]
}

// 2번째 요청 (전체 히스토리 포함)
POST /v1/chat/completions
{
  "messages": [
    {"role": "user", "content": "Java란 뭐야?"},
    {"role": "assistant", "content": "Java는 객체지향..."},
    {"role": "user", "content": "그럼 Spring은?"}
  ]
}

// 3번째 요청 (계속 누적)
POST /v1/chat/completions
{
  "messages": [
    {"role": "user", "content": "Java란 뭐야?"},
    {"role": "assistant", "content": "Java는 객체지향..."},
    {"role": "user", "content": "그럼 Spring은?"},
    {"role": "assistant", "content": "Spring은 프레임워크..."},
    {"role": "user", "content": "버전은?"}
  ]
}
```

> **Note:** 매 요청마다 전체 대화 히스토리를 Body에 담아 전송해야 맥락 유지 가능

------

### 2. Context Window: JVM Heap Memory 제한과 유사

#### 개념 정의

- LLM이 한 번에 처리할 수 있는 토큰의 최대 개수
- 고정된 크기로 제한됨
- 초과 시 OOM(Out Of Memory) 발생 또는 앞부분 삭제

#### JVM Heap Memory와의 비교

```java
// JVM Heap Memory
public class JVMMemory {
    // -Xmx4g: 최대 4GB 힙 메모리
    // 초과 시: OutOfMemoryError 발생
    
    public void processLargeData(List<Data> data) {
        if (data.size() > MAX_HEAP_CAPACITY) {
            throw new OutOfMemoryError("Heap space 부족!");
        }
    }
}

// Context Window
public class LLMContextWindow {
    // GPT-4: 최대 8,192 tokens
    // 초과 시: 오래된 메시지 삭제 (FIFO)
    
    public String chat(List<Message> history) {
        int tokens = countTokens(history);
        if (tokens > MAX_CONTEXT_WINDOW) {
            // 오래된 메시지 제거 (FIFO)
            history = trimOldMessages(history, MAX_CONTEXT_WINDOW);
        }
        return generate(history);
    }
}
```

#### HTTP Request Header 제한과의 비교

```java
// HTTP Request Header 제한
// 일반적으로 8KB ~ 16KB 제한
// 초과 시: 413 Request Entity Too Large

@PostMapping("/api/data")
public ResponseEntity<?> processData(@RequestHeader Map<String, String> headers) {
    int headerSize = calculateHeaderSize(headers);
    if (headerSize > MAX_HEADER_SIZE) {
        return ResponseEntity.status(413).build(); // Too Large
    }
    return ResponseEntity.ok().build();
}

// Context Window 제한
// GPT-4: 8,192 tokens (약 32KB)
// 초과 시: 앞부분 메시지 삭제
```

#### Context Window 크기 비교

| 모델 | Context Window | 비고 |
|------|----------------|------|
| GPT-3.5 | 4,096 tokens | 약 16KB |
| GPT-4 | 8,192 tokens | 약 32KB |
| GPT-4 Turbo | 128,000 tokens | 약 512KB |

#### Context Window Overflow 처리

```java
// JVM: OutOfMemoryError 발생
public void processData() {
    List<Data> largeList = new ArrayList<>();
    // 힙 메모리 초과 시 즉시 에러
    // → GC 실행 또는 애플리케이션 종료
}

// Context Window: FIFO 방식으로 오래된 메시지 삭제
public class ConversationManager {
    
    private static final int MAX_TOKENS = 8192;
    
    public void addMessage(Message message) {
        history.add(message);
        
        while (countTokens(history) > MAX_TOKENS) {
            // 가장 오래된 메시지 제거 (FIFO)
            history.remove(0);
        }
    }
}
```

> **Note:** Context Window 초과 시 OOM이 아닌 FIFO 방식으로 오래된 대화 삭제

#### 비용과의 관계

- 대화 히스토리가 길수록 입력 토큰 수 증가
- 입력 토큰 수에 비례하여 API 비용 증가
- 동일한 질문이라도 누적된 히스토리로 인해 비용 증가

```java
// 1번째 요청: 10 tokens → $0.0003
// 100번째 요청: 5,000 tokens → $0.15
// → 50배 비용 증가
```

------

### 3. RAG (Retrieval-Augmented Generation): Service 계층에서 Repository 조회 패턴

#### 개념 정의

- Context Window 한계를 극복하는 방법
- 답변 생성 전에 외부 데이터베이스에서 관련 정보 검색
- 검색된 정보를 프롬프트에 주입하여 답변 생성

#### Open-book Test 비유

```java
// Close Book (일반 LLM)
// → 학습 데이터만으로 답변 (암기한 지식)

// Open Book (RAG)
// → 외부 자료를 참고하여 답변 (검색 후 답변)
```

#### Service 계층에서 Repository 조회 패턴과의 비교

```java
// Spring Service 계층 패턴
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository; // Repository 주입
    
    public UserDto getUser(Long id) {
        // 1. Repository에서 데이터 조회
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException());
        
        // 2. 조회한 데이터를 기반으로 비즈니스 로직 수행
        return UserDto.from(user);
    }
}

// RAG 패턴
@Service
public class RAGService {
    
    @Autowired
    private VectorDatabase vectorDB; // Vector DB (Repository 역할)
    
    @Autowired
    private OpenAIClient openAI; // LLM (Service 역할)
    
    public String answerWithRAG(String question) {
        // 1. Vector DB에서 관련 문서 조회 (Repository 조회)
        List<Document> relevantDocs = vectorDB.search(question, limit = 3);
        
        // 2. 조회한 데이터를 프롬프트에 주입 (Injection)
        String augmentedPrompt = buildPromptWithContext(question, relevantDocs);
        
        // 3. 주입된 컨텍스트를 기반으로 답변 생성 (비즈니스 로직)
        return openAI.generate(augmentedPrompt);
    }
}
```

> **Note:** RAG = Repository 조회 + Service 로직 수행 패턴과 동일

#### RAG 동작 과정

```java
// Step 1: Retrieval (Repository 조회)
List<Document> docs = vectorDB.search(question, topK = 3);
// → SELECT * FROM vector_embeddings 
//    WHERE similarity > threshold
//    ORDER BY similarity DESC
//    LIMIT 3

// Step 2: Augmentation (프롬프트에 주입)
String prompt = """
    다음 문서를 참고하여 답변해주세요:
    
    [참고 문서]
    %s
    
    [질문]
    %s
    """.formatted(docs, question);

// Step 3: Generation (LLM 답변 생성)
String answer = openAI.generate(prompt);
```

#### Vector Database: 의미 기반 검색

```java
// 일반 DB: 키워드 매칭
SELECT * FROM documents
WHERE content LIKE '%JWT 인증%';
// → 정확히 일치하는 문자열만 검색

// Vector DB: 의미 유사도 검색
SELECT content, COSINE_SIMILARITY(embedding, query_embedding) as similarity
FROM vector_embeddings
ORDER BY similarity DESC
LIMIT 3;
// → "인증", "토큰", "보안" 등 의미적으로 관련된 것도 검색
```

#### RAG의 장점

- 최신 정보 참조 가능 (학습 데이터 시점 제한 없음)
- 회사 내부 문서/코드 참조 가능
- 근거 기반 답변 (Hallucination 감소)
- 문서 추가만으로 지식 확장 가능 (재학습 불필요)

#### Cursor @Codebase = RAG 구현체

```java
// @Codebase 사용 시
"@Codebase 우리 프로젝트에서 JPA N+1 문제 어떻게 해결했어?"

// 내부 동작:
// 1. 프로젝트 코드베이스에서 관련 파일 검색 (Vector Search)
//    - UserRepository.java (유사도: 0.92)
//    - OrderService.java (유사도: 0.87)
//
// 2. 검색된 코드를 프롬프트에 주입
//
// 3. 프로젝트 코드 기반으로 답변 생성
```

### 4. 핵심 정리

#### LLM 메모리 구조 요약

| 개념 | 개발자 비유 | 설명 |
|------|------------|------|
| **Stateless** | REST API | 매 요청마다 전체 히스토리를 Body에 포함 |
| **Context Window** | JVM Heap Memory | 고정된 크기 제한, 초과 시 OOM 또는 앞부분 삭제 |
| **RAG** | Service 계층에서 Repository 조회 | 외부 DB에서 데이터 조회 후 프롬프트에 주입 |

#### 실전 최적화 방법

**1. 히스토리 관리**
- 최근 N개 메시지만 유지
- 불필요한 대화 제거

**2. 대화 요약**
- 오래된 대화를 요약하여 토큰 수 감소
- 원본: 5,000 tokens → 요약: 100 tokens

**3. RAG 활용**
- 긴 문서는 청크로 분할 후 Vector DB 저장
- 관련 청크만 검색하여 Context Window 절약

> **Note:** Cursor의 `@Codebase` 기능은 RAG 패턴의 실전 구현체임

------

> 참고 자료
> - OpenAI API Documentation: https://platform.openai.com/docs/guides/chat
> - RAG 개념: https://arxiv.org/abs/2005.11401
> - Vector Database 비교: https://www.pinecone.io/learn/vector-database/

