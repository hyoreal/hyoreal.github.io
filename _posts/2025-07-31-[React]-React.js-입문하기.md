---
layout: post

toc: true

title: "[REACT] React.js 입문하기"

comments: true

categories: [Front-End]

tags: [Front-End]


---

React.js 입문하기

---

## React.js 입문하기

### 1. 실습 준비하기
1. 이전 포스팅대로 리액트 앱 생성
2. 불필요한 소스파일 삭제
    - ./public/vite.svg
    - ./src/assets/react.svg
    - ./src/App.css 내부 소스만 삭제
    - ./src/index.css 내부 소스만 삭제
    - ./src/App.jsx
        - import reactLogo from './assets/react.svg'
        - import viteLogo from '/vite.svg'
        - import { useState } from 'react'
        - const [count, setCount] = useState(0)
        - return 아래 코드로 변경
        - 
        ```
        return {
            <>
                <h2>Hello React!</h2>
            </>
        } 
        ```
        
    - ./src/main.jsx
        - <React.StrictMode></React.StrictMode> 삭제 후 <App />만 남김
            - StrictMode : 작성한 코드에 잠재적인 문제가 있는지 내부적으로 검사해 경고해주는 도구.
3. React 실습에 도움되는 도구 설치
    - ESLint : 작성한 코드를 정적으로 검사하여 오류 발생할만한 코드가 있다면 경고를 띄워주는 도구.
        - ./src/.eslintrc.cjs애 몇가지 옵션 사용 끄기. (아래 코드와 동일하게 rules 부분 수정)
          
        ```
        import js from '@eslint/js'
        import globals from 'globals'
        import reactHooks from 'eslint-plugin-react-hooks'
        import reactRefresh from 'eslint-plugin-react-refresh'
        import { defineConfig, globalIgnores } from 'eslint/config'

        export default defineConfig([
        globalIgnores(['dist']),
        {
            files: ['**/*.{js,jsx}'],
            extends: [
            js.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            ],
            languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
            },
            rules: {
            'no-unused-vars': "off", // 코드 상 실제로 사용하지 않는 변수를 알려주는 설정.
            'react/prop-types': "off" // 리액트를 안전하게 사용할 수 있도록 하는 설정. 입문자에겐 혼란을 초래할 수 있음.
            },
        },
        ])
        ```

### 2. React Component
1. 리액트의 컴포넌트란?
    - 아래 예시와 같이 html을 반환하는 함수를 __컴포넌트__ 라고 한다.
    - 컴포넌트를 부를땐 함수명을 사용하여 부른다.
        - 아래 예시 컴포넌트는 __App 컴포넌트__라고 부른다.
    - 화살표 함수로 만들어도 동일하다.
    - 클래스를 이용해서도 생성이 가능하지만 코드의 양이 방대해지기 때문에 함수를 사용하여 컴포넌트를 만드는 것이 일반적이며 권장하는 방법이다.
    - 컴포넌트 생성 시에는 함수명이 반드시 대문자로 시작해야한다.
        - 소문자로 만들게 되면 리액트가 컴포넌트로 인식하지 않는다.
          
    ```
    function App() {
        return (
            <>
                <h1>Hello React!</h1>
            </>
        )
    }

    // 위 코드와 아래 화살표함수 코드는 동일하게 App 컴포넌트이다.
    // const App = () => {
    //    return (
    //         <>
    //             <h1>Hello React!</h1>
    //         </>
    //     )
    // }

    function app2() {
        return (
            <>
                <h1>이 함수는 컴포넌트로 인식 불가</h1>
            </>
        )
    }
    ```

2. 하나의 파일에서 여러개의 컴포넌트를 만들었을때

