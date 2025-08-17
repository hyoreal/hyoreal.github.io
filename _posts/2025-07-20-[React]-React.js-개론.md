---
layout: post

toc: true

title: "[REACT] React.js 개론"

comments: true

categories: [Front-End]

tags: [Front-End]


---

React.js 개론 

---

## React.js

### 1. React.js 란?
- Meta(Facebook)이 개발한 오픈소스 JavaScript 라이브러리
- 대규모 웹 서비스의 UI를 더 편하게 개발하기 위해 만들어짐

### 2. React 특징
1. 컴포넌트 기반 UI 표현
   
    <img width="603" height="347" alt="Image" src="https://github.com/user-attachments/assets/d718225d-c358-4a38-8652-a00b9e70bbf1" />
    
    - 컴포넌트(Component) : 화면을 수정하는 요소. (UI 구성요소)
    - 컴포넌트별로 모듈을 분리하여 중복 코드 제거 및 유지보수성 향상

3. 화면 업데이트 구현이 쉽다
    - 업데이트(Update) : 사용자의 행동에 따라 웹 페이지가 스스로 모습을 바꿔 상호작용하는 것
    - 리액트는 __선언형 프로그래밍 방식__으로 동작하기에 업데이트 구현이 매우 쉬움.
        - 선언형 프로그래밍 : 과정은 생략하고 목적만 간결히 명시하는 방법
            - 업데이트를 위한 복잡한 동작을 직접 정의할 필요 없이 특정 변수값을 바꾸는 것만으로 화면 업데이트 가능
        - 명령형 프로그래밍 : 목적을 이루기 위한 모든 일련의 과정을 설명하는 방법

4. 화면 업데이트가 빠르게 처리됨
    - 브라우저 렌더링 과정 (Critical Rendering Path)
    <img width="805" height="361" alt="Image" src="https://github.com/user-attachments/assets/d84e72a0-8193-400c-9967-9d9ed1bc2170" />
    
    1. HTML/CSS가 각각 DOM과 CSS Object Model(CSSOM)으로 변환
        - DOM (Document Object Model) : html을 브라우저가 이해하기 쉬운 방식으로 변한 형태의 객체. 요소들의 위치, 배치, 모양에 관한 모든 정보가 담김
        <img width="785" height="367" alt="Image" src="https://github.com/user-attachments/assets/4d3ecd20-9965-438c-b555-50193e38f7cd" />

        - CSSOM (CSS Object Model) : CSS가 브라우저가 이해하기 쉬운 형태로 변환한 객체. 요소들의 스타일과 관련된 모든 정보가 담김.
    2. DOM과 CSSOM을 합쳐 __Render Tree__ 생성
        - Render Tree: 웹 페이지의 청사진. (설계도와 같음)
    3. Layout 작업 수행 : 요소들의 배치를 잡는 작업. (Reflow: DOM 수정 시 재작업. 오랜 시간 소요)
    4. Painting 작업 수행 : 실제로 화면에 그려내는 작업. (Repaint: DOM 수정 시 재작업. 오랜 시간 소요)

    - 화면 업데이트는 언제?
        - JavaScript 가 DOM을 수정하면 업데이트 발생
        <img width="803" height="312" alt="Image" src="https://github.com/user-attachments/assets/1edefc55-54a8-4caa-83c9-b158c760afe2" />

        - DOM이 수정되면 Critical Rendering Path의 전체 단계를 다시 진행.
        - Reflow, Repaint가 많이 발생하게되면 성능 악화.
            - 자바스크립트로 이와 같은 상황 방지 위해선 동시에 발생한 업데이트를 변수 등으로 모아 한번에 수정할 수 있도록 일련의 과정을 넣어줘야함.
            ##### 리액트는 이 과정을 자동으로 진행해줌. (Virtual DOM)
            <img width="797" height="242" alt="Image" src="https://github.com/user-attachments/assets/c231d8c5-486d-4751-89bd-6dbab23a5546" />

    - __Virtual DOM__
        - DOM을 자바스크립트 객체로 흉내낸 것. 일종의 복제.
        - React는 업데이트가 발생하면 실제 DOM을 수정하기 전 복제된 DOM에 먼저 반영 후 실제 DOM과 비교하여 변경이 발생한 부분 모아 한번만 업데이트함.

