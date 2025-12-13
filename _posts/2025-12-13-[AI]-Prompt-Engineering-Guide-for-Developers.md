---
layout: post

toc: true

title: "[AI] 내 명령을 AI가 못 알아듣는 이유 - 프롬프트 엔지니어링 완벽 가이드"

date: 2025-12-13 18:56:00 +0900

comments: true

categories: [AI, Machine Learning]

tags: [AI, Prompt Engineering, LLM, ChatGPT, GPT, Temperature]


---

### AI에게 제대로 명령하는 법 🎯

"ChatGPT야, 코드 짜줘"라고 했는데 엉뚱한 결과가 나온 경험 있으시죠?

문제는 AI가 아니라 **명령어(프롬프트)**에 있습니다. 마치 SQL 쿼리를 잘못 작성하면 원하는 데이터를 못 가져오는 것처럼요.

오늘은 개발자를 위한 **프롬프트 엔지니어링**을 완벽히 정리해드립니다!

------

### 프롬프트 엔지니어링이란? 📋

**"LLM에게 원하는 결과를 얻기 위해 입력을 최적화하는 기술"**

```java
// 함수 호출과 비슷
public class PromptEngineering {
    
    // Bad: 파라미터 불충분
    String result1 = llm.generate("코드 짜줘");
    // ❌ 무슨 코드? 어떤 언어? 무엇을 위한?
    
    // Good: 명확한 파라미터
    String result2 = llm.generate(
        "Java Spring Boot 3.0으로 " +
        "User CRUD REST API를 작성하되, " +
        "Swagger 문서화 어노테이션을 포함하고 " +
        "예외 처리도 해줘"
    );
    // ✅ 명확하고 구체적!
}
```

#### API 호출과 비교

```java
// REST API 호출 (구조화된 요청)
POST /api/users
{
    "name": "김개발",
    "email": "dev@example.com",
    "role": "DEVELOPER"
}
// ✅ 명확한 스키마

// LLM 호출 (비구조화된 요청)
"사용자 생성해줘"
// ❌ 애매모호

// 개선된 LLM 호출
"User 엔티티를 생성하되, name(String), email(String), role(Enum)을 포함해줘"
// ✅ 구체적
```

**핵심 차이:**
- REST API: 스키마가 강제됨 (타입, 필수값)
- LLM: 자연어라 모호함 → **명확하게 작성해야 함**

------

### 좋은 프롬프트의 4대 요소 (P.C.T.O) 🎨

#### 1. Persona (역할/페르소나)

**"너는 누구야?"**

```java
// Bad
String prompt = "Spring Security 설명해줘";

// Good
String prompt = """
    너는 10년차 Java 백엔드 시니어 개발자야.
    Spring Security에 대해 설명해줘.
    """;
```

**실제 비교:**

```
❌ Bad (역할 없음):
Q: "Spring Security 설명해줘"
A: "Spring Security는 인증과 인가를 위한 프레임워크입니다."
   (너무 추상적)

✅ Good (역할 부여):
Q: "너는 10년차 Spring 전문가야. 3년차 개발자에게 
    Spring Security를 실무 예제 중심으로 설명해줘."
A: "실무에서 가장 많이 쓰이는 JWT 기반 인증을 예로 들어볼게요.
    먼저 SecurityConfig 클래스를 만들고...
    (코드 예제)
    이렇게 구성하면 /api/login 엔드포인트에서..."
   (구체적이고 실무 중심)
```

**페르소나의 힘:**

```java
public class PersonaComparison {
    
    // 페르소나 1: 교수
    String professor = """
        너는 컴퓨터과학 교수야.
        알고리즘의 시간복잡도를 설명해줘.
        """;
    // 결과: 수학적, 이론적, Big-O 표기법 중심
    
    // 페르소나 2: 시니어 개발자
    String senior = """
        너는 10년차 백엔드 개발자야.
        알고리즘의 시간복잡도를 설명해줘.
        """;
    // 결과: 실전 예제, 성능 비교, 언제 어떤 알고리즘 쓰는지
    
    // 페르소나 3: 테크 블로거
    String blogger = """
        너는 초보자를 위한 기술 블로거야.
        알고리즘의 시간복잡도를 설명해줘.
        """;
    // 결과: 쉬운 비유, 그림, 단계별 설명
}
```

#### 2. Context (맥락/배경)

**"어떤 상황이야?"**

