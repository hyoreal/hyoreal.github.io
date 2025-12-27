---

layout: post

title: "[Network] HTTPS"

comments: true

categories: [Network]

tags: [Network, HTTP]

---

### HTTP Messages

HTTP (HyperText Transfer Protocol)

- HTML과 같은 문서를 전송하기 위한 Application Layer 프로토콜.
- HTTP 특징 : Stateless(무상태성)

**HTTP Messages**

- 클라이언트와 서버 사이 데이터 교환 방식
  - 요청(Requests)
  - 응답(Responses)
- HTTP Messages는 여러 줄의 텍스트 정보로 구성
- 구성파일, API, 기타 인터페이스에서 자동 완성
  - 따로 작성할 필요 X

요청/응답 공통 구조

- start line : 요청이나 응답의 상태. 항상 첫줄 위치. 응답에서는 **status line**
- HTTP headers : 요청 지정 및 메세지 본문 설명하는 헤더 집합
- empty line : 헤더와 본문을 구분하는 빈 줄
- body : 요청 관련 데이터나 응답 관련 데이터 및 문서 포함. 요청과 응답 유형에 따라 선택적 사용
- start line과 HTTP headers을 묶어 요청이나 응답의 head, payload는 body라 함.

요청 : 클라이언트가 서버에 보내는 메세지

- start line

  1. 수행 작업(GET,PUT,POST 등)이나 방식(HEAD, OPTIONS)를 설명하는 HTTP methods를 나타냄
  2. 요청대상 또는 프로토콜, 포트, 도메인의 절대경로는 요청 컨텍스트에서 작성

  - 요청 형식 HTTP methods
    - origin : ? 와 쿼리 문자열이 붙는 절대경로. POST, GET, HEAD, OPTIONS 등의 메서드 사용
    - absolute : 완전한 URL 형식, 프록시 연결하는 경우 GET메서드와 사용
    - authority : 도메인 이름과 포트번호로 이뤄진 URL의 authority component. HTTP터널 구축 경우 CONNECT와 사용
    - asterisk : OPTIONS 와 함께 * 하나로 서버 전체 표현

  1. HTTP 버전에 따라 HTTP message의 구조 달라짐. 따라서 start line에 버전 함께 입력

- Headers : 헤더이름(대소문자 구분X 문자열), :, 값을 입력. 값은 헤더에 따라 다름

  - General headers : 메세지에 전체 적용 헤더, body통해 전송되는 데이터와 관련X 헤더
  - Request headers : fetch를 통해 가져올 리소스, 클라이언트 자체에 대한 자세한 정보를 포함하는 헤더. User-Agent, Accept-Type, Accept-LAnguage와 같은 헤더는 요청을 구체화. Referer 처럼 컨텍스트 제공, If-None처럼 조건에 따라 제약 추가 가능
  - Representation headers : body에 담긴 리소스의 정보(콘텐츠 길이, MIME타입 등)을 포함하는 헤더

- Body

  - Single-resource bodies(단일-리소스 본문) : 헤더 두개(Content-Type, Content-Length)로 정의된 단일 파일로 구성
  - Multiple-resource bodies(다중-리소스 본문) : 여러 파트로 구성된 본문에서는 각 파트마다 다른 정보 가짐. 보통 HTML form과 관련

응답

- Status line
  1. 현재 프로토콜 버전(HTTP/1.1)
  2. 상태 코드 - 요청 결과 (200, 302, 404 등)
  3. 상태 텍스트 - 상태코드에 대한 설명
- Headers
  - General headers : 메세지 전체 적용 헤더, body를 통해 전송되는 데이터와 관련없는 헤더
  - Response header : 위치, 서버 자체 정보(이름, 버전) 와 같이 응답에 대한 부가적인 정보 갖는 헤더, Vary, Accept-Ranges와 같이 상태줄넣기 공간부족했던 추가정보제공
  - Representation headers : body에 담긴 리소스 정보(콘텐츠 길이, MIME타입) 포함 헤더
- Body
  - Single-resource bodies
    - 길이가 알려진 단일 리소스 본문은 두개의 헤더(Content-Type, Content-Length)로 정의
    - 길이를 모르는 단일파일 구성 단일리소스본문은 Transfer-Encoding이 chunked로 설정, 파일은 chuck로 나뉘어 인코딩.
  - Multiple-resource bodies : 서로 다른 정보 담고있는 body

------

### Rest API

 API

