---
layout: post

toc: true

title: "[AI 실전] AI의 지능을 해킹하자: Few-Shot 기법과 Chain of Thought (CoT)"

date: 2025-12-13 19:25:00 +0900

comments: true

categories: [AI, Deep Learning]

tags: [AI, Prompt Engineering, Few-Shot, Chain of Thought, CoT, Zero-Shot]


---

### AI를 더 똑똑하게 만드는 고급 테크닉

"ChatGPT는 똑똑한데 왜 내가 원하는 걸 못 만들어줄까?"

프롬프트 기본기를 익혔다면, 이제 **AI의 지능을 한 단계 끌어올리는 고급 테크닉**을 배울 시간이에요. 오늘 배울 2가지는:

1. **Few-Shot Learning**: AI에게 Unit Test처럼 예제를 보여주기
2. **Chain of Thought (CoT)**: AI가 의사 코드를 먼저 작성하게 만들기

마치 백엔드 개발자가 TDD와 설계 문서를 활용하듯, AI에게도 이런 기법들을 적용할 수 있어요!

------

### 1. Zero-Shot vs Few-Shot - Unit Test 케이스 보여주기 🎯

#### Zero-Shot: 예제 없이 바로 질문

```java
// Zero-Shot = 요구사항만 던지기
public interface AI {
    String execute(String instruction);
}

// 사용
String result = ai.execute("자연어를 SQL로 변환해줘");
// → AI가 알아서 해석해야 함
```

```
❌ Zero-Shot Prompt:

"다음 요구사항을 SQL로 바꿔줘:
'2023년에 가입한 유저 중 주문이 3건 이상인 사람의 이메일 목록'"

AI 응답:
SELECT email 
FROM users 
WHERE signup_year = 2023 
  AND order_count >= 3;

→ 테이블 구조를 몰라서 틀린 쿼리!
```

------

#### Few-Shot: 예제를 먼저 보여주기

```java
// Few-Shot = Unit Test처럼 예제 제공
public class AIWithExamples {
    
    private List<Example> examples = new ArrayList<>();
    
    public void addExample(String input, String expectedOutput) {
        examples.add(new Example(input, expectedOutput));
    }
    
    public String execute(String input) {
        // 예제를 참고하여 패턴을 학습
        String pattern = learnPattern(examples);
        return applyPattern(input, pattern);
    }
}

// 사용
AIWithExamples ai = new AIWithExamples();

// 예제 1
ai.addExample(
    "2022년 가입 유저 수",
    "SELECT COUNT(*) FROM users WHERE YEAR(created_at) = 2022"
);

// 예제 2
ai.addExample(
    "주문 금액이 10만원 이상인 주문",
    "SELECT * FROM orders WHERE amount >= 100000"
);

// 이제 새로운 요구사항 실행
String result = ai.execute("2023년 가입 유저 중 주문 3건 이상");
// → 예제 패턴을 따라서 정확한 쿼리 생성!
```

```
✅ Few-Shot Prompt:

"""
다음 패턴을 참고하여 자연어를 SQL로 변환해주세요:

[Example 1]
요구사항: "2022년에 가입한 유저 수"
SQL:
SELECT COUNT(*) 
FROM users 
WHERE YEAR(created_at) = 2022;

[Example 2]
요구사항: "주문 금액이 10만원 이상인 주문 목록"
SQL:
SELECT * 
FROM orders 
WHERE amount >= 100000;

[Example 3]
요구사항: "서울에 사는 유저 중 프리미엄 회원"
SQL:
SELECT * 
FROM users 
WHERE city = '서울' 
  AND membership_type = 'PREMIUM';

이제 다음 요구사항을 SQL로 변환해주세요:
"2023년에 가입한 유저 중 주문이 3건 이상인 사람의 이메일"
"""

AI 응답:
SELECT u.email
FROM users u
JOIN (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
    HAVING COUNT(*) >= 3
) o ON u.id = o.user_id
WHERE YEAR(u.created_at) = 2023;

→ 예제 패턴을 학습해서 정확한 쿼리 생성!
```

