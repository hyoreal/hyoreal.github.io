---
layout: post

toc: true

title: "[AI] AI에게 일을 제대로 시키는 노하우 - Zero-shot, Few-shot, CoT 완벽 정리"

date: 2025-12-13 19:01:00 +0900

comments: true

categories: [AI, Machine Learning]

tags: [AI, Prompt Engineering, Few-shot, Chain of Thought, Zero-shot, LLM]


---

### AI에게 일을 시키는 3가지 방법 🎓

개발자라면 누구나 경험해봤을 거예요:
- "ChatGPT야, 이 형식으로 코드 짜줘" → 엉뚱한 결과
- "복잡한 로직을 한 번에 짜줘" → 버그 투성이

문제는 **일을 시키는 방법**에 있습니다. 신입 개발자에게 일 시키는 것과 동일해요!

오늘은 AI에게 제대로 일을 시키는 3가지 핵심 기법을 정리합니다.

------

### 0. 개념 비교: 신입 개발자에게 일 시키기 👨‍💼

#### 상황: "회원가입 API 만들어줘"

**Zero-shot (예시 없이)**
```java
// 팀장: "회원가입 API 만들어줘"
// 신입: "네... (막막)" 

// 결과: 기본적인 구조만 만듦
@PostMapping("/signup")
public void signup(@RequestBody User user) {
    userRepository.save(user);
}
// ❌ Validation, 예외처리, 중복체크 없음
```

**Few-shot (예시 2개 주고)**
```java
// 팀장: "이런 스타일로 만들어줘"

// 예시 1: 로그인 API
@PostMapping("/login")
public ApiResponse<TokenDto> login(@Valid @RequestBody LoginRequest request) {
    try {
        TokenDto token = authService.login(request);
        return ApiResponse.success(token);
    } catch (AuthException e) {
        return ApiResponse.error(e.getMessage());
    }
}

// 예시 2: 비밀번호 변경 API
@PutMapping("/password")
public ApiResponse<Void> changePassword(@Valid @RequestBody PasswordRequest request) {
    try {
        userService.changePassword(request);
        return ApiResponse.success(null);
    } catch (ValidationException e) {
        return ApiResponse.error(e.getMessage());
    }
}

// 신입: "아 이렇게 짜면 되는구나!"

// 결과: 예시와 동일한 패턴으로 작성
@PostMapping("/signup")
public ApiResponse<UserDto> signup(@Valid @RequestBody SignupRequest request) {
    try {
        UserDto user = userService.signup(request);
        return ApiResponse.success(user);
    } catch (DuplicateException e) {
        return ApiResponse.error(e.getMessage());
    }
}
// ✅ 패턴 일관성 유지!
```

**Chain of Thought (단계별로 생각하게)**
```java
// 팀장: "회원가입 API 만드는데, 단계별로 생각해봐"

// 신입의 사고 과정:
/*
1단계: 요구사항 분석
   - 입력: 이메일, 비밀번호, 이름
   - 검증: 이메일 형식, 비밀번호 강도, 중복 체크
   
2단계: 예외 상황
   - 이메일 중복 → DuplicateEmailException
   - 잘못된 형식 → ValidationException
   - DB 오류 → InternalServerException
   
3단계: 보안
   - 비밀번호 암호화 (BCrypt)
   - SQL Injection 방지 (JPA)
   - XSS 방지
   
4단계: 응답
   - 성공: 201 Created + UserDto
   - 실패: 적절한 HTTP 상태 코드 + 에러 메시지
*/

// 결과: 완성도 높은 코드
@PostMapping("/signup")
@Operation(summary = "회원가입")
@ApiResponses({
    @ApiResponse(responseCode = "201", description = "가입 성공"),
    @ApiResponse(responseCode = "400", description = "잘못된 입력"),
    @ApiResponse(responseCode = "409", description = "이메일 중복")
})
public ResponseEntity<ApiResponse<UserDto>> signup(
        @Valid @RequestBody SignupRequest request) {
    
    // 1. 이메일 중복 체크
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new DuplicateEmailException("이미 사용 중인 이메일입니다.");
    }
    
    // 2. 비밀번호 암호화
    String encodedPassword = passwordEncoder.encode(request.getPassword());
    
    // 3. User 엔티티 생성
    User user = User.builder()
        .email(request.getEmail())
        .password(encodedPassword)
        .name(request.getName())
        .role(UserRole.USER)
        .createdAt(LocalDateTime.now())
        .build();
    
    // 4. 저장
    User savedUser = userRepository.save(user);
    
    // 5. DTO 변환 및 응답
    UserDto userDto = UserDto.from(savedUser);
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(ApiResponse.success(userDto));
}
// ✅ 완벽한 구현!
```

