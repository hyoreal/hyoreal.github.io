---

layout: post

title: "[Spring] API 문서 "

comments: true

categories: [Spring]

tags: [Spring]

---

### <span style='color: #2D3748; background-color: #ffdce0'>API 문서화</span>

- API 문서화

  - 클라이언트가 REST API 애플리케이션에 요청을 전송하기 위해서 알아야 하는 요청정보(요청 URL, Request Body, Query Parameter 등)을 문서로 정리한것
  - API사용을 위한 정보가 담겨있는 문서를 API문서 또는 API 스펙(Specification, 사양)이라고 함
  - API문서화 방법
    - 개발자 수기 작성
    - 애플리케이션 빌드를 통한 API 문서 자동생성
  
- API 문서화 필요이유

  - REST API기반의 백엔드 애플리케이션을 프론트엔드(클라이언트 측)에서 사용하기 위한 정보 제공
  
- API 문서 생성 자동화 필요이유

  - API 문서를 수기로 작성하는 것은 굉장히 비효율적임
  - 클라이언트에게 제공한 API 정보와 수기로 작성한 정보가 다를 수 있음
  - 작업 시간 단축
  - 애플리케이션의 완성도 ↑
  
- Spring Rest Docs vs 🔗[Swagger](https://swagger.io/docs/specification/about/)

  - Swagger
    - API 요청 툴로써의 기능 사용 가능
    - API 문서를 만들기 위해 무수히 많은 애너테이션이 추가됨
    - 클라이언트 측에서 보기엔 편하지만 개발자 측에선 바람직하지 않게 보임
      - 기능 구현과 상관없는 애너테이션이 대량으로 추가되기 때문
    - API 엔드포인트를 위한 기능 구현 코드가 한 눈에 들어오지 않음
    - API 스펙 정보를 문자열로 입력하는 경우가 많음
  - Spring Rest Docs
    - Test 클래스에서만 API 문서를 위한 정보 코드를 작성하면 됨
    - Test 가 통과하지 않으면 API 문서가 생성되지 않음
    - 애플리케이션에 정의되어있는 API 스펙 정보와 API 문서 내의 정보가 일치하지 않으면 문서가 생성되지 않음
    
  
- Spring Rest Docs

  - Controller의 슬라이스 테스트를 통해 테스트가 통과 되어야지만 API 문서가 정상적으로 만들어진다
  - 테스트를 중요하게 생각하는 개발자들에게 각광 받는 기술
  - Spring Rest Docs API 문서 생성 흐름
    - 슬라이드 테스트 코드 작성, API 스펙 정보 코드 작성
      → test 태스크 실행
      → 테스트 결과
      → 실패 시, API 스펙 정보 코드 작성으로 되돌아감
      → 성공 시, API 문서 스니핏 생성(.adoc)
      → API 문서 생성(.adoc)
      → API 문서를 HTML 로 변환
      
### <span style='color: #2D3748; background-color: #ffdce0'>Spring Rest Docs 설정</span>

  - build.gradle 설정
  ```java
  plugins {
	...
    // .adoc 파일 확장자를 가지는 AsciiDoc 문서 생성하는 Asciidoctor를 사용하기 위한 플러그인
	id "org.asciidoctor.jvm.convert" version "3.3.2" 
	id 'java'
  }

  group = 'com.codestates'
  version = '0.0.1-SNAPSHOT'
  sourceCompatibility = '11'

  repositories {
	mavenCentral()
  }

  // ext 변수의 set()메서드를 사용하여 API 문서 스니핏 생성 경로 지정
  ext {
	set('snippetsDir', file("build/generated-snippets"))
  }

  // AsciiDoctor에서 사용되는 의존 그룹 지정
  // :asciidoctor task 실행 시 지정한 'asciidoctorExtensions' 라는 그룹을 지정
  configurations {
	asciidoctorExtensions
  }

  dependencies {
       // spring-restdocs-core와 spring-restdocs-mockmvc 의존 라이브러리 추가
	testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc'
  
    // spring-restdocs-asciidoctor 의존 라이브러리 추가
    // configurations 에서 지정한 그룹에 의존 라이브러리가 포함됨
	asciidoctorExtensions 'org.springframework.restdocs:spring-restdocs-asciidoctor'
    
    ...
    
	implementation 'org.mapstruct:mapstruct:1.5.1.Final'
	annotationProcessor 'org.mapstruct:mapstruct-processor:1.5.1.Final'
	implementation 'org.springframework.boot:spring-boot-starter-mail'

	implementation 'com.google.code.gson:gson'
  }

  // :test task 실행 시, API 문서 생성 스니핏 디렉토리 경로 지정
  tasks.named('test') {
	outputs.dir snippetsDir
	useJUnitPlatform()
  }

  // :asciidoctor task 실행 시, Asciidoctor 기능 사용 위한 :asciidoctor task에 asciidoctorExtensions 설정
  tasks.named('asciidoctor') {
	configurations "asciidoctorExtensions"
	inputs.dir snippetsDir
	dependsOn test
  }

  // :build task 실행 전 실행되는 task
  // :copyDocument task 수행 시
  // index.html파일이 src/main/resources/static/docs 에 copy됨
  // copy된 index.html 파일은 API 문서를 파일 형태로 외부에 제공하기 위한 용도로 사용 가능
  task copyDocument(type: Copy) {
	dependsOn asciidoctor            // :asciidoctor task 실행 후 task실행되도록 의존성 설정
	from file("${asciidoctor.outputDir}")   // build/docs/asciidoc/ 경로에 생성되는 index.html을 copy
	into file("src/main/resources/static/docs")   // src/main/resources/static/docs 경로에 index.html 추가
  }

  build {
	dependsOn copyDocument  // :build task 실행 전 :copyDocument task 가 먼저 수행되도록 함
  }

  // :bootJar task 설정. 웹브라우저에서 API문서 확인 위한 용도
  bootJar {
    // :bootJar task 실행 전 :copyDocument task 실행되도록 의존성 설정
	dependsOn copyDocument
    // Asciidoctor  실행으로 생성되는 index.html파일을 jar 파일 안에 추가
    // 웹 브라우저에서 접속(http://localhost:8080/docs/index.html) 후, API문서 확인 가능
	from ("${asciidoctor.outputDir}") {
		into 'static/docs'
	}
  }
  ```
  - [🔗Gradle](https://docs.gradle.org/current/userguide/userguide.html)
  - [🔗ext 변수](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.ExtraPropertiesExtension.html)



### <span style='color: #2D3748; background-color: #ffdce0'>Spring Rest Docs 적용</span>

  ```java
  @WebMvcTest(MemberController.class)
  @MockBean(JpaMetamodelMappingContext.class)
  @AutoConfigureRestDocs
  public class MemberControllerRestDocsTest {
    @Autowired
    private MockMvc mockMvc;

    // MemberService의 Mock Bean 주입
    // 테스트 케이스에서의 가짜 메서드 호출 시 사용(Stubbing)
    @MockBean
    private MemberService memberService;

    // MemberMapper의 Mock Bean 주입
    // 테스트 케이스에서의 가짜 메서드 호출 시 사용(Stubbing)
    @MockBean
    private MemberMapper mapper;

    @Autowired
    private Gson gson;

    @Test
    public void postMemberTest() throws Exception {
        // postMember() 핸들러 메서드에 전송하는 request body
        // given
        MemberDto.Post post = new MemberDto.Post("hgd@gmail.com", "홍길동", "010-1234-5678");
        String content = gson.toJson(post);

        // postMember() 핸들러 메서드가 응답으로 전송하는 response body
        MemberDto.response responseDto =
                new MemberDto.response(1L,
                        "hgd@gmail.com",
                        "홍길동",
                        "010-1234-5678",
                        Member.MemberStatus.MEMBER_ACTIVE,
                        new Stamp());
                        
        // mockito
        // 주입받은 mock 객체를 사용하여 stubbing
        given(mapper.memberPostToMember(Mockito.any(MemberDto.Post.class))).willReturn(new Member());
        given(memberService.createMember(Mockito.any(Member.class))).willReturn(new Member());
        given(mapper.memberToMemberResponse(Mockito.any(Member.class))).willReturn(responseDto);

        // 슬라이스 테스트
        // MockMvc의 perform()메서드로 PATCH 요청 전송
        ResultActions actions =
                mockMvc.perform(
                        post("/v11/members/{member-id}")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );

        // then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.memberId").value(patch.getMemberId()))
                .andExpect(jsonPath("$.data.email").value(post.getEmail()))
                .andExpect(jsonPath("$.data.name").value(post.getName()))
                .andExpect(jsonPath("$.data.phone").value(post.getPhone()))
                /// andDo(document... 부터 API 문서 생성 위한 코드
                .andDo(document(       // API 스펙 정보를 전달받아 실질적 문서화 작업을 수행하는 핵심 메서드
                        "patch-member",     // API 문서 스니핏의 식별자
                        getRequestPreProcessor(),      
                        getResponsePreProcessor(),
                        pathParameters(             
                                parameterWithName("member-id").description("회원 식별자")
                        ),
                        requestFields(             
                                List.of(
                                        fieldWithPath("email").type(JsonFieldType.STRING).description("이메일"), 
                                        fieldWithPath("name").type(JsonFieldType.STRING).description("이름"),
                                        fieldWithPath("phone").type(JsonFieldType.STRING).description("휴대폰 번호")
                                )
                        ),
                        responseFields(        
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과 데이터"),
                                        fieldWithPath("data.memberId").type(JsonFieldType.NUMBER).description("회원 식별자"),
                                        fieldWithPath("data.email").type(JsonFieldType.STRING).description("이메일"),
                                        fieldWithPath("data.name").type(JsonFieldType.STRING).description("이름"),
                                        fieldWithPath("data.phone").type(JsonFieldType.STRING).description("휴대폰 번호"),
                                        fieldWithPath("data.memberStatus").type(JsonFieldType.STRING).description("회원 상태"),
                                        fieldWithPath("data.stamp").type(JsonFieldType.NUMBER).description("스탬프 갯수")
                                )
                        )
                ));
    }
  }
  ```

- pathParameters 사용 시 주의

  - MockMvcBuilers가 아닌 RestDocumentationRequestBuilders 사용해야함
    - RestDocumentationRequestBuilders 사용 시 URI를 매개변수로 받으면 urlTemplates를 찾을 수 없어 URI를 String 타입으로 만들거나 해야함
    - 🔗에러로그 링크