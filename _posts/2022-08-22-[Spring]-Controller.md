---

layout: post

title: "[Spring] Controller "

comments: true

categories: [Spring, MVC]

tags: [Spring, MVC, Controller]

---

### 패키지 구조 생성

Spring Boot 기반의 애플리케이션에서 주로 사용되는 Java 패키지 구조

- 기능 기반 패키지 구조(package-by-feature)
- 계층 기반 패키지 구조(package-by-layer)
- 테스트와 리팩토링이 용이하고, 향후 마이크로 서비스 시스템으로 분리가 상대적으로 용이한 **기능 기반 패키지 구조 사용 권장**

기능 기반 패키지 구조(package-by-feature)

- 애플리케이션의 패키지를 애플리케이션에서 구현해야 하는 기능을 기준으로 패키지를 구성하는 것
- 하나의 패키지 안에는 하나의 기능을 완성하기 위한 계층별 클래스들이 모여있다
  - 각각의 패키지 안에 레이어 별 클래스들이 존재한다

계층 기반 패키지 구조(package-by-layer)

- 패키지를 하나의 계층으로 보고 클래스들을 계층 별로 묶어서 관리하는 구조

------

### 패키지 기능 구조

> Client ↔ Controller ↔ Service ↔ Repository(DAO) ↔ DB

Entity

- DB 테이블에 존재하는 Column들을 필드로 가지는 순수 데이터 객체(1-1 관계)
- `@Entity` : Entity 클래스임을 명시
- `@Id` : DB테이블에서의 Primary Key지정 (id Column)
- `@Column` : Column에 기능 추가 가능(Unique, Not Null 등)

Controller

- 요청/응답 관리 계층
- API와 통신

Service

- 비즈니스 로직 수행
- DAO를 통해 DB 접근하여 데이터 관리

DTO(Data Transfer Object)

- 데이터 이동 위한 객체
- Controller, Service, Repository 계층 사이에 데이터가 오갈 때 DTO 형태로 이동
- 일반적으로 Getter/Setter 메서드만 가짐
  - Setter보단 생성자를 사용하여 값을 할당하는 게 더 좋음

DTO 사용 이유

- View Layer와 DB Layer 역할 분리
- Entity 객체 보존 위해
- 도메인 모델링을 지키기 위해

DAO(Data Access Object)

- DB에 접근하는 객체
- Service와 실제 DB를 연결하는 역할
- JPA 경우 Repository가 DAO역할을 함. (둘이 같은것은 아님)

------

### Controller 설계

1. 클라이언트로부터 발생할 요청 고민
2. Rest API 기반의 애플리케이션에서는 애플리케이션이 제공해야 될 가능을 리소스(
   Resource, 자원)으로 분류
3. 리소스에 해당하는 Controller 클래스 작성
4. 컨트롤러 별 CRUD 작업 진행

------

### Entrypoint

- `main()` 메서드가 포함된 애플리케이션의 엔트리포인트(Entrypoint, 애플리케이션 시작점) 작성

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Section3Week1Application {
  public static voic main(String[] args) {
    SpringApplication.run(Section3Week1Application.class, args);
  }
}
```

- Spring Intializr를 통해 생성한 프로젝트에는 엔트리포인트가 이미 작성되어있음
- @SpringBootADpplication
  - 자동 구성 활성화
  - 애플리케이션 패키지 내 `@Component` 가 붙은 클래스 검색(scan), Spring Bean 등록 기능 활성화
  - `@Configuration`이 붙은 클래스 자동 검색, 추가적 Spring Bean 등록 기능 활성화
- SpringApplication.run(Section3Week1Application.class, args);
  - Spring 애플리케이션을 부트스트랩하고 실행한다
  - 부트스트랩(Bootstrap) : 애플리케이션 실행 전 여러 설정 작업을 수행하여 실행 가능한 애플리케이션으로 만드는 단계

------

### Controller 구조 작성

```java
  @RestController
  @RequestMapping("/v1/members)
  public class MemberController {
    @PostMapping
    public ResponseEntity postMember(@RequestParam("email") String email,
                                     @RequestParam("name") String name,
                                     @RequestParam("phone") String phone)
      System.out.println("# email: " + email);
      System.out.println("# name: " + name);
      System.out.println("# phone: " + phone);

      String response =
              "{\"" + 
                "email\":\""+email+"\"," +
                "\"name\":\""+name+"\",\"" +
                "phone\":\""+phone+
              "\"}";

      return response;
    }

    @GetMapping("/{member-id}")
    public String getMember(@PathVariable("member-id") long memberId) {
        System.out.println("# memberId: " + memberId);

        // not implementation
        return null;
    }
  }