```java
// Bad: 맥락 없음
String prompt = "에러 해결해줘";

// Good: 맥락 포함
String prompt = """
    나는 Spring Boot 3.1, Java 17 환경에서 개발 중이야.
    H2 DB를 사용하고 있고, JPA 엔티티를 저장할 때
    "detached entity passed to persist" 에러가 발생해.
    
    [에러 스택트레이스]
    ...
    
    [내 코드]
    @Service
    public class UserService {
        public void save(User user) {
            repository.save(user);
        }
    }
    
    어떻게 해결해야 할까?
    """;
```

**Context의 중요성:**

```java
// 시나리오: "로그인 구현해줘"

// Context 1: 스타트업
String context1 = """
    우리는 B2C 서비스 스타트업이야. 
    빠른 개발이 중요하고, 유저는 1만명 정도야.
    소셜 로그인(카카오, 구글)을 지원해야 해.
    로그인 구현해줘.
    """;
// 결과: OAuth2, Spring Security Social 사용, 간단한 구조

// Context 2: 대기업
String context2 = """
    우리는 금융권 SI 프로젝트야.
    보안이 가장 중요하고, 유저는 100만명 이상이야.
    2FA(이중 인증), 세션 관리, 감사 로그가 필수야.
    로그인 구현해줘.
    """;
// 결과: Spring Security 커스터마이징, Redis 세션, 
//       AOP 감사 로그, 2FA 라이브러리 추가
```

#### 3. Task (작업/지시)

**"정확히 뭘 해야 해?"**

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

```java
public class TaskBreakdown {
    
    // Bad: 너무 광범위
    String bad = "회원가입 시스템 만들어줘";
    
    // Good: 단계별 명확한 Task
    String good1 = """
        [Step 1] User 엔티티 생성
        - id(Long), email(String, unique), password(String), 
          createdAt(LocalDateTime) 필드 포함
        - JPA 어노테이션 사용
        """;
    
    String good2 = """
        [Step 2] UserRepository 인터페이스 생성
        - JpaRepository 상속
        - findByEmail 메서드 추가
        """;
    
    String good3 = """
        [Step 3] UserService 클래스 생성
        - 회원가입 메서드(이메일 중복 체크 포함)
        - 비밀번호는 BCrypt로 암호화
        - 예외 처리 포함
        """;
    
    String good4 = """
        [Step 4] UserController REST API 생성
        - POST /api/users (회원가입)
        - Request/Response DTO 사용
        - Swagger 어노테이션 포함
        """;
}
```

#### 4. Output Format (출력 형식)

**"어떤 형식으로 줘?"**

```java
// Bad: 형식 지정 없음
String prompt = "User 엔티티 만들어줘";

// Good: 명확한 형식 지정
String prompt = """
    User 엔티티를 만들어줘.
    
    [출력 형식]
    1. Java 파일로 작성
    2. Lombok 어노테이션 사용
    3. 주석은 JavaDoc 형식
    4. 각 필드에 설명 주석 포함
    5. 코드 블록으로 감싸서 복사 가능하게
    """;
```

**형식 예시:**

```java
// 예시 1: 테이블 형식
String format1 = """
    Spring Security의 주요 컴포넌트를 설명해줘.
    
    [출력 형식: 마크다운 테이블]
    | 컴포넌트 | 역할 | 사용 예시 |
    |---------|-----|----------|
    """;

// 예시 2: 코드 + 설명
String format2 = """
    JPA N+1 문제를 해결하는 방법을 알려줘.
    
    [출력 형식]
    1. 문제 상황 코드
    2. 해결 방법 1: Fetch Join (코드 + 설명)
    3. 해결 방법 2: @EntityGraph (코드 + 설명)
    4. 해결 방법 3: Batch Size (코드 + 설명)
    5. 각 방법의 장단점 비교표
    """;

// 예시 3: JSON
String format3 = """
    REST API 에러 응답 포맷을 설계해줘.
    
    [출력 형식: JSON]
    {
        "timestamp": "ISO-8601 형식",
        "status": "HTTP 상태 코드",
        "error": "에러 타입",
        "message": "사용자 친화적 메시지",
        "path": "요청 경로",
        "trace": "스택트레이스 (개발환경만)"
    }
    """;
}
```

------

### Temperature: 창의성 vs 정확성 🌡️

#### Temperature란?

**"LLM의 무작위성(Randomness) 조절 파라미터"**

