---

layout: post

title: "[Spring] Hamcrest "

comments: true

categories: [Spring]

tags: [Spring]

---

### <span style='color: #2D3748; background-color: #FF9898'>Hamcrest</span>

- Hamcrest

  - JUnit 기반 단위 테스트에서 사용할 수 있는 Assertion Framework
  - JUnit Assertion 메서드보다 더 많이 사용됨

- Hamcrest 사용 이유

  - Assertion을 위한 Matcher가 한 문장으로 이어져 가독성 향상
  - 테스트 실패 메세지를 이해하기 쉽다
  - 다양한 Matcher 제공
  
- Hamcrest Assertion 예시 1

  ```java
  import static org.hamcrest.MatcherAssert.assertThat;
  import static org.hamcrest.Matchers.equalTo;
  import static org.hamcrest.Matchers.is;
  
  public class HelloHamcrestTest {
  
      @DisplayName("Hello Junit Test using hamcrest")
      @Test
      public void assertionTest1() {
          String expected = "Hello, JUnit";
          String actual = "Hello, World";
  
          assertThat(actual, is(equalTo(expected))); // Hamcrest Matcher 이용
      }
  }
  
  > 출력
  > Expected: is "Hello, JUnit"
  >      but: was "Hello, World"
  ```
  
- [🔗Hamcrest 추가 자료](http://hamcrest.org/JavaHamcrest/tutorial)