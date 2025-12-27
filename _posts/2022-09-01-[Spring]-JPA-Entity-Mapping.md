---

layout: post

title: "[Spring] JPA Entity Mapping "

comments: true

categories: [Spring, JPA]

tags: [Spring, JPA, Entity]

---

### Entity와 Table 간의 Mapping

매핑 예시

```java
@NoArgsConstructor
@Getter
@Setter
@Entity(name = "ORDERS")
public class Order {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private long orderId;

   @Enumerated(EnumType.STRING)
   private OrderStatus orderStatus = OrderStatus.ORDER_REQUEST;

   @Column(nullable = false)
   private LocalDateTime createdAt = LocalDateTime.now();

   @Column(nullable = false, name = "LAST_MODIFIED_AT")
   private LocalDateTime modifiedAt = LocalDateTime.now();

   public enum OrderStatus {
      ORDER_REQUEST(1, "주문 요청"),
      ORDER_CONFIRM(2, "주문 확정"),
      ORDER_COMPLETE(3, "주문 완료"),
      ORDER_CANCEL(4, "주문 취소");

      @Getter
      private int stepNumber;

      @Getter
      private String stepDescription;

      OrderStatus(int stepNumber, String stepDescription) {
          this.stepNumber = stepNumber;
          this.stepDescription = stepDescription;
      }
   }  
}
```



**엔티티 매핑 관련 애너테이션 모음**