```java
public class TemperatureComparison {
    
    // Temperature = 0.0 (결정적, Deterministic)
    public String generateWithTemp0() {
        // 항상 가장 확률 높은 토큰 선택
        // 매번 같은 결과
        return llm.generate(prompt, temperature=0.0);
    }
    
    // Temperature = 1.0 (창의적, Stochastic)
    public String generateWithTemp1() {
        // 확률 분포에 따라 다양한 토큰 선택
        // 매번 다른 결과
        return llm.generate(prompt, temperature=1.0);
    }
}
```

#### 실제 코드 생성 비교

**질문:** "피보나치 수열을 계산하는 Java 메서드를 작성해줘"

**Temperature = 0.0 (정확성 우선)**

```java
// 첫 번째 실행
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 두 번째 실행 (똑같음!)
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 세 번째 실행 (똑같음!)
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

**Temperature = 1.0 (창의성 우선)**

```java
// 첫 번째 실행 - 재귀 방식
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 두 번째 실행 - 반복문 방식
public int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

// 세 번째 실행 - 메모이제이션 방식
public int fibonacci(int n) {
    int[] memo = new int[n + 1];
    return fibHelper(n, memo);
}

private int fibHelper(int n, int[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
    return memo[n];
}

// 네 번째 실행 - 스트림 방식
public int fibonacci(int n) {
    return Stream.iterate(new int[]{0, 1}, 
                          arr -> new int[]{arr[1], arr[0] + arr[1]})
                 .limit(n + 1)
                 .map(arr -> arr[0])
                 .reduce((a, b) -> b)
                 .orElse(0);
}
```

#### Temperature 선택 가이드

```java
public class TemperatureGuide {
    
    // Temperature = 0.0 ~ 0.3 (정확성이 중요)
    public void useLowTemperature() {
        /*
         * 추천 사용 사례:
         * - 코드 생성 (버그 없이 정확하게)
         * - SQL 쿼리 작성
         * - 수학 문제 풀이
         * - 번역 작업
         * - 요약 작업
         */
        String code = llm.generate(
            "Spring Boot CRUD Controller 작성",
            temperature = 0.2
        );
    }
    
    // Temperature = 0.7 ~ 1.0 (창의성이 중요)
    public void useHighTemperature() {
        /*
         * 추천 사용 사례:
         * - 아이디어 브레인스토밍
         * - 마케팅 문구 작성
         * - 창의적인 글쓰기
         * - 다양한 해결 방안 탐색
         */
        String ideas = llm.generate(
            "새로운 B2B SaaS 아이디어 10가지",
            temperature = 0.9
        );
    }
    
    // Temperature = 0.4 ~ 0.6 (균형)
    public void useMediumTemperature() {
        /*
         * 추천 사용 사례:
         * - 기술 문서 작성
         * - 코드 리뷰 코멘트
         * - 이메일 작성
         * - 일반적인 질문 답변
         */
        String review = llm.generate(
            "이 PR에 대한 리뷰 코멘트 작성",
            temperature = 0.5
        );
    }
}
```

#### 실전 비교표

| Temperature | 특징 | 코드 생성 결과 | 추천 사용처 |
|------------|------|---------------|-----------|
| **0.0** | 결정적, 매번 동일 | 가장 표준적인 구현 | 프로덕션 코드 |
| **0.3** | 약간의 변화 | 표준에 가까운 구현 | 테스트 코드 |
| **0.5** | 균형잡힌 | 다양한 접근법 | 리팩토링 제안 |
| **0.7** | 창의적 | 여러 대안 제시 | 아키텍처 설계 |
| **1.0** | 매우 창의적 | 실험적인 방법 | 프로토타이핑 |

------

### Bad vs Good 프롬프트 비교 ⚖️

#### 예시 1: 코드 생성

**❌ Bad - 너무 막연함**

```
프롬프트: "코드 짜줘"

결과:
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}

문제점:
- 무엇을 위한 코드인지 모름
- 프레임워크, 라이브러리 지정 없음
- 요구사항 불명확
```

**✅ Good - 구체적이고 명확함**

```
프롬프트:
"""
너는 Spring Boot 전문가야.

[Context]
- Spring Boot 3.0
- Java 17
- MySQL 8.0
- Swagger UI 필수

[Task]
User 엔티티에 대한 REST API Controller를 작성해줘.

[상세 요구사항]
1. CRUD 엔드포인트 전부 포함 (GET, POST, PUT, DELETE)
2. Request/Response DTO 분리
3. Swagger 어노테이션 포함 (@Operation, @ApiResponse)
4. 예외 처리 (EntityNotFoundException)
5. Validation 어노테이션 추가 (@Valid, @NotNull 등)

[Output Format]
- Controller, DTO, Exception 클래스 각각 분리
- 코드 블록으로 작성
- 주석 포함
"""

