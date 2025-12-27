---

layout: post

title: "[Spring] JDBC "

comments: true

categories: [Spring, JPA]

tags: [Spring, JDBC, Database]

---

### JDBC

**JDBC(Java Database Connectivity)**

- Java에서 제공하는 표준 사양(또는 명세, Specification)
- Java 기반 애플리케이션의 코드 레벨에서 사용하는 데이터를 데이터 베이스에 저장 및 업데이트 하거나 데이터베이스에 저장된 데이터를 Java 코드레벨에서 사용하게 해줌

------

**JDBC 동작 흐름**

![img](https://blog.kakaocdn.net/dn/dcCfvA/btrUbqkPx5A/OVpfmCKjkK4MqOlddZLzE0/img.png)

------

**JDBC 드라이버를 먼저 로딩한 후에 데이터베이스와 연결**

- JDBC 드라이버는 데이터베이스와의 통신을 담당하는 인터페이스
- JDBC 드라이버의 구현체를 이용해서 특정 벤더의 데이터베이스에 액세스 가능
- Oracle, MS SQL, MySQL 같은 다양한 벤더에서는 해당 벤더에 맞는 JDBC 드라이버 구현하여 제공

------

**JDBC API 사용 흐름**

**1. JDBC 드라이버 로딩**

- 사용하고자 하는 JDBC 드라이버 로딩. JDBC 드라이버는 DriverManager라는 클래스를 통해 로딩

**2. Connection 객체 생성**

- JDBC 드라이버가 정상적으로 로딩 되면 DriverManager를 통해 데이터베이스와 연결되는 세션인 Connection 객체 생성

**3. Statement 객체 생성**

- Statement 객체는 작성된 SQL 쿼리문을 실행하기 위한 객체로써 객체 생성 후 정적 SQL 쿼리 문자열을 입력으로 가짐

**4. Query 실행**

- 생성된 Statement 객체를 이용하여 입력한 SQL 쿼리 실행

**5. ResultSet 객체로부터 데이터 조회**

- 실행된 SQL 쿼리문에 대한 결과 데이터 셋

**6. ResultSrt 객체 Close, Statement 객체 Close, Connection 객체 Close**

- JDBC API 통해 사용된 객체들은 사용 이후 사용한 순서의 역순으로 Close를 해주어야함

------

**Connection Pool**

![img](https://blog.kakaocdn.net/dn/bFIh26/btrUa4bdys6/4j3FqMxveWNky6G4YHrlAk/img.png)



- JDBC API 사용하여 DB와 연결을 위한 Connection 객체 생성작업은 비용이 많이 듦
- 애플리케이션 로딩 시점에 미리 Connection 객체 생성 → 애플리케이션에서 DB 연결이 필요할 경우 만들어둔 Connection 객체 사용으로 애플리케이션 성능 향상
- Conection Pool : DB Connection 을 미리 만들어 보관하고 필요 시 제공하는 역할을 하는 관리자
- Spring Boot 2.0 부터는 성능면에서 더 나은 이점을 가지고 있는 🔗[HikariCP](https://github.com/brettwooldridge/HikariCP)를 기본 DBCP로 채택

------

### 데이터 엑세스 기술

**대표적 데이터 엑세스 기술**

- mybatis, Spring JDBC, Spring Data JDBC, Spring Data JPA 등

**SQL 중심 기술**

- mybatis, Spring JDBC
- 애플리케이션에서 데이터베이스에 접근하기 위해 SQL 쿼리문을 애플리케이션 내부에 직접적으로 작성하는 것이 중심이 되는 기술

------

**mybatis의 SQL Mapper 예시**

```sql
<select id="findMember" resultType="Member">
   SELECT * FROM MEMBER WHERE member_id = #{memberId}
</select>
```

- SQL Mapper에서 SQL 쿼리문을 직접적으로 작성
- 작성된 SQL 쿼리문을 기반, DB의 특정 테이블에서 데이터 조회 후 Java 객체로 변환해 주는 것이 mybatis의 대표적인 기술적 특징

------

**Spring JDBC의 JdbcTemplate 사용 예시**

```java
Member member = this.jdbcTemplate.queryForObject(
                 "select * from member where member_id=?", 1, Member.class);
```

- Java 코드에 SQL 쿼리문이 직접적으로 포함
- Java 진영에서는 SQL 중심의 기술에서 객체(Object) 중심의 기술로 지속적으로 이전을 하고 있는 추세

------

**객체(Object) 중심 기술**

- 데이터를 SQL 쿼리문 위주로 생각하는 것이 아니라 모든 데이터를 객체(Object) 관점으로 바라보는 기술
- 애플리케이션 내부에서 이 Java 객체(Object)를 SQL 쿼리문으로 자동 변환 한 후에 데이터베이스의 테이블에 접근
- ORM(Object-Relational Mapping) : 객체(Object) 중심의 데이터 액세스 기술
- Java에서 대표적인 ORM 기술 : JPA(Java Persistence API)

------

### Spring Data JDBC

Spring Data JDBC

- JPA처럼 ORM 기술을 사용하지만 JPA의 기술적 복잡도를 낮춘 기술
- Spring Data JDBC vs JPA vs Spring Data JPA
  - 결론 = 다 배워야 한다
  - Spring Data JDBC : 애플리케이션의 규모가 상대적으로 크지 않고, 복잡하지 않을 경우 뛰어난 생산성 기대
  - JPA : 실무에서 가장 많이 사용하고 있는 기술
  - Spring Data JPA : Spring에서 JPA 기술을 편리하게 사용하기 위한 기술

------

### Spring Data JDBC 사전 준비

의존 라이브러리 추가

```java
dependencies {
		...
		...
		implementation 'org.springframework.boot:spring-boot-starter-data-jdbc'
		runtimeOnly 'com.h2database:h2'
}
```

- 개발 환경에서 손쉽게 사용할 수 있는 인메모리(In-memory) DB **H2**사용
  - 인메모리(In-memory) DB
    - 메모리 안에 데이터를 저장하는 데이터베이스
    - 애플리케이션이 실행되는 동안에만 데이터를 저장
    - 테스트에 필요한 데이터 이외에 나머지 쓸데없는 데이터는 테이블에 없는 것이 테스트의 정확도 면에서 유리하기 때문에 사용
    - 로컬 개발 환경에서는 인메모리(In-memory) DB 권장

------

application.yml 파일에 H2 Browser 활성화 설정 추가

```yaml
spring:
  h2:
    console:
      enabled: true  # h2 기본 설정
      path: /h2   # Context path 설정
    datasource:
      url: jdbc:h2:mem:test  # JDBC URL 설정
```