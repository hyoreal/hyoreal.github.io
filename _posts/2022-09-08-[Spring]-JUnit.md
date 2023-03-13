---

layout: post

title: "[Spring] JUnit "

comments: true

categories: [Spring]

tags: [Spring]

---

### <span style='color: #2D3748; background-color: #ffdce0'>JUnit 없이 단위테스트</span>

- 단위 테스트를 제일 쉽고 빠르게 적용할 수 있는 부분은 helper class와 utility class

- Utility Class 논쟁

  - 유틸리티 클래스의 메서드들은 일반적으로 클래스의 객체로 인스턴스화 필요 X
    - 정적 메서드로 구성
  - 객체 지향 세계에서는 유틸리티 클래스 사용을 지양하고 유틸리티 클래스조차 객체 지향적 구성 위해 노력
  - Spring Framework에서조차 StringUtils, BeanUtils 같은 유틸리티 클래스 지원
  
- 헬퍼 클래스 예

  ```java
  public class StampCalculatorTestWithoutJUnit {
      public static void main(String[] args) {
          calculateStampCountTest();
      }
      
      private static void calculateStampCountTest() {
          // given
          int nowCount = 5;
          int earned = 3;
          
          // when
          int actual = StampCalculator,calculateStampCount(nowCount, earned);
          
          int expected = 7;
          
          // then
          System.out.println(expected == actual);
       }
   }
   
   public class StampCalculator {
       public static int calculateStampCount(int nowCount, int earned) {
           return nowCount + earned;
       }
       
       public static int calculateEarnedStampCount(Order order) {
           return order.getOrderCoffees().stream().
                   .map(orderCoffee::getQuantity)
                   .mapToInt(quantity -> quantity)
                   .sum();
       }
   }
   
   
   -----------------
   
   > 실행 결과
   > false
  ```
  
   - Given-When-Then 표현 스타일 (🔗[BDD, Behavior Driven Development](https://en.wikipedia.org/wiki/Behavior-driven_development))
  
     - Given
       - 테스트를 위한 준비과정 명시
       - 테스트에 필요한 전제조건
       - 테스트 대상에 전달되는 입력값 역시 포함
       
     - When
       - 테스트 할 동작 지정(실제 테스트 할 코드)
     
     - Then
       - 테스트 결과 검증 영역
       - 예상 값(expected)와 테스트 대상 메서드 동작 수행 결과(actual)의 값을 비교하여 의도대로 동작하는지 검증(Assertion)하는 코드
  
- Assertion

  - 테스트 결과를 검증할 때 사용
  - 예상하는 결과 값이 참(true)이길 바라는 것
  
### <span style='color: #2D3748; background-color: #F8FF98'>JUnit</span>

- JUnit

  - Java 언어로 만들어진 애플리케이션을 테스트하기 위한 오픈 소스 테스트 프레임워크
  - Java 표준 테스트 프레임워크
  
- JUnit 기본 작성법

  - `src/test` 디렉토리 안에 작성
    - Spring Boot Intializr에서 Gradle 기반 Spring Boot 프로젝트 생성 시 
    - 기본으로 `src/test` 디렉토리 만들어짐
    - 기본으로 `testImplementation >'org.springframework.boot:spring-boot-starter-test'` 스타터 포함됨
    - 기본으로 JUnit 포함됨
    
  ```java
  import static org.junit.jupiter.api.Assertions.assertEquals;
  
  public class HelloJUnitTest {
      @DisplayName("Hello JUnit Test")  // 테스트 케이스 실행 시 실행 결과창에 표시되는 이름 지정
      @Test
      public void assertionTest() {
          String expected = "Hello, JUnit";
          String actual = "Hello, JUnit";
  
          assertEquals(expected, actual); // 예상값과 실제값 비교 검증
      }
  }
  ```
  
- JUnit Assertion Methods

  - assertEquals(expexted, actual) : 두 값이 같은지 검증
  - assertNotEquals(expected, actual) : 두 값이 다른지 검증
  - assertNotNull(actual, "") : 첫번째 인자 값이 Null인지 확인, 테스트 실패 시 두번째 인자 문자열 출력
  - assertThrows( .class, () -> TestMethod()) : 두번째 인자인 람다 표현식은 테스트 대상 메서드가 첫번째 인자인 발생 예상 예외가 생기는지 검증 (Executable 함수형 인터페이스)
  - [🔗추가 메서드1](https://www.baeldung.com/junit-assertions)
  - [🔗추가 메서드2](https://junit.org/junit5/docs/current/user-guide/#writing-tests-assertions)
  - [🔗Assuption Methods](https://junit.org/junit5/docs/current/user-guide/#writing-tests-assumptions) : 조건부 테스트
  
- 테스트 케이스 실행 전, 후처리

  - @Before (@BeforeAll) : 해당 클래스의 테스트 실행 전, 단 한번만 실행
  - @BeforeEach : 각 테스트 실행전마다 실행
  - @After (@AfterAll) : 해당 클래스의 테스트 실행 후, 단 한번만 실행
  - @AfterEach : 각 테스트 실행 후마다 실행