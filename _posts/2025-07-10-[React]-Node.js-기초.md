---
layout: post

toc: true

title: "[REACT] Node.js 기초"

comments: true

categories: [Front-End]

tags: [Front-End]
---

Node.js 기초

---

#### 개발 환경

MAC, VSCode

---

<img width="504" height="243" alt="Image" src="https://github.com/user-attachments/assets/e6b0c535-fae4-4220-8d60-ff3e2c52c1ed" />

## Node.js 

> React 배우기 전 Node.js 배우는 이유?
> React.js는 Node.js기반으로 동작하는 기술이기 때문
> Next.js, Vue.js, Svelte 등등 Node.js 기반 기술이 여럿 있음.

### 1. Node.js 란?
웹 브라우저가 아닌 환경에서도 자바스크립트 코드를 실행시켜주는 __JavaScript 실행 환경(Run Time)__

<details>
<summary>JavaScript History</summary>
<div markdown="1">
    자바스크립트는 HTML에 종속된 언어로, 웹 브라우저 내에서만읜 동작을 위해 사용.
    목적이 확실하게 정해진 채로 개발된 언어이기에 JAVA, C언어와는 달리 문법 자체가 유연하고 편리한 생산성에만 중심을 두고 설계됨.
    하여 대부분의 브라우저에는 자바스크립트 엔진을 갖고있어 자바스크립트가 구동됨.
    이런 자바스크립트의 장점으로 인해 많은 개발자들이 웹브라우저에 제한되지 않고 자바스크립트가 사용되기를 바람.

이 자바스크립트의 웹브라우저 내에서만 개발 가능한 단점을 넘어설 수 있기 위해 개발된 것이 Node.js
Node.js는 브라우저 외의 다른 환경에서도 실행 가능하게 해줌
</div>
</details>

### 2. Node.js 설치 과정

