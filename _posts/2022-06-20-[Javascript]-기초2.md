---

layout: post

title: "[Javascript] 기초2"

comments: true

categories: [JavaScript]

tags: [JavaScript, Frontend]

---

> 오늘은 어제 다루지 못했던 자바스크립트 기초부분을 다 정리하려고한다.

**1. 조건문 (if문, switch문)**
  -조건문에는 **if문**과 **switch문**이 대표적이다.

- ***if문 (if, else, else if)\***
  if문은 ***조건이 참(true)일 경우에만 실행***하고 ***거짓(false)인 경우에는 실행하지 않는다.***

  ```javascript
  if (조건) {
    // 조건이 참일때 실행할 실행문
  } else if (조건) {
    // 조건이 참일때 실행할 실행문
  } else {
    // 조건이 참일때 실행할 실행문
  }
  ```

  -**if**와 **else if**는 **각각의 조건이 참일 경우**에 실행문이 실행된다.
  -**둘다 거짓일 경우 else**가 실행된다.
  -**else if**는 개수와 상관없이 추가할 수 있다.

  

- **switch문**

  ```javascript
  switch(변수){
   case 조건1 :
     // 조건1이 성립할때 실행할 코드
     break;
   case 조건2 :
     // 조건2가 성립할때 실행할 코드
     break;
   case 조건3 :
     // 조건3이 성립할때 실행할 코드
     break;
   default :
     // 모든 조건에 성립하지 않을때 실행할 코드
    break;
  ```

  와 같은 문법을 갖고있다.
  ***break : 실행을 멈추고 해당 코드에서 빠져나온다.***
  ***default : if문에서 else와 같이 위에 모든 조건들이 성립하지 않았을 때 실행된다.***

  

- if문과 switch문은 **삼항 연산자**를 이용하여 간단하게 표현할 수 있다.
  \- **삼항 연산자**
  `조건문 ? 실행문1 : 실행문2`
  와 같이 사용한다.
  ?는 조건문과 실행문을 구분하고, :는 실행문을 구분해준다.

  ```javascript
  let a = 5;
  let b = 10;
  (a < b) ? console.log("true") : console.log("false");
  // true 출력
  ```

- 위와 같은 조건문들에서는 비교연산자와 논리연산자를 사용할 수 있다.

  

**2. 논리연산자**
-논리연산자는 **||(OR), &&(AND), !(NOT)** 가 있다.

- **||(OR)** : 여러 조건 중 **하나라도 true일때 true**를 반환하고, **모든 값이 false일때만 false**를 반환한다.
- **&&(AND)** : **모든 값이 true일때만 true**를 반환하고, **하나라도 false라면 false**를 반환한다.
- **!(NOT)** : ***true일 경우엔 false***를 반환하고, ***false일 경우 true***를 반환한다.