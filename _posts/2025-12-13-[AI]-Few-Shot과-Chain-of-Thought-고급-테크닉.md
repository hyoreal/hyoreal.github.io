---
layout: post

toc: true

title: "[AI 실전] Few-Shot Learning과 Chain of Thought (CoT) - 고급 기법"

date: 2025-12-13 11:00:00 +0900

comments: true

categories: [AI 실전]

tags: [AI, Prompt, Few-Shot, CoT]


---

### 1. Few-Shot Prompting

#### 개념
- 모델에게 원하는 입력과 출력의 패턴(Pattern)을 미리 보여주는 기법
- **비유: Unit Test Code 또는 Mock Data**
  - "이 함수는 입력이 'A'일 때 'B'를 뱉어야 해"라고 `assertEquals(A, B)`를 보여주는 것과 동일
- 활용: JSON 포맷팅, 말투 교정, 특정 코드 스타일 준수 시 필수

#### Zero-Shot vs Few-Shot 비교

| 비교 항목 | Zero-Shot | Few-Shot |
|----------|-----------|----------|
| 예제 제공 | 없음 | 2~5개 예제 |
| 정확도 | 낮음 (추측 기반) | 높음 (패턴 학습) |
| 토큰 사용 | 적음 | 많음 (예제 포함) |
| 사용 사례 | 간단한 질문 | 정확한 형식 필요 |
| 개발 비유 | 구두 요청 | Unit Test 제공 |

#### Zero-Shot 예시

```text
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

#### Few-Shot 예시

```text
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

#### Few-Shot = Mock Data 제공

```text
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
```

#### 실전 예시: 네이밍 컨벤션

```text
❌ Zero-Shot:

"좋은 변수명 제안해줘"

AI: "data, info, result, value..." (너무 일반적)
```

```text
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

#### 실전 예시: 에러 메시지 변환

```text
❌ Zero-Shot:

"다음 에러를 사용자 친화적 메시지로 바꿔줘:
NullPointerException at line 42"

AI 응답: "오류가 발생했습니다" (너무 모호)
```

```text
✅ Few-Shot:

"""
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
"""

AI 응답: 
"사용자 정보를 불러오는 중 오류가 발생했습니다. 
관리자에게 문의해주세요."
```

------

### 2. Chain of Thought (CoT)

#### 개념
- 바로 답을 내지 않고, 중간 추론 과정을 단계별로 생성하게 유도하는 기법
- **비유: Debugging 또는 Pseudo-code 작성**
  - 복잡한 로직을 짤 때 바로 코딩하지 않고 주석으로 순서를 적는 행위
- 효과: 수학 문제, 복잡한 비즈니스 로직 설계 시 정확도 대폭 상승

#### CoT의 매직 프롬프트

```text
"Let's think step by step."
"단계별로 생각해봐."
```

------

#### Without CoT vs With CoT

```text
문제: "레스토랑에 48명의 손님이 있습니다. 
      각 테이블에 6명씩 앉는다면 테이블은 몇 개 필요할까요?
      하지만 12명이 나갔습니다."

❌ Without CoT:

AI: "8개의 테이블이 필요합니다."
→ 잘못된 답! (48 ÷ 6 = 8로 계산, 나간 사람 무시)

✅ With CoT:

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

#### 개발자 비유: Pseudo Code

```text
❌ Without CoT: 바로 코드 작성 (버그 가능성 높음)

public List<User> getActiveUsers() {
    return userRepository.findAll(); // 잘못된 로직!
}
```

```text
✅ With CoT: 의사 코드로 먼저 설계

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
```

------

#### 실전 예시: 복잡한 비즈니스 로직

```text
❌ Without CoT:

"주문 취소 로직을 구현해줘"

AI:
@Service
public void cancelOrder(Long orderId) {
    orderRepository.deleteById(orderId);
}
→ 너무 단순! 결제 취소, 재고 복구 등 누락
```

