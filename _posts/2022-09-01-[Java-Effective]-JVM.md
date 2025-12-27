---

layout: post

title: "[Java-Effective] JVM "

comments: true

categories: [Java, JVM]

tags: [Java, JVM, Memory]

---

### JVM 탄생 배경

- 자바 탄생 전, `C++`이 프로그래밍 언어로 많이 사용.
  - `C++` : C 언어를 기반으로 한 객체 지향 프로그래밍
- `C++`에는 큰 문제 존재
  - 운영체제로부터 독립적이지 않음
  - Windows를 위한 프로그램은 Windows에서만, Mac OS를 위한 프로그램은 Mac OS에서만 작동이 가능했기에 프로그램 개발 시 각 운영체제 별로 따로 만들어야했음
- **이 문제를 해결하고자 만든 `Java`**
- **`Java` : 객체지향 프로그래밍 가능, 운영체제로부터 독립적**

------

### JVM

JVM (Java Virtual Machine)

- 자바 프로그램 실행 도구
- 즉, 자바로 작성한 소스 코드를 해석해 실행하는 별도의 프로그램
- 프로그램 실행 과정
  - 프로그램이 필요한 컴퓨터 자원을 운영체제에게 주문
  - 운영체제는 가용 자원 확인 후, 프로그램 실행 시 필요한 컴퓨터 자원을 프로그램에게 할당
- 프로그램 자원 요청 방식
  - 운영체제에게 필요한 컴퓨터 자원을 요청하는 방식은 운영체제마다 다름
  - 자바는 JVM을 매개해서 운영체제와 소통

------

### JVM 구조

![img](https://velog.velcdn.com/images/hyoreal51/post/a48f63d4-96fd-45dd-a94a-2a3fa0713d24/image.png)

1. 자바로 소스코드 작성 후 실행
2. 컴파일러 실행되면서 컴파일 진행 (.java 확장자(소스코드) → .class 확장자(바이트 코드 파일)
3. 🔗[JVM](https://deepu.tech/memory-management-in-jvm/)은 운영 체제로부터 소스코드실행에 필요한 메모리 할당받음
   => Runtime Data Area
4. 클래스 로더가 바이트 코드 파일을 JVM 내부로 불러들여 런타임 데이터 영역에 적재. (자바소스코드를 메모리에 로드)
5. 로드 완료 시 실행 엔진(Execution Engine)이 런타임 데이터 영역에 적재된 바이트 코드 실행
   5-1. 인터프리터를 통해 코드를 한 줄씩 기계어로 번역 및 실행
   5-2. JIT Compiler(Just-In-Time Compiler)를 통해 바이트 코드 전체를 기계어로 번역 및 실행

------

### Stack과 Heap

![img](https://velog.velcdn.com/images/hyoreal51/post/1952d02b-ec26-4ce5-b782-9055ae7120e4/image.png)

- JVM 메모리 구조

  - Runtime Data Area : JVM에 Java 프로그램이 로드되고 실행될 때 정보를 담은 메모리 영역

- Stack 영역

  - "Last In First Out" 마지막에 들어간 데이터가 가장 먼저 나오는 자료구조
  - Stack 작동
    - 메서드 호출 시 메서드를 위한 공간인 Method Frame 생성.
    - 메서드 내부에서 사용하는 다양한 값들이 임시로 저장
    - Method Frame이 Stack에 호출되는 순서대로 쌓임
    - Method 동작이 완료되면 역순 제거

  ![img](https://velog.velcdn.com/images/hyoreal51/post/3c0003cd-6a58-4ad4-aee5-1f9daf6c7bc4/image.png)

 

- Heap 영역
  - JVM에는 단 하나의 Heap 영역 존재, JVM 작동 시 자동 생성
  - new 키워드로 생성된 인스턴스가 생성되는 영역

```
Person person = new Person();
```

------

### Garbage Collection (GC)

- 프로그램에서 사용하지 않는 객체를 찾아 삭제 및 제거로 메모리를 확보
- 참조되고있지않은 객체 및 변수들을 검색하여 메모리 점유 해제로 메모리 공간 확보를 통한 효율적인 메모리 사용에 도움
- [🔗Garbage Collection](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html)