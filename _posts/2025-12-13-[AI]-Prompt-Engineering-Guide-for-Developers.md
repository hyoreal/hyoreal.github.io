---
layout: post

toc: true

title: "[AI 실전] 프롬프트 엔지니어링 기초 - P.C.T.O 프레임워크"

date: 2025-12-13 10:40:00 +0900

comments: true

categories: [AI, Prompt Engineering]

tags: [AI, Prompt, LLM]


---

### 1. 프롬프트 = 함수 설계

프롬프트는 함수 호출과 동일함. 모호한 입력은 Garbage Output을 생성함.

#### 함수 시그니처 비교

```java
// Bad: 타입 불명확, 제약조건 없음
Object generate(String prompt);  // Return type: Object (Unknown)

// Good: 명확한 타입과 제약조건
ResponseDTO generate(PromptRequest request);
// - PromptRequest: Persona, Context, Task, OutputFormat 포함
// - ResponseDTO: 구조화된 반환 타입
```

#### 실제 비교

```java
// ❌ Bad: 파라미터 불충분
String result = llm.generate("코드 짜줘");
// 문제점:
// - 무슨 코드? (Task 불명확)
// - 어떤 언어? (Context 없음)
// - 무엇을 위한? (Persona/Context 없음)
// - 어떤 형식? (Output Format 없음)

// ✅ Good: 명확한 파라미터
String result = llm.generate(
    """
    [Persona] 너는 10년차 Spring Boot 전문가야.
    [Context] Spring Boot 3.0, Java 17, MySQL 8.0
    [Task] User 엔티티에 대한 REST API Controller 작성
    [Output] Java 코드 블록, Swagger 어노테이션 포함
    """
);
```

#### REST API vs LLM 호출

```java
// REST API: 스키마 강제 (타입 안전)
POST /api/users
Content-Type: application/json
{
    "name": "String (required)",
    "email": "String (required, email format)",
    "role": "Enum (DEVELOPER | MANAGER)"
}
// ✅ 컴파일 타임에 검증 가능

// LLM: 자연어라 모호함 → 명확한 스펙 필요
"사용자 생성해줘"  // ❌ 애매모호

// 개선: 구조화된 프롬프트
"""
[Persona] Spring Boot 백엔드 개발자
[Context] Spring Boot 3.0, JPA 사용
[Task] User 엔티티 생성
[Constraints] 
  - name: String, required
  - email: String, required, unique
  - role: Enum (USER | ADMIN)
[Output] Java Entity 클래스, JPA 어노테이션 포함
"""
// ✅ 명확한 스펙
```

------

### 2. P.C.T.O 프레임워크

프롬프트의 4가지 필수 구성요소.

#### 2.1. Persona (역할 정의)

AI의 역할을 명시. `implements Interface` 또는 `@Service` 어노테이션과 동일.

```java
// Bad: 역할 없음
String prompt = "Spring Security 설명해줘";

// Good: 역할 명시
String prompt = """
    너는 10년차 Java 백엔드 시니어 개발자야.
    Spring Security에 대해 실무 예제 중심으로 설명해줘.
    """;
```

**Persona 비교 예시:**

```markdown
[Persona 1: 교수]
"너는 컴퓨터과학 교수야. 알고리즘 시간복잡도를 설명해줘."
→ 결과: 수학적, 이론적, Big-O 표기법 중심

[Persona 2: 시니어 개발자]
"너는 10년차 백엔드 개발자야. 알고리즘 시간복잡도를 설명해줘."
→ 결과: 실전 예제, 성능 비교, 언제 어떤 알고리즘 쓰는지

[Persona 3: 테크 블로거]
"너는 초보자를 위한 기술 블로거야. 알고리즘 시간복잡도를 설명해줘."
→ 결과: 쉬운 비유, 그림, 단계별 설명
```

#### 2.2. Context (배경 지식)

배경 지식 및 환경 정보. 함수의 파라미터 `InputDTO` 또는 전역 변수와 동일.

