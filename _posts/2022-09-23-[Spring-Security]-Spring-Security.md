---

layout: post

title: "[Spring Security] Spring Security"

comments: true

categories: [Spring, Security]

tags: [Spring, Security]

---

### <span style='color: #2D3748; background-color: #ffdce0'>Spring Security</span>

- Spring Security

  - Spring MVC 기반 애플리케이션 인증(Authentication)과 인가(Authorization) 기능 지원하는 보안 프레임워크
    - Spring MVC 기반 애플리케이션 보안 적용에서의 표준과도 같음
  - Spring 지원 **Interceptor**, **Servlet Filter**를 통해 보안 기능 구현도 가능하지만 **보안 대부분의 기능을 Spring Security에서 안정적으로 지원하기 때문에 Spring Security 이용을 권장함**
  
- Spring Security 보안 강화 기능

  - 다양한 유형의 사용자 인증 기능 적용
    - form-login, 토큰 기반 적용, OAuth2 기반 인증, LDAP 인증 등
  - 애플리케이션 사용자의 Role에 따른 권한 레벨 적용
  - 애플리케이션 제공 리소스에 대한 접근 제어
  - 민감 정보에 대한 데이터 암호화
    - password 등
  - SSL 적용
  - 일반적으로 알려진 웹 보안 공격 차단
  - SSO
  - 클라이언트 인증서 기반 인증
  - 메서드 보안
  - 접근 제어 목록 (Access Control List) 보안
  
### <span style='color: #2D3748; background-color: #FFbce0'>Spring Security 사용 용어</span>

- Principal : 주체

  - 애플리케이션에서 작업을 수행하는 사용자(디바이스 또는 시스템 등)
  - 인증 프로세스가 성공적으로 수행된 사용자의 계정 정보를 의미
  
- **Authentication : 인증**

  - 애플리케이션 사용 시 사용자가 본인인지 확인하는 절차
  - 신원을 증명하는 과정
  - 정상 수행을 위해 Credential 필요
  - Credential : 신원 증명 정보
  
- **Authorization : 인가, 권한 부여**

  - Authentication(인증)이 정상적으로 수행 된 사용자에게 하나 이상의 권한(Authority)를 부여
  - 특정 애플리케이션의 특정 리소스에 접근 가능하도록 허가하는 과정
  
- Access Control : 접근 제어

  - 사용자가 애플리케이션의 리소스에 접근하는 행위를 제어하는 행위
  
### <span style='color: #2D3748; background-color: #FFbce0'>Spring Security 특징</span>