1. 구글에 Node.js 검색 후 공식 홈페이지 클릭 (아래 링크 클릭 가능)
   [https://nodejs.org/ko](https://nodejs.org/ko)
   <img width="504" height="243" alt="Image" src="https://github.com/user-attachments/assets/8b19e2aa-e9d1-4535-a207-4497e67891a1" />

2. 아래 각자 환경에 맞도록 선택 후 다운
   <img width="984" height="286" alt="Image" src="https://github.com/user-attachments/assets/8b57a232-e6a1-48eb-9e66-43b14df1e88c" />

3. 터미널 오픈 후 아래 코드 입력하여 정상적으로 다운됐는지 확인
   각각 노드 버전 확인, npm 버전 확인 코드.
   이미지와 같이 버전이 나오면 정상적인 다운로드 성공.

```
node -v
npm -v
```
<img width="492" height="143" alt="Image" src="https://github.com/user-attachments/assets/a2a726cc-fccb-41a1-9806-6f454925ecdf" />

<details>
<summary>NPM</summary>
<div markdown="1">
    NPM (Node Package Manager)
    Node.js프로젝트의 패키지를 관리하는 도구.
    새로운 패키지 생성 및 외부 라이브러리 설치/삭제 시 유용.
</div>
</details>

### 3. Node.js 사용하기

1. Package : Node.js에서 사용하는 프로그램 단위
<details>
<summary>프로그램 단위</summary>
<div markdown="1">
    보통 프로젝트라고 한다.
</div>
</details>

2. 각자 원하는 개발툴을 열어 (필자는 VSCode를 사용한다.) Node.js 패키지 생성 위한 경로 선택 후 아래 코드를 통해 새로운 패키지를 생성한다.
init 은 패키지 초기화/생성의 의미를 갖고있다.
```
npm init
```

<img width="139" height="68" alt="Image" src="https://github.com/user-attachments/assets/d5e067e8-0a3a-4073-883f-f4d547644107" />

위 이미지와 같이 터미널에 메세지가 뜰텐데 설명은 아래에 적겠다.

```
package name: (react_study) nodejs-study // ()안은 생성할 패키지의 이름의 기본값이다. 필자는 nodejs-study로 변경해줬다
version: (1.0.0)                         // 버전은 배포 시에 의미가 있기에 현재는 엔터로 넘어갔다. 
description:                             // 설명은 각자 필요하면 작성하고 엔터로 넘어가도 무관하다.
entry point: (index.js)                  // 메인으로 실행될 파일명을 지정한다.
test command: 
git repository: (https://github.com/hyoreal/REACT_STUDY.git) // 필자는 Git에 연결해뒀기에 뜨지만 공백으로 두고 넘어가도 무관하다.
keywords: 
author: 
license: (ISC) 
About to write to /Users/hyoreal51/REACT_STUDY/package.json: // 위에 우리가 작성한 대로 패키지의 정보를 생성하여 보여준다.

{
  "name": "nodejs-study",
  "version": "1.0.0",
  "description": "리액트 스터디 - SE",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/hyoreal/REACT_STUDY.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/hyoreal/REACT_STUDY/issues"
  },
  "homepage": "https://github.com/hyoreal/REACT_STUDY#readme"
}


Is this OK? (yes)   // 위 정보가 맞다면 엔터로 넘어가 패키지를 생성한다.
```

<img width="554" height="277" alt="Image" src="https://github.com/user-attachments/assets/f481fc4d-e1b4-46c0-a730-fb3f55d12b58" />

위 이미지와 같이 package.json 파일이 제대로 생성되었는지 확인한다.
package.json은 터미널에서 확인했던 패키지 정보가 그대로 저장되어있다.

3. index.js 생성
   우리가 패키지 설정을 할 때 메인으로 실행될 파일명을 기본으로 index.js로 설정하였다.
   그렇기에 해당 패키지에 실행할 index.js를 생성한다.
   <img width="170" height="67" alt="Image" src="https://github.com/user-attachments/assets/cf8ddc42-3056-42d7-97b2-32ca6815d7d5" />
4. index.js 실행
   터미널에 아래 코드를 입력하여 index.js 에 입력한 console 메세지가 잘 출력되는지 확인한다.

```
node index.js
```

<img width="521" height="89" alt="Image" src="https://github.com/user-attachments/assets/7576ecb3-5c54-4fed-9819-844c16ce8684" />

만약 index.js가 특정 경로에 있다면 경로까지 입력해주어야 한다.
이런 복잡함을 해결하기 위해선 package.json을 수정하면 된다.

<img width="367" height="32" alt="Image" src="https://github.com/user-attachments/assets/42eb00b4-19ff-4862-928b-5a23ddb89b48" />

위 이미지와 같이 script 블럭 내부에 "start" 라는 명령어를 추가한다.

그리고 아래와 같이 입력하면 정상적으로 실행된 걸 확인할 수 있다.

```
npm run start
```

<img width="513" height="200" alt="Image" src="https://github.com/user-attachments/assets/a7169445-7aea-40b4-a675-4905ecdc599a" />

### 4. Node.js 모듈 시스템 이해하기

1. Module System : 모듈을 다룰 수 있는 어떠한 시스템.

   - 관련 코드들을 하나의 코드단위로 캡슐화하는 것을 말한다.
   - 모듈은 객체형태이다.
2. JavaScript의 모듈 시스템
   먼저 필자는 math.js라는 모듈을 하나 생성하였다.
   코드는 아래 이미지와 같다.
   
   <img width="311" height="84" alt="Image" src="https://github.com/user-attachments/assets/a3a9a5ac-05b9-4762-af6b-dfe5a2ac82e6" />

   이 math.js 모듈을 사용하여 대표적인 두가지 방법을 설명하겠다.

   - Common JS(CJS)

     - math.js에서 module.exports를 작성해준다.
     
       <img width="445" height="169" alt="Image" src="https://github.com/user-attachments/assets/5f5c1d24-82fc-40ac-b85d-1d3b10e4fa75" />
       
     - index.js에서 사용할 모듈을 아래 이미지처럼 가져온다.
       
       <img width="346" height="288" alt="Image" src="https://github.com/user-attachments/assets/f1ee1055-4edb-445a-ab21-9e18f090f0d1" />
       
     - npm run start를 실행하면 아래와 같이 나온다.
       
       <img width="498" height="149" alt="Image" src="https://github.com/user-attachments/assets/8498719e-b585-4ac9-8cd6-19457341e70e" />

     모듈은 객체이기때문에 아래 코드와 같이 객체분해할당을 사용해도 동일하게 동작한다.

     ```
     const { add, sub } = require("./math");
     console.log(add(1, 2));
     console.log(sub(1, 2));
     ```

     - CommonJSsms 모듈로부터 특정 값을 내보내어 또 다른 모듈에서 require로 불러온 값을 이용하는 방식이다.
   - ES Module(ESM)

     - React에서 사용되는 방식으로 ESM를 사용하기 위해선 package.json에 타입을 지정해줘야한다. 앞으로 이 패키지는 ESM을 사용하겠다는 의미이다.
       
       <img width="336" height="116" alt="Image" src="https://github.com/user-attachments/assets/732597d3-f8b5-4b26-91ff-3b5c319c8c91" />

     이 설정을 유지한채로 Common JS 코드를 실행하게되면 아래와 같이 오류가 발생한다.
     이 오류는 ESM과 CJS를 같이 사용할 수 없다는 오류이다.
     
     <img width="532" height="210" alt="Image" src="https://github.com/user-attachments/assets/14de79a8-3b2c-48ef-ad84-43d272fc363f" />

     - math.js의 export방식을 아래 이미지와 같이 변경해준다.
       함수 선언 시에 function 앞에 export를 작성하여 이 코드를 생략할 수도 있다.
       export default function으로 함수를 작성하게되면 math 모듈을 대표하는 기본값으로 설정된다.
       
       <img width="639" height="229" alt="Image" src="https://github.com/user-attachments/assets/32671c50-3e4a-4834-9c09-d6725be82a70" />
       
     - index.js의 require를 지우고 아래와 같이 import방식으로 수정한다.
       CJS처럼 파일명까지만 입력할 경우 오류가 발생하니 __꼭 확장자까지 작성해야한다__.
       기본값을 설정한 경우에는 중괄호 없이 바로 import하면 모듈에서 기본값으로 설정한 함수만 가져온다.
       
       <img width="268" height="225" alt="Image" src="https://github.com/user-attachments/assets/3801155c-7ce0-48d8-9386-547edef1a956" />

### 5. Node.js 라이브러리 사용하기

1. 라이브러리란?
   프로그램을 개발할 때 필요한 다양한 기능들을 미리 모듈화한것
2. npmjs
   npm의 모든 라이브러리가 등록된 사이트 [https://www.npmjs.com/](https://www.npmjs.com/)
   이 사이트에서 특정 라이브러리를 찾아 터미널에 명령어를 입력하여 새로운 라이브러리를 설치하게 되면 __package.json에 dependencies 항목__이 생성된다.
   그리고 __설치된 라이브러리는 node_modules 폴더에 저장__된다.
   package-lock.json은 이 패키지에서 사용하는 라이브러리들의 상세 정보를 저장해둔다. package.json보다 정확한 정보를 갖고있다.
   설치한 라이브러리는 기존 모듈과 다르게 from 뒤에 라이브러리 이름만 명시해주면 된다.
   만약 node_modules와 package-lock.json이 삭제된 경우 npm i를 통해 package.json에 dependencies에 있는 라이브러리들을 설치하도록 하면 정상적으로 동작한다.

> 출처
> 인프런 한 입 크기로 잘라먹는 리액트(React.js) : 기초부터 실전까지