------

### 1. Zero-shot Prompting - 예시 없이 바로 시키기 📝

#### 개념

**"예제 없이 작업 설명만으로 실행"**

```java
public String zeroShotPrompt(String task) {
    // 예제 없이 바로 요청
    return llm.generate(task);
}
```

#### 장점 & 단점

```java
// 장점
public class ZeroShotAdvantages {
    void quick() {
        // 1. 빠른 실행 (예제 준비 불필요)
        String result = llm.generate("Spring Boot Controller 작성해줘");
    }
    
    void simple() {
        // 2. 간단한 프롬프트
        String sql = llm.generate("User 테이블 생성 SQL 작성해줘");
    }
    
    void general() {
        // 3. 일반적인 작업에 효과적
        String doc = llm.generate("REST API 문서화 작성해줘");
    }
}

// 단점
public class ZeroShotDisadvantages {
    void inconsistent() {
        // 1. 일관성 부족
        String code1 = llm.generate("에러 핸들링 코드 작성해줘");
        // → try-catch 사용
        
        String code2 = llm.generate("에러 핸들링 코드 작성해줘");
        // → Optional 사용
        // ❌ 매번 다른 스타일!
    }
    
    void inaccurate() {
        // 2. 정확도 낮음 (특히 복잡한 작업)
        String complex = llm.generate("MSA 환경에서 분산 트랜잭션 처리 코드 작성해줘");
        // ❌ 너무 추상적이거나 틀린 코드 생성 가능
    }
    
    void domainSpecific() {
        // 3. 도메인 특화 작업에 약함
        String custom = llm.generate("우리 회사 코딩 컨벤션에 맞게 작성해줘");
        // ❌ 회사 컨벤션을 모름
    }
}
```

#### 실전 예시

**Zero-shot으로 적합한 작업:**

```java
// 1. 간단한 유틸 함수
String prompt1 = """
    Java로 문자열을 역순으로 뒤집는 메서드를 작성해줘.
    """;

// 결과 (정확함)
public String reverse(String str) {
    return new StringBuilder(str).reverse().toString();
}

// 2. 표준적인 CRUD
String prompt2 = """
    Spring Data JPA Repository 인터페이스를 작성해줘.
    엔티티는 User야.
    """;

// 결과 (정확함)
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// 3. 기본적인 설명
String prompt3 = """
    JPA의 영속성 컨텍스트가 뭔지 설명해줘.
    """;

// 결과 (정확함)
// "영속성 컨텍스트는 엔티티를 영구 저장하는 환경입니다..."
```

**Zero-shot으로 부적합한 작업:**

```java
// 1. 복잡한 비즈니스 로직
String prompt1 = """
    전자상거래에서 주문 취소 시 재고 복구, 결제 취소, 
    포인트 복구를 원자적으로 처리하는 코드를 작성해줘.
    """;
// ❌ 너무 복잡 → Few-shot이나 CoT 필요

// 2. 특정 스타일/패턴
String prompt2 = """
    우리 팀의 코딩 스타일에 맞게 작성해줘.
    """;
// ❌ 팀 스타일을 모름 → Few-shot으로 예시 필요

// 3. 도메인 특화 로직
String prompt3 = """
    우리 회사의 할인 정책 로직을 구현해줘.
    """;
// ❌ 회사 정책을 모름 → 상세 설명 또는 예시 필요
```

------

### 2. Few-shot Prompting - 예시로 학습시키기 🎯

#### 개념

**"1~5개 정도의 예제를 주고, 패턴을 학습시켜 실행"**

```java
public String fewShotPrompt(List<Example> examples, String task) {
    StringBuilder prompt = new StringBuilder();
    
    // 예제들 추가
    prompt.append("다음 예시를 보고 동일한 패턴으로 작성해줘:\n\n");
    for (Example ex : examples) {
        prompt.append(String.format("입력: %s\n출력: %s\n\n", 
                                    ex.input, ex.output));
    }
    
    // 실제 작업
    prompt.append(String.format("입력: %s\n출력: ?", task));
    
    return llm.generate(prompt.toString());
}
```

#### 실전 예시 1: SQL 쿼리 스타일 통일

**상황: 우리 팀의 SQL 쿼리 스타일을 학습시키기**