```text
✅ With CoT:

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
    
    public void cancelOrder(Long orderId, String reason) {
        // Step 1: 주문 조회 및 검증
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        if (!order.isCancellable()) {
            throw new OrderNotCancellableException();
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
    }
}
"""
→ 모든 엣지 케이스를 고려한 완벽한 구현!
```

#### 실전 예시: SQL 쿼리 최적화

```text
❌ Without CoT:

"이 쿼리를 최적화해줘:
SELECT * FROM orders WHERE user_id = 1;"

AI:
"인덱스를 추가하세요:
CREATE INDEX idx_user_id ON orders(user_id);"
→ 피상적인 조언
```

```text
✅ With CoT:

"""
다음 쿼리를 최적화해줘. 단계별로 분석해서 설명해줘:

[현재 쿼리]
SELECT * FROM orders WHERE user_id = 1;

[테이블 정보]
- orders 테이블: 100만 건
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

-- 최적화된 쿼리
SELECT id, created_at, amount, status
FROM orders 
WHERE user_id = 1
ORDER BY created_at DESC;

[Step 5: 성능 개선 예상]
- Before: Full Scan (100만 건)
- After: Index Scan (50건만)
- 개선율: 약 20,000배
"""
→ 깊이 있는 분석과 구체적인 해결책!
```

------

### 3. Few-Shot + CoT 콤보

#### 개념
- Few-Shot과 CoT를 함께 사용하는 조합
- 예시 제공(Few-Shot) + 단계별 사고(CoT)로 최고의 결과 도출

#### 실전 예시: 레거시 코드 리팩토링

```text
✅ Few-Shot + CoT 콤보:

"""
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

Reasoning:
1. 네이밍 개선 (u → user)
2. 매직 넘버 제거 (18 → ADULT_AGE)
3. 조건 로직 메서드 추출

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
1. 메서드명에 의도 명시
2. Stream API로 간결화
3. 문자열 비교 대신 메서드 사용

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
[Step 1: 문제점 분석]
1. NoSuchElementException 위험 (findById().get())
2. 매직 넘버 사용 (status == 1)
3. Null 반환 (NPE 위험)
4. 필드 주입 사용 (테스트 어려움)
5. 모호한 메서드명 (get())
6. 트랜잭션 미적용

[Step 2: 해결 전략]
1. Optional 처리 개선 → orElseThrow()
2. Enum으로 상태 관리
3. Optional 반환
4. 생성자 주입
5. 메서드명 개선
6. 트랜잭션 추가

[Step 3: 리팩토링된 코드]
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public Optional<User> findActiveUser(Long userId) {
        return userRepository.findById(userId)
            .filter(User::isActive);
    }
    
    public User getActiveUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        
        if (!user.isActive()) {
            throw new UserNotActiveException(userId);
        }
        
        return user;
    }
}

[Step 4: 개선 사항 요약]
- 안정성 향상: 예외 처리 명확화
- 가독성 향상: 매직 넘버 → Enum
- 유지보수성 향상: 생성자 주입, 불변성 보장
"""
```

### 4. 활용 가이드

#### 상황별 추천 기법

| 상황 | 추천 기법 | 이유 |
|------|----------|------|
| 정확한 형식 필요 | Few-Shot | 패턴 학습으로 일관성 확보 |
| 복잡한 논리 | CoT | 단계별 검증으로 오류 방지 |
| 레거시 리팩토링 | Few-Shot + CoT | 예시 + 논리적 분석 |
| 코드 생성 | Few-Shot + 낮은 Temperature | 일관성 + 정확성 |
| 버그 분석 | CoT | 논리적 디버깅 과정 |

---

> 참고 자료
> - Few-Shot Learning: https://arxiv.org/abs/2005.14165
> - Chain of Thought Prompting: https://arxiv.org/abs/2201.11903
> - OpenAI Best Practices: https://platform.openai.com/docs/guides/prompt-engineering
