---

layout: post

title: "[CodeStates] Backend 3일차 | HTML, CSS"

comments: true

categories: [Front-End]

tags: [Front-End, HTML, CSS]

---

# HTML

> HTML은 웹페이지의 틀을 만드는 마크업언어

- HTML은 태그의 집합

- html 확장자 사용

- TREE STRUCTURE

  - html 문서 시작
    - html
      - head
        - title : 페이지 제목
      - body
        - h1 : heading. 크기에 따라 h6까지 있음
        - div : 줄바꿈이 있는 컨텐츠 컨테이너
          - span : 줄바꿈이 없는 컨텐츠 컨테이너

- **Semantic Tags** : 시멘틱 태그. 시멘틱마크업이라고도 함. 의미가 있는 태그.

  - Semantic Tags가 중요한 이유

    - 1. SEO (Search Engine Optimization) : 검색 최적화
    - 1. Accessibility : 웹 접근성
    - 1. For Us, Maintainability : 우리(개발자)들을 위해, 유지보수성

    ```null
      
    ```

- 많이 쓰이는 태그들

  - `<div>` : Division. 이 태그는 한 줄을 차지. `<div></div>`

  - `<span>` : Span. 이 태그는 컨텐츠크기만큼 차지. `<span></span>`

  - `<img>` : Image. 이미지 삽입.닫는 태그 없음.

  - `<a>` : link. 링크삽입. `<a></a>`

  - `<ul>` & `<li>` : Unordered List & List Item. 리스트

  - `<ol>` : Ordered List. 숫자로 리스트 생성

    ```html
    <ul>
       <li>Item 1</li>
       <li>Item 2</li>
       <li>Item 3 has nested list
         <ul>
           <li>Item 3-1</li>
         </ul>
       </li>
    </ul>
    ```

  - `<input>` : Input (Text, Radio, Checkbox). 입력폼

  - `<textarea>` : Multi-line Text Input. 여러줄 입력가능한 텍스트입력폼 생성. `<textarea></textarea>`

  - `<button>` : button. 버튼.

  - `<p>` : Paragraph. 하나의 문단. `<p></p>`

  - `<section>` : Section. 하나의 구역.

# CSS

  - UI(User Interface) : CLI(Command Line Interface)를 입력하지 않고 사용자가 컴퓨터에게 의도하는대로 행동을 명령하는데에 있어서 쉽게 만든 인터페이스.

  - UX(User Expeience) : 사용자의 경험

  - CSS는 반드시 html이 있어야 동작할 수 있다.

    ```css
    body{
         color : red;
         font-size : 30px;
    ```

- body : 셀렉터(Selector). 특정 태그의 이름, id, class를 선택한다

- { } : 선언 블록 (Declaration block)

- `color : red;`, `font-size : 30px;` : 선언(Declaration)

- `color`, `font-size` : 속성명(Property)

- `red`, `30px` : 속성값(Value)

- `;` : 선언구분자

  > 생각해볼수있는 질문

- 텍스트를 가운데로 정렬하는 속성? `text-align`

- 글자색 바꾸는 속성? `color`

- 배경색 바꾸는 속성? `background-color`

- background속성과 backgroung-color속성 차이? `background-color는 색깔만 변경가능, background는 색 이외의 다른 옵션 설정 가능.(ex, img)`

- em의 의미? `강조되는 기울임체`

  

  

## HTML파일에 CSS파일 적용

- 외부 스타일시트

  ```html
  <link rel="stylesheet" href="파일명.css" />
  ```

~~~null
`<link>` : link태그는 HTML과 다른 파일을 연결
`rel` : 연결하려는 파일의 특징
`href` : 파일위치

- 인라인 스타일

```html
<nav style="backgrounf: #eee; color: blue">...</nav>
~~~

## 기본 Selector

- id 이름으로 스타일링 적용
  `<h1>`, `<p>`와 같은 하나의 태그를 선택해서 스타일링 가능

```css
h4 {
    color : red;
}
```

하지만 이 방법은 `<h4>`에 있는 전체의 색상을 변경하므로 이름을 붙여서 색상을 변경할수있다.

```html
<h4 id="hyoreal-title">This is hyoreal's title.</h4>
```

CSS파일에서 id를 호출할때는 `#`기호를 사용.

```css
#hyoreal-title {
    color : red;
}
```

하지만 id는 문서 내에서 단 하나의 요소에만 적용하는 유일한 이름이기에 여러개에 같은 이름을 붙여서 스타일링 할수없다. 이럴때 class를 사용.

## 하나의 class를 여러 요소에 적용

- class로 스타일링 적용

```html
<ul>
  <li class="item-list">one</li>
  <li class="item-list">two</li>
  <li class="item-list">three</li>
</ul>
```

여러 요소에 같은 스타일링을 하고싶을때 class를 이용하여 같은 이름 생성.

```css
.item-list {
    text-decoration: underline;
}
```

class를 호출할때 `.` 사용하여 호출

## 하나의 요소에 여러 class적용

```html
<li class="item-list selected">Home</li>
```

하나의 요소에 여러 class 적용

```css
.selected {
    font-weight: bold;
    color: #eee;
```

## CSS 셀렉터

- 셀렉터

```css
h1 {}
div {}
```

- 전체 셀렉터

```css
* {}
```

- Tag 셀렉터

```css
section, h1 {}
```

- id 셀렉터

```css
#idname {}
```

- class 셀렉터

```css
.classname {}
```

- 후손 셀렉터

```css
header h1 {}
```

- 자식셀렉터

```css
header > h1 {}
```

------

> 3일차도 무난하게 지나간것같다. 코드스테이츠에 들어오기 전에 혼자 독학했던 내용들과 약간 겹치는 부분들이 있어 더 수월했다.
> 하지만 독학하던때와 같은걸 느꼈다.
> 나는 정말.. 백엔드가 운명인가봐....!