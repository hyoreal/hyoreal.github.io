---

layout: post

title: "[Java] Design Pattern - State Pattern "

comments: true

categories: [Java, Design Pattern]

tags: [Java, Design Pattern]

---

### 스테이트 패턴을 알아보게 된 이유

메인 프로젝트를 진행하며 좋아요 기능을 개발할 때 중첩 if문을 사용하여 이와 같이 개발했었다.

- if 좋아요를 눌렀던 기록이 존재한다면
  - if 기록의 상태가 좋아요일때
  - else if 기록의 상태가 좋아요를 취소했을때
- else if 좋아요를 누른 기록이 존재하지 않을 때

이를 보신 멘토님께서 디자인 패턴의 State Pattern과 Strategy Pattern을 공부해보면 어떻겠냐며 권유를 해주셨고 이전에도 디자인 패턴에 대해 궁금증이 많았기에 이번 기회에 해보려고 한다.
Strategy Pattern은 이후 블로깅 할 예정이다.

> 리팩토링 이전 좋아요 코드

```java
public Likes likesContents() {

    ...

    if (좋아요 기록이 없을때) {

        reLikesClick();

    // 기록이 있을때
    } else {

        likesClick();
    }
}

/*좋아요를 누른 이력이 있는 경우*/
private void reLikesClick() {

   if (좋아요 상태가 true이면) {

        false로 바꿔서 저장

    } else {

        true로 바꿔서 저장

    }
}

/*처음 좋아요를 누른 경우*/
private void likesClick() {

    유저의 정보 및 컨텐츠의 정보와 함께 좋아요 상태를 true로 저장
}
```

------

### State Pattern

- State Pattern (상태 패턴)
  - 객체의 내부 상태에 따라 스스로 행동을 변경할 수 있게 허가하는 패턴
  - 동일한 동작을 객체 상태에 따라 다르게 처리해야 할 때 사용
  - 객체의 클래스가 바뀌는 것과 같은 결과를 얻는다
  - 컨텍스트 객체에 조건문을 넣는 대신 사용할 수 있는 패턴
    - 객체 상채를 캡슐화하여 클래스화(state 인터페이스)함으로 그것을 참조하게 만들어 상태에 따라 다르게 처리하도록 한다
- 장점
  - 조건문 효과적 제거 가능
  - 상태의 수만큼 클래스의 수가 증가하지만 때에 따라 장점이 될 수도
  - 클래스의 개수가 증가하더라도 코드 복잡도는 증가하지 않아 유지보수 유리
  - OOP 개발에 더 적합
  - 가독성 증가

------

### State Pattern 개발 순서

1.상태를 캡슐화한 인터페이스 선언

```java
public interface LikesState {

    void clickLike();
}
```

 

2.인터페이스를 구현한 상태 클래스 정의

```java
// 좋아요 상태 : false
class LikeStateFalse implements LikesState {

    @Override
    public void clickLike() {

        상태를 true로 바꿔 저장하는 로직 작성

        // 마지막엔 상태를 반대로 전환시켜준다
        likesButton.setLikeState(new LikeStateTrue());
    }
}

// 좋아요 상태 : true
class LikeStateTrue implements LikesState {

    @Override
    public void clickLike() {

        상태를 false로 바꿔 저장하는 로직 작성

        likesButton.setLikeState(new LikeStateFalse());
    }
}
```

 

3.상태 클래스를 사용할 클래스 작성

```java
public class LikesButton {

    // 이 State Pattern 로직이 처음 실행될 때 좋아요의 상태는 무조건 true가 되도록 개발했기에 기본으로 설정해준다
    private LikesState likeState = new LikeStateTrue();

    public void setLikeState(LikesState likeState) {
        this.likeState = likeState;
    }

    public void clickButton(LikesButton likesButton) {

        likeState.clickLike(likesButton);
    }
}
```

------

 

> 리팩토링 후 좋아요 코드

```java
public static LikesButton likesButton = new LikesButton();

...

private void ifLikesHave() {

    if (좋아요 기록이 있을 때) {

        // State Pattern
        likesButton.clickButton();

    } else {

        // 처음 좋아요를 누른 경우
        likesClick();
    }
}
```

 

> 참고 블로그
> https://victorydntmd.tistory.com/294
> https://tall-developer.tistory.com/14
> https://gre-eny.tistory.com/247
> https://coding-start.tistory.com/247
> https://johngrib.github.io/wiki/pattern/state/
> https://steady-coding.tistory.com/387