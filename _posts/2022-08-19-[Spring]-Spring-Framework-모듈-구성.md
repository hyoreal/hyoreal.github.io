---

layout: post

title: "[Spring] Spring 모듈 구성 "

comments: true

categories: [Spring]

tags: [Spring, Framework, Module]

---

### 아키텍처(Architecture)

- 아키텍처(Architecture)
  - 건축 분야에서 유래된 용어로, 요구 사항을 만족하는 건축물을 짓는데 있어 청사진 같은 역할
  - 너무 복잡하지 않고, 최대한 심플함을 유지해야함
- 시스템 아키텍처(System Architecture)
  - 하드웨어, 소프트웨어를 모두 포함하는 어떤 시스템의 전체적인 구성을 큰그림으로 표현한 것
  - 시스템 아키텍처를 통해 기본적으로 해당 시스템이 어떤 하드웨어로 구성되고, 어떤 소프트웨어를 사용하는지를 대략적으로 알 수 있다
  - 시스템 구성 요소들 간의 상호작용이 어떻게 이루어지는지, 시스템이 정상적으로 동작하기위한 동작 원리 등 시스템 아키텍처 안에 표현이 되면 이해 당사자들이 해당 아키텍처를 이해하는데 도움

------

**시스템 아키텍처 사례**



![img](https://blog.kakaocdn.net/dn/xZUTE/btrT1Hs9FcM/i2kkKS7lrcadw3sT1LpZOk/img.png)



 

- 채팅 서버를 구축하기 위한 전통적인 시스템 아키텍처
  - 사용자의 요청을 단일 서버가 모두 처리하기 때문에 제한적인 사용자 요청만 처리
  - 시스템 확장에 대한 부분이 전혀 고려 X
  - 웹소켓 서버가 단일 서버이기 때문에 해당 서버가 다운되면 시스템 전체가 죽게되는 문제 발생
  - 이를 보완하여 시스템 아키텍처를 만듦

------

**소프트웨어 아키텍처**

![img](https://blog.kakaocdn.net/dn/sglNq/btrT0TtH9fK/ZKQReZAkzTuxrtABDoDp0K/img.png)

- 소프트웨어의 구성을 큰 그림으로 표현한 것이 소프트웨어 아키텍처
- 소프트웨어 아키텍처를 통해 어떤 기술들을 지원하고 어떤 기능들을 사용할 수 있는지 등을 큰 그림으로 접근 가능
- [🔗소프트웨어 아키텍처 유형](https://infomoon.tistory.com/11)
- 소프트웨어 아키텍처의 대표적 사례 Java 플랫폼 아키텍처

------

**웹 애플리케이션 아키텍처**

![img](https://blog.kakaocdn.net/dn/CkHUR/btrTWMBPrZt/Fx2Chcca6yqwojiCMU2YU0/img.png)

- API 계층(API Layer)
  - 클라이언트의 요청을 받아들이는 계층
  - 일반적으로 표현 계층(Presentation Layer)라고도 불리지만 REST API를 제공하는 경우 API 계층이라고 표현
- 서비스 계층(Service Layer)
  - API 계층에서 전달 받은 요청을 업무 도메인의 요구 사항에 맞게 비즈니스적으로 처리하는 계층
  - 도메인(Domain)
    - 주로 비즈니스적인 어떤 업무 영역과 관련
    - 도메인 지식(Domain Knowledge)들을 서비스 계층에서 비즈니스 로직으로 구현 해야하는 것
  - 데이터 액세스 계층(Data Access Layer)
    - 비즈니스 계층에서 처리된 데이터를 데이터베이스 등의 데이터 저장소에 저장/호출위한 계층



![img](https://blog.kakaocdn.net/dn/Ca3gY/btrTZzITLXw/KjpmpEyDxXVKViXimfnP10/img.png)



------

### 아키텍처로 보는 Spring Framework Module 구성

- Spring Framework에서 지원하는 모듈들을 아키텍처로 표현한 것
- 모듈(Module)
  - 지원되는 여러가지 기능들을 목적에 맞게 그룹화 하여 묶어 놓은 것
  - 재사용 가능하도록 라이브러리 형태로 제공되는 경우가 많음
- [🔗Spring Framework](https://docs.spring.io/spring-framework/docs/5.0.0.M5/spring-framework-reference/html/overview.html)

![img](https://blog.kakaocdn.net/dn/cyTHxg/btrT4rXzG0U/2ms2dMQnX2gpneEeW6wmoK/img.png)