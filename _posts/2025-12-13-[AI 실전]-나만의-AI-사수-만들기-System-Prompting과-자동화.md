---
layout: post

toc: true

title: "[AI 실전] 나만의 AI 사수 만들기: System Prompting과 .cursorrules 자동화"

date: 2025-12-13 19:30:00 +0900

comments: true

categories: [AI, Deep Learning]

tags: [AI, System Prompt, Cursor, Automation, Metaprompting, cursorrules]


---

### AI를 나만의 전담 사수로 만드는 마지막 비법

지금까지 배운 LLM 원리, 프롬프트 엔지니어링, Few-Shot, Chain of Thought...

하지만 매번 이 모든 걸 프롬프트에 넣는 건 너무 귀찮아요. 😫

"매번 '자바 전문가처럼 말해줘', '코드 짜면 커밋해줘' 라고 하기 싫은데..."

**해결책: System Prompt (시스템 프롬프트)**

한 번만 설정하면 AI가 **영구적으로** 그 규칙을 따르게 만드는 마법이에요!

오늘은 AI 시리즈의 대미를 장식할 마지막 주제, **나만의 AI 사수 만들기**를 배워보겠습니다.

------

### 1. System Prompt - AI의 설정 파일 ⚙️

#### System Prompt란?

**일반 대화 이전에 AI에게 주입하는 '최상위 명령(God Mode)'**

```java
// 일반적인 대화 흐름
┌─────────────────────────────────────────────────┐
│ User Message (우리가 보내는 메시지)              │
└─────────────────────────────────────────────────┘
"Spring Security 구현 방법 알려줘"

┌─────────────────────────────────────────────────┐
│ AI Response                                     │
└─────────────────────────────────────────────────┘
"Spring Security는..."
```

```java
// System Prompt를 추가한 흐름
┌─────────────────────────────────────────────────┐
│ System Prompt (최상위 명령, 사용자에게 안 보임)  │
└─────────────────────────────────────────────────┘
"""
당신은 10년차 시니어 자바 개발자입니다.
모든 답변은 실무 경험 기반으로 작성하세요.
코드 예시는 반드시 포함하세요.
해요체를 사용하세요.
"""

┌─────────────────────────────────────────────────┐
│ User Message                                    │
└─────────────────────────────────────────────────┘
"Spring Security 구현 방법 알려줘"

┌─────────────────────────────────────────────────┐
│ AI Response (System Prompt를 따름!)            │
└─────────────────────────────────────────────────┘
"실무에서 Spring Security를 구현할 때는...
제가 실제 프로젝트에서 사용했던 방법을 보여드릴게요.

```java
@Configuration
public class SecurityConfig {
    // 실무 코드 예시
}
```
"
```

------

#### 개발자 비유: application.yml 설정 파일

```java
// System Prompt = Spring Boot의 application.yml
```

**application.yml (Spring Boot)**
```yaml
# 한 번 설정하면 모든 컴포넌트가 이 설정을 따름
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db
    username: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

# 모든 컨트롤러, 서비스가 이 설정 기반으로 동작
```

**System Prompt (AI)**
```yaml
# 한 번 설정하면 모든 대화가 이 규칙을 따름
persona: "10년차 시니어 자바 개발자"
tone: "해요체"
code_style: "Clean Code 원칙"
always_include: "실제 코드 예시"

# 모든 응답이 이 설정 기반으로 생성됨
```

------

#### 또 다른 비유: Dockerfile

```dockerfile
# Dockerfile = 컨테이너 환경 정의
FROM openjdk:17
ENV JAVA_OPTS="-Xmx512m"
WORKDIR /app
CMD ["java", "-jar", "app.jar"]

# 컨테이너가 실행될 때 이 환경이 기본으로 적용됨
```

```java
// System Prompt = AI 환경 정의
"""
당신은 자바 전문가입니다.
메모리: 실무 경험 10년치
작업 디렉토리: 백엔드 개발
실행 명령: 항상 코드 예시 포함

// AI가 응답할 때 이 환경이 기본으로 적용됨
"""
```

------

#### System Prompt의 특징

