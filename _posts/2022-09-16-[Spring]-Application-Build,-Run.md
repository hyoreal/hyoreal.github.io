---

layout: post

title: "[Spring] Application Build, Run "

comments: true

categories: [Spring, Boot]

tags: [Spring, Build, Gradle]

---

### <span style='color: #2D3748; background-color: #ffdce0'>IntelliJ IDE를 이용한 빌드</span>

![](https://velog.velcdn.com/images/hyoreal51/post/2185473e-1a34-4a61-828a-8876ae239403/image.png)

1. 우측 상단 [Gradle] 윈도우 탭 클릭

2. Tasks → Build → bootJar (or build) 더블 클릭으로 실행
- build
  - assemble, check와 같은 빌드와 관련된 모든 task 실행
  - 실행 가능한 Jar 파일 외의 plain Jar 파일을 하나 더 생성
- bootJar
  - 애플리케이션의 실행 가능한 Jar(Executable Jar)파일 생성을 위한 task만 실행
  
### <span style='color: #2D3748; background-color: #ffdce0'>Gradle Task를 이용한 빌드</span>

1. 생성한 템플릿 프로젝트가 위치한 디렉토리 경로로 이동

2. Gradle task를 CLI 명령으로 입력할 수 있는 콘솔창을 템플릿 프로젝트 root 경로에서 오픈
    2-1.  Windows의 cmd, Git Bash, Windows Power Shell, 터미널 모두 사용 가능

3. 아래 명령어를 입력하여 애플리케이션 빌드
```java
// Windows 터미널
PS D:\파일경로\프로젝트> .\gradlew bootJar
// Git Bash
MINGW64 /파일경로/프로젝트 (main) $ ./gradlew build
```

4. 빌드 정상 종료 시 `build.libs` 디렉토리에 Jar 파일 확인 가능

### <span style='color: #2D3748; background-color: #ffdce0'>애플리케이션 실행</span>

1. Jar 파일이 있는 디렉토리 경로로 이동
2. 터미널 창 오픈 후 아래 명령어 입력
```java
java -jar Jar_파일명.jar
```

- [🔗Profile](https://www.baeldung.com/spring-profiles) 적용

  - 🔗[Profile](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.profiles)
    - 애플리케이션 빌드 시, 로컬 환경에서는 로컬 환경의 DB 설정정보를 실행 파일에 포함하고, 서버 환경에서는 서버 환경의 DB 설정 정보를 실행파일에 포함하도록 할 수 있다.
    </br>
  - `application.yml` 파일 외의 `application-local.yml`, `application-server.yml` 파일 추가
    - `application.yml` : 애플리케이션 실행 환경 상관 없이 공통적으로 적용할 프로퍼티 적용
    - `application-local.yml` : 로컬 환경에서 사용하는 정보
    - `application-server.yml` : 서버 환경에서 사용하는 정보 
  
  1. IntelliJ IDE 에서 프로파일 적용
  
  ![](https://velog.velcdn.com/images/hyoreal51/post/7798fa17-e667-4946-becd-486055db36e9/image.png)
  
  ![](https://velog.velcdn.com/images/hyoreal51/post/3095418c-e900-4efd-94c2-2f69b069c3ea/image.png)

  - program arguments 입력 시 : `--spring.profiles.active=적용_프로파일_이름`
    - ex `--spring.profiles.active=local`
  - VM options 입력 시 : `-Dspring.profiles.active=적용_프로파일_이름`
    - ex `-Dspring.profiles.active=local`
  - IntelliJ의 activeProfiles 입력 시 : `적용_프로파일_이름`
    - ex `local`
  
  2. CLI 환경에서 프로파일 적용
  
  - Jar 파일이 위치한 디렉토리에서 터미널 오픈 후 아래 명령어 입력
  
  ```java
  java -jar [파일명].jar --spring.profiles.active=[적용_프로파일_이름]`
  ```
  
  - 프로파일 적용 확인 로그
  ```
  ...
  
  [main] c.c.Application : The following 1 profile is active: local
  
  ...
  ```
  
### <span style='color: #2D3748; background-color: #ffdce0'>애플리케이션 배포</span>

- 전통적인 배포 방법 : [scp](https://www.freecodecamp.org/news/scp-linux-command-example-how-to-ssh-file-transfer-from-remote-to-local/), sftp 같은 표준 유닉스 툴을 사용하여 서버로 전송

- 클라우드 서비스를 위한 배포 방법

  - Paas(Platform as a Service)
    - Cloud Foundry, Heroku
    - Cloud Foundry : 대표적 Paas 제공 기업
    - Cloud Foundry 에서 제공하는 cf command line 툴을 사용하여 배포 가능
    ```
    $ cf push acloudysspringtime -p target/app-0.0.1-SNAPSHOT.jar
    ```
    
  - IaaS(Infrastructure as a Service)
    - AWS Elastic Beanstalk, AWS Container Registry, AWS Code Deploy, Azure Spring Cloud, Azure App Service, Google Cloud
    
  - CI/CD 플랫폼을 사용한 배포
    - Github Actions, Circle CI 같은 CI / CD 플랫폼을 이용해 AWS, Azure 같은 클라우드 서비스에 Executable Jar 파일을 자동 배포하도록 구성 가능
    
> 클라우드 서비스 추가 공부
> Cloud Computing : 🔗
> Deploy : 🔗
> AWS : 🔗