---

layout: post

title: "[Spring] Spring Framework 기초  "

comments: true

categories: [Spring]

tags: [Spring]

---

### Framework

- 기본적으로 프로그래밍을 하기 위한 틀이나 구조를 제공
- 다양한 기능들을 라이브러리 형태로 제공함으로써 개발자가 애플리케이션의 핵심 로직을 개발하는데에 집중하게해줌
- 특정 개념들의 추상화를 제공하는 여러 클래스나 컴포넌트로 구성
- 추상적인 개념들이 문제를 해결하기 위해 같이 작업하는 방법 정의
- 프레임워크만으로 애플리케이션이 동작하지는 않음
- 프로그래밍을 위한 기본구조 제공 이상의 많은 기능 제공
  - 서로 다른 애플리케이션간의 통신
  - 데이터를 데이터 저장소에 저장

------

**Framework와 Library**

- Library
  - 단순 활용 가능한 도구들의 집합
  - 개발자가 구성한 코드 내에서 필요한 기능이 있으면 해당 라이브러리를 호출해서 사용
  - 프레임워크에서 필요한 최소한의 라이브러리 지원
  - JUnit, Lombok 등..
- 차이
  - Library : 애플리케이션의 흐름 주도권이 개발자에게 있다
  - Framework : 애플리케이션의 흐름 주도권이 Framework에 있다.(IoC 제어의 역전)

- Framework 장점
  - 가이드 제공으로 프로그램 체계적 관리 가능
  - 규약에 맞춰 작성하기에 유지보수 체계적 가능
  - 기본적인 설계, 라이브러리 제공으로 개발속도 ↑
  - 코드의 재사용성, 확장성 ↑
- Framework 단점
  - 프레임워크 별 학습 필요
  - 프로젝트 용량 증가
  - 규약 벗어나서 코드 작성 X

------

### Spring Framework

- Java 기반의 웹 애플리케이션을 개발하는데에 필요한 Framework
- Java 기반의 웹 애플리케이션을 개발하는데 있어 표준과도 같음
- 기업들이 Spring Framework를 선택하는 이유(기업용 엔터프라이즈 시스템)
  - 개발 생산성 ↑
  - 유지 보수 용이
  - 신뢰성 중요
  - 서버 안정성 유지 중요
  - 데이터 관리 중요

**Spring Framework 도입 전 기술**

- JSP를 이용한 애플리케이션
  - JSP 개발 방식 : 사용자에게 보여지는 View 페이지 코드와 사용자의 요청을 처리하는 서버 코드가 섞여있는 형태 (프론트엔드 + 백엔드)
  - 코드자체가 너무 길어 가독성 저하
  - 애플리케이션 유지보수 최악
  - 효율적인 협업 불가능

------

```java
// Sevlet 방식 예제 코드 : Java코드만 별도의 서블릿 클래스로 분리 시킴

@WebServlet(name = "TodoServelt")
public class TodoServlet extends HttpServlet {
  // (1) DataBase를 대신한다
  private List<ToDo> todoList;
  
  @Override
  public void init() throws ServletException {
    super.init();
    this.todoList = new ArrayList<>();
  }
  
  // (2) 클라이언트 측에서 요청을 받아 데이터 저장소에 등록한다
  // DB가 아닌 List에 담아줌
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      request.setCharacterEncoding("UTF_8");
      response.setContentType("text/html;charset="UTF_8"");
      
      String todoName = request.getPArameter("todoName");
      String todoDate = request.getParameter("todoDate");
      
      todoList.add(new ToDo(todoName, todoDate));
      
      RequestDispatcher dispatcher = 
          request.getRequestDispatcher("/todo.jsp");
      request.setAttribute("todoList", todoList);
      
      dospatcher.forward(request, response);
  }
  
  // (3)
  protected void doGet(HttpServletRequest request,
      HttpServletResponse response) 
          throw ServletException, IOException {
      System.out.println("Hello Servlet doGet!");
      
      RequestDispatcher dispatcher = 
          request.getRequestDispatcher("/todo.jsp");
      dispatcher.forward(request, response);
  }
}
```