------

#### Few-Shot = Mock Data 제공

```java
// 개발자의 테스트 작성
@Test
public void testUserService() {
    // Given: Mock 데이터 제공
    User mockUser1 = new User(1L, "user1@test.com", "서울");
    User mockUser2 = new User(2L, "user2@test.com", "부산");
    
    // When: 테스트 실행
    List<User> result = userService.findByCity("서울");
    
    // Then: 예상 결과
    assertThat(result).contains(mockUser1);
}

// AI의 Few-Shot Learning
"""
[Example 1 - Input]
User: { id: 1, email: "user1@test.com", city: "서울" }

[Example 1 - Output]
DTO: { userId: 1, email: "user1@test.com", location: "서울" }

[Example 2 - Input]
User: { id: 2, email: "user2@test.com", city: "부산" }

[Example 2 - Output]
DTO: { userId: 2, email: "user2@test.com", location: "부산" }

이제 다음 User를 DTO로 변환해줘:
User: { id: 3, email: "user3@test.com", city: "대전" }
"""
```

------

#### Zero-Shot vs Few-Shot 비교

| 비교 항목 | Zero-Shot | Few-Shot |
|----------|-----------|----------|
| **예제 제공** | ❌ 없음 | ✅ 2~5개 예제 |
| **정확도** | 낮음 (추측 기반) | 높음 (패턴 학습) |
| **토큰 사용** | 적음 | 많음 (예제 포함) |
| **사용 사례** | 간단한 질문 | 정확한 형식 필요 |
| **개발 비유** | 구두 요청 | Unit Test 제공 |

```java
// 비용-정확도 Trade-off
public class PromptStrategy {
    
    public String chooseStrategy(Task task) {
        if (task.isSimple() && task.toleratesError()) {
            // Zero-Shot: 빠르고 저렴
            return zeroShot(task);
        } else if (task.requiresAccuracy()) {
            // Few-Shot: 느리지만 정확
            return fewShot(task);
        }
    }
}
```

------

#### Few-Shot 실전 예시 1: 네이밍 컨벤션

```
❌ Zero-Shot:

"좋은 변수명 제안해줘"

AI: "data, info, result, value..." (너무 일반적)
```

```
✅ Few-Shot:

"""
우리 팀의 네이밍 컨벤션:

[Example 1]
용도: 유저 목록 조회 결과
네이밍: foundUserList (동사 과거형 + 명사)

[Example 2]
용도: 주문 생성 요청 DTO
네이밍: createOrderRequest (동사원형 + 명사 + Request)

[Example 3]
용도: 상품 재고 확인 서비스
네이밍: checkProductStockService (동사원형 + 명사 + Service)

이제 다음 용도의 변수명을 제안해줘:
용도: 결제 검증 결과
"""

AI: validatedPaymentResult (패턴 일치!)
```

------

#### Few-Shot 실전 예시 2: 에러 메시지 변환

```java
// ❌ Zero-Shot
String prompt = """
    다음 에러를 사용자 친화적 메시지로 바꿔줘:
    "NullPointerException at line 42"
    """;

// AI 응답: "오류가 발생했습니다" (너무 모호)
```

```java
// ✅ Few-Shot
String prompt = """
    다음 패턴으로 에러 메시지를 변환해주세요:
    
    [Example 1]
    Technical: "SQLException: Connection timeout"
    User-Friendly: "데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요."
    
    [Example 2]
    Technical: "IllegalArgumentException: Email format invalid"
    User-Friendly: "이메일 형식이 올바르지 않습니다. 다시 확인해주세요."
    
    [Example 3]
    Technical: "AuthenticationException: Invalid credentials"
    User-Friendly: "아이디 또는 비밀번호가 일치하지 않습니다."
    
    이제 다음 에러를 변환해주세요:
    Technical: "NullPointerException at UserService.getUser()"
    """;

// AI 응답: 
// "사용자 정보를 불러오는 중 오류가 발생했습니다. 
//  관리자에게 문의해주세요."
```

