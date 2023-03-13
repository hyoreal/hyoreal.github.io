---

layout: post

title: "[Spring WebFlux] Project Reactor"

comments: true

categories: [Spring, WebFlux]

tags: [Spring, WebFlux]

---

### <span style='color: #2D3748; background-color: #ffdce0'>Reactor</span>

- [🔗Reactor](https://projectreactor.io/)
  - 리액티브 스트림즈 표준 사양을 구현한 구현체 중 하나
  - Spring 5 버전부터 지원하는 리액티브 스택에 포함
    - 리액티브 애플리케이션 동작에 있어 핵심적 역할을 하는 리액티브 프로그래밍을 위한 라이브러리
  
- Reactor 특징

 1. Reactor는 Reactive Streams를 구현한 리액티브 라이브러리
    </br>
 2. Non-Blocking은 리액티브 프로그래밍의 핵심적 특징
    - Reactor도 완전한 Non-Blocking 통신 지원
    - Non-Blocking : 요청 쓰레드가 차단되지 않음
    </br>
 3. Reactor는 Publicher 타입
 - Reactor 제공 Publisher
    - Mono[0|1] : 0건 또는 1건의 데이터를 emit 가능
    - Flux[N] : 여러 건의 데이터를 emit 가능
    </br>  
 4. Non-Blocking 통신을 지원하는 Reactor는 MSA 구조에 적합한 라이브러리
    - MSA(Microservice Architecture) 기반 애플리케이션들은 Blocking 통신을 사용하기에는 무리
      - 서비스들간의 통신이 잦으므로 요청 쓰레드가 차단되면 안됨
    </br>
5. Reactor는 **Backpressure** 전략을 잘 지원해줌
-  [🔗Backpressure](https://projectreactor.io/docs/core/release/reference/#reactive.backpressure)
   - Subscriber의 처리 속도가 Publihser의 emit 속도를 따라가지 못할 때 적절하게 제어하는 전략
   
      - 리액티브 프로그래밍은 끊임없이 들어오는 데이터를 적절하게 처리해야함
      - Publisher에서 들어오는 데이터 emit에 비해 Subscriber의 처리속도가 느리면 처리되지 않은 대기 데이터가 지속적으로 쌓이게됨
      - 처리되지 않은 대기 데이터가 쌓이는 것을 방치하게되면 오버플로우 발생
        - 시스템 다운 가능성도 존재
        
### <span style='color: #2D3748; background-color: #ffdce0'>Marble Diagram</span>

![](https://velog.velcdn.com/images/hyoreal51/post/a866be86-1163-4a1a-85e1-3104abeabc0e/image.jpg)

- Marble Diagram

  - 시간의 흐름에 따라 변화하는 데이터의 흐름을 표현한 다이어그램
  - 구슬모양의 알록달록한 동그라미는 하나의 데이터를 의미
  - Reactor 제공 Operator의 내부동작을 이해하는데에 도움
  - Operator를 적절하게 사용하는데에 도움
  - [🔗Marble Diagram](https://projectreactor.io/docs/core/release/reference/#howtoReadMarbles)
  
### <span style='color: #2D3748; background-color: #ffdce0'>Scheduler</span>

- [🔗Scheduler](https://projectreactor.io/docs/core/release/reference/#schedulers)
  - Thread를 관리하는 관리자 역할
  - Reactor의 Scheduler는 복잡한 멀티쓰레딩 프로세스를 단순하게 해줌
    - Reactor Sequence 상에서 처리되는 동작들의 하나 이상의 쓰레드에서 동작하도록 별도의 쓰레드를 제공해줌
    - Non-Blocking 통신을 위해 여러 쓰레드를 손쉽게 관리해주기 때문에 Reactor에서 굉장히 중요함
  
- Scheduler 전용 Operator

  - `subscribeON()` 
    - 데이터 소스에서 데이터를 emit하는 원본 Publisher의 실행 쓰레드를 지정하는 역할
    - 구독 직 후 실행되는 **Operator 체인의 실행 쓰레드**를 지정한 쓰레드로 변경
    - ex) subscribeOn(Schedulers.boundedElastic())
    - 실제로 Schedulers.boundedElastic()를 자주 사용함
    - 여러번 추가해도 한번만 생성
    
  - `doOnSubscribe()`
    - 구독 발생 직 후에 트리거 되는 Operator
    - 구독 직 후 수행하고싶은 동작 작성
    
  - `publichOn()`
    - 전달 받은 데이터를 가공 처리하는 Operator 앞에 추가해서 실행 쓰레드를 별도로 추가하는 역할
    - 추가할 때 마다 추가한 publishOn()을 기준으로 **Downstream쪽 쓰레드**가 지정한 쓰레드로 변경
    - ex) publishOn(Schedulers.parallel())
    
  - `doOnNext()`
    - 바로 앞에 위치한 Operator가 실행될 때 트리거 되는 Operator

- 구독 직 후의 실행 쓰레드와 Operator 체인마다 실행 쓰레드를 구분한 이유
  - Spring WebFlux 기반의 애플리케이션은 적은 수의 쓰레드로 대량의 요청을 Non-Blocking 방식으로 처리할 수 있는 구조
  - 쓰레드가 직접 복잡한 계산을 수행할 경우에는 응답 처리 시간이 늦어짐
    - 복잡한 계산이 필요한 작업의 경우 서버 엔진에서 생성하는 요청 처리 쓰레드가 응답 지연이 발생하지 않도록 별도의 쓰레드가 필요
  - Scheduler를 통해 별도의 쓰레드를 생성한 후, 복잡한 계산을 수행시켜서 응답 지연이 발생하지 않도록 함
  
- [🔗Scheduler 지원 쓰레드 유형](https://spring.io/blog/2019/12/13/flight-of-the-flux-3-hopping-threads-and-schedulers)

### <span style='color: #2D3748; background-color: #ffdce0'>종류별 Operators</span>

- [🔗토리맘의 한글라이즈 프로젝트 Reactor](https://godekdls.github.io/Reactor%20Core/appendixawhichoperatordoineed/#:~:text=%EC%97%90%EA%B2%8C%20Flux%20%EB%A9%80%ED%8B%B0%EC%BA%90%EC%8A%A4%ED%8A%B8%ED%95%98%EA%B8%B0-,A.1.%20Creating%20a%20New%20Sequence%E2%80%A6,-%EC%86%8C%EC%8A%A4%EB%8A%94%20%EC%9E%88%EA%B3%A0%2C)