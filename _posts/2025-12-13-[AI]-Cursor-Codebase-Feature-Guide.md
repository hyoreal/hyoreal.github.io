---
layout: post

toc: true

title: "[AI 도구] Cursor IDE - 설치 및 Codebase 인덱싱 설정"

date: 2025-12-13 10:10:00 +0900

comments: true

categories: [AI 도구]

tags: [AI, Cursor, Codebase, RAG, Vector Search, Spring, ComponentScan]


---

## 1. 프롬프트 엔지니어링의 핵심: Context

### Garbage In, Garbage Out 원칙

- LLM은 입력된 맥락(Context)에 기반하여 답변 생성
- 부정확하거나 불충분한 맥락 → 부정확한 답변
- 충분하고 정확한 맥락 → 정확하고 실행 가능한 답변

### 맥락 제공의 중요성

**예시: 코드 리뷰 요청**

```
❌ 맥락 없음
"UserService 코드 리뷰해줘"
→ 일반론적 조언만 가능 (트랜잭션 추가, 예외 처리 개선 등)

✅ 맥락 제공
"@Codebase UserService 코드 리뷰해줘"
→ 프로젝트 전체 구조 파악
→ 다른 서비스(OrderService)와 패턴 비교
→ SecurityConfig 설정 참고
→ 구체적 라인 번호와 개선 코드 제시
```

### 개발자 관점의 비유

- **HTTP 요청**: Request Body에 필요한 데이터 포함
- **DB 쿼리**: WHERE 절에 충분한 조건 명시
- **함수 호출**: 파라미터로 필요한 정보 전달
- **프롬프트**: Context로 프로젝트 정보 제공

------

## 2. 도구 선정: Cursor IDE

### 선정 이유: 로컬 파일 기반 RAG 내장

**타 IDE 대비 차별점**

| 구분 | 일반 IDE + ChatGPT | Cursor IDE |
|------|-------------------|------------|
| **컨텍스트 제공** | 수동 복사/붙여넣기 | 자동 인덱싱 |
| **프로젝트 이해** | 단일 파일만 인식 | 전체 구조 파악 |
| **답변 품질** | 일반론적 | 프로젝트 맞춤형 |
| **실행 가능성** | 추상적 조언 | 구체적 코드 제시 |

### 핵심 기능: @Codebase

**정의**
- 프로젝트 전체 코드베이스를 벡터 인덱싱하여 LLM 컨텍스트에 자동 주입

**작동 원리**
1. 프로젝트 인덱싱: 모든 파일을 의미 단위 청크로 분할
2. 벡터 변환: 코드를 벡터로 임베딩하여 Vector DB 저장
3. 유사도 검색: 질문과 관련된 코드 조각 검색 (Vector Search)
4. 컨텍스트 구성: 검색된 코드를 LLM 프롬프트에 포함
5. 답변 생성: 프로젝트 맥락을 이해한 상태에서 답변

**Spring 개발자 비유: @ComponentScan**

```java
// @ComponentScan: Bean 자동 스캔 및 등록
@ComponentScan(basePackages = "com.example")
// → 패키지 내 모든 @Component 자동 발견
// → ApplicationContext에 Bean 등록
// → @Autowired로 의존성 주입 가능

// @Codebase: 코드 자동 스캔 및 컨텍스트 주입
@Codebase
"UserService 개선해줘"
// → 프로젝트 내 모든 관련 파일 자동 발견
// → Vector DB에 코드 임베딩 저장
// → 프롬프트에 컨텍스트 자동 주입
```

### Before & After 비교

**Before: 외부 컨설턴트 (ChatGPT)**
- 프로젝트 구조 모름
- 일반론적 조언
- 추상적 답변
- 실행 불가능한 예시 코드

**After: 팀 동료 (Cursor + @Codebase)**
- 프로젝트 전체 구조 파악
- 프로젝트 맞춤형 조언
- 구체적 답변 (라인 번호 포함)
- 바로 사용 가능한 코드

------

## 3. 프롬프트 기초 원칙

### 3.1 구체성 (Specificity)

**원칙**
- 모호한 질문 → 모호한 답변
- 구체적인 질문 → 구체적인 답변

**Bad vs Good**