------

### 2. Chain of Thought (CoT) - 의사 코드 먼저 작성하기 🧠

#### CoT란?

**AI가 최종 답변 전에 '사고 과정'을 단계별로 보여주게 만드는 기술**

```java
// Without CoT: 직관적 답변 (빠르지만 오류 가능)
public int calculate(String problem) {
    return quickAnswer(problem); // 생각 없이 바로 답변
}

// With CoT: 단계별 사고 (느리지만 정확)
public int calculateWithThinking(String problem) {
    // 1. 문제 분석
    String analysis = analyzeProblem(problem);
    
    // 2. 해결 전략 수립
    String strategy = planStrategy(analysis);
    
    // 3. 단계별 실행
    int step1 = executeStep1(strategy);
    int step2 = executeStep2(step1);
    int step3 = executeStep3(step2);
    
    // 4. 검증
    validate(step3);
    
    return step3; // 논리적으로 검증된 답변
}
```

------

#### CoT의 매직 프롬프트

```
"Let's think step by step."
"단계별로 생각해봐."
```

이 한 문장이 왜 효과적일까요?

```java
// 개발자의 문제 해결 과정
public void solveBug() {
    // 1. 주석으로 의사 코드 작성
    // Step 1: 입력 데이터 검증
    // Step 2: 비즈니스 로직 수행
    // Step 3: 결과 검증
    // Step 4: 응답 반환
    
    // 2. 실제 코드 작성
    validateInput();
    processLogic();
    validateResult();
    return response;
}
```

AI도 마찬가지로 **"생각의 과정"을 명시적으로 작성**하면 논리 오류를 줄일 수 있어요!

------

#### Without CoT vs With CoT

```
문제: "레스토랑에 48명의 손님이 있습니다. 
      각 테이블에 6명씩 앉는다면 테이블은 몇 개 필요할까요?
      하지만 12명이 나갔습니다."

┌─────────────────────────────────────────────────┐
│ ❌ Without CoT                                  │
└─────────────────────────────────────────────────┘

AI: "8개의 테이블이 필요합니다."

→ 잘못된 답! (48 ÷ 6 = 8로 계산, 나간 사람 무시)

┌─────────────────────────────────────────────────┐
│ ✅ With CoT (단계별로 생각해봐)                  │
└─────────────────────────────────────────────────┘

AI:
"단계별로 생각해보겠습니다:

Step 1: 처음 손님 수 확인
- 초기 손님: 48명

Step 2: 나간 손님 계산
- 나간 손님: 12명
- 남은 손님: 48 - 12 = 36명

Step 3: 필요한 테이블 수 계산
- 테이블당 인원: 6명
- 필요 테이블: 36 ÷ 6 = 6개

따라서 6개의 테이블이 필요합니다."

→ 정확한 답!
```

------

#### 개발자에게 더 익숙한 비유: Pseudo Code

```java
// ❌ Without CoT: 바로 코드 작성 (버그 가능성 높음)
public List<User> getActiveUsers() {
    return userRepository.findAll(); // 잘못된 로직!
}
```

```java
// ✅ With CoT: 의사 코드로 먼저 설계
public List<User> getActiveUsers() {
    /*
     * Pseudo Code (사고 과정):
     * 1. 모든 유저 조회
     * 2. 활성 상태인 유저만 필터링
     * 3. 마지막 로그인 날짜 순으로 정렬
     * 4. 결과 반환
     */
    
    // 실제 구현
    return userRepository.findAll().stream()
        .filter(user -> user.isActive())              // Step 2
        .sorted(Comparator.comparing(User::getLastLogin).reversed()) // Step 3
        .collect(Collectors.toList());                // Step 4
}
```

------

#### CoT 실전 예시 1: 복잡한 비즈니스 로직

```
❌ Without CoT:

Prompt:
"주문 취소 로직을 구현해줘"

AI:
@Service
public void cancelOrder(Long orderId) {
    orderRepository.deleteById(orderId);
}

→ 너무 단순! 결제 취소, 재고 복구 등 누락
```

