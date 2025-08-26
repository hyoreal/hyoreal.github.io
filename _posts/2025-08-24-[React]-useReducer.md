---
layout: post

toc: true

title: "[REACT] useReducer"

comments: true

categories: [Front-End]

tags: [Front-End]


---

## useReducer

### 1. useReducer
1. useReducer란?
- 컴포넌트 내부에 새로운 State를 생성하는 React Hook
- 모든 useState는 useReducer로 대체 가능 
  - useState와 useReducer의 차이점?
    - useState는 __컴포넌트 내부에서만 관리가 가능__ 하지만 useReducer는 __상태 관리 코드를 컴포넌트 외부로 분리하여 관리__ 할 수 있는 핵심적인 차이점이 있다
    - 컴포넌트의 메인 역할을 UI를 렌더링하는 것이지만 상태관리코드가 길어진다면 주객전도 되는 것

### 2. useReducer 활용법
```jsx
// useState 예시
import useState from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const idRef = useRef(0);

  // 컴포넌트 내부에 상태 관리 코드를 작성해야함
  const onCreate = (content) => {
    const newTodo = {
      id: idRef.current++
      , isDone: false
      , content: content 
      , date: new Date().getTime()
    };

    setTodos([newTodos, ...todos]);
  }
}
```

```jsx
// useReducer 예시
// const [state, dispatch] = useReducer(reducer, initialState);
// state: 상태
// dispatch: 상태를 변화시키는 action을 발생시키는 함수
// reducer: dispatch로 인해 일어난 상태변화 처리 함수
// initialState: 초기값
import { useReducer } from "react";

// reducer : 변환기
// -> 상태를 실제로 변환시키는 변환기
function reducer(state, action) {
    console.log(state, action);

    // if (action.type === "INCREASE") {
    //     return state + action.data;
    // } else if (action.type === "DECRESE") {
    //     return state - action.data;
    // }

    // 액션의 타입이 많아질 경우, switch문 사용이 일반적임
    switch (action.type) {
        case "INCREASE" : return state + action.data;
        case "DECREASE" : return state - action.data;
        default : state;
    }
}

const Exam = () => {
    // dispatch : 발송하다, 급송하다 
    // -> 상태 변화가 있어야 한다는 사실을 알리는, 발송하는 함수
    const [state, dispatch] = useReducer(reducer, 0);

    const onClickPlus = () => {
        // 인수: 상태가 어떻게 변화되길 원하는지
        // -> 액션 객체
        dispatch({
            type: "INCREASE"
            , data: 1
        });
    }

    const onClickMinus = () => {
        dispatch({
            type: "DECREASE"
            , data: 1
        })
    }

    return (
        <div>
            <h1>{state}</h1>
            <button onClick={onClickPlus}>+</button>
            <button onClick={onClickMinus}>-</button>
        </div>
    );
}

export default Exam;
```

### 3. 투두리스트 업그레이드

```jsx
// 수정 전 App.jsx
import './App.css'
import { useState, useRef } from "react";
import Header from "./components/Header";
import Editor from "./components/Editor";
import List from "./components/List";

function App() {
  const [todos, setTodos] = useState([]);
  const idRef = useRef(0);

  const onCreate = (content) => {
    const newTodo = {
      id: idRef.current++
      , isDone: false
      , content: content
      , date: new Date().getTime()
    };

    setTodos([newTodo, ...todos]);
  }

  const onUpdate = (targetId) => {
    setTodos(todos.map((todo) => todo.id === targetId ? { ...todo, isDone: !todo.isDone} : todo))
  }

  const onDelete = (targetId) => {
    setTodos(todos.filter((todo) => todo.id !== targetId));
  }

  return (
    <div className='App'>
      <Header />
      <Editor onCreate={onCreate} />
      <List todos={todos} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}

export default App
```

```jsx
// 수정 후 App.jsx
import './App.css'
import { useState, useRef, useReducer } from "react";
import Header from "./components/Header";
import Editor from "./components/Editor";
import List from "./components/List";

function reducer(state, action) {
  switch (action.type) {
    case "CREATE" : return [action.data, ...state];
    case "UPDATE" : return state.map(item => item.id === action.targetId ? {...item, isDone: !item.isDone} : item);
    case "DELETE" : return state.filter(item => item.id != action.targetId);
    default: return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  const onCreate = (content) => {
    dispatch({
      type: "CREATE"
      , data: {
        id: idRef.current++
        , isDone: false
        , content: content
        , date: new Date().getTime()
      }
    })
  }
 
  const onUpdate = (targetId) => {
    dispatch({
      type: "UPDATE"
      , targetId: targetId
    })
  }

  const onDelete = (targetId) => {
    dispatch({
      type: "DELETE"
      , targetId: targetId
    })
  }

  return (
    <div className='App'>
      <Header />
      <Editor onCreate={onCreate} />
      <List todos={todos} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}

export default App
```