```

- @RestController
  - @Controller + @ResponseBody
    - `@Controller` : 주로 View를 반환하기 위해 사용
    - `@ResponseBody` : View 페이지가 아닌 반환값 그대로 클라이언트에게 반환
  - 해당 클레스가 REST API의 리소스(Resource, 자원)을 처리하기 위한 API 엔드포인트로 동작함을 정의
  - 애플리케이션 로딩 시, Spring Bean으로 등록해줌
  - JSON 형태로 객체 데이터 반환
- `@RequestMapping`

```java
@RequestMapping(value = "/v1/members", produces = {MediaType.APPLICATION_JSON_VALUE})
```

- 클라이언트 요청과 클라이언트 요청을 처리하는 핸들러 메서드(Handler Method)를 매핑해주는 역할
- 클래스 레벨에 추가하여 클래스 전체에 사용되는 공통 URL 설정
- produces : 응답 데이터를 어떤 미디어 타입으로 클라이언트에게 전송할 지를 설정
  - `MediaType.APPLICATION_JSON_VALUE` : JSON 형식의 데이터를 응답 데이터로 전송하겠다는 의미
  - `@____Mapping`
- 요청받는 http의 메서드를 `___` 부분에 지정
  - POST : 요청마다 새로운 리소스 생성
  - PATCH : 수정
  - PUT : 요청마다 같은 리소스 반환 (멱등성)
  - GET : 데이터 변경 없이 조회
  - DELETE : 특정 데이터 제거 및 초기화
  - `@RequestParam`
- 쿼리 파라미터(Query Parameter 또는 Query String), 폼 데이터(form-data), x-www-form-urlencoded 형식으로 전송하면 서버쪽에서 전달 받음
  - `@PathVariable`
- 핸들러 메서드 중 하나
- 요청 URI에 데이터를 넣어 전달
  - `@RequestBody`
- JSON 형식의 데이터를 DTO 통해 받음

------

### REST API 핸들러 메서드

| Method Arguments | 설명                                                         |
| ---------------- | ------------------------------------------------------------ |
| @RequestParam    | 쿼리 파라미터, 폼 데이터 등의 서블렛 요청 파라미터를 바인딩할때 사용 |
| @RequestHeader   | Request Header를 바인딩하여 Header의 키/값에 접근 가능       |
| @RequestBody     | Request Body를 읽어 Java객체로 역직렬화                      |
| @RequestPart     | multipart/form-data 형식의 요청 데이터를 part별 바인딩하는데 도움 |
| @PathVariable    | @RequestMapping에 패턴 형식으로 정의된 URL 변수에 바인딩     |
| @MatrixVariable  | URL 경로 세그먼트 부분에 키/값 쌍으로 된 데이터에 바인딩     |
| HttpEntity       | request header, body에 접근할 수 있는 컨테이너 객체 사용 가능 |

 

------

### ResponseEntity

```java
@RestController
@RequestMapping("/v1/members")
public class MemberController {
    @PostMapping
    public ResponseEntity postMember(@RequestParam("email") String email,
                                     @RequestParam("name") String name,
                                     @RequestParam("phone") String phone) {
        Map<String, String> map = new HashMap<>();
        map.put("email", email);
        map.put("name", name);
        map.put("phone", phone);

        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }
}
```

- 클래스 레벨의 `@RequestMapping` 의 produces 애트리뷰트 생략됨
- JSON 문자열을 수작업으로 작성한 부분이 Map 객체로 대체
  - Map객체를 리턴하면 내부적으로 JSON형식으로 자동 변환 시킴
- 리턴부분이 ResponseEntity 객체 리턴으로 바뀜
  - ResponseEntity 객체로 응답 데이터를 래핑함으로써 조금 더 세련된 방식으로 응답 데이터를 생성
  - HTTP 응답 상태를 명시적으로 함께 전달하면 클라이언트의 요청을 서버가 어떻게 처리했는지를 쉽게 가늠
  - [🔗HTTP 응답 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)