```java
public class SystemPrompt {
    
    // 1. 영구적 (Persistent)
    private static final String SYSTEM_PROMPT = """
        당신은 시니어 개발자입니다.
        """;
    
    // 한 번 설정하면 대화가 끝날 때까지 유지
    
    // 2. 암묵적 (Implicit)
    public String chat(String userMessage) {
        // 사용자에게는 안 보이지만 항상 적용됨
        String fullPrompt = SYSTEM_PROMPT + "\n\n" + userMessage;
        return ai.generate(fullPrompt);
    }
    
    // 3. 최상위 (Priority)
    public String handleConflict() {
        // User: "반말로 답변해줘"
        // System: "항상 해요체 사용"
        // → System Prompt가 우선!
        return "해요체로 답변해요"; // System Prompt가 이김
    }
}
```

------

### 2. System Prompt 실전 예시 💼

#### 예시 1: 코드 리뷰 전문 AI

```java
// Without System Prompt
User: "이 코드 리뷰해줘"
AI: "좋은 코드입니다." // 너무 간단

// With System Prompt
System: """
당신은 까다로운 코드 리뷰어입니다.
다음 관점에서 반드시 검토하세요:
1. 버그 가능성
2. 성능 이슈
3. 보안 취약점
4. 가독성
5. Best Practice 위반

형식:
🚨 심각한 문제:
⚠️ 개선 필요:
💡 제안 사항:
✅ 잘한 점:

반드시 개선된 코드를 제시하세요.
"""

User: "이 코드 리뷰해줘"
AI: """
🚨 심각한 문제:
1. NPE 위험: findById().get() 사용
2. SQL Injection 가능성

⚠️ 개선 필요:
1. 필드 주입 → 생성자 주입
2. 트랜잭션 누락

💡 제안 사항:
...

✅ 개선된 코드:
```java
@Service
@RequiredArgsConstructor
public class UserService {
    // ...
}
```
"""
```

------

#### 예시 2: 번역 전문 AI

```java
System: """
당신은 한영 번역 전문가입니다.

규칙:
1. 자연스러운 번역 (직역 금지)
2. 기술 용어는 영어 그대로
3. 존댓말 → Formal English
4. 반말 → Casual English

출력 형식:
[원문]
...

[번역]
...

[주요 표현]
- 용어1: 설명
- 용어2: 설명
"""

User: "이 문장 번역해줘: 스프링부트로 REST API를 구현했어요"

AI: """
[원문]
스프링부트로 REST API를 구현했어요

[번역]
I implemented a REST API using Spring Boot.

[주요 표현]
- "구현했어요" → "implemented" (완료형)
- Spring Boot는 고유명사로 그대로 유지
- REST API는 기술 용어로 그대로 유지
"""
```

------

#### 예시 3: 테스트 코드 작성 AI

