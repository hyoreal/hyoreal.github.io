---

layout: post

title: "[Javascript] 기초"

comments: true

categories: [Javascript]

tags: [Javascript]

---

# 시작하는 말

오늘은 그동안 독학했던 내용들에 대해 정리를 해보려고 한다.
그럼 바로 시작!!

**1. 변수**

- 변수란 데이터를 담는 공간을 말한다.
  변수를 선언할 때에는 **var, let, const**를 사용한다.

  -**var**는 재선언 및 값을 다른 값으로 변경하는 재할당이 가능하다.

  -**let**은 재선언은 불가하지만 재할당은 가능하다.

  -**const**는 재선언도 재할당도 불가하다.
   그렇기에 값이 변하지 않는 상수를 선언할 때 사용하면 좋다.  단, 값이 변하지 않는 상수의 변수명은 대문자로만 이루는게 좋다.

  

**2.데이터 타입**

- 데이터타입에는 **String, Number, Function** 등 이 존재한다.

```javascript
// - String(문자형)
//  문자형은 큰따옴표, 작은따옴표, 백틱을 사용한다.
  const str1 = "Hello";
  const str2 = 'Hello';
  const str3 = `Hello`;

//  숫자가 큰따옴표, 작은따옴표, 백틱 안에 있어도 문자형으로 구분된다.
  const str4 = "20";
  
//  변수값에 기호를 추가하고싶으면 \를 입력하거나 다른 기호를 사용해야한다.
  const str5 = "He's a boy."; // 가능
//  const str6 = 'He's a boy'; // 불가능

//  백틱을 사용할 때 ${}를 사용하여 식을 값에 할당할 수 있다.
  const str7 = `나는 ${30+1}살 입니다.`;


// - Number(숫자형)
//  숫자형은 별도의 기호없이 입력한다.
  const num1 = 10; // 정수
  const num2 = -10; // 음수
  const PI = 3.14; // 실수, 변하지 않는 값
  

/* 
   - Function(함수)
   함수는 자바스크립트에서의 가장 기본적인 구성 블록 중 하나이다. 
   function 키워드를 이용하여 함수를 생성할 수 있다.
  
   function 함수명 (매개변수) {
     // 실행시키고자 하는 식 
   }
   위 식과 같은 구성요소를 가지고있고
   함수명(인자); 로 함수를 호출할 수 있다.
   인자에 아무것도 쓰지않아도 함수는 호출된다.
*/
    
   function plus (a , b) {
     return a + b;
   }
   plus(3, 4);
/*   위 함수에서 함수명은 plus이고 매개변수는 a와 b이다.
   여기서 매개변수는 인자에서 전달받은 값을 의미한다.
   return은 함수를 실행한 후 나온 값을 반환해준다. */
   
   
// -Array(배열)
//  배열은 대괄호 안에 여러 값이 들어있다.
  let students = ["Amy", "Tom", "Peter"];
//  배열에는 인덱스가 존재하는데 앞부터 0 , 1 , 2 ...로 커진다.
  students[0]; // Amy가 호출된다.
  students[0] = "Penny"; // 인덱스0의 값을 Penny로 바꾼다.
  

/*
 -Object(객체형)
 객체란 이름과 값으로 구성된 프로퍼티의 정렬되지 않은 집합이다.
 프로퍼티의 값으로 함수가 올 수도 있는데, 이러한 프로퍼티를 메소드라고 한다.
 
 예를 들어 이름은 피터피커이고 나이는 21살인 스파이더맨이 있다고 할 때
*/ 
 const Spiderman ={
   name : "Peter Parker",
   age : 21,
 }
 
/* 위 와 같은 객체를 생성할 수 있고 name과 age는 키(Key),
 Peter Parker과 21은 키값(Value), 
 name : "Peter Parker" 과 age : 21 은 각각 프로퍼티(Property)라고 한다.
 프로퍼티는 , 로 구분한다. */
 
// 객체에 접근할 때에는 . , []를 사용한다.
 Spiderman.name
 Spiderman['age']  // 와 같이 할 수 있다.
 
// 객체에 추가할 때에도 . , []를 사용한다.
 Spiderman.gender = 'male';
 Spiderman['gender'] = 'male'; // 와 같이 할 수 있다.
 
// 객체에 있는 값을 삭제하고싶을때는 delete 연산자를 사용한다.
 delete Spiderman.gender;

// in 연산자를 사용하여 프로퍼티의 존재여부를 파악할 수 있다.
 'country' in Spiderman ---false
 'age' in Spiderman ---true


// -Boolean(불리언,불린)
// 불린형은 true와 false로 구성되어있다.
 const a = true;
 const b = false;
// 논리연산자를 확인할때 주로 사용된다.
 
 
// -Undefined,null
// Undefined는 변수에 값을 할당하지 않은 상태를 말한다.
 var Unde;  // 변수만 선언하고 값을 할당하지 않은 상태.
 
// null은 비어있는 데이터를 입력한 상태를 말한다.
 var empty = null; // 비어있는 데이터를 변수에 할당한 상태.
```