### 3. React App 생성하기

1. React Application : React로 만든 웹서비스
React는 프레임워크가 아닌 npm 라이브러리임.
하여 Node.js 패키지 생성 -> React 라이브러리 설치 -> .. 와 같은 일련의 과정으로 설치해야하지만 복잡함.
React 공식 홈페이지에서 권장하는 Vite를 사용하는 방식이 좀 더 간단함.

2. Vite
    - 차세대 프론트엔드 개발툴
    - 기본 설정이 적용된 React App 생성 가능

3. VSCode에서 리액트앱 생성할 폴더 열기

4. 터미널에 아래와 같이 입력 (가장 최신 버전으로 생성)
   
```
npm create vite@latest
```
아래 이미지와 같이 선택. (프로젝트명은 각자 알아서)

<img width="533" height="326" alt="Image" src="https://github.com/user-attachments/assets/0d9f15f7-d4f2-497e-ad35-36b7e82069bd" />

위 방법을 따라가면 아래와 같이 폴더가 생성된다.

<img width="168" height="245" alt="Image" src="https://github.com/user-attachments/assets/2271c6da-ea5f-4161-93ac-015b6b75a068" />

5. package.json
   
```
{
  "name": "onebite-react",  -- 프로젝트명
  "private": true,
  "version": "0.0.0",       -- 버전
  "type": "module",         -- ES Module 사용
  "scripts": {              -- 개발 중 사용하게될 스크립트
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {         -- 사용할 라이브러리
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {      -- 개발중에만 사용할 라이브러리
    "@eslint/js": "^9.30.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.6.0",
    "eslint": "^9.30.1",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "vite": "^7.0.4"
  }
}
```

6. package.json만 생성되어있으니 npm을 사용하여 라이브러리 다운로드

<img width="388" height="118" alt="Image" src="https://github.com/user-attachments/assets/c0fa320d-399c-4181-9ddd-2e5068c39c8a" />

아래 이미지와 같이 node_modules와 package-lock.json이 생성된걸 확인할 수 있다

<img width="164" height="245" alt="Image" src="https://github.com/user-attachments/assets/3523213b-b1f2-4a11-a474-03360e9f51af" />

7. 각 폴더 별 설명
    - public: 이미지, 폰트, 동영상 등의 정적 파일 보관
    - src: 실제 작성한 react나 JavaScript 코드 보관
        - assets : 이미지 등 정적 파일 보관 
        - .jsx : 리액트 코드
        - eslint.cjs: 일정한 규칙에 맞는 코드 컨벤션을 유지하게 해주는 도구.
        - .gitignore : github에 올리지 않을 파일들을 설정
        - index.html : 리액트 앱의 기본 틀 역할을 하는 html 코드 파일
        - vite.config.js : vite 옵션 설정 파일

8. 리액트 앱 실행
package.json에 작성되어있던 script 중 dev를 사용해서 실행 가능

<img width="303" height="158" alt="Image" src="https://github.com/user-attachments/assets/bb507517-f666-4fca-bb75-ec04875fba53" />

터미널에 출력된 localhost의 포트로 접속 가능

### 4. React App 구동원리
1. React App은 어떻게 구동?
    1. React App 생성 - npm create vite@latest
    2. React App 가동 - npm run dev
    3. React App 접속 - http://localhost:5173

2. React Application? 
    - http://localhost:5173 이 주소는 어디서 나온걸까? 
        - Vite로 설치한 React App에 웹서버가 내장.
        - npm run dev는 React App 웹서버를 가동시키는 명령어.
            - localhost: 현재 사용중인 컴퓨터 주소. 127.0.0.1이 localhost를 가리키는 루프백 주소임

3. React 앱의 렌더링
    - 실행 후 주소 접속 시 index.html을 브라우저에게 전송
    - index.html에 있는 스크립트 태그를 통해 요소 불러옴
        - ReactDOM.createRoot() : 인수로 전달받은 html 요소를 리액트의 루트로 만들어줌
    - 임포트한 컴포넌트로 요소를 추가해줌
        - 컴포넌트 : 함수가 html태그를 리턴하고 있으면 컴포넌트라고 부름


> 출처

> 인프런 한 입 크기로 잘라먹는 리액트(React.js) : 기초부터 실전까지