```
✅ With CoT:

Prompt:
"""
주문 취소 로직을 구현해줘.

단계별로 생각해서 필요한 모든 처리를 포함해줘:
1. 무엇을 먼저 확인해야 할까?
2. 어떤 순서로 처리해야 할까?
3. 예외 상황은 무엇이 있을까?
"""

AI:
"""
단계별로 분석하겠습니다:

[Step 1: 주문 상태 확인]
- 주문이 취소 가능한 상태인가?
- 이미 배송 시작되었나?
- 결제 완료 상태인가?

[Step 2: 결제 취소]
- 결제 게이트웨이 API 호출
- 환불 처리

[Step 3: 재고 복구]
- 주문했던 상품들의 재고 증가
- 재고 히스토리 기록

[Step 4: 주문 상태 변경]
- 주문 상태를 '취소'로 변경
- 취소 사유 및 시간 기록

[Step 5: 알림 발송]
- 사용자에게 취소 알림
- 관리자에게 로그 전송

[구현 코드]
@Service
@Transactional
@RequiredArgsConstructor
public class OrderCancellationService {
    
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final InventoryService inventoryService;
    private final NotificationService notificationService;
    
    public void cancelOrder(Long orderId, String reason) {
        // Step 1: 주문 조회 및 검증
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        if (!order.isCancellable()) {
            throw new OrderNotCancellableException(
                "주문 상태: " + order.getStatus()
            );
        }
        
        // Step 2: 결제 취소
        if (order.isPaid()) {
            paymentService.refund(order.getPaymentId());
        }
        
        // Step 3: 재고 복구
        order.getOrderItems().forEach(item -> 
            inventoryService.increaseStock(
                item.getProductId(), 
                item.getQuantity()
            )
        );
        
        // Step 4: 주문 상태 변경
        order.cancel(reason);
        orderRepository.save(order);
        
        // Step 5: 알림 발송
        notificationService.notifyOrderCancelled(order);
        
        log.info("주문 취소 완료: orderId={}, reason={}", orderId, reason);
    }
}
"""

→ 모든 엣지 케이스를 고려한 완벽한 구현!
```

------

#### CoT 실전 예시 2: SQL 쿼리 최적화

```
❌ Without CoT:

"이 쿼리를 최적화해줘:
SELECT * FROM orders WHERE user_id = 1;"

AI:
"인덱스를 추가하세요:
CREATE INDEX idx_user_id ON orders(user_id);"

→ 피상적인 조언
```

```
✅ With CoT:

"""
다음 쿼리를 최적화해줘. 단계별로 분석해서 설명해줘:

[현재 쿼리]
SELECT * FROM orders WHERE user_id = 1;

[테이블 정보]
- orders 테이블: 100만 건
- 평균 주문 컬럼 수: 20개
- user_id별 평균 주문 수: 50건
"""

AI:
"""
단계별로 최적화를 분석하겠습니다:

[Step 1: 문제점 파악]
1. SELECT * 사용 → 불필요한 컬럼까지 조회
2. 인덱스 없음 → Full Table Scan 발생
3. 필요한 컬럼이 명시되지 않음

[Step 2: 실행 계획 예상]
- 현재: Full Table Scan (100만 건 스캔)
- 예상 시간: 2-3초
- I/O 비용: 매우 높음

[Step 3: 최적화 전략]
1. 필요한 컬럼만 SELECT
2. user_id에 인덱스 추가
3. 자주 조회되는 컬럼은 커버링 인덱스 고려

[Step 4: 최적화된 쿼리]

-- 인덱스 생성
CREATE INDEX idx_user_id ON orders(user_id);

-- 또는 커버링 인덱스 (자주 조회하는 컬럼 포함)
CREATE INDEX idx_user_id_created_amount 
ON orders(user_id, created_at, amount);

-- 최적화된 쿼리
SELECT 
    id,
    created_at,
    amount,
    status
FROM orders 
WHERE user_id = 1
ORDER BY created_at DESC;

[Step 5: 성능 개선 예상]
- Before: Full Scan (100만 건)
- After: Index Scan (50건만)
- 개선율: 약 20,000배 ⚡

[Step 6: 추가 최적화 제안]
1. 페이징 추가 (LIMIT, OFFSET)
2. 자주 쓰이면 Redis 캐싱 고려
3. 읽기 전용이면 @Transactional(readOnly=true)

[코드 예시]
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    @Query("""
        SELECT new OrderDto(
            o.id, o.createdAt, o.amount, o.status
        )
        FROM Order o
        WHERE o.userId = :userId
        ORDER BY o.createdAt DESC
        """)
    @QueryHints(@QueryHint(
        name = org.hibernate.annotations.QueryHints.READ_ONLY, 
        value = "true"
    ))
    Page<OrderDto> findByUserIdOptimized(
        @Param("userId") Long userId,
        Pageable pageable
    );
}
"""

→ 깊이 있는 분석과 구체적인 해결책!
```

