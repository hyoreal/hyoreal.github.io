---
layout: post

toc: true

title: "[AI 실전] System Prompting과 자동화 - .cursorrules 설정"

date: 2025-12-13 11:20:00 +0900

comments: true

categories: [AI, Prompt Engineering]

tags: [AI, System Prompt, Automation]


---

### 1. System Prompt의 필요성

#### 문제 상황

- 매번 프롬프트에 반복 지시 필요
  - "자바 전문가처럼 말해줘"
  - "코드 짜면 커밋해줘"
  - "해요체 사용해줘"
- 토큰 낭비 및 시간 소모
- 일관성 유지 어려움

#### 해결책: System Prompt

**전역 설정(Global Configuration)으로 반복 작업 자동화**

------

### 2. System Prompt 개념

#### 정의

**AI와의 대화 세션 전체에 적용되는 전역 설정**

- 사용자 메시지 이전에 자동 주입
- 대화 세션 동안 지속 적용
- 사용자에게는 보이지 않음

#### 비유: Environment Variables (.env)

```bash
# .env 파일
DATABASE_URL=jdbc:mysql://localhost:3306/db
API_KEY=secret_key
LOG_LEVEL=INFO

# 애플리케이션 실행 시 자동으로 환경 변수 로드
```

```markdown
# System Prompt
당신은 10년차 시니어 자바 개발자입니다.
모든 답변은 실무 경험 기반으로 작성하세요.
코드 예시는 반드시 포함하세요.

# AI 대화 시 자동으로 규칙 적용
```

#### 비유: Base Docker Image

```dockerfile
# Base Image 정의
FROM openjdk:17
ENV JAVA_OPTS="-Xmx512m"
WORKDIR /app

# 모든 컨테이너가 이 환경을 상속
```

```markdown
# System Prompt 정의
당신은 자바 전문가입니다.
작업 디렉토리: 백엔드 개발
실행 명령: 항상 코드 예시 포함

# 모든 응답이 이 환경 기반으로 생성
```

#### System Prompt 특징

| 특징 | 설명 |
|------|------|
| **영구성** | 대화 세션 동안 지속 적용 |
| **암묵성** | 사용자에게 보이지 않지만 항상 적용 |
| **최상위 우선순위** | 사용자 요청과 충돌 시 System Prompt 우선 |
| **토큰 절약** | 반복 지시 불필요 |

------

### 3. Cursor의 .cursorrules

#### 정의

**프로젝트 루트에 위치하여, 해당 프로젝트 내에서 AI가 지켜야 할 규칙을 정의하는 파일**

#### 비유: .editorconfig

```ini
# .editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 4

# 프로젝트 내 모든 파일에 자동 적용
```

```markdown
# .cursorrules
당신은 이 프로젝트의 시니어 개발자입니다.
코딩 스타일: Google Style Guide 준수
테스트: TDD 원칙 필수

# 프로젝트 내 모든 AI 대화에 자동 적용
```

#### 비유: .gitignore

```gitignore
# .gitignore
*.class
*.log
node_modules/

# 프로젝트별로 다른 규칙 적용 가능
```

```markdown
# .cursorrules
# 프로젝트별로 다른 AI 규칙 적용 가능
# 블로그 프로젝트: Front Matter 필수
# 코딩 프로젝트: TDD 원칙
```

#### 작동 원리

```
프로젝트 열기
    │
    ▼
.cursorrules 파일 자동 읽기
    │
    ▼
System Prompt로 설정
    │
    ▼
모든 대화에 자동 적용
```

#### 장점

- **토큰 절약**: 매번 지시 불필요
- **시간 절약**: 반복 입력 제거
- **일관성**: 프로젝트별 표준화
- **자동화**: 규칙 기반 자동 실행

------

### 4. 실전 설정 예시 (Template)

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

### 5. Metaprompting: AI에게 규칙 생성 요청

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

### 6. Best Practices

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

### 7. 실전 적용 가이드



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



------

> 참고 자료
> - OpenAI System Message: https://platform.openai.com/docs/guides/text-generation
> - Cursor Rules Documentation: https://docs.cursor.com/context/rules-for-ai
> - Metaprompting: https://arxiv.org/abs/2401.12954
> - Prompt Engineering Guide: https://www.promptingguide.ai/



