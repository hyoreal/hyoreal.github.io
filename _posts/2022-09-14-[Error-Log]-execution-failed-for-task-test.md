---

layout: post

title: "[Error Log] execution failed for task ':test'"

comments: true

categories: [Error Log]

tags: [Error Log]

---

### <span style='color: #C50017;'>에러 발생</span> 🚨

스피닛을 이용한 API 문서화 실습을 진행하던 도중 index.adoc 템플릿 문서까지 다 작성한 후 build를 하려 했으나 계속 `execution failed for task ':test'` 와 같은 오류가 발생했다.
이 전에도 여러번 만났던 오류이지만 어쩌다보니 해결되다보니 원인도 해결법도 모른채 결국 이 순간까지 왔다.

이 전과 똑같이 Gradle 재 빌드, 인텔리제이 재실행, 설정 → 실행, 배포, 빌드 → Gradle → Gradle(default)를 IntelliJ로 변경 등과 같은 방법들을 시행해봤으나 이번에는 해결되지않았다.

### <span style='color: #DE5959;'>문제 파악</span>🚒

이 오류가 발생하는 원인부터 알아야 해결이 가능하기에 여기저기 구글링 해 본 결과 이런 오류가 발생하는 상황들은 이러했다.

1. 테스트 메서드 명이 한글인 경우

2. gradle 실행 시 Exception 발생
    → 설정 > 실행, 배포, 빌드 > Gradle -> IntelliJ IDEA로 변경하면 해결된다고 한다

3. Gradle 버전 문제

4. **Windows에서 사용하는 한글 인코딩과 JVM에서 사용하는 파일 인코딩이 달라 발생한 문제** [참고 : 인프런 길근오님 답변](https://www.inflearn.com/questions/459145#:~:text=Edit%20Custom%20VM%20options)

등등.. 이 있었고 나는 4번에 해당한다는걸 바로 깨달았다.

바로 내 프로젝트가 위치한 상위 경로에 한글 파일 폴더가 있는지 확인해봤고 예상밖의 것이 나왔다.

`바탕화면`......

바탕화면은 기본 폴더명이기에 이름변경이 불가한걸로 알고있던 터라 상당히 곤란한 문제였다.
그래도 앞으로 개발자로의 삶을 위해 해결해야한다는 생각이 컸기에 방법을 열심히 알아보았다.

### <span style='color: #98AFFF;'>~~해결🧐~~</span>

여기저기 서칭해보았을때 영문명 -> 한글명 은 정보가 많았지만 한글명 -> 영문명은 생각보다 정보가 부족했다.

그래도 찾아냈다.

>내 PC > 바탕화면 폴더 우클릭 > 속성 > 위치 

위 경로로 들어간 후 위치를 DeskTop으로 변경해주니 바탕화면 개체명은 여전히 바탕화면이었지만 프로젝트들의 경로를 확인했을때 DeskTop으로 제대로 변경되었다.

- 변경 전

![](https://velog.velcdn.com/images/hyoreal51/post/b992abaf-1597-438c-a758-524ca1de4b12/image.png)



- 변경 후

![](https://velog.velcdn.com/images/hyoreal51/post/d716a0e8-f64a-4920-904b-35016d5bded4/image.png)

그리고 다시 원래 목표였던 API 문서화!!

html 파일로 변환을 진행해보았더니..!!!!

![](https://velog.velcdn.com/images/hyoreal51/post/ca04b109-03af-49a0-acaa-0f4a1d138f28/image.png)

음..?

왜.... 안생기지.....?

![](https://velog.velcdn.com/images/hyoreal51/post/239c4258-1bf9-4509-8e3e-6efe6b2ab661/image.png)

분명.... <span style='color: #C50017;'>빨간 글씨</span>가 없는걸 보면 제대로 실행은 됐는데 왜 안생길까 하며 하염없이 쳐다보던 중...

보고말았다.

![](https://velog.velcdn.com/images/hyoreal51/post/e4823bfe-8b0d-43cd-89e1-cb6fa294e4e6/image.png)

.
.
.
.
.
</br>
</br>

![](https://velog.velcdn.com/images/hyoreal51/post/ca433be1-559d-49fc-82f7-017c784b2218/image.gif)

</br>
</br>

## To be continue.....

-------------------