------

### 3. Few-Shot + CoT 콤보 🔥

가장 강력한 조합은 **Few-Shot과 CoT를 함께 사용**하는 거예요!

```java
// 최강 조합
String prompt = buildPrompt()
    .withExamples(examples)      // Few-Shot
    .withStepByStepThinking()    // CoT
    .build();
```

#### 실전 예시: 레거시 코드 리팩토링

```
✅ Few-Shot + CoT 콤보:

"""
[Persona]
당신은 Clean Code 전문가입니다.

[Few-Shot Examples]
다음은 좋은 리팩토링 예시입니다:

[Example 1]
Before:
public void process(User u) {
    if(u!=null&&u.getAge()>=18){
        // ...
    }
}

After:
public void processAdultUser(User user) {
    if (isValidAdultUser(user)) {
        // ...
    }
}

private boolean isValidAdultUser(User user) {
    return user != null && user.getAge() >= ADULT_AGE;
}

Reasoning:
1. 네이밍 개선 (u → user, process → processAdultUser)
2. 매직 넘버 제거 (18 → ADULT_AGE)
3. 조건 로직 메서드 추출 (가독성 향상)

[Example 2]
Before:
public List<Order> getOrders() {
    List<Order> list = new ArrayList<>();
    for(Order o : orderRepository.findAll()) {
        if(o.getStatus().equals("PAID")) {
            list.add(o);
        }
    }
    return list;
}

After:
public List<Order> getPaidOrders() {
    return orderRepository.findAll().stream()
        .filter(Order::isPaid)
        .collect(Collectors.toList());
}

Reasoning:
1. 메서드명에 의도 명시 (getOrders → getPaidOrders)
2. Stream API로 간결화
3. 문자열 비교 대신 메서드 사용 (isPaid)

[Task]
이제 다음 레거시 코드를 리팩토링해주세요.
단계별로 생각하면서 진행해주세요:

[Legacy Code]
@Service
public class UserService {
    @Autowired
    UserRepository repo;
    
    public User get(Long id) {
        User u = repo.findById(id).get();
        if(u.getStatus() == 1) {
            return u;
        }
        return null;
    }
}

[Instructions]
1. 문제점을 단계별로 분석
2. 각 문제의 해결 방법 설명
3. 리팩토링된 코드 제시
4. 개선 사항 요약
"""

AI 응답:
"""
단계별로 분석하고 리팩토링하겠습니다:

[Step 1: 문제점 분석]

🚨 심각한 문제:
1. NoSuchElementException 위험
   - `findById().get()` 사용
   - 데이터 없으면 예외 발생

2. 매직 넘버 사용
   - `status == 1`의 의미 불명확

3. Null 반환
   - null 반환은 NullPointerException 유발 가능

⚠️ 개선 필요:
4. 필드 주입 사용
   - @Autowired 필드 주입 (테스트 어려움)

5. 모호한 메서드명
   - `get()`이 뭘 리턴하는지 불명확

6. 트랜잭션 미적용
   - readOnly 트랜잭션 누락

[Step 2: 해결 전략]

1. Optional 처리 개선
   → orElseThrow()로 명시적 예외 처리

2. Enum으로 상태 관리
   → 매직 넘버 제거

3. Optional 반환
   → null 대신 Optional 사용

4. 생성자 주입
   → @RequiredArgsConstructor 활용

5. 메서드명 개선
   → getActiveUser로 의도 명시

6. 트랜잭션 추가
   → @Transactional(readOnly = true)

[Step 3: 리팩토링된 코드]

// 1. User 엔티티에 Enum 추가
@Entity
public class User {
    @Id
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    // 비즈니스 로직 메서드
    public boolean isActive() {
        return status == UserStatus.ACTIVE;
    }
}

// 2. 상태 Enum 정의
public enum UserStatus {
    ACTIVE(1),
    INACTIVE(0),
    SUSPENDED(-1);
    
    private final int code;
    
    UserStatus(int code) {
        this.code = code;
    }
}

// 3. 리팩토링된 Service
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public Optional<User> findActiveUser(Long userId) {
        return userRepository.findById(userId)
            .filter(User::isActive);
    }
    
    // 또는 예외를 던지는 버전
    public User getActiveUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        
        if (!user.isActive()) {
            throw new UserNotActiveException(userId);
        }
        
        return user;
    }
}

// 4. 커스텀 예외
@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long userId) {
        super("User not found: " + userId);
    }
}

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UserNotActiveException extends RuntimeException {
    public UserNotActiveException(Long userId) {
        super("User is not active: " + userId);
    }
}

[Step 4: 개선 사항 요약]

✨ 개선된 점:

1. 안정성 향상
   - NoSuchElementException 방지
   - 명시적 예외 처리
   - NPE 위험 제거

2. 가독성 향상
   - 매직 넘버 → Enum
   - 모호한 이름 → 의도 명확한 이름
   - 비즈니스 로직 캡슐화 (isActive)

3. 유지보수성 향상
   - 생성자 주입 (테스트 용이)
   - 불변성 보장 (final)
   - 단일 책임 원칙 준수

4. 성능 최적화
   - readOnly 트랜잭션
   - 불필요한 쿼리 방지

[Before vs After 비교]

Before:
- 코드 라인: 8줄
- 잠재적 버그: 5개
- 가독성: ⭐⭐
- 유지보수성: ⭐

After:
- 코드 라인: 30줄 (하지만 훨씬 명확)
- 잠재적 버그: 0개
- 가독성: ⭐⭐⭐⭐⭐
- 유지보수성: ⭐⭐⭐⭐⭐

코드는 길어졌지만, 안정성과 유지보수성이 크게 향상되었습니다!
"""
```

