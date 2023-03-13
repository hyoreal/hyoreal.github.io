---

layout: post

title: "[Spring] Mapper / Mapstruct "

comments: true

categories: [Spring]

tags: [Spring]

---

### Mapper

Mapper 필요 이유

- DTO와 Entity를 서로 변환해야함
  - 코드 구성의 단순화
  - REST API 스펙의 독립성 확보
  - 계층별 관심사 분리
    - [🔗하나의 클래스나 메서드 내에서 여러 개의 기능들을 구현하고 있는 것은 객체 지향 코드 관점에서도 리팩토링 대상](https://velog.io/@hyoreal51/Spring-SOLID)
- Request DTO → Entity → Response DTO

Mapper 클래스 구현

```
@Component
public class MemberMapper {
    public Member memberPostDtoToMember(MemberPostDto memberPostDto) {
        return new Member(0L,
                memberPostDto.getEmail(),
                memberPostDto.getName(),
                memberPostDto.getPhone());
    }
}
```

------

### MapStruct

MapStruct

- Java Bean 규약을 지키는 객체들 간의 변환 기능을 제공하는 매퍼(Mapper) 구현 클래스를 자동으로 생성해주는 코드 자동 생성기

MapStruct의 필요 이유

- 어떤 도메인 업무 기능이 늘어날때 마다 개발자가 일일이 수작업으로 매퍼(Mapper) 클래스를 만드는 것은 비효율적
- MapStruct가 매퍼 클래스를 자동으로 구현해줌으로 개발 생산성 향상

MapStruct 프레임워크 추가

```
dependencies {
		...
		...
		implementation 'org.mapstruct:mapstruct:1.4.2.Final'
		annotationProcessor 'org.mapstruct:mapstruct-processor:1.4.2.Final'
}
```



MapStruct 기반 Mapper 인터페이스 정의

```
@Mapper(componentModel = "spring") // componentModel = "spring" 을 지정하면 Spring Bean 등록
public interface MemberMapper {
  Member memberPostDtoToMember(MemberPostDto memberPostDto);
  Member memberPatchDtoToMember(MemberPatchDto memberPatchDto);
  MemberResponseDto memberToMemberResponseDto(Member member);
  // 변경_후_객체 메서드명 (변경_전_객체 변경전객체)
}
```

- 실제로 구현된 객체는 Gradle의 build task를 실행 시 자동 생성
  - IntelliJ IDE 좌측 `Project 탭` > `프로젝트명` > `build` 디렉토리 내에 Mapper 인터페이스가 위치한 패키지 안에 생성