```sql
-- Zero-shot (스타일 불일치)
프롬프트: "User 테이블에서 활성 사용자 조회하는 쿼리 작성해줘"

결과:
SELECT * FROM USER WHERE STATUS = 'ACTIVE';
-- ❌ 컬럼 전체 조회, 대문자만 사용

-- Few-shot (예시 2개 제공)
프롬프트:
"""
우리 팀의 SQL 스타일로 작성해줘. 다음 예시를 참고해:

[예시 1]
요구사항: Order 테이블에서 완료된 주문 조회
쿼리:
SELECT 
    o.order_id,
    o.user_id,
    o.total_amount,
    o.created_at
FROM orders o
WHERE o.status = 'COMPLETED'
    AND o.deleted_at IS NULL
ORDER BY o.created_at DESC;

[예시 2]
요구사항: Product 테이블에서 재고 있는 상품 조회
쿼리:
SELECT 
    p.product_id,
    p.name,
    p.price,
    p.stock_quantity
FROM products p
WHERE p.stock_quantity > 0
    AND p.is_active = true
    AND p.deleted_at IS NULL
ORDER BY p.name ASC;

[내 작업]
요구사항: User 테이블에서 활성 사용자 조회
쿼리: ?
"""

결과:
SELECT 
    u.user_id,
    u.email,
    u.name,
    u.created_at
FROM users u
WHERE u.status = 'ACTIVE'
    AND u.deleted_at IS NULL
ORDER BY u.created_at DESC;
-- ✅ 팀 스타일 완벽 반영!
-- - 별칭 사용 (u)
-- - 필요한 컬럼만 명시
-- - soft delete 고려
-- - 정렬 기준 포함
```

#### 실전 예시 2: API Response 형식 통일

```java
// Few-shot으로 회사 표준 Response 형식 학습

String prompt = """
우리 회사의 API Response 형식으로 작성해줘:

[예시 1 - 성공]
요청: GET /api/users/1
응답:
{
    "success": true,
    "data": {
        "id": 1,
        "name": "홍길동",
        "email": "hong@example.com"
    },
    "message": null,
    "timestamp": "2024-01-15T10:30:00"
}

[예시 2 - 실패]
요청: POST /api/users (이메일 중복)
응답:
{
    "success": false,
    "data": null,
    "message": "이미 사용 중인 이메일입니다.",
    "errorCode": "DUPLICATE_EMAIL",
    "timestamp": "2024-01-15T10:31:00"
}

[내 작업]
요청: DELETE /api/orders/123 (권한 없음)
응답: ?
""";

// 결과
{
    "success": false,
    "data": null,
    "message": "해당 주문에 접근할 권한이 없습니다.",
    "errorCode": "FORBIDDEN",
    "timestamp": "2024-01-15T10:32:00"
}
// ✅ 완벽한 형식 일관성!
```

#### 실전 예시 3: 테스트 코드 패턴

```java
String prompt = """
우리 팀의 테스트 코드 스타일로 작성해줘:

[예시 1]
테스트 대상: UserService.createUser()
테스트 코드:

@DisplayName("회원 생성 - 성공")
@Test
void createUser_Success() {
    // given
    SignupRequest request = SignupRequest.builder()
        .email("test@example.com")
        .password("password123")
        .name("테스트")
        .build();
    
    given(userRepository.existsByEmail(request.getEmail()))
        .willReturn(false);
    
    // when
    UserDto result = userService.createUser(request);
    
    // then
    assertThat(result.getEmail()).isEqualTo(request.getEmail());
    assertThat(result.getName()).isEqualTo(request.getName());
    verify(userRepository, times(1)).save(any(User.class));
}

[예시 2]
테스트 대상: OrderService.cancelOrder()
테스트 코드:

@DisplayName("주문 취소 - 실패: 이미 배송 시작")
@Test
void cancelOrder_Fail_AlreadyShipped() {
    // given
    Long orderId = 1L;
    Order order = Order.builder()
        .id(orderId)
        .status(OrderStatus.SHIPPED)
        .build();
    
    given(orderRepository.findById(orderId))
        .willReturn(Optional.of(order));
    
    // when & then
    assertThatThrownBy(() -> orderService.cancelOrder(orderId))
        .isInstanceOf(OrderCancelException.class)
        .hasMessage("배송이 시작된 주문은 취소할 수 없습니다.");
}

[내 작업]
테스트 대상: PaymentService.refund() - 실패: 환불 기한 초과
테스트 코드: ?
""";

// 결과
@DisplayName("환불 처리 - 실패: 환불 기한 초과")
@Test
void refund_Fail_RefundPeriodExpired() {
    // given
    Long paymentId = 1L;
    Payment payment = Payment.builder()
        .id(paymentId)
        .paidAt(LocalDateTime.now().minusDays(31)) // 31일 전
        .build();
    
    given(paymentRepository.findById(paymentId))
        .willReturn(Optional.of(payment));
    
    // when & then
    assertThatThrownBy(() -> paymentService.refund(paymentId))
        .isInstanceOf(RefundException.class)
        .hasMessage("환불 가능 기간(30일)이 지났습니다.");
}
// ✅ 팀의 테스트 패턴 완벽 반영!
```