정말 완벽한 리팩토링 제안이죠? 이게 바로 **Few-Shot + CoT**의 위력이에요!

------

### 4. 실전 적용 템플릿 📚

```java
@Component
public class AdvancedPromptTemplates {
    
    /**
     * Few-Shot 템플릿
     */
    public static String fewShot(
        List<Example> examples,
        String task
    ) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("다음 예시들을 참고하여 패턴을 학습하세요:\n\n");
        
        for (int i = 0; i < examples.size(); i++) {
            Example ex = examples.get(i);
            prompt.append(String.format("""
                [Example %d]
                Input: %s
                Output: %s
                
                """, i + 1, ex.getInput(), ex.getOutput()));
        }
        
        prompt.append("이제 다음 작업을 수행하세요:\n");
        prompt.append(task);
        
        return prompt.toString();
    }
    
    /**
     * Chain of Thought 템플릿
     */
    public static String chainOfThought(String task) {
        return String.format("""
            다음 작업을 수행해주세요:
            %s
            
            단계별로 생각하면서 진행해주세요:
            1. 먼저 문제를 분석하세요
            2. 해결 전략을 수립하세요
            3. 각 단계를 실행하세요
            4. 결과를 검증하세요
            
            각 단계마다 사고 과정을 명시적으로 보여주세요.
            """, task);
    }
    
    /**
     * Few-Shot + CoT 콤보
     */
    public static String fewShotWithCoT(
        List<Example> examples,
        String task
    ) {
        StringBuilder prompt = new StringBuilder();
        
        // Few-Shot 파트
        prompt.append("다음 예시들을 참고하세요:\n\n");
        for (int i = 0; i < examples.size(); i++) {
            Example ex = examples.get(i);
            prompt.append(String.format("""
                [Example %d]
                Before: %s
                After: %s
                Reasoning: %s
                
                """, 
                i + 1, 
                ex.getBefore(), 
                ex.getAfter(), 
                ex.getReasoning()
            ));
        }
        
        // CoT 파트
        prompt.append(String.format("""
            이제 다음 작업을 수행하세요:
            %s
            
            단계별로 생각하면서 진행해주세요:
            [Step 1: 문제점 분석]
            - 무엇이 문제인가?
            
            [Step 2: 해결 전략]
            - 어떻게 개선할 것인가?
            
            [Step 3: 구현]
            - 실제 코드 작성
            
            [Step 4: 검증]
            - 개선 사항 확인
            
            각 단계의 사고 과정을 명시적으로 보여주세요.
            """, task);
        
        return prompt.toString();
    }
    
    /**
     * 자연어 → 코드 변환 (Few-Shot)
     */
    public static String naturalLanguageToCode(
        String naturalLanguage
    ) {
        return String.format("""
            다음 패턴을 학습하세요:
            
            [Example 1]
            요구사항: "유저 목록 중 성인만 필터링"
            코드:
            users.stream()
                .filter(user -> user.getAge() >= 18)
                .collect(Collectors.toList());
            
            [Example 2]
            요구사항: "상품을 가격 높은 순으로 정렬"
            코드:
            products.stream()
                .sorted(Comparator.comparing(Product::getPrice).reversed())
                .collect(Collectors.toList());
            
            [Example 3]
            요구사항: "주문 금액 합계 계산"
            코드:
            orders.stream()
                .mapToInt(Order::getAmount)
                .sum();
            
            이제 다음 요구사항을 코드로 변환해주세요:
            요구사항: "%s"
            """, naturalLanguage);
    }
}
```

