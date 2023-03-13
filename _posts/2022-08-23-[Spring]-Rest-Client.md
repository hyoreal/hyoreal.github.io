---

layout: post

title: "[Spring] Rest Client "

comments: true

categories: [Spring]

tags: [Spring]

---

### Client와 Server의 관계

![img](https://blog.kakaocdn.net/dn/bXiIRl/btrUe9WEE0e/o1pXdWK3RXWgHyZ1MmnwQ1/img.png)

**Client 와 Frontend Server**

- 웹 브라우저는 웹 서버의 리소스(Resource, 자원)을 이용하는

   

  클라이언트

  - 웹 브라우저에서 보여지는 HTML 컨텐츠를 웹 서버에 요청
  - 웹 서버는 요청에 해당하는 컨텐츠를 웹 브라우저에 응답으로 전달

- 서버도 다른 서버로부터 리소스를 제공받아야 하는 경우 대다수 발생(Frontend Server와 Backend Server 관계)

**Frontend와 Backend**

- Frontend는 웹 브라우저에게는 리소스를 제공하니 서버가 맞지만 Frontend가 Backend에 동적인 데이터를 요청하게 되면

   

  Frontend가 Backend의 리소스를 이용하는 클라이언트

  이다

  - **클라이언트와 서버의 관계는 상대적**

- 클라이언트 앱을 만들기 위한 React, Angular 같은 자바스크립트 진영에서는 Backend 서버와 통신하기 위해 Axios 같은 라이브러리를 사용

**Backend와 Backend**

- Backend 쪽에서도 모든 작업을 하나의 서버에서 전부 처리하는 것이 아니라 Backend 서버 내부적으로 다른 서버에게 HTTP 요청을 전송해서 작업을 나누어 처리하는 경우 대다수
- Backend A가 Frontend에게 리소스를 제공해주기 때문에 서버 역할을 하지만 Backend B의 리소스를 이용하는 때 만큼은 Backend A도 클라이언트의 역할을 한다

> 어떤 서버가 HTTP 통신을 통해서 다른 서버의 리소스를 이용한다면 그 때만큼은 클라이언트의 역할을 한다

------

### Rest Client

- Rest Client
  - Rest API 서버에 HTTP 요청을 보낼 수 있는 클라이언트 툴 또는 라이브러리
  - UI가 갖춰진 Rest Client : Postman
- Java에서 사용할 수 있는 HTTP Client 라이브러리
  - java.net.HttpURLConnection
  - Apache HttpComponents
  - OkHttp 3
  - Netty 등

------

### RestTemplate

- Spring 에서 Java에서 사용 할 수 있는 HTTP Client 라이브러리 중 하나를 이용하여 원격지에 있는 다른 Backend 서버에 HTTP 요청을 보낼 수 있는 🔗**[RestTemplate](https://docs.spring.io/spring-framework/docs/current/javadoc-api/)** 이라는 Rest Client API 제공
- Template 의미
  - 파워포인트 템플릿처럼 RestTemplate이라는 템플릿 클래스를 이용하여 HTTP Client 라이브러리 중 하나를 유연하게 사용할 수 있다

**RestTemplate Apache HttpComponents 전달 예시**

```java
dependencies {
    ...
    ...
    implementation 'org.apache.httpcomponents:httpclient'
}
```

- Apache HttpComponents 사용 시 build.gradle에 의존 라이브러리 추가

------



```java
public class RestClientExample01 {
    public static void main(String[] args) {
        RestTemplate restTemplate =
                new RestTemplate(new HttpComponentsClientHttpRequestFactory());

        UriComponents uriComponents = 
                UriComponentsBuilder
                        .newInstance()
                        .scheme("http")
                        .host("worldtimeapi.org")
                        .port(80)
                        .path("/api/timezone/{continents}/{city}")
                        .encode()
                        .build();
        URI uri = uriComponents.expend("Asia", "Seoul").toUri();

        String result = restTemplate.getForObject(uri, String.class);

        System.out.println(result);
    }
}
```

- RestTemplate 객체 생성 후 RestTemplate 생성자 파라미터로 HTTP Client 라이브러리 구현 객체 전달
- HTTP Request를 전송할 Rest 엔드 포인트의 URI지정
  - 위 코드는 `UriComponentsBuilder` 클래스를 이용하여 `UriComponents` 객체 생성하여 HTTP Tequest를 요청할 엔드포인트 URI 생성
- Rest 엔드포인트로 Request 전송

------

- UriComponentsBuilder 클래스 제공 API 메서드 기능

  | Methods       | 기능                                                         |
  | ------------- | ------------------------------------------------------------ |
  | newInstance() | UriComponentsBuilder 객체 생성                               |
  | scheme()      | [🔗URI scheme](https://en.wikipedia.org/wiki/List_of_URI_schemes) 설정 |
  | host()        | host 정보 입력                                               |
  | port()        | 포트번호 지정(디폴트값 80)                                   |
  | path()        | URI 경로 지정                                                |
  | encode()      | URI에 사용된 템플릿 변수 🔗[인코딩](https://ko.wikipedia.org/wiki/퍼센트_인코딩) |
  | build()       | UriComponents 객체 생성                                      |

------

- UriComponents API 메서드 기능

  | Methods  | 기능                                |
  | -------- | ----------------------------------- |
  | expend() | 입력값을 URI 템플릿 변수값으로 대체 |
  | toUri()  | URI 객체 생성                       |