```
❌ "코드 개선해줘"
✅ "@Codebase UserService.java의 createUser 메서드를 OrderService 패턴으로 개선해줘"

❌ "에러 해결해줘"
✅ "@Codebase UserController.java 45번째 줄 LazyInitializationException 해결해줘"
```

### 3.2 제약 조건 (Constraints)

**원칙**
- 프로젝트의 제약 조건을 명시하여 일관성 유지

**예시**

```
"@Codebase 새로운 ProductController를 작성해줘.
기존 UserController, OrderController와 동일한 패턴으로:
- Swagger 어노테이션 사용
- ResponseEntity<ApiResponse<T>> 반환
- CustomException으로 에러 처리
- DTO 패턴 (from() 정적 팩토리 메서드)"
```

### 3.3 파일 지정 (@Files)

**원칙**
- @Codebase로 전체 스캔 + @Files로 특정 파일 집중

**예시**

```
"@Codebase @Files UserService.java, OrderService.java
두 서비스의 예외 처리 패턴을 비교하고 통일해줘"
```

### 3.4 단계적 접근

**원칙**
- 큰 작업을 작은 단계로 분할

**예시**

```
1단계: "@Codebase 프로젝트 구조 설명해줘"
2단계: "@Codebase Controller 레이어 패턴 분석해줘"
3단계: "@Codebase UserController를 분석한 패턴으로 개선해줘"
```

### 3.5 패턴 학습 요청

**원칙**
- 기존 코드 패턴을 학습하여 일관성 유지

**예시**

```
"@Codebase 이 프로젝트의 Controller 패턴을 분석하고,
새로운 ProductController를 같은 패턴으로 작성해줘"
```

------

## 4. 실전 활용 가이드

### 4.1 코드 리뷰

```
"@Codebase UserService.java를 OrderService.java와 비교하여
개선점을 제시해줘"
```

### 4.2 버그 찾기

```
"@Codebase UserService에서 발생할 수 있는
잠재적 버그를 찾고, OrderService와 비교해서 개선점을 제시해줘"
```

### 4.3 테스트 코드 작성

```
"@Codebase UserServiceTest를 OrderServiceTest와 동일한 패턴으로 작성해줘"
```

### 4.4 새 기능 추가

```
"@Codebase UserController, OrderController 패턴을 참고하여
ProductController를 작성해줘"
```

------

## 5. 한계 및 보완

### 한계

1. **Context Window 제한**
   - 매우 큰 프로젝트(1000+ 파일)는 전체 분석 어려움
   - 보완: 파일 단위로 좁혀서 질문

2. **실시간 동기화 지연**
   - 코드 변경 후 즉시 반영 안될 수 있음 (수 초 ~ 수십 초)
   - 보완: 중요한 변경 후 잠시 대기

3. **숨겨진 파일 제외**
   - .gitignore에 포함된 파일은 스캔 안됨
   - 보완: 필요시 명시적으로 파일 열기

4. **외부 의존성 한계**
   - 외부 라이브러리 내부 구현은 모름
   - 보완: 공식 문서와 병행

### 보완 방법

- 좁은 범위로 질문: 전체 프로젝트 → 특정 파일/메서드
- 구체적 파일 지정: 모호한 질문 → 파일명 + 라인 번호
- 단계적 접근: 큰 작업 → 작은 단계로 분할

------

## 6. 핵심 정리

### 프롬프트 엔지니어링 = Context 제공

- LLM은 입력된 맥락에 기반하여 답변 생성
- 충분한 맥락 제공이 정확한 답변의 핵심

### Cursor IDE = 자동 Context 주입

- @Codebase: 프로젝트 전체 코드를 벡터 인덱싱하여 자동 주입
- RAG 기반: 관련 코드를 검색하여 컨텍스트 구성
- 타 IDE 대비: 단순 텍스트 생성이 아닌 프로젝트 구조 이해

### 프롬프트 원칙

- 구체성: 모호한 질문 지양, 구체적 질문 사용
- 제약 조건: 프로젝트 제약 명시하여 일관성 유지
- 파일 지정: @Files로 특정 파일 집중
- 단계적 접근: 큰 작업을 작은 단계로 분할

------

> 참고 자료
> - Cursor AI Documentation: https://docs.cursor.sh/
> - RAG (Retrieval-Augmented Generation): https://arxiv.org/abs/2005.11401
> - Vector Database Explained: https://www.pinecone.io/learn/vector-database/