------

### 5. 실전 사용 시나리오

#### 시나리오 1: API 명세서 → 코드 생성

```java
@RestController
@RequestMapping("/api/ai")
public class CodeGenerationController {
    
    @Autowired
    private OpenAIClient openAI;
    
    @PostMapping("/generate-from-spec")
    public String generateFromSpec(@RequestBody ApiSpec spec) {
        // Few-Shot: 좋은 API 코드 예시 제공
        List<Example> examples = Arrays.asList(
            new Example(
                "GET /users - 유저 목록 조회",
                """
                @GetMapping("/users")
                public ResponseEntity<List<UserDto>> getUsers() {
                    List<UserDto> users = userService.findAll();
                    return ResponseEntity.ok(users);
                }
                """
            ),
            new Example(
                "POST /users - 유저 생성",
                """
                @PostMapping("/users")
                public ResponseEntity<UserDto> createUser(
                    @Valid @RequestBody CreateUserRequest request
                ) {
                    UserDto user = userService.create(request);
                    return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(user);
                }
                """
            )
        );
        
        // CoT: 단계별 생각하게 만들기
        String prompt = String.format("""
            %s
            
            이제 다음 API 명세서로 코드를 생성해주세요:
            %s
            
            단계별로 생각하면서 진행해주세요:
            1. 적절한 HTTP 메서드 결정
            2. 경로 변수/쿼리 파라미터 파악
            3. 요청/응답 DTO 설계
            4. 예외 처리 고려
            5. 완전한 코드 작성
            """,
            AdvancedPromptTemplates.fewShot(examples, ""),
            spec.toString()
        );
        
        return openAI.chat(prompt, temperature = 0.2);
    }
}
```

------

#### 시나리오 2: 버그 분석 및 수정