#### Few-shot의 핵심 포인트

```java
public class FewShotBestPractices {
    
    // 1. 예시 개수는 2~5개가 적당
    void optimalExamples() {
        // Too Few (1개)
        // ❌ 패턴 파악 어려움
        
        // Optimal (2~3개)
        // ✅ 패턴 명확
        
        // Too Many (10개)
        // ❌ Context Window 낭비, 비용 증가
    }
    
    // 2. 예시는 다양해야 함
    void diverseExamples() {
        /*
         * 예시 1: 정상 케이스
         * 예시 2: 예외 케이스
         * 예시 3: 엣지 케이스
         */
    }
    
    // 3. 예시와 작업의 유사도가 높아야 함
    void similarExamples() {
        // Good: User API 예시 → User API 작업
        // Bad: User API 예시 → 결제 시스템 작업
    }
}
```

------

### 3. Chain of Thought (CoT) - 단계별로 생각하게 하기 🧠

#### 개념

**"복잡한 문제를 단계별로 분해하여 사고하게 만들기"**

```java
public String chainOfThoughtPrompt(String task) {
    return llm.generate(
        task + "\n\n단계별로 생각해서 풀어줘 (Let's think step by step):"
    );
}
```

#### Magic Phrase: "Let's think step by step"

```java
// Without CoT
String prompt1 = "복잡한 비즈니스 로직 구현해줘";
// ❌ 한 번에 짜려다 놓치는 부분 많음

// With CoT
String prompt2 = """
    복잡한 비즈니스 로직 구현해줘.
    
    단계별로 생각해봐:
    1. 요구사항 분석
    2. 예외 케이스 정리
    3. 필요한 검증 로직
    4. 트랜잭션 범위
    5. 최종 코드 작성
    """;
// ✅ 체계적으로 접근
```

#### 실전 예시 1: 복잡한 비즈니스 로직

**상황: 전자상거래 주문 취소 로직**

