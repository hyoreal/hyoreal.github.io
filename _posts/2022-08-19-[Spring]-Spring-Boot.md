---

layout: post

title: "[Spring] Spring Boot "

comments: true

categories: [Spring, Boot]

tags: [Spring, Spring Boot, AutoConfiguration]

---

### Spring Boot

- Spring Boot
  - Spring Framework : 엔터프라이즈 애플리케이션을 개발하기 위한 핵심 기능을 제공하는 Spring Project 중 하나
  - Spring Boot
    - Spring Framework의 편리함에도 불구, Spring 설정의 복잡함으로 인해 Spring 기반 애플리케이션 개발 시작 전부터 생겨난 문제점을 해결하기 위해 생겨난 Spring Project 중 하나
- Spring Boot 을 사용해야 하는 이유
  - XML 기반의 복잡한 설계 방식 지양
    - Spring 애플리케이션 개발을 위한 설정은 굉장히 복잡
    - Spring Boot으로 인해 개발자는 Spring의 복잡한 설정에 대한 어려움에서 해방
  - 의존 라이브러리의 자동 관리
    - 애플리케이션에서 필요한 라이브러리를 사용하기 위해서는 필요한 라이브러리의 이름과 버전을 일일이 추가
    - 이로 인해 라이브러리 간의 버전 불일치로 인한 빌드 및 실행 오류 역시 빈번하게 발생
    - Spring Boot의 starter 모듈 구성 기능을 통해 의존 라이브러리를 수동으로 설정해야 하는 불편함에서 해방
  - 애플리케이션 설정의 자동 구성
    - Spring Boot은 스타터(Starter) 모듈을 통해 설치되는 의존 라이브러리를 기반으로 애플리케이션 설정 자동 구성
    - 자동 구성 활성화 위한 애너테이션 `@SpringBootApplication`
  - 프로덕션 급 애플리케이션의 손쉬운 빌드
    - 애플리케이션 구현 코드를 쉽게 빌드하여 직접 빌드 결과물을 War 파일 형태로 WAS(Web Application Server)에 올릴 필요 X
    - WAS(Web Application Server)
      - 구현된 코드를 빌드해서 나온 결과물을 실제 웹 애플리케이션으로 실행되게 해주는 서버
  - 내장된 WAS를 통한 손쉬운 배포
    - Apache Tomcat이라는 WAS를 내장하고 있기때문에 별도의 WAS를 구축 필요 X
    - `java -jar <jar 파일명>.jar` 명령어 통해 애플리케이션 손쉬운 실행 가능