결과:
// UserController.java
@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "사용자 관리 API")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @Operation(summary = "전체 사용자 조회", description = "모든 사용자 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    public List<UserResponse> getAllUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "사용자 상세 조회", description = "ID로 특정 사용자를 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "404", description = "사용자 없음")
    })
    public UserResponse getUser(@PathVariable Long id) {
        return userService.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }
    
    @PostMapping
    @Operation(summary = "사용자 생성", description = "새로운 사용자를 생성합니다.")
    @ApiResponse(responseCode = "201", description = "생성 성공")
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "사용자 수정", description = "기존 사용자 정보를 수정합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수정 성공"),
        @ApiResponse(responseCode = "404", description = "사용자 없음")
    })
    public UserResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        return userService.update(id, request);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "사용자 삭제", description = "사용자를 삭제합니다.")
    @ApiResponse(responseCode = "204", description = "삭제 성공")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

// UserCreateRequest.java
public class UserCreateRequest {
    @NotBlank(message = "이름은 필수입니다")
    private String name;
    
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @NotBlank(message = "이메일은 필수입니다")
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String password;
}

// ... (나머지 클래스들)
```

#### 예시 2: 에러 해결

**❌ Bad**

```
프롬프트: "에러 났어 고쳐줘"

결과: "어떤 에러인지 알려주세요."
(AI가 추가 질문)
```

**✅ Good**

```
프롬프트:
"""
[환경]
- Spring Boot 3.1.0
- Java 17
- H2 Database
- JPA/Hibernate

[문제 상황]
User 엔티티를 저장할 때 다음 에러 발생:

org.hibernate.PersistentObjectException: 
detached entity passed to persist: com.example.User

[에러 발생 코드]
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User update(Long id, UserUpdateRequest request) {
        User user = new User();
        user.setId(id);  // 기존 ID 세팅
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        
        return userRepository.save(user);  // 여기서 에러!
    }
}

[질문]
1. 왜 이 에러가 발생하나요?
2. 어떻게 수정해야 하나요?
3. save() vs merge() 차이는 뭔가요?
"""

결과:
"""
이 에러는 JPA의 영속성 컨텍스트 문제입니다.

[원인]
새로운 객체를 생성하고 ID만 세팅했기 때문에, 
JPA는 이를 "준영속(detached)" 상태로 인식합니다.
save()는 새 엔티티(transient)만 처리하므로 에러가 발생합니다.

[해결 방법 1: 조회 후 수정 (권장)]
public User update(Long id, UserUpdateRequest request) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException());
    
    // 영속 상태 엔티티 수정
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    
    return user;  // @Transactional이면 자동 저장
}

[해결 방법 2: merge 사용]
public User update(Long id, UserUpdateRequest request) {
    User user = new User();
    user.setId(id);
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    
    return entityManager.merge(user);
}

[save() vs merge() 차이]
- save(): 새 엔티티를 영속화 (INSERT)
- merge(): 준영속 엔티티를 영속화 (UPDATE)

권장: 방법 1 (조회 후 수정)
이유: 
1. 변경 감지(Dirty Checking) 활용
2. 의도치 않은 전체 필드 업데이트 방지
3. 존재 여부 검증 가능
"""
```

#### 예시 3: 아키텍처 설계

**❌ Bad**

```
프롬프트: "MSA 구조 알려줘"

결과: (일반적인 MSA 설명만 나열)
```

**✅ Good**

```
프롬프트:
"""
[Persona]
너는 10년차 백엔드 아키텍트야.

[Context]
우리는 전자상거래 스타트업이야.
- 현재 모놀리식 Spring Boot 애플리케이션
- 월 10만 트랜잭션
- 팀원: 백엔드 5명, 프론트 3명
- AWS 인프라 사용

[Task]
MSA로 전환하려고 해. 다음을 설계해줘:

1. 마이크로서비스 분리 기준
   - User Service
   - Product Service  
   - Order Service
   - Payment Service
   어떤 기준으로 나눠야 할까?

2. 서비스 간 통신 방법
   - 동기 vs 비동기
   - REST vs gRPC vs 메시지 큐
   각각 어떤 상황에 사용?

3. 데이터 관리
   - DB 분리 전략
   - 트랜잭션 처리 (Saga 패턴)
   - 데이터 일관성 보장

4. 인프라
   - API Gateway (Spring Cloud Gateway vs Kong)
   - Service Discovery (Eureka vs Consul)
   - Config Server

[Output Format]
1. 아키텍처 다이어그램 (텍스트로)
2. 각 컴포넌트별 설명
3. 기술 스택 추천 (이유 포함)
4. 단계별 마이그레이션 계획
5. 주의사항 및 트레이드오프
"""