```
// App.jsx

import './App.css'

function Header() {
  return (
    <header>
      <h1>Header</h1>
    </header>
  )
}

function App() {
  return (
    <>
      <Header /> // 다른 컴포넌트의 리턴문 내부에 포함되는 컴포넌트는 자식 컴포넌트라고 한다.
      <h1>Hello React!</h1>
    </>
  )
}

export default App
```

    - 리액트의 모든 컴포넌트들은 화면에 렌더링되기 위해서는 main.jsx에서 createRoot로 작성한 리액트 __루트 컴포넌트__의 자식 컴포넌트로 포함되어야만 한다.
    - 최상위에 위치한 컴포넌트를 __루트 컴포넌트__ 라고 한다.
        - 모든 컴퍼넌트들의 뿌리역할을 한다는 의미이다.

3. 컴포넌트 별로 분리하기
    - App.jsx의 Header 컴포넌트를 분리하겠다.

    <img width="170" height="158" alt="Image" src="https://github.com/user-attachments/assets/c6054dab-f907-44d7-89c6-0b95c869b64a" />

    - 위 이미지와 같이 컴포넌트를 모아두기 위한 components 폴더를 생성하여 하위에 Header.jsx파일을 생성한다.
        - Header.jsx의 내부 소스는 App.jsx에 만들었던 Header 컴포넌트를 잘라내어 가져온다. 아래 소스와 같다.
          
        ```
        // Header.jsx

        function Header() {
            return (
                <header>
                    <h1>Header</h1>
                </header>
            )
        }

        export default Header
        ```

        - App.jsx는 아래와 같이 수정한다.
          
        ```
        import './App.css'
        import Header from './components/Header' // 이전 포스팅에서 ES Module은 확장자까지 작성해야한다고 하였지만 vite로 생성한 리액트앱은 확장자를 작성하지 않아도 해당 파일을 찾아갈 수 있도록 내부적인 설정이 되어있다.

        function App() {
            return (
                <>
                    <Header />
                    <h1>Hello React!</h1>
                </>
            )
        }

        export default App
        ```

4. 계층 구조로 컴포넌트 생성하기
    - 필자는 아래 구조로 컴포넌트를 생성하였다.
        - App : 루트 컴포넌트
            - Header : 자식 컴포넌트
            - Main : 자식 컴포넌트
            - Footer : 자식 컴포넌트
              
    ```
    // Header.jsx
    function Header() {
        return (
            <header>
                <h1>Header</h1>
            </header>
        )
    }

    export default Header
    ```

    ```
    // Main.jsx
    function Main() {
        return (
            <main>
                <h1>Main</h1>
            </main>
        )
    }

    export default Main
    ```

    ```
    // Footer.jsx
    function Footer() {
        return (
            <footer>
                <h1>Footer</h1>
            </footer>
        )
    }

    export default Footer
    ```

    ```
    // App.jsx
    import './App.css'
    import Header from './components/Header'
    import Main from './components/Main'
    import Footer from './components/Footer'

    function App() {
        return (
            <>
                <Header />
                <Main />
                <Footer />
            </>
        )
    }

    export default App
    ```

### 2. JSX로 UI 표현하기
1. JSX란?
    - JSX (JavaScript Extensions) : 확장된 자바스크립트 문법
    - 자바스크립트 코드 안에 HTML코드를 삽입할 수 있게 하는 확장된 자바스크립트 문법.
    - 변수를 바로 html에 넣어 렌더링 할 수 있다.

2. JSX 특징
    - 변수를 바로 html에 넣어 렌더링 할 수 있다.
        - html에 자바스크립트 표현식을 넣을때는 중괄호를 사용하여 넣는다.
            - 자바스크립트 표현식 : 삼항연산자, 변수명 등 한 줄로 특정 값으로 평가될 수 있는 코드
            - if나 for문은 한 줄로 평가될 수 없는 값이기에 오류가 발생한다.
              
    ```
    function Footer() {
        const myName = "HyoReal";

        return {
            <footer>
                <h1>안녕 내 이름은 {myName}이야</h1>
            </footer>
        }
    }
    ```
    
    - JSX에서는 숫자, 문자열, 배열의 값만 정상적으로 렌더링된다
        - 분리형 값이나 boolean, undefined, null과 같은 값은 오류는 발생하지 않아도 값이 렌더링되지는 않는다.
        - Object를 중괄호에 넣게되면 WhiteScreen 발생
            - 객체 자체는 리액트가 렌더링 할 수 없음

    - 모든 태그는 닫혀있어야 한다. 
        - 셀프클로징이나 별도의 닫는 태그는 필수로 있어야한다.

    - 최상위태그는 반드시 하나여야한다.
        - 최상위태그 : return문의 소괄호 안에서 가장 높은 위치에 있는 메인태그
        - 적절한 최상위 태그가 없는 경우 빈 태그로라도 묶어줘야한다

