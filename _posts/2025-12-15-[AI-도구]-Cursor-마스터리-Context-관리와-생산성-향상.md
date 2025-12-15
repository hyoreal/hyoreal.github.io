---
layout: post

toc: true

title: "[AI 도구] Cursor 마스터리 - Context 관리와 생산성 향상"

date: 2025-12-15 19:00:00 +0900

comments: true

categories: [AI 도구]

tags: [AI, Cursor, Context Management, @Symbols, Refactoring, Productivity]


---

### 1. Context 관리의 중요성

#### 문제 상황

- 맥락 없이 질문 시 부정확한 답변 발생
- 프로젝트 구조를 이해하지 못한 코드 생성
- 반복적인 설명과 수정 작업 필요

#### 해결책: @Symbols 활용

**Cursor의 핵심 기능인 @를 통한 Context 주입**

------

### 2. Cursor 기본 명령어

#### Cmd + K vs Cmd + L

| 명령어 | 용도 | 특징 |
|--------|------|------|
| **Cmd + K** | 단순 수정/생성 | 현재 파일 또는 선택 영역 기반 빠른 편집 |
| **Cmd + L** | 대화형 채팅 | 복잡한 질문, 프로젝트 전체 분석, 아키텍처 설계 |

#### 사용 시나리오

```markdown
# Cmd + K 사용 예시
- 변수명 변경
- 메서드 추가
- 간단한 리팩토링

# Cmd + L 사용 예시
- 레거시 코드 분석
- 아키텍처 설계 질문
- 복잡한 비즈니스 로직 리팩토링
```

------

### 3. @Symbols 상세 가이드

#### @Codebase

**전체 프로젝트 인덱싱 기반 검색**

- 장점: 프로젝트 전체 구조 파악
- 단점: 토큰 사용량 증가
- 사용 시기: 프로젝트 구조 파악, 전역 리팩토링

```markdown
# 프롬프트 예시
@Codebase
이 프로젝트의 전체 아키텍처를 분석해줘.
Controller, Service, Repository 계층 구조를 정리해줘.
```

#### @Files

**특정 파일만 참조**

- 장점: 정확한 Context, 토큰 절약
- 단점: 여러 파일 태그 필요
- 사용 시기: 특정 기능 리팩토링, 연관 파일 분석

```markdown
# 프롬프트 예시
@Files UserController.java
@Files UserService.java
@Files UserRepository.java

이 세 파일의 연관 관계를 분석하고, 
UserService에 비즈니스 로직을 집중시키는 리팩토링 방안을 제시해줘.
```

#### @Folder

**특정 디렉토리 전체 참조**

- 사용 시기: 특정 모듈 전체 분석

```markdown
# 프롬프트 예시
@Folder src/main/java/com/example/user

user 패키지의 모든 클래스를 분석하고,
공통 개선 사항을 제안해줘.
```

------

### 4. 실전 활용: 레거시 JSP → Spring Boot 변환

#### Step 1: 레거시 코드 분석

```markdown
# Cmd + L 프롬프트
@Files order.jsp
@Files OrderController.java

지금 태그된 JSP 파일의 비즈니스 로직을 분석해줘.
이 로직을 Spring Service 계층으로 분리하려고 해.

1. 현재 로직의 흐름을 요약해줘
2. 리팩토링할 Service 메서드 시그니처와 구현 코드를 제안해줘
3. 변환 시 주의할 점(Session 처리 등)을 알려줘
```

#### Step 2: Service 계층 설계

```java
// AI가 제안하는 Service 인터페이스
public interface OrderService {
    /**
     * 주문 생성
     * @param request 주문 요청 정보
     * @param session 세션 정보 (레거시 호환)
     * @return 주문 ID
     */
    Long createOrder(OrderCreateRequest request, HttpSession session);
}
```

#### Step 3: 구현 코드 생성

```java
@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    @Override
    public Long createOrder(OrderCreateRequest request, HttpSession session) {
        // 세션에서 사용자 정보 추출 (레거시 호환)
        Long userId = (Long) session.getAttribute("userId");
        
        // 비즈니스 로직 구현
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        
        Order order = Order.builder()
            .user(user)
            .items(request.getItems())
            .totalAmount(request.getTotalAmount())
            .build();
        
        return orderRepository.save(order).getId();
    }
}
```