```java
System: """
당신은 TDD 전문가입니다.

테스트 작성 원칙:
1. Given-When-Then 패턴 사용
2. 테스트 메서드명: 한글_설명식
3. @DisplayName으로 상세 설명
4. 경계값, 예외 케이스 포함
5. Mockito로 의존성 격리

반드시 다음을 포함하세요:
- 정상 케이스 테스트
- 예외 케이스 테스트
- 경계값 테스트
"""

User: "UserService.createUser 테스트 코드 짜줘"

AI: """
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    @DisplayName("정상적인 유저 정보로 회원가입 시 성공")
    void 유저_생성_성공() {
        // Given
        CreateUserRequest request = new CreateUserRequest(
            "test@example.com", 
            "password123"
        );
        User savedUser = new User(1L, "test@example.com");
        
        when(userRepository.existsByEmail(anyString()))
            .thenReturn(false);
        when(userRepository.save(any(User.class)))
            .thenReturn(savedUser);
        
        // When
        UserDto result = userService.createUser(request);
        
        // Then
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    @DisplayName("이미 존재하는 이메일로 회원가입 시 예외 발생")
    void 중복_이메일_예외() {
        // Given
        CreateUserRequest request = new CreateUserRequest(
            "duplicate@example.com", 
            "password123"
        );
        
        when(userRepository.existsByEmail(anyString()))
            .thenReturn(true);
        
        // When & Then
        assertThatThrownBy(() -> userService.createUser(request))
            .isInstanceOf(DuplicateEmailException.class)
            .hasMessage("이미 존재하는 이메일입니다");
    }
    
    // 경계값 테스트 등 추가...
}
```
"""
```

------

### 3. .cursorrules - Cursor AI의 System Prompt 📋

#### .cursorrules란?

**프로젝트 루트에 두는 System Prompt 설정 파일**

```bash
my-project/
├── .cursorrules          # ← System Prompt!
├── src/
├── pom.xml
└── README.md
```

```java
// .cursorrules = Cursor AI의 application.yml
```

Cursor AI가 프로젝트를 열면:
1. `.cursorrules` 파일을 자동으로 읽음
2. 파일 내용을 System Prompt로 설정
3. 모든 대화에 자동 적용

------

#### 우리 프로젝트의 .cursorrules 분석

```markdown
# hyoreal.github.io 블로그 글쓰기 규칙

당신은 이 Jekyll 블로그 프로젝트의 **수석 편집자**이자 **시스템 관리자**입니다.
```

**→ Persona 설정!**

```markdown
## 2. Front Matter (YAML 헤더)

date: YYYY-MM-DD HH:MM:SS +0900  # 필수!
```

**→ 매번 "date 필드 넣어줘"라고 안 해도 알아서 포함!**

```markdown
## 7. Git Automation & Workflow (Mandatory)

1. `git add [Exact File Path]`
2. `git commit -m "docs: [Extracted Title] 포스팅 작성"`
3. `git push origin main`
```

**→ 매번 "커밋해줘"라고 안 해도 자동으로 실행!**

------

#### .cursorrules 작동 원리

```java
// Cursor AI의 내부 동작 (의사 코드)
public class CursorAI {
    
    private String systemPrompt = "";
    
    public void openProject(String projectPath) {
        // 1. .cursorrules 파일 찾기
        File cursorrules = new File(projectPath + "/.cursorrules");
        
        if (cursorrules.exists()) {
            // 2. 내용을 System Prompt로 설정
            this.systemPrompt = readFile(cursorrules);
        }
    }
    
    public String chat(String userMessage) {
        // 3. 모든 대화에 System Prompt 자동 포함
        String fullPrompt = this.systemPrompt + "\n\n" + userMessage;
        return llm.generate(fullPrompt);
    }
}
```

**실제 대화 흐름:**

```
┌─────────────────────────────────────────────────┐
│ .cursorrules (자동으로 읽힘, 사용자에게 안 보임) │
└─────────────────────────────────────────────────┘
"""
당신은 수석 편집자입니다.
Front Matter에 date 필드 필수 포함.
파일 저장 후 자동으로 git commit & push.
해요체 사용.
...
"""

┌─────────────────────────────────────────────────┐
│ User: "Spring Security 포스팅 작성해줘"         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AI: (자동으로 규칙을 따름)                      │
└─────────────────────────────────────────────────┘
1. 파일 생성: 2025-12-13-[Spring]-Security.md
2. Front Matter에 date 자동 포함 ✅
3. 해요체로 작성 ✅
4. 파일 저장 후:
   - git add ✅
   - git commit ✅
   - git push ✅
```

------

#### .cursorrules 실전 템플릿

```markdown
# [프로젝트명] 개발 규칙

## Persona
당신은 이 프로젝트의 시니어 개발자입니다.

## 코딩 스타일
- Java: Google Style Guide 준수
- 메서드는 최대 20줄
- 주석은 JavaDoc 형식
- 변수명: camelCase

## 자동화 규칙
파일 수정 후 자동으로:
1. 코드 포맷팅 (google-java-format)
2. 테스트 실행
3. git add
4. git commit -m "[type]: [description]"

## 금지 사항
- 반말 사용 금지
- System.out.println 사용 금지 (Logger 사용)
- @Autowired 필드 주입 금지 (생성자 주입만)

## 응답 형식
코드 작성 시:
1. 변경 이유 설명
2. 코드 (주석 포함)
3. 테스트 코드
4. 사용 예시
```

------

### 4. Metaprompting - AI에게 규칙 짜게 시키기 🤖

#### Metaprompting이란?

**"AI에게 System Prompt를 작성하게 시키는 것"**

```java
// 우리가 .cursorrules 만들 때 했던 방식!
User: ".cursorrules 파일에 규칙 추가해줘"

AI: (규칙을 분석하고 자동으로 추가)
"""
### [AI 기초], [AI 실전], [AI 도구] 분류
- [AI 기초]: 이론 학습
- [AI 실전]: 프롬프트 엔지니어링
...
"""
```

**이게 바로 Metaprompting!**

------

#### Metaprompting 전략

**전략 1: 샘플 제공하기**

```
User: """
우리 팀의 코드 스타일을 학습하고 .cursorrules 만들어줘.

