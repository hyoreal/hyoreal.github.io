---

layout: post

title: "[Spring WebFlux] Reactive Programming"

comments: true

categories: [Spring, WebFlux]

tags: [Spring, WebFlux]

---

### <span style='color: #2D3748; background-color: #ffdce0'>Reactive System</span>

- Reactive : 반응을 하는, 반응을 보이는

- Reactive System

  - Reactive System을 이용하는 **클라이언트의 요청에 반응을 잘 하는 시스템**
  - 클라이언트의 요청에 대한 응답 대기 시간을 최소화 할 수 있도록 Non-Blocking 하여 클라이언트에게 즉각적으로 반응하도록 구성된 시스템
  - Non-Blocking : Request thread가 차단되지 않게 함
  - 🔗[Blocking / Non-Blocking 정리](https://velog.io/@hyoreal51/%EC%BD%94%EB%93%9C%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%B8%A0-%EB%B0%B1%EC%97%94%EB%93%9C-30%EC%9D%BC%EC%B0%A8-HTTP#:~:text=%EB%B8%94%EB%A1%9C%ED%82%B9%20/%20%EB%85%BC%EB%B8%94%EB%A1%9C%ED%82%B9%2C%20%EB%8F%99%EA%B8%B0%20/%20%EB%B9%84%EB%8F%99%EA%B8%B0)
  - Reactive System에서의 Message Driven(메세지 기반 통신)은 Non-Blocking 통신과 유기적인 관계를 맺음
  
- Reactive System 설계원칙

  ![](https://velog.velcdn.com/images/hyoreal51/post/7a0dd758-6d7c-4386-8f55-6ee5ab50ad9f/image.png)
  >참고 자료 : https://www.reactivemanifesto.org/
  
  - MEANS : 리액티브 시스템에서 사용하는 커뮤니케이션 수단
    - Message Driven : 리액티브 시스템에서는 메세지 기반 통신으로 여러 시스템 간에 느슨한 결합 유지
    
  - FORM : 메세지 기반 통신을 통해 리액티브 시스템이 형성되는 어떤 특징을 가진 구조
    - Elastic : 시스템으로 들어오는 요청량의 양과 무관하게 일정한 응답성 유지
    - Resillient : 시스템 일부 장애 발생하더라도 응답성 유지
    
  - VALUE : 리액티브 시스템 핵심 가치가 무엇인지 표현하는 영역
    - Responsive : 클라이언트의 요청에 즉각적으로 응답할 수 있어야함
    - Maintainable : 클라이언트의 요청에 대한 즉각적 응답이 지속가능해야함
    - Extensible : 클라이언트의 요청에 대한 처리량을 자동 확장/축소 가능해야함
    
### <span style='color: #2D3748; background-color: #ffdce0'>Reactive Programming</span>

- Reactive Programming

  - 리액티브 시스템에서 사용되는 프로그래밍 모델
  - Non-Blocking 통신을 위한 프로그래밍 모델

- Reactive Programming 특징

  - declarative programming paradigm
    - 선언형 프로그래밍 방식을 사용하는 대표적 프로그래밍 모델
    
  - data streams and the propagation of change
    - data streams : 지속적으로 데이터가 입력으로 들어올 수 있음
    - 데이터가 지속적으로 발생하는 것 자체가 데이터에 어떤 변경이 발생하는 것
    - 변경 자체를 이벤트로 간주, 이벤트 발생 시 마다 데이터 지속 전달
    
  - automatic propagation of the changed data flow
    - data streams and the propagation of change와 같은 의미
    - 지속 발생 데이터를 하나의 데이터 플로우로 보고 데이터 자동으로 전달
  
- [🔗Reactive Streams : 리액티브 프로그래밍을 위한 표준 사양(or 명세, Specification)](https://github.com/reactive-streams/reactive-streams-jvm)
### <span style='color: #2D3748; background-color: #ffdce0'>Reactive Streams Component</span>

- Publisher
  ```java
  public interface Publisher<T> {
      public void subscribe(Subscriber<? super T> s);
  }
  ```
  - 데이터 소스로부터 데이터를 내보내는 역할 (emit 한다)
  - subscribe() 추상메서드를 포함하고 있음
    - subscribe() : Publicher가 내보내는 데이터 수신 여부를 결정하는 구독 의미
    - subscribe()가 호출되지 않으면 emit 프로세스 동작 X
    - subscribe()의 파라미터로 받는 Subscriber가 Publicher로부터 내보내진 데이터를 소비함
  
- Subscriber
  ```java
  public interface Subscriber<T> {
      public void onSubscribe(Subscription s);
      public void onNext(T t);
      public void onError(Throwable t);
      public void onComplete();
  }
  ```
  - Publisher로부터 내보내진 데이터 소비 역할
  - 4개의 추상메서드
    - onSubscribe(Subscription s) : 구독 시작 시점에 호출, onSubscribe() 내에서 Publisher에세 요청할 데이터 개수 지정 및 구독 해지 처리 가능
    - onNext(T t) : Publisher가 데이터 emit할 때 호출, emit된 데이터를 전달받아 소비
    - onError(Throwable t) : Publisher로부터 emit된 데이터가 Subscriber에게 전달하는 과정에서 에러 발생 시 호출
    - onComplete() : Publisher가 데이터 emit하는 과정이 종료면 호출, emit 정상 완료 후 처리할 작업 있을 시 onComplete()내에서 수행 가능
  
- Subscription
  ```java
  public interface Subscription {
      public void request(long n);
      public void cancel();
  }
  ```
  - Subscriber의 구독 자체를 표현한 인터페이스
  - request(long n) : Publisher가 emit하는 데이터 개수 요청
  - cancel() : 구독 해지 역할, 구독 해지 발생 시 Publisher는 데이터 emit을 하지않음
  
- Processor
  ```java
  public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {
  }
  ```
  - Subscriber 인터페이스와 Publisher 인터페이스를 상속
  - Publisher와 Subscriber의 역할을 동시에 할 수 있음
  - 별도 구현할 추상 메서드는 없음
  
### <span style='color: #2D3748; background-color: #ffdce0'>Reactive Streams 구현체</span>

- Project Reactor(Reactor)
  - Reactive Streams를 구현한 대표 구현체
  - Spring과 궁합이 가장 잘 맞는 리액티브 스트림 구현체
  - Spring 5의 리액티브 스택에 포함되어있음
  - Spring Reactive Application 구현에 있어 핵심 역할
  
- RxJava
  - Rx는 Reactive Extension의 줄임특정 언어에서 리액티브 스트림즈를 구현한 별도의 구현체가 존재한다는 의미
  - .Net 기반의 리액티브 라이브러리를 넷플릭스에서 Java 언어로 포팅한 JVM 기반 리액티브 확장 라이브러리
  - 2.0부터 리액티브 스트림 표준 사양을 준수하고 있음
    - 이 전 버전의 컴포넌트와 함께 혼용되어 사용
  
- Java Flow API
  - 리액티브 스트림즈 표준 사양을 Java 안에 포함시킨 구조
  - 리액티브 스트림즈 사양을 구현한 여러 구현체들에 대한 SPI 역할
  
- 기타 🔗[리액티브 확장](https://reactivex.io/)(Reactive Extension)
  - 특정 언어 앞에 `Rx`가 붙으면 특정 언어에서 리액티브 스트림즈를 구현한 별도 구현체가 존재한다는 의미
  - 다양한 프로그래밍 언어에서 리액티브 스트림즈를 구현한 리액티브 확장(Reactive Extension) 라이브러리를 제공 중임
  - 대표적 리액티브 확장 라이브러리
    - RxJava
    - RxJS
    - RxAndroid
    - RxKotlin
    - RxPython
    - RxScala
    
### <span style='color: #2D3748; background-color: #ffdce0'>Reactive Programming 용어</span>

- Publisher : 데이터를 내보내는 주체 (ex. Mono, Flux 등)

- Emit : Publisher가 데이터를 내보내는 것

- Subscriber : Publisher가 emit한 데이터를 전달 받아 소비하는 주체

- Subscribe : 구독

- Signal : Publisher가 발생시키는 이벤트

- Operator : 어떤 동작을 수행하는 메서드
  - ex. fromIterator(), filter(), reduce() 등등
  
- Sequence : Operator 체인으로 표현되는 데이터의 흐름

- Upstream : 특정 Operator를 기준으로 위쪽의 Sequence 일부

- Downstream : 특정 Operator를 기준으로 아래 쪽 Sequence 일부

> _심화_
> 선언형 프로그래밍
> https://www.techtarget.com/searchitoperations/definition/declarative-programming
> https://en.wikipedia.org/wiki/Declarative_programming