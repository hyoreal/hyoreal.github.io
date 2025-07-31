---
layout: post

toc: true

title: "[REACT] Node.js 기초"

comments: true

categories: [Front-End]

tags: [Front-End]
---
---

#### 개발 환경

MAC, VSCode

---

Node.js 기초

![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472932053-99181176-5ced-4804-8bbb-66a9a0749461.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102536Z&X-Amz-Expires=300&X-Amz-Signature=346a734e5ddae749fd691f66fab1bd014cf2a314a34e12319b4a8fbce4c3e2b5&X-Amz-SignedHeaders=host)

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
![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472879806-7338c206-0354-4869-b105-fe359e9f16d8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102328Z&X-Amz-Expires=300&X-Amz-Signature=eb7d84748fa0f34e61430a7a0c8210deedc1ba1aba7ee4ca19cd5c498781deed&X-Amz-SignedHeaders=host)
2. 아래 각자 환경에 맞도록 선택 후 다운
![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472881761-3c809800-79a8-4683-a6b1-d53097926c9f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102400Z&X-Amz-Expires=300&X-Amz-Signature=6f28149cb262f37142e74799be18f84d7d626f2c45cdbebf52d84034ad1315f0&X-Amz-SignedHeaders=host)
3. 터미널 오픈 후 아래 코드 입력하여 정상적으로 다운됐는지 확인
각각 노드 버전 확인, npm 버전 확인 코드.
이미지와 같이 버전이 나오면 정상적인 다운로드 성공.

```
node -v
npm -v
```

![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472886754-d6cdcd1c-5a07-4317-97f1-1c576c594c8f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102423Z&X-Amz-Expires=300&X-Amz-Signature=564b184d9a4aaf6e0c4c899aa34e4644919f6361f5e5cd5bae28d95055abc359&X-Amz-SignedHeaders=host)

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

![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472899773-31c2d1ed-036d-4acf-be26-54317495bfb7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102438Z&X-Amz-Expires=300&X-Amz-Signature=f6902dc2ae9c44b7d260a68a1a49d97801739ee297291caead12a4a5200092b5&X-Amz-SignedHeaders=host)

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

![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472902743-88380516-e20c-4722-8c60-6fcd500be0bd.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102451Z&X-Amz-Expires=300&X-Amz-Signature=c970cb95777934c4c05b42ab920311346e8433d646c387b3792be4e6291fbbaf&X-Amz-SignedHeaders=host)
위 이미지와 같이 package.json 파일이 제대로 생성되었는지 확인한다.
package.json은 터미널에서 확인했던 패키지 정보가 그대로 저장되어있다.

3. index.js 생성
우리가 패키지 설정을 할 때 메인으로 실행될 파일명을 기본으로 index.js로 설정하였다.
그렇기에 해당 패키지에 실행할 index.js를 생성한다.
![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472904276-7827b3eb-f0d5-426a-abcc-dd16e63c10b2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102558Z&X-Amz-Expires=300&X-Amz-Signature=e17e1c4820ff518ddf85a6c9653ebaf79a542e04921a5242aa0413bd30bc96ea&X-Amz-SignedHeaders=host)

4. index.js 실행
터미널에 아래 코드를 입력하여 index.js 에 입력한 console 메세지가 잘 출력되는지 확인한다.
```
node index.js
```

![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472908131-82a568c1-0073-4cf8-b48f-1f4b72372697.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102615Z&X-Amz-Expires=300&X-Amz-Signature=d659a1528d96935a09dccac92bbabe69b93944474b10179fd33f9504f12614a0&X-Amz-SignedHeaders=host)

만약 index.js가 특정 경로에 있다면 경로까지 입력해주어야 한다.
이런 복잡함을 해결하기 위해선 package.json을 수정하면 된다.

![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472909387-61569856-aea9-4eee-af0f-1d3824d354e3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102634Z&X-Amz-Expires=300&X-Amz-Signature=24ba60270d73bd59b3376c8efe513660cabe9fd025d45b6fecee9197cfaec186&X-Amz-SignedHeaders=host)

위 이미지와 같이 script 블럭 내부에 "start" 라는 명령어를 추가한다.

그리고 아래와 같이 입력하면 정상적으로 실행된 걸 확인할 수 있다.
```
npm run start
```
![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472909747-08ae5b8d-778d-4d10-a696-ab89659b9729.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102647Z&X-Amz-Expires=300&X-Amz-Signature=c22396d32ca5809f451cceec155af7b38007aa16ea4d0fb40cc87103fa802f3b&X-Amz-SignedHeaders=host)

### 4. Node.js 모듈 시스템 이해하기