[Sample 1]
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    public User findUser(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}

[Sample 2]
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        User user = userService.findUser(id);
        return ResponseEntity.ok(UserDto.from(user));
    }
}

이 패턴을 분석해서 .cursorrules 작성해줘.
"""

AI: """
```markdown
# 코딩 스타일 규칙

## 어노테이션 순서
1. 클래스 레벨: @Service/@RestController → @RequiredArgsConstructor
2. 메서드 레벨: @GetMapping 등

## 의존성 주입
- 항상 생성자 주입 (@RequiredArgsConstructor 활용)
- 필드는 private final

## 예외 처리
- Optional.orElseThrow() 패턴 사용
- 커스텀 예외에 명확한 메시지 포함

## 응답 형식
- ResponseEntity로 감싸기
- DTO 변환: Entity → DTO (from 메서드)
```
"""
```

------

**전략 2: 반복 학습시키기**

```java
// 1단계: 첫 번째 규칙 생성
User: "Spring 프로젝트용 .cursorrules 만들어줘"
AI: (기본 규칙 생성)

// 2단계: 피드백
User: "좋은데, 예외 처리 규칙도 추가해줘"
AI: (규칙 업데이트)

// 3단계: 더 구체화
User: "테스트 코드 작성 규칙도 포함시켜줘"
AI: (최종 규칙 완성)

// 결과: 점진적으로 완벽한 System Prompt 완성!
```

------

#### Metaprompting 실전 예시

```java
@Service
public class MetaPromptingService {
    
    /**
     * 프로젝트 분석 후 .cursorrules 자동 생성
     */
    public String generateCursorRules(Project project) {
        // 1. 프로젝트 구조 분석
        String structure = analyzeProjectStructure(project);
        
        // 2. 기존 코드 스타일 학습
        List<String> codeSamples = extractCodeSamples(project, limit = 10);
        
        // 3. AI에게 규칙 생성 요청
        String prompt = String.format("""
            다음 프로젝트를 분석하고 .cursorrules를 작성해주세요:
            
            [프로젝트 구조]
            %s
            
            [코드 샘플]
            %s
            
            다음을 포함하세요:
            1. 코딩 스타일 (어노테이션, 네이밍)
            2. 아키텍처 패턴 (레이어 구조)
            3. 테스트 규칙
            4. 자동화 워크플로우
            5. 금지 사항
            
            실제 코드 패턴을 참고하여 구체적으로 작성하세요.
            """, structure, String.join("\n\n", codeSamples));
        
        return ai.generate(prompt);
    }
}
```

------

### 5. System Prompt Best Practices 🌟

#### 좋은 System Prompt 작성법

```java
// ✅ Good System Prompt
"""
## Persona
당신은 10년차 Spring Boot 백엔드 개발자입니다.

## 전문 분야
- Spring Boot, JPA, Redis, Kafka
- 대용량 트래픽 처리 경험
- MSA 아키텍처 설계

## 응답 규칙
1. 항상 실무 경험 기반으로 답변
2. 코드 예시 필수 포함
3. Trade-off 설명 (장단점)
4. 해요체 사용

## 출력 형식
[개념 설명]
...

[실무 예시]
```java
...
```

[주의사항]
...