**3.typeof 연산자**

- **typeof 연산자**를 사용하여 데이터타입을 구분할 수 있다.

```javascript
console.log(typeof 3); // "number" 출력
```

**4.기본 연산자**

- 기본연산자에는 +,-,*,/,% 가 존재한다.
  ***+는 더하기, -는 빼기,\* 는 곱하기, /는 나누기, %는 나머지를 뜻한다.\***

```javascript
console.log(1+1); // 2 출력
console.log(10-5); // 5 출력
console.log(2*2); // 4 출력
console.log(6/3); // 2 출력
console.log(10%3); // 1 출력


const x = 1/0;
console.log(x); // Infinity 출력

console.log("Hello"/2); // NaN 출력 (NaN는 Not a Number의 줄임말이다.)

// %(나머지)는 보통 홀수짝수를 구하거나 어떤수 사이의 값을 반환할때 사용한다.
x%2=1 // 홀수
x%2=0 // 짝수
x%5=0 // 0~4 사이의 값만 반환.
```

- 거듭제곱은 ***(곱하기)를 두번 사용**하면 된다.

```javascript
console.log(2**3); // 8 출력
```

- *와 /는 +-보다 우선순위로 계산되기 때문에 +-를 먼저 계산하고싶다면 ()를 사용해야한다.
- 연산자는 줄여서 사용할 수 있다.

```javascript
let num = 10;
num = num+5; 
num+=5 // 위 식과 동일
```

**5.증가연산자, 감소연산자**

- 증가연산자와 감소연산자는 1씩 더해주거나 빼준다.
- 증가연산자는 **+(더하기)를 두번 사용**하여 나타낸다.

```javascript
let num = 10;
num++; // 11 출력
```

- 감소연산자는 **-(빼기)를 두번 사용**하여 나타낸다.

```javascript
let num = 10;
num--; // 9 출력
```

**❗❗❗주의❗❗❗**

```javascript
let result = num++; // 일 때는 10이 출력된다.
// 다른 변수에 증가연산자와 감소연산자를 사용할때는 위치가 중요하다.

let result = ++num; // 일 경우 num에 1을 더한 값을 출력하고
let result = num++; // 일 경우에는 num을 출력한 뒤에 1을 더한 값을 할당한다.
```

**6.String(문자형)에서의 +**

- ***문자형에서도 +를 사용할 수 있다.***

```javascript
const name = "M.J";
const my = "My";
const who = "name is";

console.log(my + who + name); // "My name is M.J" 출력

const a = "나는";
const age = 21; // 숫자형
const b = "입니다.";

console.log(a + age + '살' + b); // "나는 21살 입니다." 출력
// 이 식에서 age는 숫자형이었지만 출력될땐 문자형으로 바뀌었는데 이를 자동형변환이라고 함.
```

**7.자동형변환**

- 자동형변환은 자동으로 숫자형을 문자형으로 변환해주는것이다.

```javascript
const Math = "90";
const English = "80";
const result = (Math + English) / 2; // 4540  출력
/* 숫자형이 아닌 문자형으로 인식했기에 합한 값이 아닌 앞뒤로 이어붙어진 채 2로 나누어졌다.
여기서 "9080"/2 가 숫자형으로 출력된 이유는 자동형변환때문이다.

이처럼 잦은 오류를 발생시킬 수 있고 오류발생시 원인파악이 어렵기에 좋지않다.
이를 방지하기 위해 명시적 형변환을 사용하는것이 좋다. */
```

**8.명시적 형변환**

- **명시적 형변환**은 ***String, Number, Boolean*** ***세가지가 있다.***

```javascript
// String()은 문자형으로 변환시켜준다.
String(5) // "5"출력

// Number()은 숫자형으로 변환시켜준다.
console.log(Number("87642")); // 87642 출력
// 단, 숫자가 아니고 true와 false가 아닌 문자가 포함된 경우에는 NaN을 출력한다.
Number(true) // 1 출력
Number(false) // 0 출력

/* Boolean() 불리언형으로 변환될때는
숫자0, 빈 문자열'', null, Undefined, NaN는 false가 출력되고
그 외는 true가 출력된다.*/

// *주의*
  Number(null) // 0 출력
  Number(Undefined) // NaN 출력
  Boolean(0) // false 출력
  Boolean('0') // true 출력
  Boolean('') // false 출력
  Boolean(' ') // true 출력
```

**9.비교 연산자**

- 비교 연산자에는 **<,>,<=,>=,==,!=**가 있다.
  (**< : 크다**, **> : 작다**, **<= :크거나같다**, **>= : 작거나같다**, **== : 같다**, **!= : 다르다**)

```javascript
console.log(10>5) // true 출력
console.log(10==5) // false 출력
//  여기서 ==는 동등연산자이다
console.log(10!=5) // true 출력

const a =1; const b = "1";
console.log(a==b); // true 출력
console.log(a===b); // false 출력
// ===는 데이터타입까지 비교한다.
```