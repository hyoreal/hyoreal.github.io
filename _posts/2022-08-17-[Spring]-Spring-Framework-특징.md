---

layout: post

title: "[Spring] Spring Framework 특징 "

comments: true

categories: [Spring]

tags: [Spring]

---

### Spring Framework의 특징

![img](https://velog.velcdn.com/images/hyoreal51/post/132ed578-b81e-4145-928c-ecda319bbdd7/image.png)

- Spring 삼각형
  - **POJO**라는 것은 Spring의 핵심 개념들인 IoC/DI, AOP, PSA를 통해 달성할 수 있다는 의미를 갖고있다

### POJO

- POJO(Plain Old Java Object) 프로그래밍
  - Plain Old : 순수 Java 객체
  - Java Object : 자바 객체(객체지향 프로그래밍)
  - POJO를 이용하여 프로그래밍 코드를 작성하는 것
  - POJO 프로그래밍을 효과적 적용 위한 주요 지식
    - JDK의 API에 대한 지식
    - 객체지향적인 사고방식
    - 설계를 위한 훈련이 우선



- POJO 프로그래밍의 규칙
  - Java나 Java 의 스펙에 정의된 것 외에는 다른 기술이나 규약에 얽매이지 않아야한다
  - 특정 환경에 종속적이지 않아야 한다
  - 객체지향적 원리에 충실



- POJO 프로그래밍 필요 이유
  - 특정 환경, 기술에 종속되지 않으면 재사용이 가능하고, 확장가능한 유연한 코드 작성 가능
  - 저수준 레벨의 기술과 환경에 종속적인 코드를 제거함으로써 코드가 깔끔해짐
  - 코드가 깔끔하기에 디버깅 용이
  - 특정 환경, 기술에 종속적이지 않아 테스트 단순화
  - **객체지향적인 설계를 제한없이 적용 가능**



- Spring에서 POJO를 위한 3가지 기술 지원
  - IoC/DI, AOP, PSA

------

### IoC/DI

- - IoC(Incersion of Control)
    - IoC(Incersion of Control) : 애플리케이션 흐름의 주도권이 뒤바뀐것
    - 서버 컨테이너 기술, 디자인 패턴, 객체 지향 설계 등에 적용하게 되는 일반적인 개념
    - [🔗Framework와 Library](https://velog.io/@hyoreal51/Spring-Spring-Framework-기본#:~:text=Framework에 있다.(-,IoC 제어의 역전,-))
    - 일반적인 애플리케이션 제어 흐름
      - main() 메서드 호출 → main()메서드 안에 개발자가 작성한 코드 순차적 실행 → main() 메서드 종료 → 애플리케이션 실행 종료
    - Java 웹 애플리케이션에서 IoC 적용 흐름
      - 서블릿 컨테이너에는 서블릿 사양(Specification)에 맞게 작성된 **서블릿 클래스**만 존재 (main() 메서드 X)
      - 클라이언트 요청이 들어올때마다 서블릿 컨테이너 내의 컨테이너 로직(service() 메서드)이 서블릿을 직접 실행시켜줌
        ⇒ 서블릿 컨테이너가 서블릿을 제어한다
      - 즉, 애플리케이션의 흐름 주도권이 서블릿 컨테이너에 있다(IoC 적용)



- DI(Dependency Injection)
  - DI(Dependency Injection) : IoC 개념을 구체화시킨 것
  - Spring이 제공하는 의존 관계 주입 기능
  - 생성자를 통해 어떤 클래스의 객체를 전달받는 것
  - 모듈 간 결합도 저하, 유연성 ↑
  - Interface를 사용하여 DI를 하면 다른 객체로의 수정이 쉬워짐
  - 가독성 ↑, 유지보수성 ↑, 코드 중복 제거 가능



- DI 필요성 : 클래스 내부에서 생성하는 특정 의존성 객체를 수정하게되면, 연결되어있는 모든 class를 수정해야함
- DI 구현 : 인터페이스 사용(Dependency Inversion Principle)하여 느슨한 결합(Loose Coupling)![img](https://velog.velcdn.com/images/hyoreal51/post/0b4d78a0-1269-4c42-8399-72e60c5906a6/image.png)
- stub : 메서드 호출 시, 미리 준비된 데이터 응답.(고정된 데이터)
  ⇒ 멱등성(idempotent) : 몇번을 호출해도 동일한 데이터 반환

------

### AOP

- AOP(Aspect Oriented Programming)
  - 관점 지향 프로그래밍
  - 애플리케이션의 핵심 업무 로직에서 로깅이나 보안, 트랜잭션, 모니터링, 트레이싱 등 같은 공통 기능 로직들을 분리하는 것



- 핵심 로직에서 공통기능 분리 이유?
  - 핵심 로직에 공통적인 기능의 코드들이 여기 저기 보이면 코드 자체가 복잡해짐
  - 버그 발생 가능성↑, 유지보수 어려움
  - 공통 기능들에 수정이 필요하게 되면 애플리케이션 전반에 적용되어 있는 공통 기능에 해당하는 코드를 일일이 수정해야함



- AOP 장점
  - 코드 간결성 유지
  - 객체지향 설계 원칙에 맞는 코드 구현
  - 코드의 재사용
  - 높은 응집도



- Transaction
  - 데이터를 처리하는 하나의 작업 단위
  - 두개의 데이터가 있을때 둘 다 제대로 동작하여 수행한 작업을 데이터베이스에 반영하거나(commit) 둘 중 하나라도 오류로 인해 제대로 동작하지 않았을 경우 두개 모두 실행 이전 상태로 돌리는 것(Rollback)

------

### PSA

- PSA(Portable Service Abstraction)

  - 추상화(Abstraction) : 어떤 클래스의 본질적인 특성만을 추출해서 '일반화' 하는 것
  - PSA : 추상화된 상위 클래스(인터페이스)를 일관되게 바라보며 하위 클래스의 기능을 사용하는 것

  ![img](https://velog.velcdn.com/images/hyoreal51/post/d719c9e5-e33d-4a23-9b7f-7d889b381e48/image.png)

- Portable Service Abstraction (일관된 서비스 추상화)

  - 서비스의 기능을 접근하는 방식 자체를 일관되게 유지하면서 기술 자체를 유연하게 사용할 수 있도록 하는 것



- PSA 필요 이유
  - 어떤 서비스 이용을 위한 접근 방식을 일관된 방식으로 유지함으로, 애플리케이션 사용 기술 변경 시에도 최소한의 변경으로 요구 사항을 반영하기 위함
  - 애플리케이션의 요구 사항 변경에 유연하게 대처