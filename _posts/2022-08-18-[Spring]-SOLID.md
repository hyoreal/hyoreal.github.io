---

layout: post

title: "[Spring] SOLID "

comments: true

categories: [Spring]

tags: [Spring, SOLID, Design Pattern]

---

### SOLID

- SOLID (객체 지향 설계 원칙) 
  - 로버트 마틴이 명명한 객체지향 프로그래밍 및 설계의 다섯가지 기본 원칙을 마이클 페더스가 두문자어 기억술로 소개한 것
  - 유지보수에 쉽고, 유연하고, 확장이 쉬운 시스템을 만들 수 있다

------

- `S` 

  단일 책임 원칙(SRP, Single Responsibility Principle)

  - '모든 클래스, 클래스가 제공하는 기능들은 단 하나의 책임만을 가지며 클래스는 그 책임을 완전히 캡슐화해야한다' 는 원칙
  - SRP를 지키지 않았을때
    - 응집력 ↓, 결합도 ↑
    - 사용하지 않는 기능이 포함됨
    - 변수 레벨 : 하나의 속성이 여러 의미를 가지는 경우
    - 메서드 레벨 : if 문이 많을 경우
  - SRP를 잘 지킬때
    - 응집력 ↑, 결합도 ↓
    - 코드 가독성 좋아짐
    - 테스트 범위가 작아짐(유지보수 편리)
  - 높은 응집력
    - 비슷한 일을 하는 기능들이 잘 뭉쳐있음을 의미
  - 낮은 결합도
    - 클래스간의 의존성이 낮음을 의미
    - 하나의 클래스 수정 시, 의존하는 다른 클래스들을 모두 수정해야한다면 높은 결합도를 갖고있음을 알 수 있다

------

- `O` 

  개방-폐쇄 원칙 (OCP, Open/Closed Principle)

  - "확장에는 열려있고, 변경에는 닫혀있어야한다"는 원칙
    - 시스템의 구조를 리팩토링하여 수정 시 하나의 모듈만 수정하도록 함
    - 동작하던 코드를 변경하지 않고, 기존 코드에 새로운 코드를 추가함으로써 기능의 추가나 변경이 가능하도록 함
  - OCP를 지키지 않으면
    - 객체지향프로그래밍의 유연성, 재사용성, 유지보수성 등을 얻을 수 없다

------

- `L`

   

  리스코브 치환 원칙 (LSP, The Liskov Substitution Principle)

  - "subclass의 객체는 superclass의 참조변수에 대입해서 superclass의 역할을 수행하는데에 문제가 없어야한다"는 원칙

------

- `I`

   

  인터페이스 분리의 원칙 (ISP, Interface Segregation Principle)

  - 인터페이스의 단일 책임을 위한 원칙
  - 하나의 일반적인 인터페이스를 더 구체적인 인터페이스로 나눔으로써 클라이언트가 꼭 필요한 메서드들만 이용할 수 있도록 함

------

- `D`

   

  의존성 역전의 법칙 (DIP, Dependency Inversion Principle)

  - 자주 변경되는 구체 클래스에 의존하지 않고, 추상화된 클래스에 의존하는 것을 의미

> 참고자료
> [위키백과 SOLID](https://ko.wikipedia.org/wiki/SOLID_(객체_지향_설계))
> [itvillage](https://itvillage.tistory.com/entry/객체지향-설계-원칙-SOLID-원칙)