- 서블릿(Servlet)을 이용한 애플리케이션
  - Servlet : 클라이언트 웹 요청처리에 특화된 Java 클래스의 일종
  - JSP 방식도 내부적으로는 Servlet 방식 사용
  - **Spring을 사용한 웹 요청 처리시에도 내부적으로 Servlet 사용**
  - JSP보단 아니지만 그래도 여전히 코드가 길다
  - [🔗Java Servlet](https://ko.wikipedia.org/wiki/자바_서블릿)
  - [🔗](https://ko.wikipedia.org/wiki/자바_서블릿)[Servlet Container](https://ko.wikipedia.org/wiki/웹_컨테이너)
    - 서블릿 컨테이너(웹 컨테이너)는 서블릿(Servlet) 기반의 웹 애플리케이션실행부터 Servlet 생명 주기 관리, 쓰레드 풀(Thread Pool) 생성하여 Servlet과 Thread를 매핑시킴
    - [🔗](https://ko.wikipedia.org/wiki/자바_서블릿)[아파치톰캣(Apache Tomcat)](https://ko.wikipedia.org/wiki/아파치_톰캣) 은 서블릿 컨테이너의 한 종류로써 Spring MVC 기반의 웹 애플리케이션 역시 기본적으로 [🔗](https://ko.wikipedia.org/wiki/자바_서블릿)[아파치 톰캣](https://tomcat.apache.org/)에서 실행

------

```java
//Spring MVC 방식 예제코드 
@Controller
public class ToDoController {
    @RequestMapping(value = "/todo", method = RequestMethod.POST)
    @ResponseBody
    public List<ToDo> todo(@RequestParam("todoName")String todoName,
                               @RequestParam("todoDate")String todoDate) {
        ToDo.todoList.add(new ToDo(todoName, todoDate));
        return ToDo.todoList;
    }
    
    @RequestMapping(value = "/todo", method = ReuestMethod.GET)
    @ResponseBody
    public List<ToDo> todoList() {
        return ToDo.todoList;
    }
}
```

- Spring MVC 를 이용한 애플리케이션
  - 코드가 굉장히 간결해짐
  - Spring MVC방식은 클라이언트의 요청에 담긴 데이터를 꺼내오는 작업, 캐릭터셋지정 등과 같은 작업들을 눈에 보이지 않지만 Spring에서 알아서 처리해줌
  - 하지만 Spring 기반의 애플리케이션의 기본 구조를 잡는 설정 작업이 여전히 불편
  - Spring 애플리케이션을 정상적으로 구동하기 위해 추가적인 추가파일 필요(web.xml 등)

------

### Spring Boot

Spring Boot

```java
@RestController
public class TodoController {
    private TodoRepository todoRepository;

    @Autowired
    TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @PostMapping(value = "/todo/register")
    @ResponseBody
    public Todo register(Todo todo) { // (1) 클라이언트 요청데이터를 클래스에 담아서 한번에 전달
        todoRepository.save(todo); // (2) DB에 저장
        return todo;
    }

    @GetMapping(value = "/todo/list")
    @ResponseBody
    public List<Todo> getTodoList(){
      return todoRepository.findAll(); // (3) 데이터 엑세스 처리
    }
}
```

```yaml
# application.properties
spring.h2.console.enabled=true
spring.h2.console.path=/console
spring.jpa.generate-ddl=true
spring.jpa.show-sql=true

# application.yml
spring:
  h2:
    console:
      enalbled: true
      path: /console
  jpa:
    generate-ddl: true
    show-sql: true
```

- Spring MVC의 단점을 개선시킨 **Spring Boot**
  - 데이터 저장뿐만 아닌 기능을 추가했음에도 코드 길이 유지
  - 복잡한 설정 작업또한 Spring이 대신 처리
    - 개발자가 애플리케이션 핵심 비즈니스 로직에만 집중할 수 있도록 도움
  - 설정 파일 역시 단순화됨
    - .properties 파일 보단 .yml파일이 더 간단