```java
// Without CoT (한 번에 작성)
프롬프트: "주문 취소 로직을 구현해줘"

결과:
@Transactional
public void cancelOrder(Long orderId) {
    Order order = orderRepository.findById(orderId).orElseThrow();
    order.setStatus(OrderStatus.CANCELLED);
    orderRepository.save(order);
}
// ❌ 재고 복구, 결제 취소, 포인트 처리 누락!

// With CoT (단계별 사고)
프롬프트:
"""
주문 취소 로직을 구현해줘.

단계별로 생각해봐:

[1단계: 비즈니스 요구사항 분석]
- 주문 취소 시 무엇을 해야 하는가?

[2단계: 예외 상황 정리]
- 어떤 경우에 취소가 불가능한가?

[3단계: 데이터 정합성]
- 어떤 데이터를 업데이트해야 하는가?

[4단계: 트랜잭션 설계]
- 어디까지를 하나의 트랜잭션으로 묶을 것인가?

[5단계: 코드 작성]
- 위 분석을 바탕으로 최종 코드 작성
"""

결과:
/*
[1단계: 비즈니스 요구사항 분석]
주문 취소 시 필요한 작업:
1. 주문 상태를 CANCELLED로 변경
2. 사용된 포인트 복구
3. 결제 취소 (PG사 API 호출)
4. 상품 재고 복구
5. 취소 사유 기록

[2단계: 예외 상황]
취소 불가능한 경우:
- 이미 배송이 시작된 경우 (status = SHIPPED)
- 이미 취소된 경우 (status = CANCELLED)
- 주문 후 30일이 지난 경우
- 배송 완료 후 7일이 지난 경우

[3단계: 데이터 정합성]
업데이트 대상:
- orders 테이블: status, cancelled_at, cancel_reason
- users 테이블: point += order.used_point
- products 테이블: stock_quantity += order_item.quantity
- payments 테이블: status = REFUNDED

[4단계: 트랜잭션 설계]
- DB 업데이트: 하나의 트랜잭션 (@Transactional)
- PG 취소 API: 별도 처리 (외부 API는 트랜잭션 불가)
- 실패 시: 보상 트랜잭션 (Saga 패턴)

[5단계: 코드 작성]
*/

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentGatewayClient pgClient;
    
    @Transactional
    public void cancelOrder(Long orderId, String cancelReason) {
        // 1. 주문 조회 및 검증
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException());
        
        // 2. 취소 가능 여부 확인
        validateCancellable(order);
        
        // 3. 주문 상태 변경
        order.cancel(cancelReason);
        
        // 4. 포인트 복구
        if (order.getUsedPoint() > 0) {
            User user = userRepository.findById(order.getUserId())
                .orElseThrow(() -> new UserNotFoundException());
            user.addPoint(order.getUsedPoint());
        }
        
        // 5. 재고 복구
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new ProductNotFoundException());
            product.increaseStock(item.getQuantity());
        }
        
        // 6. 결제 취소 (외부 API)
        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new PaymentNotFoundException());
        
        try {
            RefundResponse refundResponse = pgClient.refund(payment.getPgTransactionId());
            payment.markAsRefunded(refundResponse.getRefundId());
        } catch (PaymentGatewayException e) {
            // 결제 취소 실패 시 보상 트랜잭션 필요
            throw new OrderCancelException("결제 취소 실패: " + e.getMessage());
        }
        
        // 7. 모든 변경사항 저장
        orderRepository.save(order);
    }
    
    private void validateCancellable(Order order) {
        // 이미 취소된 주문
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new OrderCancelException("이미 취소된 주문입니다.");
        }
        
        // 배송 시작된 주문
        if (order.getStatus() == OrderStatus.SHIPPED) {
            throw new OrderCancelException("배송이 시작된 주문은 취소할 수 없습니다.");
        }
        
        // 기한 초과
        LocalDateTime cancelDeadline = order.getCreatedAt().plusDays(30);
        if (LocalDateTime.now().isAfter(cancelDeadline)) {
            throw new OrderCancelException("주문 취소 가능 기간이 지났습니다.");
        }
    }
}
// ✅ 완벽한 구현!
// - 모든 요구사항 반영
// - 예외 처리 완비
// - 데이터 정합성 보장
// - 트랜잭션 설계 명확
```

#### 실전 예시 2: 알고리즘 문제 해결

```java
// Without CoT
프롬프트: "배열에서 최장 증가 부분 수열(LIS) 길이를 구하는 Java 코드를 작성해줘"

결과:
public int lengthOfLIS(int[] nums) {
    // ... (바로 DP 코드 작성)
    // ❌ 로직 설명 없이 코드만 나옴
}

// With CoT
프롬프트:
"""
배열에서 최장 증가 부분 수열(LIS) 길이를 구하는 Java 코드를 작성해줘.

단계별로 생각해봐:
1. 문제 이해
2. 접근 방법 (완전탐색 vs DP vs 이분탐색)
3. 시간복잡도 분석
4. 최적 알고리즘 선택
5. 코드 구현
"""

결과:
/*
[1단계: 문제 이해]
입력: [10, 9, 2, 5, 3, 7, 101, 18]
출력: 4
설명: 최장 증가 부분 수열은 [2, 3, 7, 101]

[2단계: 접근 방법]

방법 1: 완전탐색 (브루트포스)
- 모든 부분 수열 확인
- 시간복잡도: O(2^n) 
- ❌ 너무 느림

방법 2: 동적 프로그래밍 (DP)
- dp[i] = i번째 원소를 마지막으로 하는 LIS 길이
- dp[i] = max(dp[j]) + 1 (j < i, nums[j] < nums[i])
- 시간복잡도: O(n^2)
- ✅ 중간 수준

방법 3: DP + 이분탐색
- tail 배열 유지 (각 길이별 최소 끝값)
- 이분탐색으로 위치 찾기
- 시간복잡도: O(n log n)
- ✅✅ 최적!

[3단계: 알고리즘 선택]
n이 크지 않으면 방법 2 (이해하기 쉬움)
n이 크면 방법 3 (최적)

여기서는 방법 2로 구현 (가독성 우선)

[4단계: 코드 구현]
*/

public int lengthOfLIS(int[] nums) {
    if (nums == null || nums.length == 0) {
        return 0;
    }
    
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);  // 최소 길이는 1
    
    int maxLength = 1;
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLength = Math.max(maxLength, dp[i]);
    }
    
    return maxLength;
}

/*
[시간복잡도 분석]
- 이중 for문: O(n^2)
- 공간복잡도: O(n)

[테스트]
입력: [10, 9, 2, 5, 3, 7, 101, 18]
dp: [1, 1, 1, 2, 2, 3, 4, 4]
출력: 4 ✅
*/
// ✅ 사고 과정까지 명확!
```

