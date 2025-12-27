---

layout: post

title: "[Error Log] gradle script '/home/runner/work/~/~/gradlew' is not executable"

comments: true

categories: [Troubleshooting]

tags: [Error, Troubleshooting]

---

### <span style='color: #C50017;'>에러 발생</span> 🚨

![](https://velog.velcdn.com/images/hyoreal51/post/1cf3ee59-0907-4f36-9761-3a854a16331c/image.png)

Githun Actions를 생성하던 도중 위와 같은 오류가 발생했다.
구글링해보았을 때 명령 프롬프트에 

>git update-index --chmod=+x gradlew

와 같이 입력하면 된다고 하였기에 실행해보았지만 여전히 같은 에러를 마주했다.

### <span style='color: #DE5959;'>문제 파악</span>🚒

너무 친절하신 여러 동기님들께서 해결책을 주셨다.

![](https://velog.velcdn.com/images/hyoreal51/post/942d2b53-a7b4-4555-b6a2-775138c6e6dc/image.png)

나는 아직 완벽하게 이해하지는 못했으나, unix 권한 문제때문에 발생한 에러이고 

>git update-index --chmod=+x gradlew

위 명령어가 그 권한을 부여해주는 듯 싶었다.

### <span style='color: #98AFFF;'>해결🧐</span>

그래서 나는 인텔이제이 터미널에서 직접 명령어를 입력했다.
그 후 `git commit 'message'` 로 커밋 후,

> git push origin +main

을 통해 강제 푸쉬를 진행하였고 다시 Github Actions을 실행시켜본 결과

![](https://velog.velcdn.com/images/hyoreal51/post/032a5a56-4152-450d-b1a5-f99553669ef1/image.png)

완벽하게 성공하였다!!!!

도움주신 모든 동기분들께 감사인사를 전한다🙇🏻‍♀️