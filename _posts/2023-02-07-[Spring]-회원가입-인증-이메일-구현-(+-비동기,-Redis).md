---

layout: post

title: "[Spring] 회원가입 인증 이메일 구현 (+ 비동기, Redis)"

comments: true

categories: [Spring]

tags: [Spring]

---

팀 프로젝트를 진행하며 Security, OAuth2 와 함께 인증 이메일 전송을 맡게 되었다.

오늘은 인증 이메일 구현 포스팅을 하려고 한다.

------

### 회원가입 인증 이메일 구현

일반적으로 이메일 인증에 사용되는 방법은 두가지가 있다.

1. 이메일 인증 URL을 전송하여 URL 접속 시 인증되는 방식

2. 인증 코드를 전송하여 해당 코드를 입력 시에 인증되는 방식

필자는 2번 방법을 사용하여 구현하였다.

레디스를 사용하여 인증 코드 유효 시간 및 인증 유무를 확인 할 예정이다.

------

#### 개발 환경

IntelliJ, Java 11, Spring Boot, Gradle, Redis

------

#### 구글 계정 설정

1. 구글 로그인 후 우측 상단 프로필 클릭 -> Google 계정 관리 클릭

![img](https://blog.kakaocdn.net/dn/9GSnn/btr1dcEP3Bv/u9vUFmrOl1G8O48soKcdZK/img.png)



2. 보안 탭 클릭 후 2단계 인증 활성화

![img](https://blog.kakaocdn.net/dn/Gvi5i/btr0WejyG1q/gFZ5NDIH3pK3BdztMkw96K/img.png)



3. 앱 비밀번호 클릭 후, **앱 선택 : 메일, 기기 선택 : Windows** 선택 후 생성 클릭

![img](https://blog.kakaocdn.net/dn/b8otgs/btr0VLhlzL2/Ip2hzkhGoOEUvKVoltfTwk/img.png)



4. 생성된 앱 비밀번호 유출되지 않을 곳에 저장

![img](https://blog.kakaocdn.net/dn/bhuazi/btr0We4U5HD/VtyqgKKZSn1FpY2ZeRuFt0/img.png)

------

#### Spring 설정



1. build.gradle Dependency에 추가

```java
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-mail'
}
```



2. application.yml **SMTP** 세팅

```yaml
spring:
  mail:
  host: smtp.gmail.com
  port: 587
  username: ${GOOGLE_EMAIL}
  password: ${GOOGLE_APP_PASSWORD} # 발급받은 앱 비밀번호
  properties:
    mail:
      smtp:
        auth: true
        starttls:
          enable: true
```



3. MailDto 생성

인증 코드를 전달받을 이메일을 그리고 이메일, 인증코드를 입력받을 DTO가 필요하다.

```java
public class MailDto {
	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class postEmail {
		@NotBlank
		@Email(message = "올바른 이메일 형식이 아닙니다.")
		private String email;
	}

	@Getter
	@Builder
	public static class checkMail {
		@NotBlank
		private String code;
		private String email;
	}
}
```



4. MailConfig 생성 

이메일 인증 관련 빈 등록을 해야한다.

```java
@Configuration
@PropertySource("classpath:application.yml")
public class MailConfig {
	@Value("${spring.mail.port}")
	private int port;
	@Value("${spring.mail.host}")
	private String host;
	@Value("${spring.mail.username}")
	private String username;
	@Value("${spring.mail.password}")
	private String password;
	@Value("${spring.mail.properties.mail.smtp.auth}")
	private Boolean auth;
	@Value("${spring.mail.properties.mail.smtp.starttls.enable}")
	private Boolean starttls;

	@Bean
	public JavaMailSender javaMailService() {
		JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
		javaMailSender.setHost(host);
		javaMailSender.setUsername(username);
		javaMailSender.setPassword(password);
		javaMailSender.setPort(port);
		javaMailSender.setJavaMailProperties(getMailProperties());
		javaMailSender.setDefaultEncoding("UTF-8");
		return javaMailSender;
	}

	private Properties getMailProperties() {
		Properties properties = new Properties();
		properties.put("mail.transport.protocol", "smtp");
		properties.put("mail.smtp.auth", auth);
		properties.put("mail.debug", "true");
		properties.put("mail.smtp.starttls.enable", starttls);
		return properties;
	}
}
```



5. MailService 

서비스 단에서 인증 코드 생성 및 레디스에 저장을 하였다.

유효한 인증 코드인지 검증하는 로직도 포함되어있다.

```java
@Service
@RequiredArgsConstructor
public class MailService {
	private final RedisUtil redisUtil;
	private final JavaMailSender javaMailSender;
	private final UserRepository userRepository;
	private final RedisTemplate<String, String> redisTemplate;

	private MimeMessage createMessage(String code, String email) throws Exception {
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

		helper.setTo(email);
		helper.setSubject("이메일 인증 코드입니다.");
		helper.setText("이메일 인증 코드: " + code, true);
		helper.setFrom( /* 본인 구글 이메일 */ , /* 전송한 사람 이름 */ );

		return message;
	}

	public void sendMail(String code, String email) throws Exception {
		try {
			MimeMessage mimeMessage = createMessage(code, email);
			javaMailSender.send(mimeMessage);
		} catch (MailException mailException) {
			mailException.printStackTrace();
			throw new IllegalAccessException();
		}

		redisUtil.setDataExpire(email, code, 60 * 5L); // 인증번호 5분간 유효
	}

    // 실질적인 메일 전송 메서드
	public String sendCertificationMail(String email) {
		try {
			String code = UUID.randomUUID().toString().substring(0, 6); // 랜덤한 6자리 코드 생성
			verifyHasCode(email);
			sendMail(code, email);
			return code;
		} catch (Exception exception) {
			exception.printStackTrace();
			throw new BusinessLogicException(ExceptionCode.EMAIL_EXIST);
		}
	}

	/* 인증된 이메일 레디스 저장 */
	public void setVerifiedEmail(String email) {
		redisUtil.deleteData(email);
		redisUtil.setData(email, "true"); // 이메일 인증된 회원 가입인지 확인하기 위해 키는 이메일, 값은 true로 저장해주었다
	}

	/* 인증 번호는 존재하지만 인증 안된 이메일인 경우 */
	private void verifyHasCode(String email) {
		if (Boolean.TRUE.equals(redisTemplate.hasKey(email))) {
			redisTemplate.delete(email);
		}
	}

	/* 인증번호 전송 전, 이미 가입한 이메일인지 확인 */
	public void verifyEmail(String email) {
		if (userRepository.findByEmail(email).isPresent()) {
			throw new BusinessLogicException(ExceptionCode.EMAIL_EXIST);
		}
	}
}
```



6. MailController

mailService를 활용하여 api를 구성한다.

```java
@Controller
@RequestMapping
@RequiredArgsConstructor
public class MailController {
	private final MailService mailService;
	private final RedisTemplate<String, String> redisTemplate;

	@PostMapping("/mail")
	public ResponseEntity<String> sendEmail(@RequestBody MailDto.postEmail mailDto) {
		mailService.verifyEmail(mailDto.getEmail());
		mailService.sendCertificationMail(mailDto.getEmail());

		return ResponseEntity.ok("인증 코드가 전송되었습니다.");
	}

	@PostMapping("/mail/check")
	public String checkEmail(@RequestBody MailDto.checkMail checkMail) {
		String verify = checkMail.getEmail();
        
		if (!Boolean.TRUE.equals(redisTemplate.hasKey(checkMail.getEmail()))) {
			verify = "유효한 이메일이 아닙니다.";
		}
		if (!Objects.equals(redisTemplate.opsForValue().get(checkMail.getEmail()), checkMail.getCode())) {
			verify = "유효한 인증 코드가 아닙니다.";
		}

		mailService.setVerifiedEmail(checkMail.getEmail());

		return verify;
	}
}
```

------

위와 같이 구현하였고 실제로 이메일 전송을 해보니 꽤나 오랜 시간이 걸린다 느꼈고 시간을 측정해본 결과 3232484700ns, 즉 3초 이상이 걸렸다.

![비동기 적용 전 메일 전송 시간](https://blog.kakaocdn.net/dn/ctA7Nj/btrZNKiYkYZ/eYU1kbc2JeERfjqv52pgCk/img.png)

회원가입이 있을때마다 매번 3초 이상 씩 딜레이 된다는 점에서 개선이 필수적이라고 느꼈고 비동기를 적용하였다.



#### 비동기 적용

1. 먼저 AsyncConfigurerSupport 를 상속받는 클래스인 AsyncConfig를 생성하였다

```java
@EnableAsync
@Configuration
public class AsyncConfig extends AsyncConfigurerSupport {

    /* 이메일 비동기 처리 */
    @Bean(name = "threadPoolTaskExecutor-Mail") // 다중으로 만들때 @Bean 어노테이션을 사용한다. 한개만 만들 시엔 필요없다
    public Executor getMailAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setMaxPoolSize(10); // 동시 동작하는 최대 스레드 개수
        executor.setCorePoolSize(5); // 기본 실행 대기 중 스레드 개수
        executor.setQueueCapacity(500); // CorePool 초과 시 Queue에 저장해 둔 후 꺼내서 실행
        executor.setThreadNamePrefix("mail_async-");
        executor.initialize();
        return executor;
    }
}
```



2. 이후 메일 전송하는 메서드에 **@Async** 어노테이션을 활용하여 스레드를 생성하고, 연결한다.

```java
@Async("threadPoolTaskExecutor-Mail") // @Bean 을 통해 생성한 이름을 넣는다
	public String sendCertificationMail(String email) {

		try {
			String code = UUID.randomUUID().toString().substring(0, 6);
			verifyHasCode(email);
			sendMail(code, email);
			return code;
		} catch (Exception exception) {
			exception.printStackTrace();
			throw new BusinessLogicException(ExceptionCode.EMAIL_EXIST);
		}
	}
```

------

정말 간단하게도 비동기 적용이 끝났다.
그리고 이메일을 전송하여 시간을 측정해보니 확실한 차이를 느꼈다.
실제 동작 시간은 이와 같았다.

![비동기 적용 후 동작 시간](https://blog.kakaocdn.net/dn/uUjmg/btrZKoVhKx8/kzuRnRWMjFcObiXhZ8ax81/img.png)

비동기를 적용하기 전과 비교를 해보면 무려 약 **80600%** 의 속도가 개선된 것을 확인할 수 있었다.
그리고 레디스를 활용하여 지연 시간을 줄이고, 간단하게 이메일 인증 제한 시간을 구현할 수 있었다.