#### 실전 예시 3: 시스템 설계

```java
프롬프트:
"""
대규모 트래픽을 처리하는 채팅 시스템을 설계해줘.

단계별로 생각해봐:
1. 요구사항 정리 (기능/비기능)
2. 트래픽 예측 및 병목 지점 파악
3. 기술 스택 선정 (이유 포함)
4. 아키텍처 설계 (컴포넌트별 역할)
5. 확장 전략 (스케일 아웃)
6. 주요 챌린지와 해결 방법
"""

결과:
/*
[1단계: 요구사항 정리]

기능 요구사항:
- 1:1 채팅
- 그룹 채팅 (최대 100명)
- 읽음 표시
- 메시지 검색
- 파일 전송

비기능 요구사항:
- MAU: 1000만명
- DAU: 200만명
- 동시 접속자: 50만명
- 메시지 처리: 초당 10만건
- 응답 시간: 100ms 이내
- 가용성: 99.9%

[2단계: 트래픽 분석]

병목 지점:
1. WebSocket 연결 관리 (메모리)
2. 메시지 저장/조회 (DB)
3. 실시간 전송 (네트워크)

계산:
- 동시 접속: 50만명
- 연결당 메모리: 10KB
- 총 메모리: 5GB (WebSocket만)
- 메시지/초: 10만건
- DB Write: 10만 TPS 필요

[3단계: 기술 스택]

Real-time 통신:
- WebSocket (Socket.IO) ✅
  이유: 양방향 통신, 연결 유지, 재연결 자동

메시지 큐:
- Apache Kafka ✅
  이유: 높은 처리량, 파티셔닝, 복제

DB:
- Primary: MongoDB ✅
  이유: 유연한 스키마, 샤딩 지원
- Cache: Redis ✅
  이유: 빠른 읽기, Pub/Sub

서버:
- Spring Boot + WebFlux ✅
  이유: 비동기 처리, Reactive

[4단계: 아키텍처 설계]

┌─────────┐
│ Client  │
└────┬────┘
     │ WebSocket
     ▼
┌─────────────┐
│ Load Balancer│
│ (Sticky Session)
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐ ┌─────┐
│Chat │ │Chat │ (WebSocket 서버)
│Server│ │Server│
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │ Publish
       ▼
   ┌────────┐
   │ Kafka  │ (메시지 큐)
   └───┬────┘
       │ Subscribe
       ▼
   ┌────────┐
   │Message │ (처리 서버)
   │Processor│
   └───┬────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐ ┌─────┐
│Redis│ │MongoDB│
│(Cache)│ │(Storage)
└─────┘ └─────┘

[5단계: 확장 전략]

Horizontal Scaling:
1. Chat Server: 부하에 따라 Pod 증설
2. Message Processor: Kafka 파티션 수만큼 스케일
3. MongoDB: Sharding (user_id 기준)
4. Redis: Cluster Mode

예시 코드:
*/

@Service
@RequiredArgsConstructor
public class ChatService {
    
    private final KafkaTemplate<String, ChatMessage> kafkaTemplate;
    private final RedisTemplate<String, ChatMessage> redisTemplate;
    private final MongoTemplate mongoTemplate;
    
    // 메시지 전송
    public Mono<Void> sendMessage(ChatMessage message) {
        return Mono.fromRunnable(() -> {
            // 1. Kafka에 발행 (비동기)
            kafkaTemplate.send("chat-messages", message.getChatRoomId(), message);
            
            // 2. Redis에 캐시 (최근 메시지)
            String cacheKey = "room:" + message.getChatRoomId() + ":recent";
            redisTemplate.opsForList().leftPush(cacheKey, message);
            redisTemplate.expire(cacheKey, Duration.ofHours(24));
        });
    }
    
    // Kafka Consumer (별도 서버)
    @KafkaListener(topics = "chat-messages")
    public void processMessage(ChatMessage message) {
        // 1. MongoDB에 저장
        mongoTemplate.save(message);
        
        // 2. 수신자들에게 WebSocket으로 전송
        notifyRecipients(message);
        
        // 3. 읽지 않은 메시지 카운트 업데이트 (Redis)
        updateUnreadCount(message);
    }
}

/*
[6단계: 주요 챌린지와 해결책]

Challenge 1: 메시지 순서 보장
해결: Kafka 파티션 키를 chatRoomId로 설정

Challenge 2: 사용자 온라인/오프라인 상태
해결: Redis Pub/Sub + Heartbeat (30초마다)

Challenge 3: 메시지 전송 실패 시 재시도
해결: Kafka의 내장 재시도 + Dead Letter Queue

Challenge 4: WebSocket 연결 관리 (메모리)
해결: Stateless 서버, Redis에 연결 정보 저장

Challenge 5: DB 부하 (읽기)
해결: Redis 캐싱 (최근 메시지 100개)
*/
// ✅ 완벽한 시스템 설계!
```

