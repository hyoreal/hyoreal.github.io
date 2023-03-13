---

layout: post

title: "[Spring] DTO "

comments: true

categories: [Spring]

tags: [Spring]

---

### DTO

- DTO (Data Transfer Object)

  - 마틴 파울러(Martin Fowler)가 ‘Patterns of Enterprise Application Architecture’ 책에서 처음 소개한 **엔터프라이즈 애플리케이션 아키텍처 패턴** 중 하나
  - 데이터를 전송하기 위한 용도의 객체
    - `Client --Request Data--→ Server` 형식
    - `Server --Response Data-→ Client` 형식
    - 위 두 형식에서 클라이언트와 서버간에 데이터 전송이 이뤄짐
    - data 구간에서 DTO 사용

- DTO 필요 이유

  - 요청 데이터 개수가 증가함에 따라 @RequestParam의 개수 증가

    → DTO 클래스가 요청데이터를 하나의 객체로 전달받는 역할을 해줌

    - 코드 단순화
    - 코드 가독성↑
    
  - 유효성 검증 필요시마다 핸들러 내 유효성 검증 로직들로 코드 복잡해짐
  
    → DTO 클래스를 사용하면 유효성 검증 로직을 DTO 클래스로 빼내어 핸들러 메서드의 간결함을 유지
  
    - 애너테이션 사용을 통해 쉬운 데이터 유효성 검증 가능
    - 한번에 여러 데이터를 전부 가져오거나 보내줄 수 있어 http 요청 수를 줄일 수 있다
  
  - 유효성 검증 : 서버 쪽에서 유효한 데이터를 전달 받기 위해 데이터를 검증하는 것
  
- DTO 적용 시

  - Data를 주고받는 형식 필요 시 마다 DTO 클래스를 만들어 사용
    - 각 멤버변수에 해당하는 getter 메서드 or @Getter 애너테이션 반드시 필요
    - getter 가 없으면 Response Body에 해당 멤버 변수값이 포함되지 않는 문제 발생
  - DTO 파라미터 앞에 @RequestBody 애너테이션을 사용
    - JSON 형식 데이터 : @RequestBody
    - x-www-form-urlencoded 형식 데이터 : @ModelAttribute (DTO 클래스에 setter 필요)

- 직렬화(Serialization) : Java의 객체를 JSON 형식으로 변환

- 역직렬화(Deserialization) : JSON 형식을 Java 객체로 변환

- DTO 클래스의 대표적 단점

  - Controller 클래스가 늘어남에 따라 DTO 클래스가 두배로 늘어남

------

### DTO 유효성 검증

- DTO 유효성 검증 필요 이유

  - 클라이언트 측에서 잘못된 형식을 입력했을 경우 프론트엔드 쪽에서 1차적으로 유효성검사를 진행 후 사용자에게 이를 알려주는것이 일반적이지만, 프론트엔드 쪽에서 유효성검사에 통과되었다고 하더라도 그 값이 반드시 유효하다고 보장할 수 없음
    - JavaScript로 전송되는 데이터는 브라우저의 개발자 도구를 사용하여 break point를 건 뒤 값을 조작할 수 있음!!
    - 그렇기에 서버 쪽에서 한번 더 유효성 검사를 진행해야 함
    - 프론트엔드의 유효성검사는 사용자의 편의성을 위한 이유가 더 큼

- DTO 유효성 검증 적용

  - 유효성 검증 위한 의존성 라이브러리 추가

    - build.gradle 파일의 dependencies항목에 추가

```java
dependencies {
implementation 'org.springframework.boot:spring-boot-starter-validation'
...
...
}
```

- 유효성 검증 예시

```java
@RestController
@RequestMapping("/v1/coffees)
@Validated // 해당 컨트롤러 클래스 내에 메서드에 검증조건이 있는경우 데이터검증 실행
public class CoffeeController {
 @PostMapping
 public ResponseEntity postCoffee(
           @Valid @RequestBody CoffeePostDto coffeePostDto) {
     return new ResponseEntity<>(coffeePostDto,  HttpStatus.CREATED);
 }
    ...
    ...
}
@RestController
@RequestMapping("/v1/coffees)
@Validated // 해당 컨트롤러 클래스 내에 메서드에 검증조건이 있는경우 데이터검증 실행
public class CoffeeController {
   @PostMapping
   public ResponseEntity postCoffee(
             @Valid @RequestBody CoffeePostDto coffeePostDto) {
       return new ResponseEntity<>(coffeePostDto,  HttpStatus.CREATED);
   }
      ...
      ...
}
```

------

데이터 검증 애너테이션

| Annotation                  | 설명                                                         |
| --------------------------- | ------------------------------------------------------------ |
| @NotNull                    | Null 불가                                                    |
| @Null                       | Null만 허용                                                  |
| @NotEmpty                   | Null, "" 불가                                                |
| @NotBlank                   | Null, "", " " 불가                                           |
| @Size(min=,max=)            | 문자열 길이 제한                                             |
| @Pattern(regexp = )         | [정규 표현식](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions) 검사 |
| @Email                      | 이메일 형식 검사, ""허용                                     |
| @Max(value = )              | value 이하만 허용                                            |
| @Min(value = )              | value 이상만 허용                                            |
| @Positive                   | 양수의 값만 허용                                             |
| @PositiveOrZero             | 양수, 0 만 허용                                              |
| @Negative                   | 음수의 값만 허용                                             |
| @NegativeOrZero             | 음수, 0 만 허용                                              |
| @DecimalMax(value = )       | value 이하의 실수만 허용                                     |
| @DecimalMin(value = )       | value 이상의 실수만 허용                                     |
| @Future                     | 현재보다 미래                                                |
| @FutureOrPresent            | 현재이거나 미래                                              |
| @Past                       | 현재보다 과거                                                |
| @PastOrPresent              | 현재이거나 과거                                              |
| @AssertFalse                | false여부, Null은 체크X                                      |
| @AssertTrue                 | true여부, Null은 체크X                                       |
| @Valid                      | 객체의 확인조건 만족할 경우만 허용                           |
| @Digits(integer=,fraction=) | 대상 수가 integer와 fraction 자리수보다 적을 경우 허용       |

> [참고자료 : beanvalidation](https://beanvalidation.org/2.0/spec/)