```java
// Bad: 맥락 없음
String prompt = "에러 해결해줘";

// Good: 맥락 포함
String prompt = """
    [Context]
    - 환경: Spring Boot 3.1, Java 17, H2 Database
    - 상황: JPA 엔티티 저장 시 에러 발생
    - 에러: "detached entity passed to persist"
    
    [에러 발생 코드]
    @Service
    public class UserService {
        public User update(Long id, UserUpdateRequest request) {
            User user = new User();
            user.setId(id);
            return repository.save(user);  // 에러 발생
        }
    }
    
    해결 방법을 알려줘.
    """;
```

**Context에 따른 결과 차이:**

```markdown
[Context 1: 스타트업]
"B2C 서비스, 빠른 개발 중요, 유저 1만명, 소셜 로그인 필요"
→ 결과: OAuth2, Spring Security Social, 간단한 구조

[Context 2: 대기업]
"금융권 SI, 보안 최우선, 유저 100만명+, 2FA 필수"
→ 결과: Spring Security 커스터마이징, Redis 세션, AOP 감사 로그, 2FA
```

#### 2.3. Task (구체적 작업)

수행해야 할 구체적 작업. 비즈니스 로직과 동일.

```java
// Bad: 애매한 지시
String task = "코드 개선해줘";

// Good: 구체적 지시
String task = """
    다음 코드를 개선해줘:
    1. null 체크를 Optional로 변경
    2. Stream API 사용으로 가독성 향상
    3. 매직 넘버를 상수로 추출
    4. 메서드를 3개 이하 라인으로 분리
    
    [기존 코드]
    public List<User> getActiveUsers(List<User> users) {
        List<User> result = new ArrayList<>();
        for (User user : users) {
            if (user != null && user.getStatus() == 1) {
                result.add(user);
            }
        }
        return result;
    }
    """;
```

**Task 세분화 예시:**

```markdown
[Step 1] User 엔티티 생성
- id(Long), email(String, unique), password(String), createdAt(LocalDateTime)
- JPA 어노테이션 사용

[Step 2] UserRepository 인터페이스 생성
- JpaRepository 상속
- findByEmail 메서드 추가

[Step 3] UserService 클래스 생성
- 회원가입 메서드(이메일 중복 체크)
- 비밀번호 BCrypt 암호화
- 예외 처리 포함

[Step 4] UserController REST API 생성
- POST /api/users
- Request/Response DTO 사용
- Swagger 어노테이션 포함
```

#### 2.4. Output Format (반환 형식)

반환 형식 명시. 함수의 Return Type과 동일.

```java
// Bad: 형식 지정 없음
String prompt = "User 엔티티 만들어줘";

// Good: 명확한 형식 지정
String prompt = """
    User 엔티티를 만들어줘.
    
    [Output Format]
    1. Java 파일로 작성
    2. Lombok 어노테이션 사용
    3. 주석은 JavaDoc 형식
    4. 각 필드에 설명 주석 포함
    5. 코드 블록으로 감싸서 복사 가능하게
    """;
```

**Output Format 예시:**

```markdown
[형식 1: 마크다운 테이블]
Spring Security 주요 컴포넌트 설명
| 컴포넌트 | 역할 | 사용 예시 |

[형식 2: 코드 + 설명]
JPA N+1 문제 해결 방법
1. 문제 상황 코드
2. 해결 방법 1: Fetch Join (코드 + 설명)
3. 해결 방법 2: @EntityGraph (코드 + 설명)
4. 각 방법의 장단점 비교표

[형식 3: JSON]
REST API 에러 응답 포맷
{
    "timestamp": "ISO-8601",
    "status": "HTTP 상태 코드",
    "error": "에러 타입",
    "message": "사용자 친화적 메시지",
    "path": "요청 경로"
}
```

------

### 3. Bad vs Good 프롬프트 비교

#### 예시 1: 코드 생성

**❌ Bad - 모호한 입력**