### 3. JSX를 사용하여 메인 컴포넌트가 조건에 따라 각각 다른 UI를 보여주도록 구현하기

```
// Main.jsx

const Main = () => {
    const user = {
        name: "Hyoreal"
        , isLogin: true
    }

    return <> 
        {user.isLogin ? <div>로그아웃</div> : <div>로그인</div>}
    </>;
}
```

### 4. JSX 문법 상에서 DOM 요소에 스타일 적용하기
1. 요소에 직접 스타일 속성 설정하기
   
```
// Main.jsx

const Main = () => {
    const user = {
        name: "Hyoreal"
        , isLogin: true
    }

    return <> 
        {user.isLogin ? <div style={{backgroundColor: red;}}>로그아웃</div> : <div>로그인</div>}
    </>;
}
```

- 스타일 요소는 객체를 전달하기 때문에 중괄호를 두번 사용해야한다.
- 요소의 스타일 속성을 직접 전달하는 경우 - 로 연결된 규칙이 아닌 CamelCase규칙으로 작성해야한다.
    - ex) ~~background-color~~ __backgroundColor__

2. 컴포넌트를 위한 CSS파일 생성하여 스타일 속성 설정하기
   
```
// Main.css

.logout {
    background-color: red;
}
```

```
// Main.jsx

import "./Main.css";

const Main = () => {
    const user = {
        name: "Hyoreal"
        , isLogin: true
    }

    return <> 
        {user.isLogin ? <div className="logout">로그아웃</div> : <div>로그인</div>}
    </>;
}
```

- css 파일을 만들어 스타일을 작성하고 jsx에서 import하여 사용한다.
    - 단, JSX에서는 자바스크립트와 HTML을 함께 사용하고 있어 Javascript의 예약어인 class는 사용불가하면 __className__ 로 작성해야한다.

### 5. Props로 데이터 전달하기

1. Props란?

    <img width="320" height="282" alt="Image" src="https://github.com/user-attachments/assets/b6e74bbc-4c7e-4204-a509-562933e2062a" />

    <img width="744" height="321" alt="Image" src="https://github.com/user-attachments/assets/6964e97d-d5f2-4d6e-a3ae-c44eadfec77d" />

    - 컴퍼넌트에 전달된 값들을 Props라고 한다.
    - Props를 사용하면 컴퍼넌트를 함수 호출하듯이 전달된 값에 따라 다른 UI를 렌더링 할 수 있다
    - __Props는 리액트의 핵심개념 중 하나이다__

    <img width="502" height="154" alt="Image" src="https://github.com/user-attachments/assets/05a527e9-d737-4c66-9741-4667f7b164f3" />

    ```
    import './App.css'
    import Button from './components/Button'

    function App() {
        return (
            <>
                <Button text={"메일"} />
                <Button text={"카페"} />
                <Button text={"블로그"} />
            </>
        )
    }

    export default App
    ```

    <img width="157" height="77" alt="Image" src="https://github.com/user-attachments/assets/257c94ee-d17a-4b22-8cfb-91513856fb63" />

    - 위와 같이 자식 컴퍼넌트에 props를 전달해주면 이 값들은 객체로 묶어 자식 컴퍼넌트의 매개변수로 받을 수 있다

    ```
    function App() {
        return (
            <>
                <Button text={"메일"} color={"red"} />
                <Button text={"카페"} color={"blue"} />
                <Button text={"블로그"} />
                <Button>
                    <div>자식요소</div>
                </Button>
            </>
        )
    }
    ```
    - 위처럼 요소에 자식이 있는 경우 컴포넌트에서 구조분해할당을 통해 children이라는 이름의 props로 전달된다.
        - 자식 컴포넌트도 동일하게 전달이 가능하다.

