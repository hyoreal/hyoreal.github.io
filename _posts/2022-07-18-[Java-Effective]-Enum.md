---

layout: post

title: "[Java-Effective] Enum "

comments: true

categories: [Java, Enum]

tags: [Java, Enum]

---

### 열거형 (Enum)

열거형(enum, enumerated type)

- 서로 연관된 상수들의 집합
- 몇 가지로 한정된 변하지 않는 데이터를 다루는데 사용

열거형 사용 이유

```java
  // 여러 상수 정의 위한 옛 방식
  // 계절
  public static final int SPRING = 1;
  public static final int SUMMER = 2;
  public static final int FALL = 3;
  public static final int WINTER = 4;

  // 프레임워크
  public static final int SPRING = 1;
  public static final int FLASK = 2; // 계절의 SPRING과 중복, 컴파일 에러 발생
  public static final int DJANGO = 3;
  public static final int NEST = 4;
```

- enum 이전에 상수 정의 시 종종 상수명 중복 발생

```java
  interface Seasons {
    int SPRING = 1, SUMMER = 2, FALL = 3, WINTER = 4;
  }

  interface Frameworks {
    int SPRING = 1, FLASK = 2, DJANGO = 3, NEST = 4;
  }

  System.out.println(Seasons.SPRING == Frameworks.SPRING);

  > 출력
  > true
```

- 인터페이스 사용하여 상수 구분
  - 상수명 중복 해결, 타입 안정성 문제 발생
  - 타입안정성 : 타입(개념)다름에도 불구하고 할당된 값으로만 비교

 

~~~java
class Seasons {
public static final Seasons SPRING = new Seasons();
public static final Seasons SUMMER = new Seasons();
public static final Seasons FALL = new Seasons();
public static final Seasons WINTER = new Seasons();
}

class Frameworks {
public static final Frameworks SPRING = new Frameworks();
public static final Frameworks FLASK = new Frameworks();
public static final Frameworks DJANGO = new Frameworks();
public static final Frameworks NEST = new Frameworks();
}

- enum 사용 시
- 코드 단순화
- 가독성 ↑
- switch문에서 사용 가능
- 타입안정성 보장
- 중복 해결

```java
// enum 열거형이름 {상수명1, 상수명2, 상수명3, ...}
// 자동적으로 값이 0부터 할당됨
// 상수명1 = 0, 상수명2 = 1, ...

enum Seasons {SPRING, SUMMER, FALL, WINTER}
enum Frameworks {SPRING, FLASK, DJANGO, NEST}
~~~

- 서로 다른 객체로 생성
  - 코드가 길어지는 단점
  - switch문 활용 불가

 

enum Methods

| 리턴 타입 | 메서드               | 설명                                                         |
| --------- | -------------------- | ------------------------------------------------------------ |
| String    | name()               | 열거 객체가 갖고있는 문자열 반환. 정의할때 사용한 상수이름과 동일 |
| int       | ordinal()            | 열거 객체의 순번 반환                                        |
| int       | compareTo(비교값)    | 비교하여 순번 차이 반환                                      |
| enum      | valueOf(String name) | 문자열의 열거객체 반환                                       |
| enum[]    | values()             | 모든 열거객체를 배열로 반환                                  |