------

### 4. 3가지 기법 비교 및 선택 가이드 📊

#### 비교표

| 구분 | Zero-shot | Few-shot | Chain of Thought |
|------|-----------|----------|------------------|
| **예시 필요** | ❌ 불필요 | ✅ 2~5개 | ❌ 불필요 |
| **복잡도** | 낮음 | 중간 | 높음 |
| **정확도** | 낮음 | 높음 | 매우 높음 |
| **일관성** | 낮음 | 매우 높음 | 높음 |
| **비용** | 낮음 | 중간 | 높음 (토큰 많음) |
| **적합한 작업** | 간단한 작업 | 패턴 작업 | 복잡한 로직 |

#### 선택 가이드

```java
public class PromptTechniqueSelector {
    
    public PromptTechnique selectTechnique(Task task) {
        
        // 1. Zero-shot: 간단하고 표준적인 작업
        if (task.isSimple() && task.isStandard()) {
            return PromptTechnique.ZERO_SHOT;
            /*
             * 예시:
             * - 간단한 유틸 함수
             * - 표준 CRUD
             * - 기본적인 설명
             */
        }
        
        // 2. Few-shot: 특정 스타일/패턴 따라야 함
        if (task.requiresConsistency() || task.hasDomainSpecificStyle()) {
            return PromptTechnique.FEW_SHOT;
            /*
             * 예시:
             * - 팀 코딩 컨벤션
             * - API Response 형식
             * - 테스트 코드 패턴
             * - SQL 쿼리 스타일
             */
        }
        
        // 3. CoT: 복잡한 로직, 다단계 사고 필요
        if (task.isComplex() || task.requiresReasoning()) {
            return PromptTechnique.CHAIN_OF_THOUGHT;
            /*
             * 예시:
             * - 복잡한 비즈니스 로직
             * - 알고리즘 문제
             * - 시스템 설계
             * - 디버깅/분석
             */
        }
        
        return PromptTechnique.ZERO_SHOT; // default
    }
}
```

#### 실전 의사결정 플로우

```
작업이 주어짐
    │
    ▼
┌───────────────────┐
│ 간단한 작업인가?   │
│ (표준적, 일반적)  │
└────┬──────────────┘
     │
     ├─ YES → Zero-shot
     │         "User 엔티티 만들어줘"
     │
     └─ NO
        │
        ▼
   ┌───────────────────┐
   │ 특정 패턴을       │
   │ 따라야 하는가?    │
   └────┬──────────────┘
        │
        ├─ YES → Few-shot
        │         "우리 팀 스타일로 API 만들어줘"
        │         (예시 2~3개 제공)
        │
        └─ NO
           │
           ▼
      ┌───────────────────┐
      │ 복잡한 로직인가?  │
      │ (다단계 사고 필요)│
      └────┬──────────────┘
           │
           └─ YES → Chain of Thought
                    "주문 취소 로직 구현해줘"
                    "단계별로 생각해봐:"
```

------

### 5. 혼합 사용: 최강의 조합 🚀

#### Few-shot + CoT 조합

```java
String prompt = """
우리 팀의 에러 핸들링 패턴으로 작성해줘.

[예시 1: UserService]
@Service
public class UserService {
    public UserDto createUser(SignupRequest request) {
        try {
            // 비즈니스 로직
            validateEmail(request.getEmail());
            User user = userRepository.save(User.from(request));
            return UserDto.from(user);
        } catch (DuplicateEmailException e) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL, e);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e);
        }
    }
}

[예시 2: OrderService]
@Service
public class OrderService {
    public OrderDto createOrder(OrderRequest request) {
        try {
            // 비즈니스 로직
            validateStock(request.getItems());
            Order order = orderRepository.save(Order.from(request));
            return OrderDto.from(order);
        } catch (InsufficientStockException e) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK, e);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e);
        }
    }
}

[내 작업]
PaymentService의 결제 처리 메서드를 만들어줘.

단계별로 생각해봐:
1. 어떤 검증이 필요한가?
2. 어떤 예외가 발생할 수 있는가?
3. 각 예외를 어떻게 처리할 것인가?
4. 위 예시의 패턴을 따라 코드 작성
""";

// 결과: Few-shot의 일관성 + CoT의 완성도!
```

