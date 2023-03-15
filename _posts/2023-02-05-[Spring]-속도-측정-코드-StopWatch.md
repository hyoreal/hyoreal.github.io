---

layout: post

title: "[Spring] 속도 측정 코드 StopWatch "

comments: true

categories: [Spring]

tags: [Spring]

---

###  속도 측정 코드

프로젝트를 진행하다 보니 각 메서드 별 시간을 측정해야한다는 것을 느꼈다.

Spring의 util에 간단하게 속도를 측정할 수 있도록 지원해주는 **StopWatch** 가 있다는 것을 알았고
필자가 자주 사용할 거 같아 블로그에 써두려고 한다.

```java
StopWatch stopWatch = new StopWatch();
stopWatch.start();

// 동작할 코드

stopWatch.stop();
log.info("실행 시간 = "+ stopWatch.getTotalTimeNanos() + "ns");
```