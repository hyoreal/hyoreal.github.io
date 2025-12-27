---

layout: post

title: "[Cloud] Cloud Computing"

comments: true

categories: [DevOps, Cloud]

tags: [Cloud, AWS, Deploy]

---

### <span style='color: #2D3748; background-color: #ffdce0'>Cloud Computing</span>

- Cloud Computing 등장 배경

  - 기존 서버 방식 : 서버실같은 곳에 컴퓨터를 배치하여 직접 서버를 구축하고 관리함(물리적 서버)
    - 서버 한계 도달 시 : 더 많은 컴퓨터 추가 or 컴퓨터 성능 업그레이드
    - 기본 서버 방식의 한계 : 주기적인 관리 필요, 공간의 한계 문제 발생
  - 추가 서버 증설에 한계가 발생하자 일부 거대 기업이 데이터 센터 설립
    - 이때 데이터 센터의 유휴 자원 대여 서비스 등장
    - 서버의 차원과 공간 및 네트워크 환경 제공을 빌려 사용하는 **Cloud Computing** 시작
    
### <span style='color: #2D3748; background-color: #ffdce0'>Cloud</span>

- 온프레미스 : 서버 자원, 공간 및 네트워크 환경 제공
  
- 현대의 클라우드 컴퓨팅 : 기존의 온프레미스 형식과 달리 가상화(Virtualization) 기술의 발전으로 가상 컴퓨터를 대여

- 가상화 기술을 사용하는 클라우드 서비스 장점
  
  - 서버 자원, 공간 및 네트워크 환경 제공
  - 필요 시마다 컴퓨팅 능력을 유연하게 조절가능
  - 사용한 만큼의 요금(온디맨드 방식)만 지급
  - 컴퓨터의 Snapshot(Image)을 이용하여 다른 컴퓨터로 즉시 이주 가능(migration)
  
- 가상화 기술을 사용하는 클라우드 서비스 단점
  
  - 운영 환경 자체가 특정 클라우드 제공자(vendor)에게 종속됨
    - 클라우드 서비스에 문제 발생 시 내가(사람이) 배포&관리 하는 환경에도 영향 미침
    - 백엔드 구성 자체가 특정 회사의 기술로만 구성해야 하는 경우 발생 가능성 존재
  - AWS와 같은 대표적 클라우드 사업자 제공 기술을 익히는 것도 중요하지만, **인프라 자체에 대한 이해가 더 중요**
    
### <span style='color: #2D3748; background-color: #ffdce0'>Cloud Service 형태</span>

  ![](https://velog.velcdn.com/images/hyoreal51/post/e784e86e-6e2e-479b-aa12-81db04c0c072/image.png)

- IaaS (Infrastructure as a Service) : 물리적 자원 가상화

  - 클라우드 제공자가 가상 컴퓨터까지 제공하는 경우
  - 네트워크, 하드웨어 까지 제공
  - 비즈니스 집중 원할 시 사용
  - 장점
    - 물리적 자원을 서버형태로 사용하기 때문에 고정비용 발생 X
    - 물리적 자원 즉시 소비 가능
    - 물리적 자원 관리를 논리적 영역 대체 가능
    - 물리적 자원에 대한 자동화 배포 가능
    - 물리적 자원의 안정적 운영을 vendor에 맡길 수 있음
    - 물리적 자원의 규모 확장 및 축소의 자유 
  - ex) Amazon Web Service, Microsoft Azure, DigitalOcean, Google Compute Engine
  
- PaaS (Platform as a Service) : 소프트웨어 개발을 돕는 플랫폼 제공

  - 클라우드 제공자가 DB, 개발 플랫폼까지 제공하는 경우
  - 네트워크, 하드웨어, 운영체제, 플랫폼/DB 까지 제공
  - 신속 개발 원할 시 사용
  - 장점
    - 필요한 플랫폼만 소비, 비용 부담 절감
    - 개발 및 배포 프로세스 빠른 확보 가능
    - 소프트웨어 유지관리 쉬움
    - 가상화 기술 기반 구축으로 비즈니스 변경에 따라 리소스 확장 및 축소 쉬움
    - 응용 프로그램 개발, 테스트 및 배포 지원 등 다양 서비스 제공
    - 많은 사용자가 동일 개발 응용 프로그램에 엑세스 가능
  - 단점
    - 특정 플랫폼 서비스에 종속될 가능성 有
  - ex) AWS Elastic Beanstalk, Windows Azure, Herku, Google App Engine
  
- SaaS (Software as a Service) : 고객이 사용하는 소프트웨어 제공

  - 클라우드 제공자가 당장 사용 가능한 소프트웨어를 제공하는 경우
  - 네트워크, 하드웨어, 운영체제, 플랫폼/DB, 애플리케이션 까지 제공
  - 빠른 변화 원할 시 사용
  - 장점
    - 소프트웨어를 소비형태로 사용, 비용 부담 절감
    - 즉시 사용 가능
    - 소프트웨어를 설치한 물리적 자원 필요 無
    - 언제 어디서나 접근 가능
  - 단점
    - 커스터마이징 어렵
  - ex) Google Apps, DropBox, Salesforce, WhaTap