- HTTP 프로토콜 기반으로 요청응답에 따라 리소스를 주고받기위한 *메뉴판* 필요
- 이 메뉴판 역할을 API가 하기 때문에 잘 알아볼수 있게끔 작성해야함.

**REST API**

- 웹에서 사용되는 데이터나 리소스를 HTTP URI로 표현하고 HTTP 프로토콜을 통해 요청과 응답을 정의
- 웹 애플리케이션은 HTTP 메서드를 통해 서버와 통신
- 통신 중 요청과 응답을 할 때 일종의 규약

Rest 구성

- RESOURCE(자원) - URI
- Verb(행위) - HTTP METHOD
- Representations(표현)

**REST 특징**

- 유니폼 인터페이스
  - URI로 지정한 리소스 조작을 통일, 한정적인 인터페이스로 수행하는 아키텍처 스타일
- Stateless : 무상태성.
- 캐싱(Cacheable)
  - HTTP의 기존 웹 표준을 사용하기 때문에 기존 인프라 활용
  - Last-Modified / E-Tag 태그를 이용해 캐싱 구현 가능
- 자체 표현 구조
  - REST API 메세지만 보고 쉽게 이해 가능
- Client - Server
  - 클라이언트는 사용자인증, 세션, 로그인정보 들을 직접관리하는 구조
  - 서버는 API 제공으로 명확히 구분되어있어 의존성이 줄어듦
- 계층 구조
  - REST 서버는 다중 계층 구조로 구성 가능
  - 보안, 암호화, 로드밸런싱 계층 추가로 구조상 유연성을 둘 수 있음
  - 게이트웨이 등과 같은 네트워크 기반의 중간매체를 사용할 수 있음

좋은 REST API

- REST API작성 시 규칙 존재
- 로이 필딩이 제시한 REST 방법론을 더 실용적으로 적용하기 위해 레오나르도 리차드슨은 REST 성숙도 모델을 만듦



