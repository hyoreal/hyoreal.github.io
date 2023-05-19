---
layout: post

toc: true

title: "[Jenkins] Jenkins와 Docker를 활용한 CI/CD"

categories: [Docker, Jenkins]

tags: [Docker, Jenkins]


---

ASAP 프로젝트의 마지막 단계인 젠킨스와 도커를 활용한 CI/CD를 진행하려고 한다.

젠킨스 EC2-Ubuntu와 운영 서버 EC2-Ubuntu를 나눠 관리하여 총 2대의 EC2 인스턴스를 사용하였다.

---

## 젠킨스 EC2 세팅

### 1. EC2 젠킨스 설치

```
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
```

<details>
<summary>GPG 에러 발생 시</summary>
<div markdown="1">
  <code>
    GPG error: https://pkg.jenkins.io/debian-stable binary/ Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY {16자리 PUBKEY}
  </code>
  <br></br>
  해당 에러는 패키지 설치 과정에서 PUBKEY가 등록되지 않아 발생하는 오류이다.
  위 에러메세지의 PUBKEY를 복사한 후 아래 key등록 명령어를 입력한다.
  <br></br>
  <code>
    sudo apt-key adv --keyserver  keyserver.ubuntu.com --recv-keys {16자리 PUBKEY}
  </code>
</div>
</details>



### 2. 젠킨스 업데이트 및 재시작

```
sudo apt-get update
sudo apt-get upgrade jenkins
sudo systemctl restart jenkins
```



### 3. 젠킨스 실행 확인

```
sudo systemctl status jenkins
```



### 4. 젠킨스 비밀번호 확인

```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```



### 5. <젠킨스 EC2의 퍼블릭 IPv4 DNS>:8080 접속 후 비밀번호 입력

<img width="990" alt="20230417_235748_route53_4" src="https://github.com/hyoreal/hyoreal.github.io/assets/102732425/ec84503b-403e-4e9a-9048-181b3f687afe">

------

## 젠킨스에 GitHub 권한 부여

### 1. 젠킨스 EC2에서 SSH 키 발급

```
sudo mkdir /var/lib/jenkins/.ssh
sudo ssh-keygen -t -rsa -f /var/lib/jenkis/.ssh/{SSH_키_이름}
```



### 2. 발급받은 SSH `공개키` 복사

- 생성한 키 이름 뒤에 `.pub` 이 붙어있다면 공개키
- 생성한 키 이름 뒤에 아무것도 없다면 비밀키

```
cat ~/.ssh/{SSH_키_이름}.pub
```

 

### 3. 배포 원하는 GitHub Repository에 SSH 공개키 등록

- Settings → Deploy keys → Add deploy key
- Title : 본인이 원하는 식별가능한 값
- Key : 2번에서 복사한 키 붙여넣기

<img width="990" alt="20230417_235748_route53_4" src="https://github.com/hyoreal/hyoreal.github.io/assets/102732425/15e5e880-0553-4fc2-a9c3-5969119e23e4">



### 4. 젠킨스 Credential 설정

- `cat ~/.ssh/{SSH_키_이름}` 으로 나오는 SSH 비밀키 복사

````
-----BEGIN OPENSSH PRIVATE KEY-----
비밀키
-----END OPENSSH PRIVATE KEY-----
````



- <젠킨스 EC2의 퍼블릭 IPv4 DNS>:8080 접속
- Jenkins관리 → Manage Credentials → Stores scoped to Jenkins의 Domains 하단 `(global)`에서 Add credentials 선택
  - Kind : `SSH Username with private key` 선택
  - ID : 본인이 원하는 식별가능한 Credential ID 입력
  - Private Key : Add → 복사한 SSH 비밀키 입력

<img width="990" alt="20230417_235748_route53_4" src="https://github.com/hyoreal/hyoreal.github.io/assets/102732425/7704ab62-8dc9-4bfa-9a2e-e5733768b4bc">


---

## 젠킨스 EC2와 운영서버 EC2 연결

### 1. 젠킨스 EC2에서 SSH pem 키 발급

```
ssh-keygen -t rsa -C "키_이름" -m PEM -P "" -f /var/lib/jenkins/.ssh/{키_이름}
```



### 2. 발급받은 SSH pem `공개키` 복사

```
sudo cat /var/lib/jenkins/.ssh/{키_이름}.pub
```



### 3. `운영서버 EC2`에 pem키 등록

```
sudo nano .ssh/authorized_keys
```

- 해당 파일에 pem키를 붙여넣기한다



### 4. 젠킨스 EC2에서 발급받은 pem의 비밀키 복사

```
sudo cat /var/lib/jenkins/.ssh/{키_이름}
```



### 5. <젠킨스 EC2의 퍼블릭 IPv4 DNS>:8080 접속



### 6. Jenkins 관리 → 플러그인 관리 → Available plugins

- Publish Over SSH 검색 후 설치
- Jenkins 관리 → Configure System → Publish Over SSH
  - Path to key : SSH 보관 경로 (ex. `/var/lib/jenkins/ssh/{폴더명}`)
  - Key : 복사한 pem 비밀키 붙여넣기