1. Module System : 모듈을 다룰 수 있는 어떠한 시스템. 
    - 관련 코드들을 하나의 코드단위로 캡슐화하는 것을 말한다.
    - 모듈은 객체형태이다.

2. JavaScript의 모듈 시스템
    먼저 필자는 math.js라는 모듈을 하나 생성하였다.
    코드는 아래 이미지와 같다.
    ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472912588-2f9460eb-2a4b-4919-ba34-9ba8017a7073.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102658Z&X-Amz-Expires=300&X-Amz-Signature=095399ee6283e1386c98f6eb7f7fecd9d117d17ba3e370c4f76883eb0ced0808&X-Amz-SignedHeaders=host)

    이 math.js 모듈을 사용하여 대표적인 두가지 방법을 설명하겠다.

    - Common JS(CJS)
        - math.js에서 module.exports를 작성해준다.
        ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472914993-b3343501-b424-490b-97d8-be7e6a6766c3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102709Z&X-Amz-Expires=300&X-Amz-Signature=63e7abe87cdd1add871995d1e70e1e8241195bbaf9801c759058b02b30c5df13&X-Amz-SignedHeaders=host)

        - index.js에서 사용할 모듈을 아래 이미지처럼 가져온다.
        ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472916696-c4a9030c-106a-471f-80bd-42fc9ad4fcc7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102722Z&X-Amz-Expires=300&X-Amz-Signature=125f4de799bed88266234ca63be92b849ba87c785ad97f3ea6cb540f33178576&X-Amz-SignedHeaders=host)

        - npm run start를 실행하면 아래와 같이 나온다.
        ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472916825-c6e37a9f-75ee-47d3-b0f7-1eeb1297386f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102734Z&X-Amz-Expires=300&X-Amz-Signature=3489f99693a9048196cb1f3d32a2436bdce0792343df415f0f4ad17e9626a06d&X-Amz-SignedHeaders=host)

        모듈은 객체이기때문에 아래 코드와 같이 객체분해할당을 사용해도 동일하게 동작한다.
        ```
        const { add, sub } = require("./math");
        console.log(add(1, 2));
        console.log(sub(1, 2));
        ```

        - CommonJSsms 모듈로부터 특정 값을 내보내어 또 다른 모듈에서 require로 불러온 값을 이용하는 방식이다.

    - ES Module(ESM)
        - React에서 사용되는 방식으로 ESM를 사용하기 위해선 package.json에 타입을 지정해줘야한다. 앞으로 이 패키지는 ESM을 사용하겠다는 의미이다.
        ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472918511-755cd8cd-45a0-4a95-94a3-da86dcf9b90c.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102750Z&X-Amz-Expires=300&X-Amz-Signature=2e0512f8ab034fd63134bd409b78b24c571a13ccf19143755478f7400bbab325&X-Amz-SignedHeaders=host)

        이 설정을 유지한채로 Common JS 코드를 실행하게되면 아래와 같이 오류가 발생한다.
        이 오류는 ESM과 CJS를 같이 사용할 수 없다는 오류이다.
        ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472919284-784e864a-95fc-4da8-ada8-3ff2dd1234f4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102757Z&X-Amz-Expires=300&X-Amz-Signature=1c1f46ceebde1450e9e9fbd4c0f24aac6fc085877d4352c51dcf03d92359a4c0&X-Amz-SignedHeaders=host)

        - math.js의 export방식을 아래 이미지와 같이 변경해준다.
        함수 선언 시에 function 앞에 export를 작성하여 이 코드를 생략할 수도 있다.
        export default function으로 함수를 작성하게되면 math 모듈을 대표하는 기본값으로 설정된다.
        ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472922378-ca0a4095-37c3-4552-ae92-36e03338fa32.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102807Z&X-Amz-Expires=300&X-Amz-Signature=e57a15bb4f7de569109be6e9b88ed7c30aec5cfc220ca5b37a48bd852a17474b&X-Amz-SignedHeaders=host)

        - index.js의 require를 지우고 아래와 같이 import방식으로 수정한다.
        CJS처럼 파일명까지만 입력할 경우 오류가 발생하니 __꼭 확장자까지 작성해야한다__.
        기본값을 설정한 경우에는 중괄호 없이 바로 import하면 모듈에서 기본값으로 설정한 함수만 가져온다.
        ![Image](https://github-production-user-asset-6210df.s3.amazonaws.com/102732425/472922945-0fa0e5ad-c3f1-4e82-a2b1-63ff864cdfa0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250731T102816Z&X-Amz-Expires=300&X-Amz-Signature=ac1aca1ab29a3856b58cc9c1429b02ac56966076d15adb60aac079c255134398&X-Amz-SignedHeaders=host)
 
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