## 금지 사항
- 추상적인 설명만 하지 않기
- "보통 이렇게 해요" 같은 모호한 표현 금지
- 코드 없이 설명만 하지 않기
"""

// ❌ Bad System Prompt
"""
자바 개발자처럼 답변해줘.
코드 예시 넣어줘.
"""
→ 너무 모호함!
```

------

#### System Prompt 구조화

```java
public class SystemPromptTemplate {
    
    /**
     * 체계적인 System Prompt 구조
     */
    public String build() {
        return String.format("""
            # [프로젝트명] AI Assistant
            
            ## 1. Identity (정체성)
            - Role: %s
            - Expertise: %s
            - Experience: %s
            
            ## 2. Behavior (행동 규칙)
            - Tone: %s
            - Style: %s
            - Format: %s
            
            ## 3. Constraints (제약 조건)
            - Must Do: %s
            - Must Not Do: %s
            
            ## 4. Automation (자동화)
            - On File Create: %s
            - On File Update: %s
            - On Error: %s
            
            ## 5. Output Template (출력 템플릿)
            %s
            """,
            role, expertise, experience,
            tone, style, format,
            mustDo, mustNotDo,
            onCreate, onUpdate, onError,
            outputTemplate
        );
    }
}
```

------

#### 실전 .cursorrules 템플릿

```markdown
# Spring Boot 프로젝트 개발 규칙

## 🎭 Persona
당신은 이 프로젝트의 시니어 백엔드 개발자입니다.
- 경력: 10년
- 전문: Spring Boot, JPA, MSA
- 스타일: Clean Code, TDD

## 📝 코딩 컨벤션

### 레이어 구조
```
Controller → Service → Repository
   ↓           ↓           ↓
  DTO        Entity       Entity
```

### 어노테이션 순서
1. @RestController / @Service
2. @RequestMapping
3. @RequiredArgsConstructor
4. @Slf4j

### 네이밍
- Controller 메서드: 동사 + 명사 (getUser, createOrder)
- Service 메서드: 동사 + 명사 (findUser, saveOrder)
- Repository 메서드: find/save/delete + By + 조건

## 🧪 테스트 규칙

### 테스트 구조
```java
@DisplayName("기능_설명")
void 테스트명() {
    // Given: 테스트 데이터 준비
    
    // When: 실행
    
    // Then: 검증
}
```

### 필수 테스트
- 정상 케이스
- 예외 케이스
- 경계값 케이스

## 🤖 자동화 규칙

### 파일 생성 시
1. 패키지 구조 확인
2. 필요한 import 자동 추가
3. 기본 어노테이션 추가
4. 테스트 파일 함께 생성

### 파일 수정 시
1. 변경 사항 설명
2. 영향 받는 코드 확인
3. 테스트 업데이트 제안

### 커밋 시
1. git add (변경 파일만)
2. git commit -m "[type]: [description]"
   - feat: 새 기능
   - fix: 버그 수정
   - refactor: 리팩토링
   - test: 테스트 추가
3. git push origin [branch]

## 🚫 금지 사항

### 절대 사용 금지
- @Autowired 필드 주입
- System.out.println (Logger 사용)
- 매직 넘버 (상수로 정의)
- 하드코딩된 URL/경로

### 지양해야 할 것
- 100줄 이상의 메서드
- 중첩 if 3단계 이상
- 주석 없는 복잡한 로직

## 📤 응답 형식

### 코드 작성 시
```
[변경 이유]
왜 이렇게 구현했는지 설명

[코드]
```java
// 주석 포함한 코드
```

[테스트]
```java
// 테스트 코드
```

[사용 예시]
// API 호출 예시 또는 사용 방법
```

### 리뷰 시
```
🚨 심각한 문제:
- 문제점 1
- 문제점 2

⚠️ 개선 필요:
- 개선점 1
- 개선점 2

💡 제안:
- 제안 1
- 제안 2

✅ 개선된 코드:
```java
...
```
```

---

**모든 답변은 이 규칙을 기반으로 작성하세요.**
```

------

### 6. AI 시리즈 마무리 🎬

#### 우리가 함께한 여정

```java
/**
 * AI 개발자 학습 로드맵 완주!
 */
public class AIJourney {
    
    // 📚 Chapter 1: 기초 이론
    void learnBasics() {
        understand("LLM과 Transformer 구조");
        understand("Token, Hallucination, 확률 통계");
        understand("Context Window와 RAG");
        understand("Stateless 특성");
    }
    
    // 🎯 Chapter 2: 프롬프트 기본
    void learnPrompting() {
        master("Temperature 조절");
        master("Persona 부여");
        master("CO-STAR 프레임워크");
        master("함수 설계 관점");
    }
    
    // 🚀 Chapter 3: 고급 테크닉
    void learnAdvanced() {
        master("Few-Shot Learning");
        master("Chain of Thought");
        master("콤보 활용");
    }
    
    // ⚡ Chapter 4: 자동화 (오늘!)
    void learnAutomation() {
        master("System Prompt");
        master(".cursorrules");
        master("Metaprompting");
        
        // 🎉 완주!
        celebrate("나만의 AI 사수 완성!");
    }
}
```

------

#### 학습 효과

**Before (시리즈 시작 전):**
```
User: "코드 짜줘"
AI: "어떤 코드요?"
User: "Spring Security"
AI: "어떤 기능이요?"
User: "JWT 인증"
AI: "어떤 방식으로요?"
User: "... (짜증)"
```

**After (시리즈 완주 후):**
```
.cursorrules 설정 완료 ✅

User: "JWT 인증 구현"
AI: (자동으로)
- 시니어 개발자 관점 ✅
- 실무 코드 예시 ✅
- 테스트 코드 포함 ✅
- 주석 상세 설명 ✅
- git commit & push ✅
- 해요체 사용 ✅
```

------

#### 핵심 정리

| 단계 | 배운 내용 | 효과 |
|------|----------|------|
| **기초** | Token, Context Window, RAG | AI의 작동 원리 이해 |
| **기본** | Temperature, Persona, CO-STAR | 정확한 프롬프트 작성 |
| **고급** | Few-Shot, Chain of Thought | 복잡한 문제 해결 |
| **자동화** | System Prompt, .cursorrules | 반복 작업 제거 |

------

### 7. 실전 적용 가이드 📖

#### Step 1: 프로젝트별 .cursorrules 만들기

```bash
# 프로젝트 루트에 생성
cd my-project
touch .cursorrules
```

#### Step 2: AI에게 규칙 작성 요청 (Metaprompting)

```
User: """
우리 프로젝트 구조야:
```
src/
├── main/
│   ├── java/com/myapp/
│   │   ├── controller/
│   │   ├── service/
│   │   └── repository/
│   └── resources/
└── test/
```

