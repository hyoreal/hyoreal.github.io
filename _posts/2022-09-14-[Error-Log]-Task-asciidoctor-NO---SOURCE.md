---

layout: post

title: "[Error Log] Task :asciidoctor NO-SOURCE"

comments: true

categories: [Error Log]

tags: [Error Log]

---

### <span style='color: #C50017;'>에러 발생</span> 🚨

![](https://velog.velcdn.com/images/hyoreal51/post/44004413-e7f6-4047-88a0-c64127cad5f2/image.png)

이번 문제는 내가 열심히 작성한 `.adoc` 템플릿 문서를 못찾아서 발생한 문제같았다.
전 에러보다는 쉽게 해결할 수 있을것 같은 느낌!!!

그래서 또 열심히 구글링을 해 본 결과 역시 예상대로 못찾은게 맞다.

### <span style='color: #DE5959;'>문제 파악</span>🚒

템플릿 문서를 못찾았다면 의존 라이브러리가 잘못 등록됐을까 하며 들어가보았다!

![](https://velog.velcdn.com/images/hyoreal51/post/ba64829e-ab5a-45d8-bb4e-6c1f1385ed93/image.png)


ㅎㅎ 너무 잘돼있넹

Gradle 빌드 때 html 파일을 만들기때문에 html뒤에 5를 붙여줘야 한다.
```java
from ("${asciidoctor.outputDir}/html5") {
    ...
}
```
잘 되어있다.

저장공간도 지정해줘야한다
```java
from file("build/docs/asciidoc/")
```
너무 정확하게 잘 되어있어 문제를 찾을수가 없을것만 같았다.

그렇게 넋놓고 화면을 바라보고 있었다.

![](https://velog.velcdn.com/images/hyoreal51/post/3e23c12b-5007-494e-a166-fe4b752cb351/image.png)


![](https://velog.velcdn.com/images/hyoreal51/post/6661e728-4745-4ac4-87a2-4718e6be0fa3/image.png)

![](https://velog.velcdn.com/images/hyoreal51/post/81fe06f8-bc56-4d2c-bc88-11e3fab98fa4/image.png)

혹시.. 이미... 눈치 챈 분들이 계시다면....
정말..... 기립 박수를 쳐드리고싶다.....

나는 혹시나 하는 마음에 새로운 패키지를 만들어 보았다.

![](https://velog.velcdn.com/images/hyoreal51/post/62e481c0-6a99-40a9-8546-14d5ed0b3896/image.png)

### 짜잔!! 한 패키지에 같은 이름의 패키지가 존재하는 마법⭐

</br>

.....

밑에 있는 `docs.asciidoc` 은 두개의 패키지가 연결된 상태가 아닌 패키지 명 자체가 **`docs.asciidoc`** 인것이다. `.` 까지 포함해서.

### <span style='color: #98AFFF;'>해결🧐</span>

그래서 패키지를 다시 만들어주었다.

![](https://velog.velcdn.com/images/hyoreal51/post/4614d842-aaf9-4a3f-b6b5-043f8241e50d/image.png)

나는.. main이나 test 내부에 패키지 만들때 한 패키지 안에 하나의 패키지만 있으면 저렇게 축약되기에 src도 당연히 그럴거라고 생각했다.

그리고 다시 빌드한 결과

![](https://velog.velcdn.com/images/hyoreal51/post/6437e4d5-6e7a-47a6-b3e2-fdff26bc3df2/image.png)

html 파일이 제대로 생성되었다!

이렇게 오늘도 역시 내 말도 안되는 실수덕에 지식이 상승한다!!!😂