#### Zero-shot → Few-shot 점진적 개선

```java
// 1단계: Zero-shot으로 시작
String result1 = llm.generate("REST API 작성해줘");
// → 기본적인 코드 생성

// 2단계: 결과가 마음에 안들면 Few-shot으로 개선
String result2 = llm.generate("""
    다음 스타일로 REST API 작성해줘:
    
    [예시 1]
    """ + result1 + """
    
    [개선 요청]
    - Swagger 어노테이션 추가
    - Validation 추가
    - 예외 처리 추가
    """);
// → 개선된 코드
```

------

### 6. 실전 팁 💡

#### Tip 1: Temperature 조절 조합

```java
// 복잡한 작업 = CoT + Low Temperature
String prompt = """
    단계별로 생각해서 주문 취소 로직을 구현해줘.
    """;
String result = llm.generate(prompt, temperature = 0.2);
// → 체계적이고 정확한 결과

// 창의적 작업 = Few-shot + High Temperature
String prompt2 = """
    다음 예시를 참고해서 새로운 디자인 패턴을 제안해줘.
    [예시들...]
    """;
String result2 = llm.generate(prompt2, temperature = 0.8);
// → 다양한 아이디어
```

#### Tip 2: 반복 개선 (Iterative Refinement)

```java
// 1차 시도: Zero-shot
String v1 = llm.generate("User API 만들어줘");

// 2차 개선: Few-shot 추가
String v2 = llm.generate("""
    이 코드를 우리 팀 스타일로 개선해줘:
    [v1 코드]
    
    [팀 스타일 예시]
    ...
    """);

// 3차 개선: CoT로 검증
String v3 = llm.generate("""
    이 코드를 검토하고 개선점을 단계별로 분석해줘:
    [v2 코드]
    
    1. 보안 취약점은?
    2. 성능 이슈는?
    3. 테스트 가능성은?
    4. 최종 개선 코드
    """);
```

#### Tip 3: 작업 분해

```java
// Bad: 한 번에 너무 많이 요청
String bad = "회원가입부터 로그인, 프로필 수정까지 모두 구현해줘";

// Good: 작업을 분해하여 각각 처리
List<String> tasks = Arrays.asList(
    "회원가입 API (Few-shot으로 우리 스타일 적용)",
    "로그인 API (위 회원가입 API와 동일한 패턴으로)",
    "프로필 수정 API (CoT로 검증 로직 먼저 설계)"
);

for (String task : tasks) {
    String result = llm.generate(task);
    // 각 작업을 순차적으로 정확하게 처리
}
```

------

### 마치며: AI는 초급 개발자다 🎓

```java
/**
 * AI를 대하는 마음가짐
 */
public class AIManagementPhilosophy {
    
    void treatAILikeJuniorDeveloper() {
        /*
         * Zero-shot = "알아서 해봐"
         *   → 신입이 막막해함
         * 
         * Few-shot = "이런 예시들 참고해서 해봐"
         *   → 신입이 패턴 파악하고 따라함
         * 
         * CoT = "단계별로 생각하면서 해봐"
         *   → 신입이 체계적으로 접근
         */
        
        // 결론: AI도 사람처럼 대하면 더 좋은 결과!
    }
}
```

**핵심 정리:**

1. **Zero-shot**: 간단한 작업, 빠른 프로토타입
2. **Few-shot**: 특정 패턴/스타일 통일, 일관성 중요
3. **Chain of Thought**: 복잡한 로직, 체계적 접근 필요

3가지 기법을 **상황에 맞게 조합**하면 AI를 최대한 활용할 수 있습니다!

------

> 참고 자료
> - Chain-of-Thought Prompting Paper: https://arxiv.org/abs/2201.11903
> - Few-shot Learning: https://arxiv.org/abs/2005.14165
> - OpenAI Prompt Engineering: https://platform.openai.com/docs/guides/prompt-engineering
> - Prompt Engineering Guide: https://www.promptingguide.ai/