- [🔗Session Fixation 세션 고정 공격](https://owasp.org/www-community/attacks/Session_fixation) 보호

- 🔗[CSRF](https://namu.wiki/w/CSRF) 공격 방지

- 🔗[클릭재킹](https://ko.wikipedia.org/wiki/%ED%81%B4%EB%A6%AD%EC%9E%AC%ED%82%B9) 공격 방지

### <span style='color: #2D3748; background-color: #FFbce0'>Spring Security 사용 이유</span>

- 보안 강화 위한 솔루션으로 Spring Security만한 프레임워크가 없다  

  - 🔗[Apache Shiro](https://shiro.apache.org/), 🔗[OACC](http://oaccframework.org/) 등의 Java 애플리케이션을 위한 보안 프레임워크 존재
  - **Spring Security**는 위 보안 프레임워크를 능가하는 기능 지원
  - Spring과 궁합이 잘 맞음
  
- 기본 옵션만으로 불가한 특정 보안 요구 사항을 만족시키기 위한 코드 커스터마이징 용이 및 유연한 확장 가능

### <span style='color: #2D3748; background-color: #FFbce0'>Spring Security  [🔗SSR 방식에서의 구성](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-controller)</span>

- InMemory 방식 : 테스트환경 혹은 데모환경에서 사용

  - Spring Security의 기본구조와 기본 동작방식 이해에 가장 좋은 Form-Login 방식
  - Spring Security를 이용한 보안 설정
    - HttpSecurity를 매개변수로 갖고 SecurityFilterChain을 리턴하는 Bean 생성
  - HttpSecurity를 통해 Spring Security 지원 보안 설정 구성 가능
  - 로컬환경에서의 테스트를 위해서는 CSRF설정 비활성 필요
  - 🔗[AntPattern](https://ant.apache.org/manual/dirtasks.html#patterns)
  - 이름 충돌 방지 위한 🔗[XML NameSpace](w3schools.com/xml/xml_namespaces.asp)
  
- DB 연동 방식 : Custom UserDetailsService를 사용하는 방법

  - JavaConfiguration의 Bean 등록 변경
  ```java
  @Configuration
  public class JavaConfiguration {
    // 데이터를 DB에 저장, 패스위드 암호화 위한 Memberrepository, PasswordEncoder DI
    @Bean
    public MemberService dbMemberService(MemberRepository memberRepository,
                                         PasswordEncoder passwordEncoder) {
      return new DBMemberService(memberRepository, passwordEncoder);
  ```
  
  - DBMemberService 구현
    - Spring Security 제공 🔗[PasswordEncoder](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html#authentication-password-storage)
    - 패스워드 같은 민감한(sensitive) 정보는 반드시 암호화 저장
    - 패스워드는 암호화 된 상태에서 복호화 할 이유없음
      - 즉, 🔗[단방향 암호화 방식](https://en.citizendium.org/wiki/One-way_encryption)으로 암호화
  ```java
  @Transactional
  public class DBMemberService implements MemberService {
    // MemberRepository, PasswordEncoder Bean 객체 DI
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
  
    public DBMemberService(MemberRepository memberRepository,
                             PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }
  
    public Member createMember(Member member) {
        verifyExistsEmail(member.getEmail());
        
        // PasswordEncoder 사용하여 패스워드 암호화
        String encryptedPassword = passwordEncoder.encode(member.getPassword());
        
        // 암호화된 패스워드를 password 필드에 할당
        member.setPassword(encryptedPassword);   
  
        Member savedMember = memberRepository.save(member);
  
        System.out.println("# Create Member in DB");
        return savedMember;
    }
    
    ...
    ...
  }
  ```
  
  - Custom UserDetailsService 구현
    - Spring Security 제공 컴포넌트 중 하나인 UserDetailsService
      - UserDetailsService는 User 정보를 로드하는 핵심 인터페이스
    - UserDetailsManager : UserDetailsService를 상속하는 확장 인터페이스
    - InMemberUserDetailsManager : UserDetailsManager 의 구현체
    - **UserDetails**는 UserDetailsService에 의해 로드되어 인증을 위해 사용되는 핵심 User 정보 표현 인터페이스
      - 직접사용되지는 않고 Authentication 객체로 캡슐화되어 제공됨
  ```java
  // DB의 인증정보로 인증 처리하는 Custom UserDetailsService
  @Component
  public class HelloUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;
    private final HelloAuthorityUtils authorityUtils;
  
    public HelloUserDetailsServiceV(MemberRepository memberRepository, HelloAuthorityUtils authorityUtils) {
        this.memberRepository = memberRepository;
        this.authorityUtils = authorityUtils;
    }
  
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Member> optionalMember = memberRepository.findByEmail(username);
        Member findMember = optionalMember.orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));
  
        return new HelloUserDetails(findMember)l
    }
    
    // DB 조회 회원 정보를 Spring Security의 User 정보로 변환하는 과정, User 권한정보 생성 과정 캡슐화
    private final class HelloUserDetails extends Member implememts UserDetails {
        HelloUserDetails(Member member) {
            setMemberId(member.getMemberId());
            setName(member.getName());
            setEmail(member.getEmail());
            setPassword(member.getPassword());
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorityUtils.createAuthorities(this.getEmail()); 
        }
        
        @Override
        public String getUsername() {
            return getEmail();
        }
  
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
  
        @Override
        public boolean isAccountNonLocked() {
            return true;
        }
  
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
  
        @Override
        public boolean isEnabled() {
            return true;
        }
    }
  }
  
  // User 권한 매핑, 생성하는 HelloAuthorityUtils
  @Component
  public class HelloAuthorityUtils {
    // .yml 추가 프로퍼티 가져오는 표현식
    // @Value("${프로퍼티_경로}")
    // 사용 전 .yml파일에 관리자 이메일 주소 정의 필요
    @Value("${mail.address.admin}")
    private String adminMailAddress;
  
    // AuthorityUtils 클래스 사용하여 관리자용 권한 목록 생성
    private final List<GrantedAuthority> ADMIN_ROLES = AuthorityUtils.createAuthorityList("ROLE_ADMIN", "ROLE_USER");
  
    // AuthorityUtils 클래스 사용하여 일반 사용 권한 목록 생성
    private final List<GrantedAuthority> USER_ROLES = AuthorityUtils.createAuthorityList("ROLE_USER");
    
    public List<GrantedAuthority> createAuthorities(String email) {
        // 매개변수 email과 .yml파일의 이메일과 동일하다면 관리자용 권한 리턴
        if (email.equals(adminMailAddress)) {
            return ADMIN_ROLES;
        }
        return USER_ROLES;
    }
  }
  ```
  
  - User Role 을 DB에서 관리
    - JPA 통한 User와 User 권한정보간의 연관관계 매핑 추가
    - 회원가입 시, User의 권한 정보를 DB에 저장 추가
    - 로그인 인증 시, User 권한정보를 DB 조회 작업 추가
  
- [🔗bcrypt 알고리즘](https://ko.wikipedia.org/wiki/Bcrypt)
- [🔗Clickjacking 공격](https://ko.wikipedia.org/wiki/%ED%81%B4%EB%A6%AD%EC%9E%AC%ED%82%B9)