```markdown
프롬프트: "코드 짜줘"

결과:
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}

문제점:
- 무엇을 위한 코드인지 불명확
- 프레임워크, 라이브러리 지정 없음
- 요구사항 불명확
```

**✅ Good - 명확한 스펙**

```markdown
프롬프트:
"""
[Persona]
너는 Spring Boot 전문가야.

[Context]
- Spring Boot 3.0
- Java 17
- MySQL 8.0
- Swagger UI 필수

[Task]
User 엔티티에 대한 REST API Controller 작성

[Requirements]
1. CRUD 엔드포인트 전부 포함 (GET, POST, PUT, DELETE)
2. Request/Response DTO 분리
3. Swagger 어노테이션 포함 (@Operation, @ApiResponse)
4. 예외 처리 (EntityNotFoundException)
5. Validation 어노테이션 추가 (@Valid, @NotNull)

[Output Format]
- Controller, DTO, Exception 클래스 각각 분리
- 코드 블록으로 작성
- 주석 포함
"""

결과:
@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "사용자 관리 API")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @Operation(summary = "전체 사용자 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    public List<UserResponse> getAllUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "사용자 상세 조회")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "404", description = "사용자 없음")
    })
    public UserResponse getUser(@PathVariable Long id) {
        return userService.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }
    
    // ... (나머지 CRUD 메서드)
}
```

#### 예시 2: 에러 해결

**❌ Bad**

```markdown
프롬프트: "에러 났어 고쳐줘"

결과: "어떤 에러인지 알려주세요." (AI가 추가 질문)
```

**✅ Good**

```markdown
프롬프트:
"""
[Context]
- Spring Boot 3.1.0, Java 17, H2 Database, JPA/Hibernate

[문제 상황]
User 엔티티 저장 시 다음 에러 발생:
org.hibernate.PersistentObjectException: 
detached entity passed to persist: com.example.User

[에러 발생 코드]
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User update(Long id, UserUpdateRequest request) {
        User user = new User();
        user.setId(id);
        user.setName(request.getName());
        return repository.save(user);  // 에러 발생
    }
}

[질문]
1. 왜 이 에러가 발생하나요?
2. 어떻게 수정해야 하나요?
3. save() vs merge() 차이는 뭔가요?
"""

결과:
"""
[원인]
새로운 객체를 생성하고 ID만 세팅했기 때문에, 
JPA는 이를 "준영속(detached)" 상태로 인식함.
save()는 새 엔티티(transient)만 처리하므로 에러 발생.

[해결 방법 1: 조회 후 수정 (권장)]
public User update(Long id, UserUpdateRequest request) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException());
    
    user.setName(request.getName());
    return user;  // @Transactional이면 자동 저장
}

[해결 방법 2: merge 사용]
public User update(Long id, UserUpdateRequest request) {
    User user = new User();
    user.setId(id);
    user.setName(request.getName());
    return entityManager.merge(user);
}

[save() vs merge() 차이]
- save(): 새 엔티티를 영속화 (INSERT)
- merge(): 준영속 엔티티를 영속화 (UPDATE)
"""
```

------

### 4. Temperature: 창의성 vs 정확성

LLM의 무작위성(Randomness) 조절 파라미터.

#### Temperature 값에 따른 동작

```java
// Temperature = 0.0 (결정적, Deterministic)
// 항상 가장 확률 높은 토큰 선택 → 매번 같은 결과
llm.generate(prompt, temperature=0.0);

// Temperature = 1.0 (창의적, Stochastic)
// 확률 분포에 따라 다양한 토큰 선택 → 매번 다른 결과
llm.generate(prompt, temperature=1.0);
```

#### 실제 코드 생성 비교

**질문:** "피보나치 수열을 계산하는 Java 메서드를 작성해줘"

**Temperature = 0.0 (정확성 우선)**

