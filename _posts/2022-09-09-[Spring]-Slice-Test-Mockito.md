---

layout: post

title: "[Spring] Slice Test, Mockito "

comments: true

categories: [Spring, Testing]

tags: [Spring, Mockito, Testing]

---

### <span style='color: #2D3748; background-color: #FFBC98'>Slice Test</span>

- Slice Test

  - 각 계층에 구현해 놓은 기능들이 잘 동작하는지 특정 계층만 잘라서(Slice) 테스트하는 것
  - 통합테스트
    - 슬라이스 테스트 후 통합테스트까지 마무리해야 비로소 개발자의 테스트 작업이 마무리된다고 할 수 있지만 일반적으로 QA부서에서 진행함
    - QA부서에서 통합테스트 진행 전, 애플리케이션의 특정 수정 사항으로 인해 영향을 받는 범위에 한해 제한된 테스트 진행을 스모크 테스트라고 함
  - 단위 테스트, 슬라이스 테스트 시 Mock 객체 사용 (Mocking)
  
### <span style='color: #2D3748; background-color: #FFE298'>Mockito</span>

- Mock

  - `not real, but intended to be very similar to a real situation, substance etc`
  - 테스트 세계에서의 Mock : 가짜 객체
  
- Mock 사용 이유

  - 슬라이스 테스트는 해당 계층에 대한 테스트를 집중해야함
  - Mock 객체 없이 테스트를 하게되면 DB까지 이어졌다 되돌아오기 때문에 통합테스트에 가까움
  - Mock 객체를 사용하여 다른 계층과 단절시켜 불필요한 과정을 줄일 수 있음
  
- Mockito

  - Mock 객체로 Mocking을 할 수 있게 해주는 Spring Framework 지원 라이브러리
  - Mock 객체 생성 및 해당 객체가 진짜 객체처럼 동작하게 해준다
  
### <span style='color: #2D3748; background-color: #ECFF98'>Slice Test에 Mockito 적용</span>

- API 계층 (Controller)

  ```java
  @SpringBootTest
  @AutoConfigureMockMvc
  class MemberControllerMockTest {
      @Autowired
      private MockMvc mockMvc;
  
      @Autowired
      private Gson gson;
  
      // @MockBean : 가짜 객체 주입
      @MockBean
      private MemberService memberService;
  
      @Autowired
      private MemberMapper mapper;
  
      @Test
      void postMemberTest() throws Exception {
          // given
          MemberDto.Post post = new MemberDto.Post(
                  "hgd@gmail.com",
                  "홍길동",
                  "010-1234-5678");
  			
          Member member = mapper.memberPostToMember(post);
          member.setStamp(new Stamp());
  
          // given()은 Mock 객체 특정 값을 리턴하는 동작 지정
          // Mockito의 when()과 동일 기능
          given(memberService.createMember(
                    Mockito.any(Member.class)))
                            .willReturn(member); // .willReturn()은 리턴할 stub 데이터
  
          String content = gson.toJson(post);
  
          // when
          ResultActions actions =
                    mockMvc.perform(
                            post("/v11/members")
                                    .accept(MediaType.APPLICATION_JSON)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(content));
  
          // then
          MvcResult result = 
                actions.andExpect(status().isCreated())
                       .andExpect(jsonPath("$.data.email").value(post.getEmail()))
                       .andExpect(jsonPath("$.data.name").value(post.getName()))
                       .andExpect(jsonPath("$.data.phone").value(post.getPhone()))
                       .andReturn();
      }
  }
  ```

  

- 서비스 계층

  ```java
  @ExtendWith(MockitoExtension.class)
  public class MemberService {
      @Mock
      private MemberRepository memberRepository;
      
      @InjectMocks
      private MemberService memberService;
   
      public Member createMember(Member member) {
          verifyExistsEmail(member.getEmail());  
          Member savedMember = memberRepository.save(member);
  
          publisher.publishEvent(new MemberRegistrationApplicationEvent(this, savedMember));
          return savedMember;
      }
              ...
	  	...
      private void verifyExistsEmail(String email) {
          Optional<Member> member = memberRepository.findByEmail(email);
  
          if (member.isPresent())
              throw new BusinessLogicException(ExceptionCode.MEMBER_EXISTS);
      }
  }
  ```