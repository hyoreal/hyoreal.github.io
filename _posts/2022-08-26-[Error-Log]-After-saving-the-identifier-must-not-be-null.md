---

layout: post

title: "[Error Log] After saving the identifier must not be null"

comments: true

categories: [Error Log]

tags: [Error Log]

---

### <span style='color: #C50017;'>에러 발생</span> 🚨

Spring Data JDBC 수업을 위한 인메모리(In-memory) DB인 H2와 인텔리제이를 연결하는 중 오류가 발생했다.

오류가 발생한 부분은 연결의 마지막 부분인 메세지를 요청한 후 데이터베이스에 저장되었는지 확인만 하면 되는 부분이었지만 예상밖의 오류가 발생했다.

오류 발생까지의 연동 방식은 이러했다.

  1. build.gradle의 dependencies에 의존 라이브러리 추가

    - `implementation 'org.springframework.boot:spring-boot-starter-data-jdbc'`
    - `runtimeOnly 'com.h2database:h2'`

  2. application.yml 파일에 H2 Browser 활성화 설정 추가
  
  3. 코드 구현

    - MessageDto.class
    - MessageController.class
    - MessageMapper.interface
    - MessageService.class
    - Message.class(Entity)
    - MessageRepository.interface(DB계층)

  4. 애플리케이션 실행 후 클라이언트 요청 전송
  
  5. 에러 발생
    ![](https://velog.velcdn.com/images/hyoreal51/post/06ade23a-4ed0-4e37-9344-2ed4925236c7/image.png)

### <span style='color: #DE5959;'>문제 파악</span>🚒

먼저 저 오류의 의미는 _식별자로 저장된 후에는 null값이 나오면 안된다_ 라는 의미이다.
그렇다면 Primary key를 지정할때 실수를 했을까, SQL에서 오타가 있었나 싶어 확인해보았다.

```sql
# .sql
CREATE TABLE IF NOT EXISTS MESSAGE (
    message_id bigint NOT NULL AUTO_INCREMENT,
    message varchar(100) NOT NULL,
    PRIMARY KEY (message_id)
);
```
.sql 파일에서는 잘못된걸 발견할 수 없었다.
id를 Primary key로 하기 위해 값을 입력하지 않아도 자동으로 값을 포함시켜주는 AUTO_INCREMENT도 잘 적었다.

그래서 더 알아보았더니 알게된게 있었다.

- 데이터 엑세스 계층에서 데이터 베이스와의 연동을 담당하는 MessageRepository.Interface는 CrudRepository.Interface를 상속받고있다.

```java
// MessageRepository.Interface
public interface MessageRepository extends CrudRepository<Message, Long> {
}
```

- CrudRepository.Interface는 Spring에서 지원해주는 인터페이스이다.

- MessegeService.class에서 DI를 통해 MessageRepository.Interface를 주입받아 사용할 때 `save()`메서드를 사용했다.

```java
public Message createMessage(Message message) {
        return messageRepository.save(message);
}
```

- **`save()` 사용시 컬럼을 명시하지 않으면 null값으로 덮어쓰는 현상이 발생한다**
[참고](https://kmhan.tistory.com/701)

### <span style='color: #98AFFF;'>해결</span>🧐

이 사실을 앎과 동시에 Message.class 파일을 바로 열어보았더니..

```java
// Message.class
public class Message {
    private long messageId;
    private String message;
}
```
.............

잠시 할 말을 잃고 쳐다보다가 천천히 어노테이션을 추가해 주었다.

```java
import org.springframework.data.annotation.Id;

public class Message {
    @Id
    private long messageId;
    private String message;
}
```

![](https://velog.velcdn.com/images/hyoreal51/post/dd413bbe-f7c0-4942-9a2c-12a08805f545/image.png)

오류가 언제 있었냐는듯이 해결되었다!
내 말도 안되는 실수 덕분에 오늘도 지식이 상승한다!!😂