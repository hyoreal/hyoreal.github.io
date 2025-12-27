---

layout: post

title: "[Error Log] urlTemplate not found "

comments: true

categories: [Troubleshooting]

tags: [Error, Troubleshooting]

---

### <span style='color: #C50017;'>에러 발생</span> 🚨

![](https://velog.velcdn.com/images/hyoreal51/post/a73b6d0c-1d29-4255-9bc4-1bd475528c8e/image.png)

API 문서화 과제를 진행하던 도중 이상한 에러를 만났다.
urlTemplate을 찾을수 없다는 말과 함께 `RestDocumentationRequestBuilders`를 사용하라고 한다.

그래서 나는 에러메세지를 그대로 따라했다.

![](https://velog.velcdn.com/images/hyoreal51/post/c3b21e98-fad6-4e92-8cf7-917130d7b47f/image.png)


먼저 실제 테스트 코드에서는 문제가 없어보였다.
그래서 helper 인터페이스를 확인해보았다.

![](https://velog.velcdn.com/images/hyoreal51/post/5a9fc1af-41f8-4059-97bf-253c180b5fe2/image.png)

위 코드를

![](https://velog.velcdn.com/images/hyoreal51/post/277ee2bb-9f85-41c0-abbf-dcf90843b20d/image.png)

이렇게 고쳐서 테스트를 실행해봤지만 여전히 같은 에러메세지를 뱉어냈다.

### <span style='color: #DE5959;'>문제 파악</span>🚒

이런식으로 해결하는것보단 원인부터 파악하고 싶었다.

먼저 실행 후 콘솔창을 확인해 본 결과, URI가 인식은 된것으로 보였다.

![](https://velog.velcdn.com/images/hyoreal51/post/2bb88404-973c-4221-80e0-a114975d019e/image.png)

urlTemplate를 찾을 수 없다는게 정확하게 어떤 뜻인지 몰라 알아본 결과,
URI에서 `{}` 에 속하는 부분이 템플릿인것으로 파악됐다.

그렇다면 즉,

/v11/members/**`{member-id}`**

이 부분을 찾지 못한다는 이야기였다.

분명 그 전까진 제대로 작동했으나 갑자기 못찾는다는게 이해가 안가 열심히 알아보았더니 `RestDocumentationRequestBuilder`와 관련이 있어보였다.

### RestDocumentationRequestBuilder

Spring REST DOCs에서 pathParameters를 사용하는 경우 `MockMVCBuilder`가 아닌 `RestDocumentationRequestBuilder`의 메소드를 사용해야 한다.

[참고](https://docs.spring.io/spring-restdocs/docs/1.0.0.BUILD-SNAPSHOT/reference/html5/#documenting-your-api-path-parameters)

나는 변경해주었는데도 오류가 나는 이유를 정확하게 찾지는 못했지만 예상하는건 하나 있다.

RestDocumentationRequestBuilder 안에 들어보니 여러 글들이 보였지만 그 중에서 눈에 띈건 이 부분이다.

![](https://velog.velcdn.com/images/hyoreal51/post/b6673a8a-c534-40cf-b8db-5deae60977bf/image.png)

![](https://velog.velcdn.com/images/hyoreal51/post/dedd878c-08e6-401a-991a-01d1343e28bb/image.png)

보면 uri는 URL로 인식하고 **urlTemplate**를 지정해줘야 template이라는 것을 알아본다는 것처럼 보인다.

현재 발생한 에러가 urlTemplate을 찾지 못한다는 에러이고, 나는 RestDocumentationRequestBuilder의 매개변수로 URI타입의 uri를 넣어준 상태였다.

즉, 내가 이해한 바로는

> `pathParameters`를 사용할땐 `RestDocumentationRequestBuilder`를 사용해야하지만,
> `RestDocumentationRequestBuilder`를 사용하면 `pathParameters`는 URI타입의 uri의 템플릿을 인식하지 못한다.

라는 것이었고 그에 맞게 다시 구현해보았다.

### <span style='color: #98AFFF;'>~~해결..?🤔~~ 해결!!🧐</span>

```java
public interface ControllerTestHelper<T> {
    default RequestBuilder getRequestBuilder(String uri, long memberId) {
        return RestDocumentationRequestBuilders
                .get(uri, memberId)
                .accept(MediaType.APPLICATION_JSON);
    }
}

public interface MemberControllerTestHelper extends ControllerTestHelper {
    default URI getURI(long memberId) {
        return createURI( "/v11/members/{member-id}", memberId);
    }
}
```

helper 인터페이스에서 URI를 String 타입으로 지정해주었고, 템플릿에 들어갈 값을 따로 할당해주었다.

그리고 실제 테스트 로직은 이렇게 변경해주었다.

![](https://velog.velcdn.com/images/hyoreal51/post/2b2bf551-675b-407c-a514-7753baa3b87f/image.png)

그리고 테스트를 실행시켜본 결과 에러없이 완벽하게 실행되었다.

사실 내가 생각하는 이 이유가 맞는건지 확신이 있지는 않다.
더 알아보고 알게되는만큼 다시 정리해두어야겠다

----------

\+ 엔지니어님께 여쭤보니 맞다고 한다!!! 야호!!!!