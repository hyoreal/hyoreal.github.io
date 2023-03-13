---

layout: post

title: "[CodeStates] Backend 4일차 | 페이지 레이아웃, 웹앱화면 설계"

comments: true

categories: [Front-End]

tags: [Front-End]

---

# 레이아웃

> 레이아웃은 화면을 나누는 방법이다.

- 수직분할

- 수평분할

- Flexbox 레이아웃

  - Flex(Flexible)은 잘 구부러진다는 의미를 갖고있다. 이 뜻과 같이 박스를 늘리고 줄여서 레이아웃을 잡는방법이다.

- `display: flex` : 부모에 영향을 주어 자식에게도 영향을 주는 방법

  - Flexbox 속성

    - ```
      flex-direction
      ```

       

      : 정렬 축 정하기, 기본 가로정렬

      - row : 기본값(좌측부터 가로정렬)
      - column : 아래로 세로정렬
      - row-reverse : 우측부터 가로정렬
      - column-reverse : 위로 세로정렬

    - ```
      flex-wrap
      ```

       

      : 줄바꿈 설정

      - nowrap : 기본값(줄바꿈 x. 요소들을 부모넓이에 맞게 자동축소)
      - wrap : 요소들의 넓이가 부모보다 클때 위에서부터 자동 줄바꿈
      - wrap-reverse : 요소들의 넓이가 부모보다 클때 아래서부터 자동줄바꿈

    - ```
      justify-content
      ```

       

      : 축의 수평방향으로 정렬. 요소들이 가로라면 가로방향, 요소들이 세로라면 세로방향으로 어떻게 정렬할것인지 정함

      - row : 기본값(가로)/ column : 세로
        - flex-direction : row (가로정렬)
          1. `flex-start` : 좌측
          2. `flex-end` : 우측
          3. `center` : 가운데
          4. `space-between` : 요소 사이 공백
          5. `space-around` : 각 요소 상하좌우로 공백
        - flex-direction : column (세로정렬)
          1. `flex-start` : 상
          2. `flex-end` : 하
          3. `center` : 가운데
          4. `space-between` : 요소 사이 공백
          5. `space-around` : 각 요소 상하좌우로 공백

    - ```
      align-items
      ```

       

      : 축의 수직방향으로 정렬. 요소들이 가로라면 세로, 요소들이 세로라면 가로방향으로 어떻게 정렬할지

      - flex-direction : row (세로정렬)

        1. `stretch` : 세로로 부모넓이에 맞게 늘림
        2. `flex-start` : 상
        3. `flex-end` : 하
        4. `center` : 가운데
        5. `baseline` : 문자 기준선에 정렬

        - flex-direction : column (가로정렬)
          1. `stretch` : 가로로 부모넓이에 맞게 늘림
          2. `flex-start` : 좌
          3. `flex-end` : 우
          4. `center` : 가운데
          5. `baseline` : 문자 기준선에 정렬
        - align-content : 여러줄 사이의 간격
          1. `flex-start` : 여러줄을 컨테이너 꼭대기로
          2. `flex-end` : 여러줄을 컨테이너 바닥으로
          3. `center` : 여러줄을 세로선상 컨테이너 가운데
          4. `space-between` : 여러줄 사이 공백
          5. `space-around` : 여러줄사이 동일간격
          6. `stretch` : 여러줄을 컨테이너에 맞도록 늘림

- `flex` : 자식요소에 적용. 요소가 차지하는 공간 관련. 세가지값 지정가능.
  `flex: <grow> <shrink> <basis>`

  - `grow` : 팽창지수, 각 요소마다 차지할 비율만큼 설정

  - `shrink` : 수축지수, 각 요소마다 차지할 비율만큼 설정

  - `basis` : 기본크기
    flex속성을 설정하지않으면 기본값 적용

  - `flex: 0 1 auto;`
    각 값을 따로 지정 가능.

  - `flex-grow: 0;`

  - `flex-shrink: 1;`

  - `flex-basis: auto`

    # 웹 앱화면 설계

    ## 와이어프레임(Wireframe)

    > 레이아웃의 뼈대를 그리는 단계

  - **목업(Mock-up): 실제와 동일하게 작성하지만 기능동작은 없는 상태**

  - 프로토타이핑 : 개발 초기에 모형을 만들어 기능의 요구사항을 파악 후 반영하는 개선법. 개발 직전 꼭 필요.

    ### 설계 순서

  1. 큰 틀에서 영역 나누기

  2. 각 영역을 태그로 표현하기 (여러 태그를 하나의 태그로 감싸줘야함)

     > div태그는 단순히 감싸주는 역할. form태그는 사용자의 입력을 페이지로 전달하는 역할

     ###### id 및 class를 목적에 맞게 사용

  - id : 고유한 이름을 붙일때 사용. 중복 허용X

  - class : 반복되는 영역을 유형별로 분류할때 사용.

    ------

    > 오늘은 프론트엔드의 업무인 html과 css, 그리고 와이어 프레임에 대해 배웠다!
    > 역시..난 백엔드가 잘맞다는걸 매일 느끼는 중이다.
    > 오늘 프로기라는 게임같으면서도 css를 공부할수있는 프로그램을 시작하고 끝냈다.
    > 짧은 코드임에도 불구하고 정말 많은 고민을 하며 작성했다.
    > 이 짧은 코드에서도 많은 고민이 필요한데 내일 실전을 어떨지.. 정말 떨린다!!