---

layout: post

title: "[Spring] JPA "

comments: true

categories: [Spring]

tags: [Spring]

---

### JPA

**[🔗JPA](https://en.wikipedia.org/wiki/Jakarta_Persistence)(Java Persistence API/Jakarta Persistence API)**

- Java 진영에서 사용하는 ORM(Object-Relational Mapping) 기술의 표준 사양(또는 명세, Specification)
- Java의 인터페이스로 사양이 정의되어 있기 때문에 JPA라는 표준 사양을 구현한 구현체는 따로 있다는 것을 의미
- 구현체 :  🔗[Hibernate ORM](https://docs.jboss.org/hibernate/orm/6.0/javadocs/), EclipseLink, DataNucleus 등
  - Hibernate ORM은 JPA에서 정의해둔 인터페이스를 구현한 구현체
  - JPA에서 지원하는 기능 이외에 Hibernate 자체적으로 사용 API 역시 지원

------

### 데이터 액세스 계층 JPA 위치

![img](https://blog.kakaocdn.net/dn/cLkasj/btrUceEvsRV/KGqrzKKoiZW0di4cfwlDr1/img.png)

- JPA는 데이터 엑세스 계층의 상단에 위치
- 데이터 저장, 조회 등의 작업은 JPA를 거쳐 Hibernate ORM을 통해 이뤄짐
- Hibernate ORM은 내부적으로 JDBC API를 이용하여 데이터베이스에 접근

------

### Persistence

J**P**A 의 **P** (Persistence)

- Persistence : 영속성, 지속성
  - 무언가를 금방 사라지지 않고 오래 지속되게 한다

**영속성 컨텍스트(Persistence Context)**

![img](https://blog.kakaocdn.net/dn/ddU6QV/btrUgSTVoVR/Sw8XA9twnUe6yWzM7BYMEk/img.png)

- ORM : 객체(Object)와 DB 테이블의 매핑을 통해 엔티티 클래스 객체 안에 포함된 정보를 테이블에 저장하는 기술
- 영속성 컨텍스트 : 테이블과 매핑되는 엔티티 객체 정보
  - 엔티티 정보는 데이터베이스 테이블에 데이터를 저장, 수정, 조회, 삭제에 사용
- 1차 캐시 : JPA에서 엔티티 정보를 저장하는 곳
- 쓰기 지연 SQL 저장소 : DB에 보내지 않은 Query를 저장한 곳

------

### JPA  API

**build.gradle 의존 라이브러리 추가**

```java
dependencies {
      implementation 'org.springframework.boot:spring-boot-starter-data-jpa' 
      ...
}
```

------

**JPA 설정(application.yml)**

🔗[ddl-auto](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.data-initialization.using-hibernate) : 엔티티 테이블 자동 생성

```yaml
spring:
h2:
console:
  enabled: true
  path: /h2     
datasource:
url: jdbc:h2:mem:test
jpa:
hibernate:
  ddl-auto: create  # (1) 스키마 자동 생성
show-sql: true      # (2) SQL 쿼리 출력
```

------

샘플 코드 실행 위한 Config 예시

```java
@Configuration
public class JpaBasicConfig {
    private EntityManager em;
    private EntityTransaction tx;
    
    @Bean
    public CommandLineRunner testJpaBasicRunner(EntityManagerFactory emFactory) {
        this.em = emFactory.createEntityManager();
        this.tx = em.getTransaction();
        
        return args -> {
            tx.begin();
            Member member = new Member("hgd@gmail.com");
            
            em.persist(member);
            
            tx.commit();
            
            Member resultMember = em.find(Member.class, 1L);
            
            System.out.println("Id: " + resultMember.getMemberId() +
                          ", email: " + resultMember.getMemberEmail());
    }
}
```

------

JPA  API Methods

| Method            | 설명                                                         |
| ----------------- | ------------------------------------------------------------ |
| em                | EntityManager. EntityManagerFactory에서 createEntityManager 메서드 통해 가져온다 |
| tx                | EntityTransaction. EntityManager에서 getTransaction 메서드 통새 가져온다 |
| tx.begin()        | Transaction 실행 위한 메서드                                 |
| em.persist()      | 영속성 컨텍스트에 엔티티 저장                                |
| tx.commit()       | 메서드 호출 시 영속성 컨텍스트에 저장되어있는 객체를 DB에 적용 |
| em.flush()        | tx.commit() 메서드 호출 시 JPA 내부적으로 호출되어 영속성 컨텍스트 변경내용을 DB에 반영 |
| em.find(.class, ) | 영속성 컨텍스트에서 데이터 조회                              |