이 구조에 맞는 .cursorrules 작성해줘.
- Spring Boot 3.2
- JPA 사용
- RESTful API
- TDD 방식
"""

AI: (완벽한 .cursorrules 생성!)
```

#### Step 3: 테스트 및 개선

```
User: "UserController 만들어줘"
AI: (규칙 따라 생성)

User: "오 좋은데, 예외 처리도 자동으로 추가해줘"
→ .cursorrules 업데이트
```

#### Step 4: 팀과 공유

```bash
# .cursorrules를 git에 포함
git add .cursorrules
git commit -m "docs: 프로젝트 개발 규칙 추가"
git push

# 팀원들이 pull 받으면 자동으로 적용!
```

------

### 마치며: 이제 여러분은 AI 마스터입니다 🎓

```java
public class AIJourneyComplete {
    
    public static void main(String[] args) {
        Developer you = new Developer();
        
        // Before
        System.out.println(you.getProductivity()); // 1x
        
        // AI 시리즈 완주 후
        you.learn(LLMBasics.class);           // 원리 이해
        you.learn(PromptEngineering.class);   // 기본기
        you.learn(AdvancedTechniques.class);  // 고급 기법
        you.learn(SystemPrompt.class);        // 자동화
        
        // After
        System.out.println(you.getProductivity()); // 10x 🚀
        
        System.out.println("축하합니다! AI 개발자가 되셨습니다! 🎉");
    }
}
```

#### 이제 여러분은:

✅ LLM의 작동 원리를 이해하고
✅ 효과적인 프롬프트를 작성할 수 있으며  
✅ Few-Shot과 CoT로 복잡한 문제를 해결하고
✅ System Prompt로 AI를 자동화할 수 있습니다!

**다음 프로젝트에서 바로 적용해보세요:**

1. 프로젝트에 `.cursorrules` 생성
2. AI에게 프로젝트 분석 후 규칙 작성 요청
3. 코드 작성, 리뷰, 테스트 모두 자동화
4. 생산성 10배 향상! 🚀

AI는 이제 도구가 아닌 **당신의 든든한 사수**입니다.

감사합니다. 그리고 즐거운 개발 되세요! 💻✨

------

> 참고 자료
> - OpenAI System Message: https://platform.openai.com/docs/guides/text-generation
> - Cursor Rules Documentation: https://docs.cursor.com/context/rules-for-ai
> - Metaprompting: https://arxiv.org/abs/2401.12954
> - Prompt Engineering Guide: https://www.promptingguide.ai/