```java
@Service
public class BugFixService {
    
    @Autowired
    private OpenAIClient openAI;
    
    public BugFixResult analyzeBug(String buggyCode, String error) {
        // CoT: 단계별 디버깅
        String prompt = String.format("""
            [Buggy Code]
            ```java
            %s
            ```
            
            [Error Message]
            %s
            
            단계별로 디버깅을 진행해주세요:
            
            [Step 1: 에러 메시지 분석]
            - 어떤 종류의 에러인가?
            - 어느 라인에서 발생했는가?
            
            [Step 2: 근본 원인 파악]
            - 왜 이 에러가 발생했는가?
            - 어떤 조건에서 발생하는가?
            
            [Step 3: 해결 방법]
            - 어떻게 수정해야 하는가?
            - 여러 방법이 있다면 각각의 장단점은?
            
            [Step 4: 수정된 코드]
            - 버그를 수정한 완전한 코드
            - 주석으로 수정 사항 설명
            
            [Step 5: 재발 방지]
            - 이런 버그를 예방하려면?
            - 테스트 코드 작성 방법
            
            각 단계를 명확히 설명해주세요.
            """, buggyCode, error);
        
        String response = openAI.chat(prompt, temperature = 0.3);
        return parseBugFixResult(response);
    }
}
```

------

### 6. 정리: 고급 테크닉 활용법

```java
/**
 * 프롬프트 고급 테크닉 총정리
 */
public class AdvancedPromptEngineering {
    
    // 1. Few-Shot = Unit Test 케이스 제공
    List<Example> examples = Arrays.asList(
        new Example("입력1", "출력1"),
        new Example("입력2", "출력2"),
        new Example("입력3", "출력3")
    );
    
    // 2. Chain of Thought = 의사 코드 작성
    String cotInstruction = """
        단계별로 생각해봐:
        1. 문제 분석
        2. 전략 수립
        3. 실행
        4. 검증
        """;
    
    // 3. 최강 콤보: Few-Shot + CoT
    String ultimatePrompt = buildPrompt()
        .withExamples(examples)      // 패턴 학습
        .withStepByStepThinking()    // 논리적 사고
        .withPersona("시니어 개발자") // 전문성
        .withTemperature(0.3)        // 정확성
        .build();
}
```

#### 핵심 체크리스트

| 상황 | 추천 기법 | 이유 |
|------|----------|------|
| **정확한 형식 필요** | Few-Shot | 패턴 학습으로 일관성 확보 |
| **복잡한 논리** | CoT | 단계별 검증으로 오류 방지 |
| **레거시 리팩토링** | Few-Shot + CoT | 예시 + 논리적 분석 |
| **코드 생성** | Few-Shot + 낮은 Temperature | 일관성 + 정확성 |
| **버그 분석** | CoT | 논리적 디버깅 과정 |

------

### 마치며

프롬프트 엔지니어링의 고급 테크닉을 익히면:

1. **Few-Shot**: Unit Test처럼 예제를 보여줘서 패턴 학습
2. **Chain of Thought**: 의사 코드를 먼저 작성하게 해서 논리 검증
3. **콤보 활용**: 두 기법을 섞어서 최고의 결과 도출

개발자로서 이 기법들을 이해하면:
- AI로부터 정확한 결과를 얻을 수 있고
- 복잡한 문제도 단계별로 해결할 수 있으며
- 실무에서 바로 사용 가능한 코드를 생성할 수 있습니다!

다음에 AI와 대화할 때는:
1. 예제 2-3개 보여주고 (Few-Shot)
2. "단계별로 생각해봐" 추가하세요 (CoT)

이것만으로도 결과의 품질이 10배는 향상될 거예요! 🚀

------

> 참고 자료
> - Few-Shot Learning: https://arxiv.org/abs/2005.14165
> - Chain of Thought Prompting: https://arxiv.org/abs/2201.11903
> - Let's think step by step: https://arxiv.org/abs/2205.11916
> - OpenAI Best Practices: https://platform.openai.com/docs/guides/prompt-engineering

