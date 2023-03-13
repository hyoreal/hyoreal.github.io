---

layout: post

title: "[Javascript] 변수"

comments: true

categories: [Javascript]

tags: [Javascript]

---

> 이번엔 변수에 대한 추가 정리를 할것이다.

**1. Hoisting, TDZ**

- 먼저 변수를 설명하기에 앞서 필요한 지식인 **Hoisting(호이스팅)**과 **TDZ(Temporal Dead Zone** 에 대해 설명하겠다.

  - **Hoisting (호이스팅)** : 호이스팅이란 자바스크립트 함수가 실행되기 전 함수에 **필요한 모든 선언들을 최상단으로 끌어올려서 선언하는 것**이다.

    호이스팅은 var로 **선언된 변수**와 **함수 선언문** 에서만 일어난다.

    ```javascript
    Hoisting
    console.log(name); // "Mike" 출력
    var name = "Mike";
    ```

  - TDZ (Temporal Dead Zone)

    ```javascript
    console.log(age); // TDZ
    const age = 30; // 선언 및 할당
    console.log(age); // 30 출력
    ```

    이와 같이 변수를 선언하고 할당하기 전까지는 사용할 수 없는것이 TDZ의 영향을 받는것이다.

**2. 변수란?**

- 자바스크립트에서 **변수**는 쉽게 말해서 **데이터를 담아두는 공간**이라고 할 수 있다.
  **변수**를 사용하기 위해서는 **변수를 선언**한 후에 **값을 저장**해주면 된다.

- 변수를 선언은 **var , let, const**를 사용해서 한다.

  - var : 변수선언 이후 어디서든 재선언, 재할당이 가능하다.

    ```javascript
    var name = "Tom";
    console.log(name); // "Tom" 출력
    var name = "Mike"; // 재선언
    console.log(name); // "Mike" 출력
    name = "Jake"; // 재할당
    console.log(name); // "Jake" 출력
    ```

    

  - let : 재선언은 불가하지만 재할당은 가능하다.

    ```javascript
    let age = 30;
    console.log(age); // 30 출력
    let age = 10; // 재선언
    console.log(age); // 오류발생
    age = 10; // 재할당
    console.log(age); // 10 출력
    ```

    

  - const : 재선언도 재할당도 불가하다. 값이 변하지 않는 상수를 선언할 때 사용하는 것이 좋다. 변수명은 대문자로만 이루어야 상수라는걸 알기 편하다.

    ```javascript
    const PI = 3.14;
    console.log(PI); // 3.14 출력
    const PI = 3.1415;
    console.log(PI); // 오류발생
    PI = 3.1415;
    console.log(PI); // 오류발생
    ```

**3. 변수 생성 과정**

- 변수를 선언하고 변수가 생성될 때는 `변수 선언 -> 변수 초기화 -> 변수에 값 할당` 의 순서를 거치는데 **var, let, const** 의 과정이 각각 다르다.

  - **var** 생성과정 : ***변수 선언 및 초기화*** -> 값 할당
    **var**은 **Hoisting**되어 **TDZ(Temporal Dead Zone)**의 영향을 받지 않기 때문에 어느 위치에서도 선언할 수 있다.

  - **let** 생성과정 : ***변수 선언 -> 변수 초기화*** -> 변수에 값 할당
    **let**은 값을 할당하기 직전에 변수를 초기화한다.

  - **const** 생성과정 : **변수 선언 및 초기화, 할당**

    const는 변수선언, 초기화, 할당을 모두 동시에 해야한다. let이나 var과 다르게 **선언만 하고 나중에 값을 할당하는 것은 불가능**하다.

    ```javascript
    const gender;
    gender = "female";
    console.log(gender); // 오류발생
    ------------------------------------------------------------------------
    const gender = "female";
    console.log(gender); // "female" 출력
    ```

**4. 스코프**

- var, let, const는 스코프도 다르다.

  - var : **함수 스코프 (function-scoped)**

    함수 스코프인 **var** 는 함수블록 내에서 선언 되었을때 함수블록 외부에서 호출을 하게되면 오류가 발생한다.

    ```javascript
    function plus(num1, num2) {
    var answer = num1 + num2;
    }
    plus(1, 2); // 3 
    console.log(answer); // 오류발생
    ```

    하지만 함수를 제외한 다른 블록에서 선언한 var는 블록 외부에서 호출할 수 있다.

    ```javascript
    const PI = 3.14;
    if (PI > 0) {
    var result = "true";
    }
    console.log(result); // "true" 출력
    ```

    

    - let, const : **블록 스코프 (block-scoped)**

    let과 const는 블록 스코프라고 하는데 **블록 스코프는 함수 스코프와 다르게 *모든 코드블록(function, if문, for문, while문, try/catch문)*에서 선언된 변수들은 코드블록 외부에서 접근할 수 없다.**

    ```javascript
    function plus(1, 2){
    const result = "false";
    }
    console.log(result); // 오류발생
    ```

    ```javascript
    if(1 > 2){
    let ans = "false";
    }
    console.log(ans); // 오류발생
    ```

    ```javascript
    for(let i = 0; i < 10; i++) {
    const answer = "false";
    }
    console.log(answer); // 오류발생
    ```

    즉, 함수스코프는 함수 외의 다른 블록에는 아무런 영향을 받지 않는다.