| Annotation               | Attribute                                    | 설명                                                         |
| ------------------------ | -------------------------------------------- | ------------------------------------------------------------ |
| @NoArgsConstructor(필수) | -                                            | 매개변수가 없는 생성자 자동 생성                             |
| @AllArgsConstructor      | -                                            | 매개변수가 있는 생성자 자동 생성                             |
| @Getter                  | -                                            | getter 자동 생성                                             |
| @Setter                  | -                                            | setter 자동 생성                                             |
| @Entity (필수)           | name : Entity 이름 설정(default: 클래스명)   | JPA 관리 대상 Entity 지정(DB Table과 매핑)                   |
| @Table (선택)            | name : DB Table 이름 설정(default: 클래스명) | DB Table 이름 설정                                           |
| @Id (필수)               | -                                            | 해당 field를 DB의 기본키(Primary Key, PK) 지정               |
| @GeneratedValue          | strategy : 기본키 생성 전략                  | 기본키 자동 생성 지원(없을 시 수동 지정)                     |
| ∥                        | strategy = GenerationType.IDENTITY           | 기본키 생성을 DB가 대신 해줌(commit 여부 상관 X. persist 실행 시 INSERT 실행 후 PK 가져옴) |
| ∥                        | strategy = GenerationType.SEQUENCE           | DB 제공 시퀀스 사용하여 기본키 생성                          |
| ∥                        | strategy = GenerationType.AUTO               | JPA가 DB의 🔗[Dialect](https://docs.jboss.org/hibernate/orm/5.6/userguide/html_single/Hibernate_User_Guide.html#database-dialect)에 따라 적절한 전략을 자동 선택 |
| @Column (선택)           | 지정하지 않을 시 default값으로 매핑          | 필드와 컬럼 매핑                                             |
| ∥                        | name                                         | Table 컬럼 이름 지정하여 컬럼 생성                           |
| ∥                        | nullable                                     | null 허용 여부 (default : true). 원시타입 적용 시 false 지정해야 에러 방지 |
| ∥                        | updatable                                    | 컬럼 데이터 수정 가능 여부 (default : false)                 |
| ∥                        | unique                                       | 중복 제한 조건 (default : false)                             |
| ∥                        | length                                       | 문자열 길이 제한 (default : 255)                             |
| @Transient               | -                                            | Table Column 매핑 X(임시 데이터 용도)                        |
| @Enumerated              | EnumType.___                                 | enum 타입과 매핑 시 사용                                     |
| ∥                        | EnumType.STRING                              | enum 이름을 DB 저장                                          |
| ∥                        | EnumType.ORDINAL                             | enum 순서를 테이블에 저장(순서가 뒤바뀔 가능성 있으므로 사용 자제) |

------

### 연관관계 매핑

**연관관계 매핑** : 엔티티 클래스 간의 관계를 만들어주는 것

**JPA에서의 연관관계 매핑** : Entity가 Entity를 참조하는 것

------

**연관 관계 종류**

- **단방향 연관 관계** : 한쪽 클래스만 다른 쪽 클래스의 참조 정보를 가지고 있는 관계
- **양방향 연관 관계** : 양쪽 클래스가 서로의 참조 정보를 가지고 있는 관계
- JPA는 단방향 연관 관계와 양방향 연관 관계를 모두 지원
- Spring Data JDBC는 단방향 연관 관계만 지원

------

**1:N (1<N)**

- 일대다 단방향 연관 관계
  - 1에 해당하는 클래스가 N에 해당하는 객체를 참조할 수 있는 관계
  - 일대다 중에서 ‘다’에 해당하는 테이블에서 ‘일’에 해당하는 테이블의 기본키를 외래키로 가짐
- 다대일 연관 관계
  - N에 해당하는 클래스가 1에 해당하는 객체를 참조할 수 있는 관계
  - 다대일 단방향 매핑은 테이블 간의 관계처럼 자연스러운 매핑 방식
    - JPA의 엔티티 연관 관계 중에서 가장 기본으로 사용

**다대일 단방향 연관관계 예시**

```java
@NoArgsConstructor
@Getter
@Setter
@Entity(name = "ORDERS")
public class Order {

  ...

  @ManyToOne // 다대일 관계 명시
  @JoinColumn(name = "MEMBER_ID")
  private Member member;

  public void addMember(Member member) {
      this.member = member;
  }
  
  ...
  
}
```

- 다대일 단방향 연관관계 매핑
  - @JoinColumn(name = )
    - DB에서 정보가 저장될 entity에 사용("다"에 해당하는 테이블)
    - name은 해당 테이블에서 외래키에 해당하는 컬럼명을 적어준다("일"에 해당하는 테이블의 기본키 이름)



**일대다 매핑 추가한 다대일 양방향 매핑 예시**

```java
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Member {
  
  ...
  @OneToMany(mappedBy = "member")
  private List<Order> orders = new ArrayList<>();
  
  ...
}
```

- 다대일 매핑에 일대다 매핑을 추가하여 양방향 관계 생성
  - @OneToMany(mappedBy = )
    - 일대다 단방향 매핑 경우 mappedBy 애트리뷰트 값 필요 x
    - mappedBy는 참조할 대상 필요



```
The field that owns the relationship. 
Required unless the relationship is unidirectional.
```

- 위 글은 mappedBy에 있는 주석
- 즉, **mappedBy의 값은 "다"에 해당하는 테이블 클래스에서 외래키의 역할을 하는 필드**를 적어주어야 한다

------

**N:N (N<>N)**

- 다대다 연관관계
- 다대다 사이를 이어주는 테이블을 만들어 다대일대다 연관관계로 만들어 구현
- @ManyToMany를 사용해도 구현이 가능하지만 권장하지않는다

**다대다 연관관계 매핑 예시**

```java
// N : 1 : N

public class Order { // N
  ...
  
  @OneToMany(mappedBy = "order")
  private List<OrderCoffee> orderCoffees = new ArrayList<>();
  
  ...
}

public class OrderCoffee { // 1
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long orderCoffeeId;
  
  @ManyToOne
  @JoinColumn(name = "ORDER_ID")
  private Order order;
  
  @ManyToOne
  @JoinColumn(name = "COFFEE_ID")
  private Coffee coffee;
  
  @Column(nullable = false)
  private Integer quantity;
}

public class Coffee { // N
  ...
  
  @OneToMany(mappedBy = "coffee")
  private List<OrderCoffee> orderCoffees = new ArrayList<>();
  
  ...
}
```

------

**1:1 (1-1)**

- 일대일 연관관계
- @OneToOne 애너테이션을 이용하여 구현
- 기본키를 갖는 테이블에 @JoinColumn(name = )
- 외래키를 갖는 테이블에 @OneToOne(mappedBy = )

**일대일 연관관계 매핑 예시**

```java
public class Member {
  @Id
  @GeneratedValue(strategy = GenerationType.TDENTITY)
  private long memberId;

  ...
  
  @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
  private Stamp stamp;
}

public class Stamp {
  ...
  
  @OneToOne
  @JoinColumn(name = "MEMBER_ID")
  private Member member;
}
```

------

- [🔗Entity Class 연관관계](https://docs.jboss.org/hibernate/orm/5.6/userguide/html_single/Hibernate_User_Guide.html#associations)
- [🔗JPA FETCH](https://docs.jboss.org/hibernate/orm/5.6/userguide/html_single/Hibernate_User_Guide.html#fetching)
- [🔗JPA CASCADE﻿](https://docs.jboss.org/hibernate/orm/5.6/userguide/html_single/Hibernate_User_Guide.html#pc-cascade)