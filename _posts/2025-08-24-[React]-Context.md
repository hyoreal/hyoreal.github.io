---
layout: post

toc: true

title: "[REACT] Context"

comments: true

categories: [Front-End]

tags: [Front-End]


---

## Context

### 1. Context
1. React Context
- 컴포넌트 간 데이터를 전달하는 또 다른 방법
- 기존의 Props가 갖고있던 단점 해결 가능

- Props 의 단점? 

<img width="766" height="399" alt="Image" src="https://github.com/user-attachments/assets/8b271c28-88c6-4a26-89fc-559746338cf8" />

- 부모 -> 자식으로만 전달이 가능하다. (Props Drilling)
  - App에서 TodoItem으로 바로 Props 전달이 불가하여 List가 중간다리 역할을 해줘야했다.

<img width="609" height="375" alt="Image" src="https://github.com/user-attachments/assets/c288f8a7-1dca-4929-865c-bd70eb90a4a9" />

- Context는 데이터 보관소 역할을 하는 객체.

<img width="723" height="292" alt="Image" src="https://github.com/user-attachments/assets/51b7638b-41a8-4681-bda9-f6d2b55423af" />

- 여러개 생성도 가능
- Context 내부에는 많은 Property가 있지만 대부분 내부적인 동작을 위해 존재하기 때문에 __Provider__ 만 제대로 알아두면 된다

2. Provider
- Provider: 공급자, 제공자
- Context가 공급할 데이터를 설정하거나 Context의 데이터를 공급받을 컴포넌트들을 설정하기 위해 사용하는 프로퍼티.
  - Provider는 컴포넌트로 작성하여 렌더링할 수 있음

```jsx
// App.jsx
import './App.css'
import { useState, useRef, useReducer, useCallback, createContext } from "react";
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

// 데이터를 하위 컴포넌트에 공급만 하면 되기 때문에 특수한 경우가 아닌 이상 컴포넌트 외부에 선언한다.
export const TodoContext = createContext();
console.log(TodoContext);

function App() {
  const [todos, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  const onCreate = useCallback(
    (content) => {
      dispatch({
        type: "CREATE"
        , data: {
          id: idRef.current++
          , isDone: false
          , content: content
          , date: new Date().getTime()
        }
      })
    }, []);
 
  const onUpdate = useCallback((targetId) => {
    dispatch({
      type: "UPDATE"
      , targetId: targetId
    })
  }, []);

  const onDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE"
      , targetId: targetId
    })
  }, []);

  return (
    <div className='App'>
      <Header />
      <TodoContext.Provider value={{
        todos, onCreate, onUpdate, onDelete
      }}>
        <Editor/>
        <List/>
      </TodoContext.Provider>
    </div>
  );
}

export default App
```

```jsx
// Editor.jsx
import './css/Editor.css';
import { useState, useRef, useContext } from "react";
import { TodoContext } from "../App";

const Editor = () => {
  // const data = useContext(TodoContext);
  // console.log(data);
  const {onCreate} = useContext(TodoContext);
  const [content, setContent] = useState("");
  const contentRef = useRef();

  const onChangeContent = (e) => {
    setContent(e.target.value);
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSubmit();
    }
  }

  const onSubmit = () => {
    if (content === "") {
        contentRef.current.focus();
        return;
    }
    onCreate(content);
    setContent("");
  }

  return (
    <div className='Editor'>
        <input ref={contentRef} value={content} onKeyDown={onKeyDown} onChange={onChangeContent} placeholder='새로운 Todo...' />
        <button onClick={onSubmit}>추가</button>
    </div>
  );
};

export default Editor;
```

```jsx
// List.jsx
import './css/List.css';
import TodoItem from "./TodoItem";
import { useState, useMemo, useContext } from "react"; 
import { TodoContext } from "../App";

const List = () => {
  const { todos } = useContext(TodoContext);
  const [search, setSearch] = useState("");

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  }

  const getFilteredData = () => {
    if (search === "") {
        return todos;
    }
    return todos.filter((todo) => todo.content.toLowerCase().includes(search.toLowerCase()));
  }

  const filteredData = getFilteredData();

  const {totalCount, doneCount, notDoneCount} = useMemo(() => {
    console.log("getAnalyzedData 호출");
    const totalCount = todos.length;
    const doneCount = todos.filter(todo => todo.isDone).length;
    const notDoneCount = totalCount - doneCount;

    return {
      totalCount
      , doneCount
      , notDoneCount
    }
  }, [todos]);
  // 첫번째 인수 : 콜백함수
  // 두번째 인수 : 의존성배열 - deps

  return (
    <div className='List'>
        <h4>Todo List 🌱</h4>
        <div>
            <div>total: {totalCount}</div>
            <div>done: {doneCount}</div>
            <div>notDone: {notDoneCount}</div>
        </div>
        <input value={search} onChange={onChangeSearch} placeholder='검색어를 입력하세요' />
        <div className='todos_wrapper'>
            {filteredData.map((todo) => {
                return <TodoItem key={todo.id} {...todo}/>;
            })}
        </div>
    </div>
  );
};

export default List;
```

```jsx
// TodoItem.jsx
import './css/TodoItem.css';
import { memo, useContext } from "react";
import { TodoContext } from "../App";

const TodoItem = ({id, isDone, content, date}) => {
    const { onUpdate, onDelete } = useContext(TodoContext);
    const onChaneCheckbox = () => {
        onUpdate(id);
    }

    const onClickButton = () => {
        onDelete(id);
    }

    return (
        <div className='TodoItem'>
            <input onChange={onChaneCheckbox} readOnly checked={isDone} type="checkbox" />
            <div className='content'>{content}</div>
            <div className='date'>{new Date(date).toLocaleDateString()}</div>
            <button onClick={onClickButton}>삭제</button>
        </div>
    );
}

export default memo(TodoItem);
```

- 위와 같이 Context를 적용했더니 TodoItem 촤적화를 했음에도 불구하고 하나의 아이템만 수정해도 전체 아이템이 리렌더링된다.

3. 최적화 풀린 이유
- todos state가 변경되어 앱 컴포넌트가 리렌더링되면서 TodoContext.Provider의 value props로 전달하고있는 객체 자체가 새로 생성되었기 때문.
- 이 문제는 context를 분리하여 해결할 수 있다.

<img width="606" height="330" alt="Image" src="https://github.com/user-attachments/assets/7d78d583-b050-4c84-9c0a-ea65b5900ac1" />

<img width="797" height="387" alt="Image" src="https://github.com/user-attachments/assets/ba97128c-2ac5-472b-a8f8-61abf87471f6" />