<img width="990" alt="20230417_235748_route53_4" src="https://github.com/hyoreal/hyoreal.github.io/assets/102732425/543c4ca2-1676-4203-b4b8-abef6f9df6bd">



### 7. SSH Server 추가

- Name : SSH 서버명
- Hostname : 운영서버 IP 주소
- Username : 운영서버의 유저명 (필자는 유저를 따로 생성하지 않아 `ubuntu`로 작성했다.)

이후 Test Configuration 클릭으로 연동테스트해서 Success가 뜨면 성공한거다.

<img width="990" alt="20230417_235748_route53_4" src="https://github.com/hyoreal/hyoreal.github.io/assets/102732425/d01b2f69-3024-494b-a8d9-0f467fcb47fe">

---

## Docker 설치 및 빌드

### 1. 젠킨스 EC2 apt 업데이트

```
sudo apt update
```



### 2. 젠킨스 EC2에 아래 명령어 입력

```
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

- `apt-transport-https` : HTTPS를 통해 APT 패키지 전송에 사용되는 패키지
- `ca-certificates`  : 인증서 관련 패키지
- `gnupg-agent`  : GnuPG 패키지
- `oftware-properties-common` : 소프트웨어 소스 관리 패키지

즉, HTTPS를 통해 안전한 패키지를 다운로드하고, SSL/TLS 인증서를 받을 수 있도록 도와주는 패키지, GPG키 설정 위한 패키지를 다운받는 명령어이다.



### 3. Docker GPG 키 추가 및 설치

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - // Docker GPG 키 추가
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" // Docker Repository 추가
sudo apt-get install docker-ce docker-ce-cli containerd.io // Docker Ce 설치
```



### 4. Docker 그룹에 젠킨스 유저 추가

```
sudo usermod -aG docker {user} // 현 젠킨스 EC2 사용자 입력
su - {user}
```



### 5. 그룹에 잘 추가되었는지 확인

```
id -nG
```



### 6. Docker 서버와 Docker 클라이언트 간의 통신 위한 `.sock` 권한 변경

```
sudo chmod 666 /var/run/docker.sock
```



### 7. Docker 로그인

```
sudo su - {user}
docker login
```

- Docker Hub의 아이디와 비밀번호를 입력하면 된다.



### 8. <젠킨스 EC2의 퍼블릭 IPv4 DNS>:8080 접속 후 item 생성

- 필자는 운영서버에서 이미 Redis가 실행 중이었기에 하나의 이미지만 빌드하고 배포하면 되었다.
- 보다 많은 이미지 빌드를 해야한다면 Pipeline으로 생성해야하지만 더 간편한 `Freestyle project`로 생성하였다.



### 9. `생성한 프로젝트 → 소스 코드 관리`에서 GitHub Repository 설정

- Git 선택 → URL 작성
- Credentials : 아까 생성한 GitHub Credentials 선택
- Branch Specifier : main 혹은 배포할 브랜치를 작성한다. 필자는 프론트엔드와 같은 Repository를 사용하기에 다른 브랜치를 지정해줬다. (Ex. */bedev)

<img width="990" alt="20230417_235748_route53_4" src="https://github.com/hyoreal/hyoreal.github.io/assets/102732425/83f8e88a-3656-4e22-8b82-32448de5b6ff">



### 10. `빌드 환경`설정

- `Send files or execute commands over SSH after the build runs` 체크 

  - 빌드 실행 후 SSH를 통해 동작할 명령어를 작성하기 위함이다.

  

- Exec command 에 하단의 명령어를 입력한다.

```
sudo docker pull {Docker_허브_유저명}/{Docker_허브_Repo명}
sudo docker stop {컨테이너_이름} || true && sudo docker rm {컨테이너_이름} || true 
sudo docker run -d --name {컨테이너_이름} -p 8080:8080 {Docker_허브_유저명}/{Docker_허브_Repo명}:{버전}

```



### 11. `Build Steps` 설정

- Execute shell에 명령어를 입력한다. (Add build step을 클릭하여 Execute shell을 추가할 수 있다.)

```
sudo chmod +x ./be/gradlew // 프로젝트 gradlew에 권한 부여 
cd /var/lib/jenkins/workspace/{Repository_이름}/{프로젝트_저장된_폴더} // 프로젝트 위치로 이동
./gradlew clean build
```

```
sudo docker build -t {Docker_허브_유저명}/{Docker_허브_Repo명} -f /{Repository_이름}/Dockerfile . // 이미지 빌드
sudo docker push {Docker_허브_유저명}/{Docker_허브_Repo명} // 도커 허브로 푸시
```

------

## 자동배포 설정

### 1. <젠킨스 EC2의 퍼블릭 IPv4 DNS>:8080 접속



### 2. Jenkins 관리 → 플러그인 관리 → Available plugins

- GitHub Integration 설치



### 3. `프로젝트` → 빌드 유발

- `GitHub hook trigger for GITScm polling` 체크



### 4. Github 프로젝트 → Settings → Webhooks → add Webhook

- Payload URL : `{젠킨스EC2_URL}:{젠킨스_포트번호}/github-webhook/`
- Content type : `application/json`