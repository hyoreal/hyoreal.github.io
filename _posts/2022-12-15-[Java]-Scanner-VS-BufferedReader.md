---

layout: post

title: "[Java] Scanner VS BufferedReader "

comments: true

categories: [Java]

tags: [Java]

---

### Scanner

Scanner

- 입력받은 데이터를 다양한 타입으로 변환하여 반환하는 클래스
- 기본형과 문자열(String)타입을 정규표현식을 사용하여 파싱 가능

Scanner 특징

- java.util 패키지
- 공백 || 개행 기준으로 읽음
- 버퍼 사이즈가 1KB(1024byte)
- Uncheck 예외로 별도로 예외 처리 명시할 필요 없음

------

### BufferedReader

BufferedReader

- 8KB의 버퍼를 가져 버터에 입력된 데이터를 저장하였다가 한번에 전송
- 속도 방면에서 Scanner보다 빠름
- 버퍼(Buffer)
  - 데이터를 전송하는 동안 일시적으로 보관하는 임시 메모리 영역
  - 주로 입출력 속도 향상을 위해 사용
  - Java에서는 BufferedReader, BufferedWriter 클래스에서 다룰 수 있음

BufferedReader 특징

- java.io 패키지
- 버퍼 사이즈는 8KB
- Checked 예외로 반드시 예외 처리를 명시해야힘
  - throw IOException || try/catch
- Thread safe 성질을 지님
  - 멀티 스레드 환경에서 안전
- 데이터를 파싱하지 않음
  - 속도 방면에 유리
  - String으로만 읽고 가져옴

------

### Scanner 사용법 및 속도

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String st = sc.nextLine();
        int num = sc.nextInt();
        double num2 = sc.nextDouble();
    }
}
```

- 원하는 타입별로 입력받을 수 있다
- 백준 알고리즘 문제 Scanner 사용 시 속도
  ![img](https://velog.velcdn.com/images/hyoreal51/post/c1d0ef0f-c0a4-48fc-ad70-c01deaa2cf71/image.png)

------

### BufferedReader 사용법 및 속도

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String st = br.readLine();
    }
}
```

- BufferedReader는 매개변수로 InputStreamReader를 사용하여 객체 생성

- InputStreamReader

  - 문자 기반 보조 스트림
  - 바이트 기반 스트림을 문자 기반 스트림으로 연결시켜 주는 역할

- 백준 알고리즘 문제 BufferedReader 사용 시 속도

  ![img](https://velog.velcdn.com/images/hyoreal51/post/62b8d939-d124-42af-a3c6-5e751051e643/image.png)

> 참고 블로그
> https://velog.io/@langoustine/Scanner-VS-BufferedReader
> https://dlee0129.tistory.com/238