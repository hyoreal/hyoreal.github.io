---

layout: post

title: "[Spring] Transaction "

comments: true

categories: [Spring, Transaction]

tags: [Spring, Transaction, ACID]

---

### <span style='color: #2D3748; background-color: #E9FF98'>Transaction</span>

- Transaction

  - DB의 상태를 변화시키는 하나의 논리적 기능을 수행하기 위한 작업의 단위
  - 애플리케이션의 신뢰성이 깨지는 상황이 발생하면 트랜잭션이라고 부를 수 없다
  - 여러 작업을 하나의 작업단위로 인식하여 전부 성공하거나 전부 실패(All or Nothing) 둘 중 하나로 처리되어야 트랜잭션의 의미를 가진다
    - All or Nothing : 데이터의 무결성을 보장하는 핵심 역할
  - [ACID 원칙](https://ko.wikipedia.org/wiki/ACID)을 지킴
    
### <span style='color: #2D3748; background-color: #B5FF98'>Transaction 성질 (ACID 원칙)</span>

- Atomicity 원자성

  - 하나의 트랜잭션의 연산은 DB에 모두 반영되거나 모두 반영되지 않아야 한다
  - 트랜잭션 내 모든 명령은 반드시 수행되어야 하고, 하나라도 오류가 발생한다면 트랜잭션 전체가 취소되어야한다
  - 결과가 예측 가능하다
  
- Consistency 일관성

  - 트랜잭션 실행 이후에도 DB의 상태는 일관적이어야한다
  - DB가 갖고 있는 제약은 트랜잭션 실행 전후 무관하게 지켜져야한다

- Isolation 독립성(격리성)

  - 모든 트랜잭션은 다른 트랜잭션으로부터 독립적이다
  - 하나의 트랜잭션은 다른 트랜잭션에게 영향을 줄 수 없다
  - 수행중인 트랜잭션은 완전히 완료되기 전에는 다른 트랜잭션의 수행결과를 참조할 수 없다
  
- Durability 영속성(지속성)

  - 트랜잭션이 완료되면 그 결과는 지속되어야 한다
  - 성공적으로 완료된 트랜잭션의 결과는 시스템 오류가 발생하더라도 영구적으로 반영되어야한다
  
### <span style='color: #2D3748; background-color: #98FFB0'>Transaction Commit/Rollback</span>

- [Commit](https://www.tutorialspoint.com/h2_database/h2_database_commit.htm)

  - 모든 작업을 최종적으로 DB에 반영하는 명령어
  - commit 명령을 수행 시, 변경된 내용이 DB에 영구적으로 저장
  - commit 명령을 수행하지 않을 시, 작업의 결과가 DB에 반영 X
  - commit 명령을 수행 시, 하나의 트랜잭션 과정 종료
  
- [Rollback](https://www.tutorialspoint.com/h2_database/h2_database_rollback.htm)

  - 작업 중 문제 발생 시, 트랜잭션 내에 수행 작업들 취소
  - 트랜잭션 시작 이 전의 상태로 되돌아감
  

### <span style='color: #2D3748; background-color: #98F6FF'>Transaction 적용</span>

- 선언형 방식 트랜잭션 적용

  - 비즈니스 로직에 애너테이션을 추가하는 방식
  - 클래스 레벨에 @Transactional 적용
    - 클래스 레벨에 추가하면 해당 클래스에서 MemberRepository의 기능을 이용하는 모든 메서드에 트랜잭션이 적용
    
  ```java
  @Service
  @Transactional
  public class MemberService {
    ...
  }
  ```
  
  - 메서드 레벨에 @Transactional 적용
    - 해당 메서드만 @Transactionl 적용
    - 트랜잭션 설정 추가 가능
  
  ```java
  @Service
  @Transactional
  public class MemberService {
    ...
    
    @Transactional(readOnly = true) // 읽기전용 트랜잭션
    public Member findMember(long memberId) {
      return findVerifiedMember(memberId)l
    }
    
    ...
  }
  ```
  
  - AOP 방식을 이용해서 비즈니스 로직에서 아예 트랜잭션 적용 코드 자체를 감추는 방식
  
  ```java
  @Configuration
  @RequiredArgsConstructor
  public class TxConfig {
    private final TransactionManager transactionManager;
  
    @Bean
    public TransactionInterceptor txAdvice() {
        NameMatchTransactionAttributeSource txAttributeSource =
                                    new NameMatchTransactionAttributeSource();
  
        RuleBasedTransactionAttribute txAttribute =
                                        new RuleBasedTransactionAttribute();
        txAttribute.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
  
        RuleBasedTransactionAttribute txFindAttribute =
                                        new RuleBasedTransactionAttribute();
        txFindAttribute.setPropagationBehavior(
                                        TransactionDefinition.PROPAGATION_REQUIRED);
        txFindAttribute.setReadOnly(true);
  
        Map<String, TransactionAttribute> txMethods = new HashMap<>();
        txMethods.put("find*", txFindAttribute);
        txMethods.put("*", txAttribute);
  
        txAttributeSource.setNameMap(txMethods);
        
        return new TransactionInterceptor(transactionManager, txAttributeSource);
    }
  
    @Bean
    public Advisor txAdvisor() {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression("execution(* com.codestates.coffee.service." +
                "CoffeeService.*(..))");
  
        return new DefaultPointcutAdvisor(pointcut, txAdvice());
    }
  }
  ```
  
### <span style='color: #2D3748; background-color: #98F6FF'>Transaction 특징</span>

- Transaction 설정

  - 조회 메서드에 @Transaction(readOnly = true)
  
    - JPA에서 commit이 호출 시, 영속성 컨텍스트 flush
    - 위와 같은 트랜잭션 설정을 해 두면 JPA 내부적으로 영속성 컨텍스트를 flush 하지 않음
    - 읽기 전용 트랜잭션일 경우, 변경 감지를 위한 스냅샷 생성도 진행 X
    - 조회 메서드에는 readonly 속성을 true로 지정해서 JPA가 자체적으로 성능 최적화 과정 거치도록 하는편이 좋음

- 여러 작업이 하나의 트랜잭션으로 묶이는 경우

- 트랜잭션 전파(Transaction Propagation) : 트랜잭션의 경계에서 진행 중인 트랜잭션이 존재할 때 또는 존재하지 않을 때, 어떻게 동작할 것인지 결정하는 방식
  - 트랜잭션 전파는 propagation 애트리뷰트로 설정
    - Propagation.REQUIRED : 진행 중인 트랜잭션이 없으면 새로 시작, 진행 중인 트랜잭션이 있으면 해당 트랜잭션에 참여(default)
    - Propagation.REQUIRES_NEW : 이미 진행중인 트랜잭션과 무관하게 새로운 트랜잭션이 시작, 기존 트랜잭션 중지
    - Propagation.MANDATORY : 진행 중인 트랜잭션이 없을 시 예외 발생
    - Propagation.NOT_SUPPORTED : 트랜잭션을 필요로 하지 않음, 기존 트랜잭션 중단
    - Propagation.NEVER : 트랜잭션을 필요로 하지 않음, 진행중인 트랜잭션 존재 시 예외 발생
  
- 트랜잭션 격리 레벨(Isolation Level) : 특정 트랜잭션이 다른 트랜잭션에서 변경/조회하는 데이터를 볼 수 있도록 허용할지 말지 결정하는 방식
  - 트랜잭션 격리 레벨은 isolation 애트리뷰트로 설정
    - Isolation.DEFAULT : DB 제공 기본값 (사용 권장)
    - Isolation.READ_UNCOMMITTED : 다른 트랜잭션에서 커밋하지 않은 데이터 읽기 허용 (정합성에 문제가 많아 사용하지 않을것을 권장)
    - Isolation.READ_COMMITTED : 다른 트랜잭션에 의해 커밋된 데이터 읽기 허용 (RDB에서 기본적으로 사용, 정합성 어긋나는 문제 존재)
    - Isolation.REPEATABLE_READ : 트랜잭션 내에서 한 번 조회한 데이터는 반복해서 조회해도 같은 데이터가 조회(MVCC 방식, 서버 처리 성능 저하)
    - Isolation.SERIALIZABLE : 동일 데이터에 대해 동시에 두 개 이상의 트랜잭션이 수행 불가(동시 처리 성늘 최하위, DB에서 거의 사용X)