![img](https://blog.kakaocdn.net/dn/b94lWm/btrVQn51vkB/fzZJ1K7YF5K4uPzN6kMTYK/img.png)

- REST 성숙도 모델
  - 0 ~ 3단계, 즉 4단계로 이루어짐
  - 3단계까지 지키기는 어렵기때문에 2단계까지만 적용하더라도 좋은 API



- 0단계
  - 단순히 HTTP 프로토콜만 사용해도 가능
  - 좋은 REST API를 작성하기 위한 기본 단계
  - 현재 엔드포인트 `/appointment` 

```json
// Request 요청
POST /appointment HTTP/1.1
[헤더 생략]
{
"date" : "2022-08-03",
"doctor" : "허준"
}
// Response 응답
HTTP/1.1 200 OK
[헤더 생략]
{
"slots" : [
{ "doctor" : "허준", "start" : "09:00", "end" : "12:00"},
{ "doctor" : "허준", "start" : "14:00", "end" : "18:00"}
]
}
```

------

- 1단계
  - 1단계에서는 개별 리소스와의 통신 준수
  - 모든 자원은 개별 리소스에 맞는 endpoint를 작성하고, 요청하고 받은 자원에 대한 정보를 응답으로 전달해야함
  - 요청하는 리소스가 무엇인지에 따라 다른 엔드포인트로 구분
  - 요청에 따른 응답으로 리소스를 전달할 때에도 사용한 리소스에 대한 정보와 함께 리소스 사용에 대한 성공 / 실패 여부를 반환해야함.



```json
//Request 요청
POST /doctors/허준 HTTP/1.1
[헤더 생략]
{
  "date" : "2022-08-03"
}
//Response 응답
HTTP/1.1 200 OK
[헤더 생략]
{
  "slots: [
    { "id" : 123, "doctor" : "허준", "start" : "09:00", "end" : "12:00"},
    { "id" : 456, "doctor" : "허준", "start" : "14:00", "end" : "18:00"}
  ]
}
```



------

- 2단계
  - CRUD에 맞게 적절한 HTTP 메서드를 사용하는 것에 중점
  - `GET`메서드는 body를 갖지않기때문에 query parameter을 사용하여 필요한 리소스 전달, 서버의 데이터를 변화시키지 않는 요청에 적합
  - `POST`메서드는 요청마다 새로운 리소스를 생성
  - `PUT`메서드는 요청마다 같은 리소스 반환, 🔗[멱등](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)한다.
  - `PUT`은 교체, `PATCH`는 수정

------

- 3단계
  - 마지막 단계는 HATEOAS(Hypertext As The Engine Of Application State)로 표현되는 하이퍼미디어 컨트롤 적용.
  - 요청은 2단계와 동일, 응답에는 리소스의 URI를 포함한 링크 요소를 삽입하여 작성.
  - 새로운 링크를 넣어 새로운 기능에 접근할 수 있도록 하는것이 3단계 중요 포인트
  - [🔗REST API 디자인 가이드](https://blog.restcase.com/5-basic-rest-api-design-guidelines/)
  - [🔗구글 API 작성 가이드](https://cloud.google.com/apis/design?hl=ko)
  - [🔗마이크로소프트 API 작성 가이드](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)

------

### Open API

- Open API
  - 누구에게나 열려있는 API이지만, 기관마다 정해진 이용수칙이 있고, 그 이용수칙에 따라 제한이 있을 수 있음
  - 정부제공 🔗[공공데이터](https://www.data.go.kr/)
  - [🔗날씨제공 Open API](https://openweathermap.org/api)
  - API를 이용하기 위해서는 API Key가 필요
  - API Key : 서버의 문을 여는 열쇠

------

### Blocking / Non-Blocking

![img](https://velog.velcdn.com/images/hyoreal51/post/cb3d75ad-9aae-4361-9a5e-e0ba75fa62ba/image.png)

1. 블로킹 (Blocking)
   1. A함수가 B함수를 호출하면, 제어권을 A가 호출함수 B에게 넘겨준다

------

![img](https://velog.velcdn.com/images/hyoreal51/post/60b90b8e-31f2-4b88-8c1c-65556e618d84/image.png)

1. 논블로킹 (Non-blocking)
   1. A함수가 B함수를 호출해도 제어권은 A가 갖고있는다

------

### Synchronous / Asynchronous

![img](https://velog.velcdn.com/images/hyoreal51/post/2dd5f29b-0105-47fb-b9c1-aa7b1f88a9c1/image.png)![img](https://velog.velcdn.com/images/hyoreal51/post/61b8b858-39e6-4c17-87a6-680fa43eaae9/image.png)

1. 동기 Synch
   - 함수 A가 함수 B를 호출한 후, 함수B의 리턴값을 계속 확인하는것

------

![img](https://velog.velcdn.com/images/hyoreal51/post/128992fa-a6d4-4f25-b786-c5ad185e43cf/image.png)

1. 비동기 Asynch
   - 함수 A가 함수B를 호출할때 콜백 함수를 함께 전달해서, 함수 B의 작업이 완료되면 함께 보낸 콜백함수를 실행한다
   - 함수A는 함수B를 호출한 후로 함수B의 작업완료여부에는 신경쓰지않는다

------

### Sync-Blocking / Sync-Nonblocking

![img](https://velog.velcdn.com/images/hyoreal51/post/fcfa707c-6eb1-421f-9a4b-9833911a96bf/image.png)

1. Sync-Blocking
   - 함수 A는 함수 B의 리턴값을 필요로함(동기)
   - 제어권을 함수 B에게 넘겨주고, 함수B가 실행 완료하고 리턴값과 제어권을 돌려줄때까지 기다림(블로킹)

------

![img](https://velog.velcdn.com/images/hyoreal51/post/d4b19b46-8e08-4dad-8087-c5883e3b8a16/image.png)

1. Sync-Nonblocking
   - A함수가 B함수를 호출할때 B에게 제어권을 주지 않고, A함수의 코드를 실행(논블로킹)
   - 그 때 A함수는 B함수의 리턴값이 필요하기 때문에 B함수가 실행을 완료했는지 계속 물어보며 상태를 파악한다(동기)

------

![img](https://velog.velcdn.com/images/hyoreal51/post/310ca065-26b8-41ab-be46-415d23b2f28f/image.png)

1. Async-Nonblocking
   - A함수가 B함수를 호출할때 제어권을 주지않고 A함수가 실행(논블로킹)
   - B함수를 호출할 때 콜백함수를 같이준다
   - B함수의 작업이 끝나면 A함수가 준 콜백함수를 실행한다(비동기)

------

![img](https://velog.velcdn.com/images/hyoreal51/post/d81840d7-6062-46b4-97e2-594a0b870881/image.png)

1. Async-Blocking
   - A함수는 B함수의 리턴값을 신경쓰지 않고 콜백함수를 보낸다(비동기)
   - 그런데 제어권도 함께 넘겨서 A함수는 B함수가 작업이 끝날때까지 기다린다

------

- 비동기-블로킹과 동기-블로킹은 성능차이가 거의 비슷해서 사용하는 경우는 별로 없다.