```java
// 매번 동일한 결과
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

**Temperature = 1.0 (창의성 우선)**

```java
// 실행마다 다른 구현 방식
// 1회차: 재귀 방식
// 2회차: 반복문 방식
// 3회차: 메모이제이션 방식
// 4회차: Stream API 방식
```

#### Temperature 선택 가이드

| Temperature | 특징 | 추천 사용처 |
|------------|------|-----------|
| **0.0 ~ 0.3** | 결정적, 정확성 우선 | 코드 생성, SQL 쿼리, 수학 문제, 번역, 요약 |
| **0.4 ~ 0.6** | 균형잡힌 | 기술 문서, 코드 리뷰, 이메일, 일반 질문 |
| **0.7 ~ 1.0** | 창의적, 다양성 우선 | 아이디어 브레인스토밍, 마케팅 문구, 창의적 글쓰기 |

------

### 5. P.C.T.O 프롬프트 템플릿

```markdown
[Persona]
너는 {역할}이야. {경력/전문성}

[Context]
- 환경: {기술 스택}
- 상황: {현재 상태}
- 제약사항: {제한 조건}

[Task]
{구체적인 작업}

[Requirements]
1. {요구사항 1}
2. {요구사항 2}
3. {요구사항 3}

[Output Format]
- {원하는 형식}

[Example] (선택)
{예시 입력} → {예시 출력}
```

#### 실전 예시: MSA 아키텍처 설계

```markdown
[Persona]
너는 10년차 백엔드 아키텍트야.

[Context]
우리는 전자상거래 스타트업이야.
- 현재 모놀리식 Spring Boot 애플리케이션
- 월 10만 트랜잭션
- 팀원: 백엔드 5명, 프론트 3명
- AWS 인프라 사용

[Task]
MSA로 전환 설계

[Requirements]
1. 마이크로서비스 분리 기준 (User, Product, Order, Payment)
2. 서비스 간 통신 방법 (동기/비동기, REST/gRPC/메시지 큐)
3. 데이터 관리 (DB 분리, 트랜잭션 처리, 일관성 보장)
4. 인프라 (API Gateway, Service Discovery, Config Server)

[Output Format]
1. 아키텍처 다이어그램 (텍스트)
2. 각 컴포넌트별 설명
3. 기술 스택 추천 (이유 포함)
4. 단계별 마이그레이션 계획
5. 주의사항 및 트레이드오프
```

------

### 6. 프롬프트 체크리스트

```java
public class PromptChecklist {
    
    public boolean isGoodPrompt(String prompt) {
        return checkPersona(prompt) &&      // ✅ 역할 명시?
               checkContext(prompt) &&      // ✅ 배경 설명?
               checkTask(prompt) &&         // ✅ 작업 명확?
               checkOutputFormat(prompt);   // ✅ 형식 지정?
    }
}
```

**체크리스트 항목:**

- [ ] Persona: AI의 역할이 명시되어 있는가?
- [ ] Context: 환경, 상황, 제약사항이 포함되어 있는가?
- [ ] Task: 수행할 작업이 구체적으로 명시되어 있는가?
- [ ] Output Format: 반환 형식이 명확한가?
- [ ] Constraints: 제약조건이 명시되어 있는가? (선택)
- [ ] Examples: 예시가 제공되어 있는가? (선택)

------

### 7. 핵심 정리

1. **프롬프트 = 함수 설계**: 모호한 입력 → Garbage Output
2. **P.C.T.O 프레임워크**: Persona, Context, Task, Output Format 필수
3. **Temperature 조절**: 정확성(0.0) vs 창의성(1.0)
4. **구체적으로 작성**: "코드 짜줘" ❌ → "Spring Boot User API with Swagger" ✅

프롬프트 엔지니어링은 **AI를 다루는 새로운 프로그래밍 언어**임.

------

> 참고 자료
> - OpenAI Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
> - Anthropic Prompt Library: https://docs.anthropic.com/claude/prompt-library
> - Learn Prompting: https://learnprompting.org/
> - Prompt Engineering Guide (GitHub): https://github.com/dair-ai/Prompt-Engineering-Guide
