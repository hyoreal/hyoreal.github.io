---

layout: post

title: "[Spring] Http Headers "

comments: true

categories: [Spring, MVC]

tags: [Spring, HTTP, Headers]

---

### <span style='color: #2D3748; background-color: #ffdce0'>HTTP Header</span>

- HTTP

  - HTML 등의 문서를 전송하는 Application Layer 프로토콜
  - Header와 Body로 구성
  
- HTTP Header

  - HTTP 메시지(Messages)의 구성 요소 중 하나
  - 클라이언트의 요청이나 서버의 응답에 포함되어 부가적인 정보를 HTTP 메시지에 포함시켜준다
  
- HTTP Header 대표적 예시

  - 클라이언트와 서버의 관점에서 내부적으로 가장 많이 사용되는 헤더 정보로 `Content-Type`이 있다
  
  - Content-Type
    
    - 클라이언트와 서버가 주고 받는 HTTP 메시지 바디(body, 본문)의 데이터 형식이 무엇인지를 알려주는 역할
    
  - Authorization
  
    - 클라이언트가 적절한 자격 증명을 가지고 있는지 확인하기 위한 정보
    - REST API 기반 애플리케이션 경우 클라이언트와 서버 간의 로그인(사용자 ID/비밀번호) 인증에 통과한 클라이언트들은 'Authorization' 헤더 정보를 기준으로 인증에 통과한 클라이언트가 맞는지 확인하는 절차를 가짐
    - 인증(Authentication) : 회원가입, 로그인. 클라이언트가 누구인지 확인하는 절차
    - 인가(Authorization) : 클라이언트에 대한 권한을 허락하는 것
    
  - User-Agent
  
    - 모바일 에이전트에서 들어오는 요청인지 모바일 이외에 다른 에이전트에서 들어오는 요청인지를 구분해서 처리
    

------

### <span style='color: #2D3748; background-color: #FFA198'>Spring MVC 에서 HTTP Request Header 정보 얻기</span>

- `@RequestHeader`로 개별 헤더 정보 받기
  ```java
  @RestController
  @RequestMapping(path = "/v1/coffees")
  public class CoffeeController {
    @PostMapping
    public ResponseEntity postCoffee(@RequestHeader("user-agent") String userAgent,
                                     @RequestParam("korName") String korName,
                                     @RequestParam("engName") String engName,
                                     @RequestParam("price") int price) {
        System.out.println("user-agent: " + userAgent);
        return new ResponseEntity<>(new Coffee(korName, engName, price),
                HttpStatus.CREATED);
    }
  }
  ```
  
  ------
  
  
  
- @RequestHeader`로 전체 헤더 정보 받기
  
  ```java
  @RestController
  @RequestMapping(path = "/v1/members")
  public class MemberController {
    @PostMapping
    public ResponseEntity postMember(@RequestHeader Map<String, String> headers,
                                     @RequestParam("email") String email,
                                     @RequestParam("name") String name,
                                     @RequestParam("phone") String phone) {
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            System.out.println("key: " + entry.getKey() +
                    ", value: " + entry.getValue());
        }
  
        return new ResponseEntity<>(new Member(email, name, phone),
                HttpStatus.CREATED);
    }
  }
  ```
  
  ------
  
  
  
- `HttpServletRequest` 객체로 헤더 정보 얻기
  
  ```java
  @RestController
  @RequestMapping(path = "/v1/orders")
  public class OrderController {
    @PostMapping
    public ResponseEntity postOrder(HttpServletRequest httpServletRequest,
                                    @RequestParam("memberId") long memberId,
                                    @RequestParam("coffeeId") long coffeeId) {
        System.out.println("user-agent: " + httpServletRequest.getHeader("user-agent"));
  
        return new ResponseEntity<>(new Order(memberId, coffeeId),
                HttpStatus.CREATED);
    }
  }
  ```
  - HttpServletRequest 이용 시, Request 헤더 정보에 다양한 방법으로 접근 가능
  - HttpServletRequest는 다양한 API를 지원하지만 단순히 특정 헤더 정보에 접근하고자 한다면 `@RequestHeader`를 이용하는 편이 더 용이
  - 저수준(Low Level)의 서블릿 API를 사용할 수 있기때문에 복잡한 HTTP Request/Response를 처리하는데 사용
------



- `HttpEntity` 객체로 헤더 정보 얻기
  ```java
  @RestController
  @RequestMapping(path = "/v1/coffees")
  public class CoffeeController{
    @GetMapping
    public ResponseEntity getCoffees(HttpEntity httpEntity) {
        for(Map.Entry<String, List<String>> entry : httpEntity.getHeaders().entrySet()){
            System.out.println("key: " + entry.getKey()
                    + ", " + "value: " + entry.getValue());
        }
  
        System.out.println("host: " + httpEntity.getHeaders().getHost());
        return null;
    }
  }
  ```
  - Request 헤더와 바디 정보를 래핑하고있음
  - 조금 더 쉽게 헤더와 바디에 접근할 수 있는 다양한 API를 지원
  - Entry 를 통해서 각각의 헤더 정보에 접근 가능
  - 자주 사용될 만한 헤더 정보들을 getXXXX()로 얻을 수 있다
    - getHost() 메서드를 통해서 host 정보를 확인
    

------



### <span style='color: #2D3748; background-color: #FFB798'>Spring MVC 에서 HTTP Response Header 정보 추가</span>

- `ResponseEntity`와 `HttpHeaders` 를 이용해 헤더 정보 추가
  - Spring에서 지원하는 고수준(High Level) API로써 간단한 HTTP Request/Response 처리를 빠르게 진행
  ```java
  @RestController
  @RequestMapping(path = "/v1/members")
  public class MemberController{
    @PostMapping
    public ResponseEntity postMember(@RequestParam("email") String email,
                                     @RequestParam("name") String name,
                                     @RequestParam("phone") String phone) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-Geo-Location", "Korea,Seoul");
  
        return new ResponseEntity<>(new Member(email, name, phone), headers,
                HttpStatus.CREATED);
    }
  }
  ```
  
  
  
- `HttpServletResponse` 객체로 헤더 정보 추가
  
  - 저수준(Low Level)의 서블릿 API를 사용할 수 있기때문에 복잡한 HTTP Request/Response를 처리하는데 사용
  ```java
  @RestController
  @RequestMapping(path = "/v1/members")
  public class MemberController{
    @GetMapping
    public ResponseEntity getMembers(HttpServletResponse response) {
        response.addHeader("Client-Geo-Location", "Korea,Seoul");
  
        return null;
    }
  }
  ```
  
- 커스텀 헤더(Custom Header) 사용

  - HTTP Request에 기본적으로 포함되어 있는 헤더 정보는 개발자가 컨트롤 해야 될 경우가 많지 않음
  - 커스텀 헤더를 종종 추가해서 부가적인 정보를 전달하는 경우
  
- 커스텀 헤더 네이밍(Naming)

  - 2012년 이 전에는 커스텀 헤더에 ‘X-’라는 Prefix를 추가하는 것이 관례
    - 이 관례는 문제점이 발생할 가능성이 높아서 더 이상 사용X.(Deprecated)
  - 헤더를 사용하는 측에서 헤더의 목적을 쉽게 이용할 수 있도록 대시(-)를 기준으로 의미가 명확한 용어를 사용 권장
    - 대시(-)를 기준으로 각 단어의 첫 글자를 대문자로 작성하는 것이 관례
    - Spring에서 Request 헤더 정보를 확인할 때, 대/소문자를 구분X.