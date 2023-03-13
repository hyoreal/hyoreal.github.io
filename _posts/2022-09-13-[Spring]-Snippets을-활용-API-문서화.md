---

layout: post

title: "[Spring] Snippets을 활용한 API 문서화 "

comments: true

categories: [Spring]

tags: [Spring]

---

### <span style='color: #2D3748; background-color: #ffdce0'>Snippets</span>

![](https://velog.velcdn.com/images/hyoreal51/post/933ab6e2-9ec8-4b84-bb07-ae3b307a1e79/image.png)

- Snippets : 테스트 케이스에 API 스펙 정보를 추가하여 생성한 문서 일부의 조각 모음

  - Gradle 프로젝트에서의 템플릿 문서 디폴트 경로 : `src/docs/asciidoc`
  
  - 템플릿 문서에서의 Snippets 사용 방법 : `include::{snippets}/snippets 문서 위치 디렉토리/snippets 문서 파일명.adoc[]'
  
  - 템플릿 문서를 HTML파일로 변환 : `[Gradle]` 탭 -> `:bootjat` or `:build` 더블클릭
  
### <span style='color: #2D3748; background-color: #ffdce0'>Asciidoc</span>

- [🔗Asciidoc](https://docs.asciidoctor.org/asciidoc/latest/)
  - Spring Rest Docs 통해 생성되는 텍스트 기반 문서 포맷
  - 기술 문서 작성을 위해 설계된 가벼운 마크업 언어 
  - [🔗AsciiDoc 구문 빠른참조](https://docs.asciidoctor.org/asciidoc/latest/syntax-quick-reference/#ex-normal) 
  
  - Asciidoc 포맷 사용하여
    - 메모, 문서, 기사, 서적, E-Book, 웹 페이지, 메뉴얼 페이지, 블로그 게시물 등을 작성
    - 작성된 문서는 HTML, PDF, EPUB, 메뉴얼 페이지를 포함한 다양한 형식으로의 변환 가능
    
### <span style='color: #2D3748; background-color: #ffdce0'>Asciidoc 기본 문법</span>

- [🔗목차 구성](https://docs.asciidoctor.org/asciidoc/latest/toc/)

  - `= API문서제목`
    - 문서 제목 작성 시 `=`를 추가
    - `=` 개수에 따라 글자 크기 조정 가능 (개수 늘어날수록 글자 크기 ↓)
  
  - `:sectnums:` : 목차에 섹션 별 넘버링

  - `:toc: 위치`
    - 목차 위치 지정
    - ex `:toc: left` 
  
  - `:toclevels: 숫자` : 목차에 표시 할 제목 레벨 설정
  
  - `:toc-title: 목차제목`
    - 목차 제목 지정
    - ex `:toc-title: Table of Contents`
  
  - `:source-highlighter: 소스코드하이라이터`
    - 소스코드 하이라이터 지정
    - ex `:source-highlighter: prettify`
  
- 박스 문단 사용 및 경고문구

	***
	문단 제목
  
           문서설명 입니다.
  
	CAUTION: 경고문구입니다.
	***
  
  ![](https://velog.velcdn.com/images/hyoreal51/post/c48791db-2b55-426a-8266-856fbd7102b9/image.png)

  
  - API 문서에 박스문단을 구성하여 API 문서에 대한 설명 추가
  - `***` 는 단락을 구분지어줌
  - 문단 제목 후 한 줄 띄우고 한칸 들여쓰기의 문단 작성 시 박스문단 사용 가능
  - `CAUTION:` : 경고문구
    - `NOTE:`, `TIP:`, `IMPORTANT:`, `WARNING:` 등 사용 가능
  
- URL Scheme 자동 인식
  
  - http, https, ftp, irc, mailto, hgd@gmail.com 과 같은 URL Scheme는 Asciidoc에서 자동으로 인식하여 링크 설정됨
  
- 이미지 추가

  - `image::` : API 문서에 이미지 추가
  
- 문서 스니핏을 템플릿 문서에 포함

 ```java
 == Controller
  === 컨트롤러
  .섹션_제목 // . 으로 하나의 스니핏 섹션 제목 표현
  include::{snippets}/post/http-request.adoc[]
 ```
   - 매크로(macro)
     - Asciidoctor에서 어떠한 작업을 처리하기 위한 용어
     - 어떤 반복되는 작업을 자동화한다는 의미
   - `include` : Asciidoctor에서 사용하는 매크로, 스니핏을 템플릿 문서에 포함 시 사용
   - `::` : 매크로 사용 위한 표기법
   - `{snippets}`
     - 해당 스니핏이 생성되는 디폴트 경로
     - build.gradle 파일에 설정한 snippetsDir 변수 참조 시 사용
 ```java
  // build.gradle
  ...
  ext {
      set('snippetsDir', file("build/generated-snippets"))
  }
 ```


### <span style='color: #2D3748; background-color: #ffdce0'>Asciidoctor</span>

- Asciidoctor

  - AsciiDoc 포맷의 문서를 파싱하여 HTML 5, 메뉴얼 페이지, PDF 및 EPUB 3 등의 문서 생성 툴
  - Spring Rest Docs에는 Asciidoc 포맷 문서 -> HTML 파일 변환을 하기 때문에 내부적으로 Asciidoctor를 사용함