### 6. 이벤트 핸들링

1. 이벤트핸들링이란?
    - Event : 웹 내부에서 발생하는 사용자 행동
    - Handling : 처리하다
    - Event Handling : 이벤트가 발생했을때 그것을 처리하는 것
    - 기존 JSP처럼 콜백함수처럼 사용하면 된다
      
    ```
    // Button.jsx
    const Button = ({text, color = "black"}) => {
        return <button onClick={() => {console.log(text + "클릭")}} style={{color: color}} >{text}</button>
    }

    export default Button
    ```

2. 이벤트객체
    - 리액트에서 발생하는 모든 이벤트들은 이벤트 핸들러 함수를 호출할때 매개변수로 이벤트 객체를 제공.
      
    ```
    // Button.jsx
    const Button = ({text, color = "black"}) => {
        return <button onClick={(e) => {console.log(e)}} style={{color: color}} >{text}</button>
    }

    export default Button
    ```

    <img width="585" height="50" alt="Image" src="https://github.com/user-attachments/assets/374e8589-b8f2-4985-b4b3-e29346203b39" />

    - SyntheticBaseEvent : 합성 이벤트 객체
        - Synthetic Base Event : 모든 웹 브라우저의 이벤트 객체를 하나로 통일한 형태
            - 다양한 브라우저마다 자바스크립트나 CSS의 기능이 어떻게 동작하는지, 지원하는지가 모두 다름
                - 브라우저 별 확인 사이트 [https://caniuse.com/](https://caniuse.com/)
        - Cross Browsing Issue : 브라우저마다 이벤트 객체에 이벤트가 현재 발생한 요소를 가져오는 속성도, 규격, 동작방식이 모두 다름.
        - Cross Browsing Issue를 편리하게 해결해 주는 것이 합성 이벤트 객체
        - 여러 브라우저들의 규격을 참고하여 하나의 통일된 규격으로 만들어둔 것.

### 7. State - 상태 관리하기
- Props와 더불어 __리액트의 핵심 개념 중 하나__
- State : 현재 가지고 있는 형태나 모양을 정의. 변화할 수 있는 동적인 값.
- 리액트의 컴포넌트들은 모두 상태를 가질 수 있음

<img width="652" height="291" alt="Image" src="https://github.com/user-attachments/assets/2bf302f4-d150-417e-978f-5c8cbe5dfba9" />

- 컴포넌트의 State는 상태를 갖고있는 변수임
    - State가 바뀌면 리액트는 자동으로 다시 렌더링해줌
        - Re-Render / Re-Rendering : 컴포넌트가 다시 렌더링되는 상황

<img width="319" height="367" alt="Image" src="https://github.com/user-attachments/assets/91b5f430-1ee2-453a-a9f7-27b8a30ff236" />

- 하나의 컴포넌트가 여러개의 state를 가질 수 있음

```
// App.jsx
import { useState } from "react"

function App() {
  const state = useState();
  console.log(state);
}

export default App
```

<img width="230" height="85" alt="Image" src="https://github.com/user-attachments/assets/07b48361-76e6-4b4b-903c-91d045f01490" />

- state 배열의 첫번째 요소는 새롭게 생성된 state의 값

```
// App,.jsx
import { useState } from "react"

function App() {
  const state = useState(0);
  console.log(state);
}

export default App
```

<img width="226" height="97" alt="Image" src="https://github.com/user-attachments/assets/6ecd753d-25c5-4866-82da-319f3aa57de9" />

- useState의 인수로 초기값을 넣어주면 state의 값이 바뀐걸 확인할 수 있음
- 두번째 요소는 state의 값을 변경하는 함수. __상태 변화 함수__
- state를 사용하는 이유? 
    - 변수로 상태를 선언하여 값을 업데이트해주면 Re-Rendering이 일어나지 않음.
    - 리액트는 state의 값이 변화했을때만 리렌더링을 진행함!

### 8. 리액트 컴포넌트 리렌더링 발생 상황
1. 자신이 관리하는 state값이 변경될때
2. 자신이 제공받는 props의 값이 변경될때
3. 부모 컴포넌트 리렌더링 시 자식 컴포넌트로 리렌더링

```
import { useState } from "react"

const Bulb = ({ light }) => {
  return (
    <div>{light === "ON" ? (<h1 style={{ backgroundColor: "orange" }}>ON</h1>) 
          : (<h1 style={{ backgroundColor: "gray" }}>OFF</h1>)}</div>
  )
}

function App() {
  const [ count, setCount ] = useState(0);
  const [ light, setLight ] = useState("OFF");
  return (
    <>
      <div>
        <Bulb light={light} />
        <button onClick={() => {
          setLight(light === "ON" ? "OFF" : "ON");
        }}>
          {light === "ON" ? "끄기" : "켜기"}
        </button>
      </div>
      <div>
        <h1>{count}</h1>
        <button onClick={() => {
          setCount(count + 1);
        }}>
          +
        </button>
      </div>
    </>
  )
}

export default App
```

- count 버튼을 클릭하게되면 App 컴포넌트가 가진 count의 state가 업데이트됨
- App 컴포넌트 리렌더링 시 자식 컴포넌트 모두 리렌더링 진행 
- count와 상관없는 Bulb 컴포넌트도 함께 리렌더링 진행됨 

- 위와 같이 부모 컴포넌트의 리렌더링으로 인해 불필요한 자식컴포넌트까지 리렌더링 진행됨.
    - 자식이 많아질수록 성능저하
    - 이런 경우를 방지하기 위해 관련없는 두개의 state를 하나의 컴포넌트에 넣기보단 서로 다른 컴포넌트로 분리하는게 좋음

    ```
    // 개선된 App.jsx
    import { useState } from "react"

    const Bulb = () => {
        const [ light, setLight ] = useState("OFF");

        return (
            <div>
                <div>{light === "ON" ? (<h1 style={{ backgroundColor: "orange" }}>ON</h1>) 
                    : (<h1 style={{ backgroundColor: "gray" }}>OFF</h1>)}</div>
                <button onClick={() => {
                    setLight(light === "ON" ? "OFF" : "ON");
                }}>
                    {light === "ON" ? "끄기" : "켜기"}
                </button>
            </div>
        )
    }

    const Counter = () => {
        const [ count, setCount ] = useState(0);
        
        return (
            <div>
                <h1>{count}</h1>
                <button onClick={() => {
                    setCount(count + 1);
                }}>
                    +
                </button>
            </div>
        )
    }

    function App() {
        return (
            <>
                <Bulb />
                <Counter />
            </>
        )
    }

    export default App
    ```

    - 더 나아가 컴포넌트 별로 분리할 수 있다
      
    ```
    // App.jsx

    import Bulb from './components/Bulb'
    import Counter from './components/Counter'

    function App() {
        return (
            <>
                <Bulb />
                <Counter />
            </>
        )
    }

    export default App
    ```

    ```
    // Bulb.jsx
    import { useState } from "react"

    const Bulb = () => {
        const [ light, setLight ] = useState("OFF");

        return (
            <div>
                <div>{light === "ON" ? (<h1 style={{ backgroundColor: "orange" }}>ON</h1>) 
                    : (<h1 style={{ backgroundColor: "gray" }}>OFF</h1>)}</div>
                <button onClick={() => {
                    setLight(light === "ON" ? "OFF" : "ON");
                }}>
                    {light === "ON" ? "끄기" : "켜기"}
                </button>
            </div>
        )
    }

    export default Bulb
    ```

    ```
    // Counter.jsx
    import { useState } from "react"

    const Counter = () => {
        const [ count, setCount ] = useState(0);
        
        return (
            <div>
                <h1>{count}</h1>
                <button onClick={() => {
                    setCount(count + 1);
                }}>
                    +
                </button>
            </div>
        )
    }

    export default Counter
    ```

### 9. State로 사용자 입력 관리하기

```
// Register.jsx
// 간단한 회원가입 폼
// 1. 이름
// 2. 생년월일
// 3. 국적
// 4. 자기소개

import { useState } from "react"

const Register = () => {
    const [ name, setName ] = useState("");
    const [ birth, setBirth ] = useState(new Date());
    const [ country, setCountry ] = useState("");
    const [ bio, setBio ] = useState("");

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeBirth = (e) => {
        setBirth(e.target.value);
    }

    const onChangeCountry = (e) => {
        setCountry(e.target.value);
    }

    const onChangeBio = (e) => {
        setBio(e.target.value);
    }
    
    return (
        <div>
            <input value={name} onChange={onChangeName} placeholder={"이름"} />
            <input type="date" value={birth} onChange={onChangeBirth} />
            <div>
                <select value={country} onChange={onChangeCountry}>
                    <option value=""></option>
                    <option value="kr">한국</option>
                    <option value="us">미국</option>
                    <option value="jp">일본</option>
                </select>
            </div>
            <textarea value={bio} onChange={onChangeBio} />
        </div>
    )
}

export default Register
```

```
// App.jsx

import Register from './components/Register'

function App() {
  return (
    <>
      <Register />
    </>
  )
}

export default App
```

- 기본적인 회원가입 인풋을 만든 화면이다.
- 동일한 구조의 동일해보이는 코드가 많다.
- 아래와 같이 리팩토링할 수 있다.

```
// 간단한 회원가입 폼
// 1. 이름
// 2. 생년월일
// 3. 국적
// 4. 자기소개

import { useState } from "react"

const Register = () => {
    const [ input, setInput ] = useState({
        name: "",
        birth: "",
        country: "",
        bio: ""
    })

    const onChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }
    
    return (
        <div>
            <input name="name" value={input.name} onChange={onChange} placeholder={"이름"} />
            <input name="birth" type="date" value={input.birth} onChange={onChange} />
            <div>
                <select name="country" value={input.country} onChange={onChange}>
                    <option value=""></option>
                    <option value="kr">한국</option>
                    <option value="us">미국</option>
                    <option value="jp">일본</option>
                </select>
            </div>
            <textarea name="bio" value={input.bio} onChange={onChange} />
        </div>
    )
}

export default Register
```

### 10. useRef - 컴포넌트의 변수 생성하기
- useRef란?
    - useRef (useReference) : 컴포넌트 내부에 새로운 Reference 객체를 생성하는 기능
        - 이 레퍼런스 객체는 컴퍼넌트 내부의 변수로 일반적인 값을 저장할 수 있음
        - useState와 달리 어떤 경우에도 리렌더링하지않음
    - 컴포넌트가 렌더링하는 특정 DOM요소에 접근 가능함
        - 해당 요소를 조작하는 것 또한 가능

1. 레퍼런스 객체 활용법
   
```
import { useState, useRef } from "react"

const Register = () => {
    const [ input, setInput ] = useState({
        name: "",
        birth: "",
        country: "",
        bio: ""
    });

    // const refObj = useRef(); // 새로운 레퍼런스 오브젝트 생성
    // console.log(refObj);  // {current: undefined}
    const countRef = useRef(0); // 초기값 설정
    // console.log(countRef); // {current: 0} 초기값 적용됨

    const onChange = (e) => {
        countRef.current++; // 해당 인풋에 몇번의 수정이 발생했는지 count
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }
    
    return (
        <div>
            <div>
                <input name="name" value={input.name} onChange={onChange} placeholder={"이름"} />
            </div>
            <div>
                <input name="birth" type="date" value={input.birth} onChange={onChange} />
            </div>
            <div>
                <select name="country" value={input.country} onChange={onChange}>
                    <option value=""></option>
                    <option value="kr">한국</option>
                    <option value="us">미국</option>
                    <option value="jp">일본</option>
                </select>
            </div>
            <textarea name="bio" value={input.bio} onChange={onChange} />
        </div>
    )
}

export default Register
```

2. 레퍼런스 객체를 생성하여 컴퍼넌트가 렌더링하는 DOM 요소 접근 및 조작
   
```
import { useState, useRef } from "react"

const Register = () => {
    const [ input, setInput ] = useState({
        name: "",
        birth: "",
        country: "",
        bio: ""
    });

    // const refObj = useRef(); // 새로운 레퍼런스 오브젝트 생성
    // console.log(refObj);  // {current: undefined}
    const countRef = useRef(0); // 초기값 설정
    // console.log(countRef); // {current: 0} 초기값 적용됨

    const onChange = (e) => {
        countRef.current++;
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }

    const inputRef = useRef();
    const onSubmit = (e) => {
        if (input.name === "") {
            inputRef.current.focus();
        }
    }
    
    return (
        <div>
            <div>
                <input ref={inputRef} name="name" value={input.name} onChange={onChange} placeholder={"이름"} />
            </div>
            <div>
                <input ref={inputRef} name="birth" type="date" value={input.birth} onChange={onChange} />
            </div>
            <div>
                <select ref={inputRef} name="country" value={input.country} onChange={onChange}>
                    <option value=""></option>
                    <option value="kr">한국</option>
                    <option value="us">미국</option>
                    <option value="jp">일본</option>
                </select>
            </div>
            <div>
                <textarea ref={inputRef} name="bio" value={input.bio} onChange={onChange} />
            </div>

            <button onClick={onSubmit}>제출</button>
        </div>
    )
}

export default Register
```

- useRef 사용 이유?
    - 리액트의 useRef 변수들은 컴퍼넌트라 리렌더링되어도 변수가 리셋되지않음
    - 그렇다고 변수를 컴퍼넌트 외부에서 선언하여 사용한다면 해당 컴포넌트를 여러번 사용했을때 여러개의 컴포넌트가 같은 변수를 공유하는 일이 발생함
        - 리액트에서도 정말 특별한 경우가 아니라면 컴포넌트 외부 변수 선언하는 것은 권장하지 않음

### 11. React Hooks
- React Hooks란?
    - React Hooks : 클래스 컴포넌트의 기능을 함수 컴포넌트에서도 이용할 수 있도록 도와주는 메서드
    - 2017년 이전 React
        - Class 컴포넌트 : 모든 기능을 이용할 수 있음
            - 문법 복잡
        - Function 컴포넌트 : UI 렌더링만 할 수 있음
        - 위 단점을 보안하기 위해 Class 컴포넌트의 기능을 함수 컴포넌트에서도 사용할 수 있게 하는 기능 __React Hooks__ 를 개발.
    - useState, useRef도 React Hooks임
        - useState: State기능을 낚아채오는 Hook
        - useRef: Reference 기능을 낚아채오는 Hook
    - React Hooks에는 __use__ 라는 접두사가 붙음
    - 각각의 메서드들은 hook이라고 함
    - 리액트 hooks들은 함수 컴포넌트 내부에서만 호출 가능
    - 조건문, 반복문 내부에서는 호출 불가
    - use 접두사를 사용하여 나만의 hook 제작 가능 (Custom Hook)

```
import { useState } from "react"

// 3가지 hook 관련된 팁
// 1. 함수 컴포넌트, 커스텀 훅 내부에서만 호출 가능
// 2. 조건부 호출 불가
// 3. 나만의 훅(Custom Hook) 직접 만들 수 있다

// 일반 자바스크립트 함수에서 React Hooks 호출 시 오류 발생
// function getInput() {
//     const [input, setInput] = useState("");

//     const onChange = (e) => {
//         setInput(e.target.value);
//     };

//     return [input, onChange]
// }

// use 접두사를 붙여 Custom Hook 생성 시 React Hooks 사용 가능
function useInput() {
    const [input, setInput] = useState("");

    const onChange = (e) => {
        setInput(e.target.value);
    };

    return [input, onChange]
}

const HookExam = () => {
    const [input, onChange] = useInput();

    return (
        <div>
            <input value={input} onChange={onChange} />
        </div>
    )
}

export default HookExam;
```

- 보통은 커스텀 훅은 src 디렉토리 하위에 Hooks라는 별도의 폴더를 만들어 분리하는게 일반적임

	1. 직접 node.js 사용자 정의 모듈과 package 와 임포트 경로 차이 이유알아오기?
		Node.js에서 사용자 정의 모듈과 package.json에 정의된 모듈의 임포트 경로가 다른 이유는 모듈 탐색 방식 때문
		사용자 정의 모듈 (상대/절대 경로)
		사용자 정의 모듈은 파일 시스템 경로를 사용합니다.
			• 상대 경로: require('./my-module.js')와 같이 현재 파일의 위치를 기준으로 다른 파일을 찾음
			• 절대 경로: require('/home/user/project/my-module.js')와 같이 시스템의 루트 디렉터리부터 시작하는 완전한 경로를 사용
		이 방식은 파일이 어디에 있는지 정확하게 알려주므로, Node.js는 별도의 추가 탐색 없이 해당 경로에서 바로 파일을 로드합니다.
		package.json에 정의된 모듈 (이름)
		package.json에 정의된 모듈은 보통 npm 또는 yarn 같은 패키지 매니저를 통해 설치된 외부 라이브러리
		이 모듈들은 프로젝트의 node_modules 디렉터리에 설치
			- 모듈 이름으로 임포트: require('express'), require('lodash')와 같이 모듈의 이름만 사용
		Node.js는 모듈 이름을 기반으로 아래와 같은 규칙을 따라 탐색을 시작
			1. node_modules 탐색: 현재 파일이 있는 디렉터리부터 시작하여 상위 디렉터리로 이동하면서 각 디렉터리에 있는 node_modules 폴더를 차례대로 탐색
			2. 패키지 내 main 필드 확인: express 모듈을 찾으면, node_modules/express/package.json 파일을 열어 main 필드에 지정된 엔트리 포인트를 로드
		
	2. Virtual DOM이 효율적인 이유?
		a. 선언형 프로그래밍 : 하나의 기능 동작으로만으로 새로운 렌더링 발생하기 때문에  느림
		b. Virtual DOM : 가상 DOM에서 수정사항을 모두 반영 후 실제 DOM과 비교 후 실제 변경건만 반영하기때문에 빠름
	Virtual DOM의 작동 방식
		1. 메모리 내 복사본: Virtual DOM은 실제 DOM을 경량화된 자바스크립트 객체 형태로 메모리 내에 복제한 것.
		2. 변경 사항 감지: 상태에 변경이 발생하면, Virtual DOM은 전체 UI를 다시 렌더링하는 대신, 새로운 Virtual DOM을 만들고 이전 Virtual DOM과 비교.
		3. 최소한의 변경: 두 Virtual DOM을 비교하여 정확히 어떤 부분이 바뀌었는지(예: 텍스트 변경, 클래스 추가 등)를 파악
		4. 실제 DOM 업데이트: 변경된 부분만 실제 DOM에 적용.

	왜 이것이 효율적인가?
		• DOM 조작의 비용: 실제 DOM을 직접 조작하는 것은 매우 비용이 많이 드는 작업. 브라우저는 DOM이 변경될 때마다 화면을 다시 계산하고, 다시 그리는 과정을 거쳐야 하는데, 이 과정이 많은 자원을 소모
		• Virtual DOM의 경량성: Virtual DOM은 자바스크립트 객체이므로, 메모리에서 비교하고 수정하는 것이 매우 빠름. 실제 DOM에 직접 접근하는 것에 비해 성능 부담이 훨씬 적음.
	따라서 Virtual DOM은 변경 사항을 한데 모아서, 필요한 부분만 한 번에 실제 DOM에 적용함으로, 불필요한 DOM 조작을 줄여 성능을 크게 향상.


