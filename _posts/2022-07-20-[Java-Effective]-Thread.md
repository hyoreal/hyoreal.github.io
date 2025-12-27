---

layout: post

title: "[Java-Effective] Thread "

comments: true

categories: [Java, Thread]

tags: [Java, Thread, Concurrency]
---

### Thread

스레드 (Thread)

- 스레드(Thread) : 프로세스 내에서 실행되는 소스코드의 실행 흐름
- 프로세스(Process)
  - 실행중인 애플리케이션
  - 데이터, 컴퓨터자원, 스레드로 구성
  - 어떤 프로세스는 단 하나의 스레드를 가질 수도, 여러개의 스레드를 가질 수 도 있음
    - 하나의 스레드는 하나의 코드 흐름을 실행

싱글 스레드 프로세스 (Single Thread Process)

- 단 하나의 스레드를 가지는 프로세스

멀티 스레드 프로세스 (Multi Thread Process)

- 여러개의 스레드를 가지는 프로세스
- 멀티 스레딩 : 멀티 스레드로 동작한다 = 해당 애플리케이션이 동시작업을 할 수 있다
  - 멀티 스레딩은 하나의 애플리케이션 내에서 멀티 태스킹을 구현하는 데에 핵심적인 역할

![img](https://velog.velcdn.com/images/hyoreal51/post/ef408279-57a3-4183-be6b-18fb0c38ef2f/image.png)

------

### 메인 스레드 (Main Thread)

- 자바 애플리케이션을 실행하면 가장 먼저 실행되는 main 메서드
- main 메서드를 실행시켜주는 Main Thread
- 메인 스레드는 코드의 끝을 만나거나 return문을 만나면 실행 종료

![img](https://velog.velcdn.com/images/hyoreal51/post/9fc4aba2-ff6d-49de-8e04-bfb388eadb41/image.png)

------

### 스레드의 생성과 실행

스레드의 생성과 실행

- 멀티 스레드로 동작하는 애플리케이션 개발 시
  - 몇 개의 작업을 동시에 실행할지 결정
  - 작업별로 스레드를 생성
- 메인 스레드 외에 추가적인 병렬 작업 수 만큼 별도의 작업 스레드를 생성하면 됨
- 별도의 작업 스레드를 활용한다는 것
  - 작업 스레드가 수행할 코드를 작성하고, 작업 스레드를 생성하여 실행시키는 것을 의미
- 자바는 객체지향 언어
  - 모든 자바 코드는 클래스 안에 작성
  - 즉, 스레드가 수행할 코드도 클래스 내부에 작성, run()메서드 내에 스레드가 처리할 작업을 작성
  - run() 메서드는 Runnable 인터페이스와 Thread 클래스에 정의

------

#### 작업 스레드를 생성 및 실행하는 방법

1.Runnable 인터페이스를 구현한 객체에서 run()을 구현하여 스레드를 생성하고 실행하는 방법

- Runnable에는 run() 정의, 반드시 run() 구현해야함
- Runnable 구현 객체를 인자로 전달하며 Thread 클래스를 인스턴스화
- 스레드 생성만으로 run()내부 코드 실행X
- run() 내부코드 실행하려면 start()메서드 호출 필요

```java
  public class ThreadExample1 {
    public static void main(String[] args) {

      // Runnable 인터페이스 구현 객체 생성
      Runnable task1 = new ThreadTask1();

      // Runnable 구현 객체를 인자로 전달
      //Thread 클래스를 인스턴스화하여 스레드 생성
      Thread thread1 = new Thread(task1);

      // 위 두 줄을 한 줄로 축약 가능
      // Thread thread1 = new Thread(new ThreadTask1());


      // 작업 스레드를 실행시켜 run()내부 코드 처리하도록
      thread1.start();


      // 반복문 추가
      for (int i = 0; i < 100; i++) {
            System.out.print("@");
      }
    }
  }

  // Runnable 인터페이스를 구현하는 클래스
  class ThreadTask1 implements Runnable {

    // run() 메서드 바디에 스레드 수행 작업 내용 작성
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.print("#");
  }

  > @와 #이 랜덤으로 섞인 채 출력
```

------

2.Thread 클래스를 상속 받은 하위 클래스에서 run() 구현 후 스레드 생성 및 실행 방법

- Thread 클래스에는 run() 메서드가 정의 - run() 메서드를 오버라이딩해야함
- Runnable과 달리 Thread를 직접 인스턴스화하지않음

```java
  public class ThreadExample2 {
    public static void main(String[] args) {

      // Thread 클래스 상속받은 클래스 인스턴스화 후 스레드를 생성
      Thread thread2 = new ThreadTask2();

      thread2.start();

      for (int i = 0; i < 100; i++) {
            System.out.print("@");
      }
    }
  }

  // Thread 클래스 상속받는 클래스 작성
  class ThreadTask2 extends Thread {

    // run() 메서드 바디에 스레드 수행 작업 내용 작성
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.print("#");
        }
  }
```

------

스레드 이름 조회

- 메인 스레드 이름 = "main"
- 추가 생성 스레드 이름 = "Thread-n"
- `스레드참조값.getName()`으로 조회 가능
- `스레드참조값.setName()`으로 이름 설정 가능
- 주소값 사용 시 `currentThread()` 사용

 

```java
Thread thread3 = new Thread(new Runnable() {
  public void run() {
    System.out.println("Get Thread Name");
  }
});

thread3.start();

System.out.println("thread3.getName() = " + thread3.getName());

> 출력
> Get Thread Name
> thread3.getName() = Thread-0

------------------------------
Thread thread4 = new Thread(new Runnable() {
  public void rn() {
    System.out.println("Set And Get Thread Name");
  }
});

thread4.start();

System.out.println("thread4.getName() = " + thread4.getName());

thread4.setName("Code States");

System.out.println("thread4.getName() = " + thread4.getName());

> 출력
> Set And Get Thread Name
> thread4.getName() = Thread-0
> thread4.getName() = Code States
```

 

------

- 스레드 동기화

  - 멀티 스레드 프로세스의 경우, 두 스레드가 동일한 데이터를 공유작업 시, 스레드가 사용 중인 객체를 다른 스레드가 변경할 수 없도록 스레드 작업이 끝날 때까지 객체에 잠금을 걸어 다른 스레드가 사용못하도록 해야함
  - 임계영역 (Critical section)
    - 하나의 스레드만 코드를 실행할 수 있는 코드 영역
  - 락 (Lock)
    - 임계 영역을 포함하고 있는 객체에 접근할 수 있는 권한

- 메서드 전체 임계 영역 지정

  - 메서드의 반환 타입 앞에 `synchronized` 키워드 작성 시 메서드 전체를 임계 영역으로 설정 가능

- 특정 영역을 임계 영역 지정

  - `synchronized` 키워드와 소괄호`()` 안에 해당 영역이 포함된 객체의 참조를 넣고, 블럭을 열어 블럭 내에 코드 작성

  ```java
  class Account {
    ...
    public boolean withdraw(int money) {
      synchronized (this) {
        if (balalce >= money) {
          try {
            Thread.sleep(1000);
          } catch (Exception e) {}
          balance -= money;
          return true;
        }
      }
    }
  }
  ```

------

- 스레드 상태
  - start() 메서드 호출 시
    1. 스레드 실행 대기 상태
    2. 스레드 스케쥴링 선택 시 스레드 CPU 점유 후 run() 메서드 실행
  - 메서드 실행 시
    - 메서드 실행 전, 스레드 스케줄링에 의해 실행대기상태로 돌아갈 수 있음
    - 실행 대기 상태, 실행상태를 번갈아가며 run()메서드 실행
    - run() 메서드 종료 시, 실행할 코드 없음. 스레드 종료

| 상태      | 열거 상수     | 설명                                     |
| --------- | ------------- | ---------------------------------------- |
| 객체 상태 | NEW           | 스레드 객체 생성. start() 메서드 호출 전 |
| 실행 대기 | RUNNABLE      | 언제든 실행상태로 갈 수 있음             |
| 일시 정지 | BLOCKED       | 사용하려는 객체의 Lock이 풀릴때까지 대기 |
| 일시 정지 | WAITING       | 다른 스레드가 통지할때까지 대기          |
| 일시 정지 | TIMED_WAITING | 주어진 시간동안 대기 → .sleep(Time)      |
| 종료      | TERMINATED    | 실행 종료                                |

![img](https://velog.velcdn.com/images/hyoreal51/post/2e8e431c-4a32-40f4-8b24-c782434c4b89/image.png)