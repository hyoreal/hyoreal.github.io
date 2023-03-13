---

layout: post

title: "[Spring] Spring MVC "

comments: true

categories: [Spring]

tags: [Spring]

---

### Spring MVC

- Spring Web MVC
  - Spring Framework : Spring에서 지원하는 모든 기능들을 포함한 것
  - `spring-webmvc` : 서블릿(Servlet) API를 기반으로 클라이언트의 요청을 처리하는 모듈
  - Spring Web MVC를 줄여 Spring MVC라고 부름
  - Spring MVC는 클라이언트의 요청을 편리하게 처리해주는 프레임워크
  - Servlet : 클라이언트의 요청을 처리하도록 특정 규약에 맞추어서 Java 코드로 작성하는 클래스 파일
  - 아파치 톰캣 : 서블릿들이 웹 애플리케이션으로 실행이 되도록 해주는 서블릿 컨테이너(Servlet Container) 중 하나

------

### MVC

- Model
  - Model은 Spring **M**VC에서 M에 해당
  - 클라이언트에게 응답으로 돌려주는 작업의 처리 결과 데이터
  - 클라이언트의 요청사항을 구체적으로 처리하는 영역인 서비스 계층(Service Layer)
  - 실제로 요청사항을 처리하기 위해 Java 코드로 구현한 비즈니스 로직(Business Logic)
- View
  - View는 Spring M**V**C에서 V에 해당
  - Model 데이터를 이용하여 클라이언트 애플리케이션 화면에 보여지는 리소스(Resource) 제공 역할
  - View 의 형태
    - HTML 페이지 출력
      - 기본적인 HTML 태그로 구성된 페이지에 Model 데이터를 채워 넣은 후, 최종 HTML 페이지 제작 후 직접 렌더링하여 클라이언트 측에 전송
      - Spring MVC에서 지원하는 HTML 페이지 출력 기술
        - Thymeleaf, FreeMarker, JSP + JSTL, Tiles 등
    - PDF, Excel 등의 문서형태로 출력
      - Model 데이터를 가공하여 PDF문서나 Excel문서를 만들어 클라이언트 측에 전송
      - 문서 내 데이터가 동적으로 변경하여야 하는 경우 사용할 수 있음
    - XML, JSON 등 특정 형식의 포맷으로 변환
      - Model 데이터를 특정 프로토콜 형태로 변환 후 변환된 데이터를 클라이언트 측에 전송
      - [🔗JSON](https://ko.wikipedia.org/wiki/JSON)
      - 장점
        - 프론트엔드와 백엔드의 명확한 구분으로 개발 및 유지보수 용이
        - 프론트엔드 측에서 비동기 클라이언트 애플리케이션 개발 가능
- Controller
  - Controller는 Spring MV**C**에서 C에 해당
  - 클라이언트 측의 요청을 직접적으로 전달 받는 엔드포인트(Endpoint)
  - Model과 View의 중간에서 상호 작용을 해주는 역할
    - Model 데이터를 View로 전달
    - 내부적으로 Spring의 View가 전달 받아 JSON 포맷으로 변경 후, 클라이언트 측에 전달
- Spring MVC 동작 방식 / 구성 요소
  - Client 요청 데이터 전송 → Controller 요청 데이터 수신 → 비즈니스 로직 처리 → Model 데이터 생성 → Controller에게 Model 데이터 전달 → Controller가 View에게 Model 데이터 전달 → View 응답 데이터 생성

 



![img](https://blog.kakaocdn.net/dn/cBiqck/btrT1GOzaiX/heZCKPmo0s1va9AnyQCsXK/img.png)



- DispatcherServlet의 역할
  - 대부분의 Spring MVC 구성 요소들과 상호 작용
  - 실제 요청에 대한 처리는 다른 구성 요소들에게 위임(Delegate)
  - Front Controller Pattern : DispatcherServlet이 애플리케이션의 가장 앞에서 다른 구성요소들과 상호작용하며 클라이언트의 요청을 처리하는 패턴

------

### JSON

- JSON (JavaScript Object Notation)
  - Spring MVC에서 클라이언트 애플리케이션과 서버 애플리케이션이 주고 받는 데이터 형식
  - JSON 기본 포맷
    - `{"속성":"값"}`
- JSON 변형 방법 : GSON 라이브러리 사용

```java
public class JsonExample {
  public static void main(String[] args) {
    Coffee coffee = new Coffee("아메리카노", "Americano", 3000);
    Gson gson = new Gson();
    String jsonString = gson.toJson(coffee);
    
    System.out.println(jsonString);
  }
}
```