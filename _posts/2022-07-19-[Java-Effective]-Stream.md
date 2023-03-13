---

layout: post

title: "[Java-Effective] Stream / Optional "

comments: true

categories: [Java, Stream]

tags: [Java, Stream]

---

### Stream

스트림 (Stream)

- 배열, 컬렉션의 저장요소를 하나씩 참조하여 람다식으로 처리할 수 있도록 해주는 반복자
- List, Set, Map, 배열 등 다양한 데이터 소스로부터 만들 수 있다
- 데이터 소스를 다루는 풍부한 메서드 제공스트림의 특징
- 중간연산과 최종연산을 할 수 있다
- 선언형으로 데이터 소스를 처리
  - 선언형 프로그래밍 : "어떻게" 보단 "무엇을" 수행하는지에 관심을 두는 프로그래밍 패러다임
  - "어떻게"의 영역은 추상화 되어있다
  - 내부의 원리를 모르더라도 코드가 무슨 일을 하는 지 이해할 수 있다
- 람다식 요소처리 코드 제공
  - 람다식 또는 메서드 참조를 이용하여 요소 처리 내용을 매개값으로 전달할 수 있다
- 내부 반복자를 사용하므로 병렬 처리가 쉽다
  - 외부반복자(external iterator) : 개발자가 코드로 직접 컬렉션의 요소를 반복해서 가져오는 코드 패턴. for문, Iterator를 이용하는 while문 등
  - 내부반복자(internal iterator) : 컬렉션 내부에서 요소들을 반복시키고 개발자는 요소 당 처리해야할 코드만 제공하는 코드 패턴 (병렬 스트림)

![img](https://velog.velcdn.com/images/hyoreal51/post/2a867998-efbd-43dc-8529-7031ca5c4cbc/image.png)

```java
double ageAve = list.stream() // 오리지널 스트림
  .filter(m -> m.getGender() == Member.MALE) // 중간연산 스트림
  .mapToInt(Member::getAge) // 중간연산 스트림
  .average() // 최종연산
  .getAsDouble();
```

- 리덕션(Reduction) : 다량의 데이터를 가공해서 축소하는 것
- 파이프라인(pipelines) : 여러개의 스트림이 연결되어있는 구조
  - 최종연산을 제외하고는 모두 중간연산 스트림
  - 최종연산 메서드가 호출될때 중간연산이 실행되는 구조

------

스트림 생성

```java
  // list 생성
  List<String> list = Arrays.asList("a", "b", "c");
  // list로 stream 생성
  Stream<String> listStream = list.stream();
  // stream의 모든 요소 출력
  listStream.forEach(System.out::println);
  
  // 배열로부터 스트림 생성
  Stream<String> stream = Stream.of("a", "b", "c"); // 가변인자
  Stream<String> stream = Stream.of(new String[] {"a", "b", "c"});
  Stream<String> stream = Arrays.stream(new String[] {"a", "b", "c"});
  Stream<String> stream = Arrays.stream(new String[] {"a", "b", "c"}, 0, 3); // end 범위 미포함
  
  // 특수 종류 Stream 사용 (IntStream, LongStream, DoubleStream 등등)
  // 4 이상 10 미만의 수를 갖는 IntStream
  // IntStream 은 range() 함수를 사용하여 for문 대체 가능
  IntStream stream = IntStream.range(4, 10);
```

- 스트림은 데이터를 읽기만 할 뿐, 변경X
- 스트림은 한번 최종연산 실행하면 끝.(일회용)
- 필요하다면 새로운 스트림을 생성해야함
  - [🔗Stream<> Methods](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)
  - [🔗IntStream Methods](https://docs.oracle.com/javase/8/docs/api/java/util/stream/IntStream.html)

------

- Collection VS Stream 

  |                       | **Collection**                     | **Stream**                                       |
  | --------------------- | ---------------------------------- | ------------------------------------------------ |
  | 목적                  | 특정 자료구조를 통해 데이터를 저장 | 데이터 가공처리                                  |
  | 데이터 수정 가능 유무 | 데이터 추가/삭제 가능              | 데이터 추가/삭제 불가                            |
  | Iteration             | for문 등의 외부 반복자 사용        | operation 메서드 내부에서 보이지 않게 내부반복자 |
  | 탐색                  | 여러번 가능                        | 한번만 가능                                      |
  | 데이터 처리방식       | Eager                              | Lazy, Short-circuit                              |

  - Eager : 즉시 작업 수행
  - Lazy : 데이터 지연 (스트림은 최종연산 시작 전까지 지연됨)
  - Short-circuit : 단락 평가

- Optional< T >

  - NullPointerException(NPE), 즉 null 값으로 인한 에러 발생 현상을 객체 차원에서 효율적으로 방지하고자 도입
  - 연산 결과를 Optional에 담아 반환하면, 따로 조건문을 작성해주지 않아도 NPE가 발생하지 않도록 코드 작성가능
  - Optional 클래스는 모든 타입의 객체를 담을 수 있는 래퍼(Wrapper) 클래스
  - Optional 객체 생성시 `of()` 또는 `ofNullable()` 사용
  - 참조변수의 값이 null일 가능성이 있다면 `ofNullable()` 사용
  - [🔗Optional Methods](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)