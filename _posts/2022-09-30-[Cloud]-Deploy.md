---

layout: post

title: "[Cloud] Deploy"

comments: true

categories: [DevOps, Cloud]

tags: [Cloud, AWS, Deploy]

---

### <span style='color: #2D3748; background-color: #ffdce0'>Deploy</span>

- Deployment
  
  - 개발 서비스를 사용자들이 이용 가능하게 하는 일련의 과정
  
- 배포 단계

  - Development 단계
    - 로컬 환경에서 각자의 컴퓨터에서 코드 작성 및 테스트 과정
    - 개발단계이기 때문에 더미 데이터를 사용하여 테스트
    
  - Integration 단계
    - 각자의 컴퓨터에서 작성한 코드 취합
    - 각자의 코드가 다른 코드에서 오류를 일으키지 않는지, 코드 간의 충돌(conflict)가 있는지 확인하는 과정
    
  - Staging 단계
    - 실제 출시 단계인 Production 단계와 가장 유사한 환경에서 테스트 진행
    - 실제 데이터를 복사해서 문제가 있지 않은지 등 다양한 환경에서 테스트를 진행
    
  - Production 단계
    - 개발된 서비스 출시 단계
    - 실제 데이터로 서비스가 운영되기 때문에 문제생기면 안됨
  
- 환경 설정

  - Development 환경과 Production 환경은 서로 다를 수 있음
    - 각각의 Local 환경에서 DB의 개인 설정 값이 다를 수 있음
  - Development 환경과 Production 환경에서의 환경 설정 코드를 분리 필수
    - 환경에 따라 포트를 분리할 수 있도록 환경변수를 설정
    - 절대경로 대신 상대경로 이용
    - Docker와 같은 개발 환경 자체를 통일시키는 솔루션 사용