결과: (상세한 설계 문서 + 코드 예시 + 마이그레이션 플랜)
```

------

### 프롬프트 체크리스트 ✅

```java
public class PromptChecklist {
    
    public boolean isGoodPrompt(String prompt) {
        return checkPersona(prompt) &&      // ✅ 역할 명시?
               checkContext(prompt) &&      // ✅ 배경 설명?
               checkTask(prompt) &&         // ✅ 작업 명확?
               checkOutputFormat(prompt);   // ✅ 형식 지정?
    }
    
    // Good Prompt 템플릿
    public String buildPrompt() {
        return """
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
            """;
    }
}
```

------

### 실전 프롬프트 패턴 모음 📚

#### 패턴 1: Few-Shot Learning (예시 제공)

```java
String prompt = """
    다음 예시를 보고 동일한 형식으로 작성해줘:
    
    [예시 1]
    입력: GET /api/users/{id}
    출력:
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    [예시 2]
    입력: POST /api/products
    출력:
    @PostMapping
    public Product createProduct(@RequestBody ProductRequest request) {
        return productService.create(request);
    }
    
    [내 작업]
    입력: DELETE /api/orders/{id}
    출력: ?
    """;
```

#### 패턴 2: Chain of Thought (단계별 사고)

```java
String prompt = """
    다음 문제를 단계별로 풀어줘:
    
    [문제]
    Spring Boot에서 N+1 문제가 발생했어.
    
    [단계별로 생각해줘]
    1. N+1 문제가 무엇인지 설명
    2. 왜 발생하는지 원인 분석
    3. 내 코드에서 문제가 되는 부분 찾기
    4. 해결 방법 3가지 제시
    5. 각 방법의 장단점 비교
    6. 최종 권장 방법 선택 (이유 포함)
    
    [내 코드]
    @Entity
    public class User {
        @OneToMany
        private List<Order> orders;
    }
    
    // Controller
    List<User> users = userRepository.findAll();
    for (User user : users) {
        System.out.println(user.getOrders().size());  // 여기서 추가 쿼리!
    }
    """;
```

#### 패턴 3: Role-Based (역할 전환)

```java
String prompt = """
    3가지 관점에서 평가해줘:
    
    [코드]
    public void processOrder(Order order) {
        if (order.getStatus() == 1) {
            // 결제 처리
            paymentService.pay(order);
            order.setStatus(2);
        }
    }
    
    [관점 1: 시니어 개발자]
    - 코드 품질은?
    - 개선할 점은?
    
    [관점 2: 보안 전문가]
    - 보안 취약점은?
    - 어떻게 보완할까?
    
    [관점 3: 성능 엔지니어]
    - 성능 이슈는?
    - 최적화 방법은?
    """;
```

------

### 마치며: 프롬프트는 코드다 💻

```java
// Bad Prompt = 버그 많은 코드
String badPrompt = "코드 짜줘";  // ❌ NullPointerException

// Good Prompt = 잘 짜여진 코드
String goodPrompt = """
    [Persona] 10년차 Spring 전문가
    [Context] Spring Boot 3.0, Java 17
    [Task] User CRUD API 작성
    [Output] Controller + Service + Repository + DTO
    [Requirements] Swagger, Validation, Exception 처리
    """;  // ✅ 완벽한 결과
```

**핵심 정리:**

1. **P.C.T.O 원칙** - Persona, Context, Task, Output Format
2. **Temperature 조절** - 정확성(0.0) vs 창의성(1.0)
3. **구체적으로** - "코드 짜줘" ❌ → "Spring Boot User API with Swagger" ✅
4. **예시 제공** - Few-Shot Learning으로 원하는 형식 명확히

프롬프트 엔지니어링은 **AI를 다루는 새로운 프로그래밍 언어**입니다!

------

> 참고 자료
> - OpenAI Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
> - Anthropic Prompt Library: https://docs.anthropic.com/claude/prompt-library
> - Learn Prompting: https://learnprompting.org/
> - Prompt Engineering Guide (GitHub): https://github.com/dair-ai/Prompt-Engineering-Guide