------

### 5. 단위 테스트 자동 생성

#### 프롬프트 예시

```markdown
@Files OrderService.java
@Files OrderRepository.java

OrderService의 createOrder 메서드에 대한 
단위 테스트를 작성해줘.

- Mockito 사용
- 정상 케이스와 예외 케이스 모두 포함
- @SpringBootTest 사용하지 말고 @ExtendWith(MockitoExtension.class) 사용
```

#### 생성된 테스트 코드

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private HttpSession session;
    
    @InjectMocks
    private OrderServiceImpl orderService;
    
    @Test
    void 주문_생성_성공() {
        // given
        Long userId = 1L;
        OrderCreateRequest request = new OrderCreateRequest(/* ... */);
        
        when(session.getAttribute("userId")).thenReturn(userId);
        when(userRepository.findById(userId))
            .thenReturn(Optional.of(new User(userId, "test")));
        when(orderRepository.save(any(Order.class)))
            .thenReturn(new Order(1L, /* ... */));
        
        // when
        Long orderId = orderService.createOrder(request, session);
        
        // then
        assertThat(orderId).isNotNull();
        verify(orderRepository).save(any(Order.class));
    }
    
    @Test
    void 사용자_없음_예외() {
        // given
        Long userId = 999L;
        when(session.getAttribute("userId")).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        
        // when & then
        assertThatThrownBy(() -> 
            orderService.createOrder(new OrderCreateRequest(), session)
        ).isInstanceOf(UserNotFoundException.class);
    }
}
```

------

### 6. Context 관리 Best Practices

#### Do's

- **명확한 파일 태그**: 필요한 파일만 정확히 태그
- **단계별 질문**: 복잡한 작업은 작은 단위로 분해
- **프로젝트 구조 설명**: @Codebase 사용 전 프로젝트 개요 제공

```markdown
# 좋은 예시
@Files UserController.java
@Files UserService.java

UserController의 createUser 메서드를 분석하고,
UserService로 비즈니스 로직을 이동하는 리팩토링을 진행해줘.
```

#### Don'ts

- **과도한 @Codebase 사용**: 토큰 낭비 및 부정확한 결과
- **맥락 없는 질문**: "이 코드 고쳐줘" (어떤 파일인지 명시 안 함)
- **한 번에 너무 많은 요청**: 단계별로 나누어 질문

```markdown
# 나쁜 예시
이 프로젝트 전체를 리팩토링해줘.
(어떤 부분을, 어떻게 리팩토링할지 불명확)
```

------

### 7. 생산성 향상 팁

#### 팁 1: 프롬프트 템플릿 저장

자주 사용하는 프롬프트를 템플릿으로 저장

```markdown
# 리팩토링 템플릿
@Files [파일명]
이 파일의 [메서드명]을 분석하고:
1. 현재 로직 요약
2. 개선 방안 제시
3. 리팩토링된 코드 생성
```

#### 팁 2: 단계별 확인

복잡한 작업은 단계별로 확인하며 진행

```markdown
# Step 1: 분석
@Files [파일명]
이 코드의 문제점을 분석해줘.

# Step 2: 설계
위 분석을 바탕으로 개선된 구조를 제안해줘.

# Step 3: 구현
제안된 구조로 리팩토링 코드를 생성해줘.
```

#### 팁 3: 에러 메시지 활용

에러 메시지를 그대로 복사하여 질문

```markdown
@Files [에러 발생 파일]
다음 에러가 발생했어:
[에러 메시지 전체 복사]

원인과 해결 방법을 알려줘.
```

------

### 8. 정리

#### 핵심 포인트

- **@Symbols로 정확한 Context 제공**
- **Cmd + K (빠른 편집) vs Cmd + L (복잡한 질문) 구분**
- **단계별 질문으로 정확도 향상**
- **프로젝트 구조 이해를 위한 @Codebase 활용**

#### 다음 단계

프롬프트 구조론과 논리 설계(Chain of Thought)로 AI의 추론 능력 향상

