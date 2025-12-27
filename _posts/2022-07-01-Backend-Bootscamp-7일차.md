---

layout: post

title: "[CodeStates] Backend 7일차 | Git 기초 "

comments: true

categories: [Git]

tags: [Bootcamp, Learning]

---

> 오늘은 Git에 대해 공부했는데 여태까지 공부한 내용중 가장 복잡했고 동기분들과의 오픈채팅에서도 질문이 굉장히 많았다..
> 먼저 설치는 이미 돼있던터라 진행이 수월할줄 알았으나.....
> 혼자 작업 workflow가 시작되고부터 고난은 끊기지 않았다.
> fork와 clone까지 한 직후부터 막혔다.
> 정말 다행히도 동기님께서 친절히 알려주신덕에 다음에 뭘 해야하는지를 알았고
> 다시 진행하기 시작했다.

### Workflow

> Fork -> `git clone` -> 작업 -> `git add` -> `git commit -m` -> `git push origin main`

1. 다른 Repository를 fork해서 내 Repository로 가져옴
2. 내 Repository에 있는 코드를 clone으로 내 작업공간(workspace)으로 가져옴
3. 내 작업공간에서 코드 변경 및 편집
4. add로 staging area에 올려줌
5. commit 및 커밋기록
6. 내 repository로 push

clone 할 경우 init 불필요
내가 폴더를 만든 후 깃에 적용하고싶으면 git init
git init : .git폴더를 만들어줌. .git폴더는 git이 작용할수있는 권한 주어진것

한번 커밋 했던 로그가 있다면
git commit -am " " 로 add와 message를 동시에

------

> git은 생각보다 복잡하고 어려웠다.
> 페어님과 함께 진행했던 workflow를 하는데 충돌상황 재현 및 충돌해결을 하는 데에서 페어님도 나도 방법을 몰라 굉장히 애먹었다.
> 열심히 구글링도 하고 urclass를 정독한 결과 답을 찾아냈다.

### 충돌 및 충돌 해결

- 페어님과 내가 코드를 편집하던 중 같은 줄에 위치한 코드를 둘 다 변경하고 pysh pull을 해서 가져오게되면 충돌이 일어난다.
- 충돌이 일어나면 IDE에서 실행시 이와 같이 나온다
  ![img](https://velog.velcdn.com/images/hyoreal51/post/e1e7ed15-0e8d-4e9a-86fc-8f9bcb340bf4/image.jpg)
- 이때 둘 중 한개를 선택할 수도 있고 둘다 선택할수도있으며 둘 다 버릴수도있다.
- `Accept Current Change` : 우선위치한 코드를 선택
- `Accept Incoming Change` : 밑에 위치한 코드 선택
- `Accept Both Changes` : 둘다 선택
- `Compare Changes` : 둘다 버림
- IDE에 따라 다른 화면이 출력될수도 있는데 그때 충돌해결볍은 코드 중 하나를 지우거나 둘다 냅두거나 둘다 지우면 해결된다.

------

> 막상 정리해보니 별거없어보이지만서도 에러가 굉장히 많이 났고 명령어를 어떨때 사용하는지 알게될때까지 많은 시간이 걸렸다.
> 백엔드 부트캠프를 시작한 후로 git이 가장 복잡하면서도 어렵지만 알게되는 과정이 재밌었다.