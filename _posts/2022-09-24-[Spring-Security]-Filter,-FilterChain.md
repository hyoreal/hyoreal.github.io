---

layout: post

title: "[Spring Security] Filter, FilterChain"

comments: true

categories: [Spring, Security]

tags: [Spring, Security, Filter]

---

### <span style='color: #2D3748; background-color: #ffdce0'>Filter</span>

- Servlet Filter

  - Servlet 기반 애플리케이션의 Filter 위치
  
  ![](https://velog.velcdn.com/images/hyoreal51/post/4f77e447-943a-48de-a885-0efb853a64c4/image.png)
  
  - 서블릿 기반 애플리케이션의 엔드 포인트에 요청이 도달하기 전, 중간에서 요청을 가로채 어떤 처리를 할 수 있도록 해주는 Java 컴포넌트
  
  - 클라이언트가 서버 측 애플리케이션으로 요청 전송 시, 제일 먼저 Servlet Filter를 거침
  
  - Filter에서의 처리가 완료되면 DispatcherServlet에서 클라이언트 요청을 핸들러에 매핑하기 위한 다음 작업 진행
  
  - Spring Security는 주요 보안에 대한 처리를 여러가지의 Filter로 처리하도록 구성
  
    - Authentication, Authorization 등의 처리
    - 자동 설정 옵션 사용 시, 10개의 Spring Security Filter 자동 설정
  
- FilterChain

  - 여러개의 필터가 체인을 형성하고 있는 Filter의 묶음

  ![](https://velog.velcdn.com/images/hyoreal51/post/b2c76229-c883-427b-a874-0bc07b79cdec/image.png)
  
- Filter와 FilterChain의 특성

  - Servlet FilterChain : 요청 URI path를 기반, HttpServletRequest를 처리
  - Filter : Filter Chain 안에서의 순서를 지정 및 지정 순서에 따라서 동작하게 가능
    - @Order(Num) 애너테이션을 통해 순서 지정
    - FilterRegistrationBean 을 이용해 Filter의 순서 명시적 지정
  
- Filter 인터페이스

  - 구현 예시
  ```java
  public class FirstFilter implements Filter {
      @Override
      // init(FilterConfig filterConfig)
      // Filter를 웹 컨테이너 내 생성 후 초기화할 때 호출
      public void init(FilterConfig filterConfig) throws ServletException {
          Filter.super.init(filterConfig);
          System.out.println("FirstFilter 생성");
          }
          
      @Override
      // doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      // Chain 을 따라 다음 Filter로 이동
      public void doFilter(ServletRequest request,
                           ServletResponse response,
                           FilterChain chain) throws IOException, ServletException {
          System.out.println("FirstFilter Start!");
          chain.doFilter(request, response);
          System.out.println("FirstFilter End!");
      }
      
      @Override
      // destory()
      // Filter 가 웹 컨테이너에서 삭제 시 호출
      public void destroy() {
          System.out.println("FirstFilter Gone!");
          Filter.super.destroy();
      }
  }
  
  ---------------------------------
  public class SecondFilter implements Filter {
      @Override
      public void init(FilterConfig filterConfig) throws ServletException {
          Filter.super.init(filterConfig);
          System.out.println("SecondFilter 생성");
      }
      
      @Override
      public void doFilter(ServletRequest request,
                           ServletResponse response,
                           FilterChain chain) throws IOException, ServletException {
          System.out.println("SecondFilter Start!!");
          chain.doFilter(request, response);
          System.out.println("SecondFilter End!!");
      }
      
      @Override
      public void destroy() {
          System.out.println("SecondFilter Gone!!");
          Filter.super.destroy();
      }
  ```
  
  - FirstFilter 적용 위한 FilterConfiguration 구성
  ```java
  @Configuration
  public class Config {
      @Bean
      public FilterRegistrationBean<FirstFilter> firstFilterRegister() {
          FilterRegistrationBean<FirstFilter> registrationBean = new FilterRegistrationBean<>(new FirstFilter());
          registrationBean.setOrder(1); // 1번째로 실행하도록 지정
          return registrationBean;
      }
      
      @Bean
      public FilterRegistrationBean<SecondFilter> secondFilterRegister()  {
          FilterRegistrationBean<SecondFilter> registrationBean = new FilterRegistrationBean<>(new SecondFilter());
          registrationBean.setOrder(2); 
          return registrationBean;
      }
  }
  
  > 실행 결과
  > FirstFilter Start!
  > SecondFilter Start!!
  > SecondFilter End!!
  > FirstFilter End!
  ```