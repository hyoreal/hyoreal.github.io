---
layout: post

title: "[Nginx] 도메인 연동, SSL 적용, SSE 통신 헤더 설정"

comments: true

categories: [Nginx]

tags: [Nginx]
---
재고관리 프로그램 프로젝트를 진행하며 배포 과정에서 웹서버로 Nginx를 택하였고 Nginx Proxy 서버에 SSL 인증서를 등록하여 HTTPS를 적용하였다.

해당 과정을 잊지 않기 위해 블로깅하려고 한다. 이 글은 AWS EC2에 1차 배포가 되어있다는 가정 하에 작성된 글이다.

---

## Route 53 도메인 구매 및 연결

### 1. [gabia](https://www.gabia.com/)에서 원하는 도메인을 검색하여 구매한다.


<img width="1728" alt="20230417_234458__1" src="https://user-images.githubusercontent.com/102732425/232650417-d83dc66d-8064-4e8e-b945-4b2e23da8591.png">


### 2. 가비아 도메인 관리 페이지의 네임 서버를 설정하기 위해 AWS Route 53 대시보드에 접속한다.

<img width="1099" alt="20230417_235127_route53" src="https://user-images.githubusercontent.com/102732425/232650533-acf2b5c7-4a4a-46ff-b955-eecf40d6d156.png">


### 3. Route 53 호스팅 영역에 접속하여 구입한 도메인을 등록해준다.


<img width="1728" alt="20230417_235421_route53_2" src="https://user-images.githubusercontent.com/102732425/232650579-944445ad-0223-4a51-bab9-b8b183fc2b20.png">

<img width="1042" alt="20230417_235534_route53_3" src="https://user-images.githubusercontent.com/102732425/232650587-80fb6f19-5aff-4076-b914-db0762309483.png">


### 4. 생성 후 해당 호스팅영역의 레코드를 조회한다.

<img width="990" alt="20230417_235748_route53_4" src="https://user-images.githubusercontent.com/102732425/232650588-4a9467d6-b728-4af9-b5aa-e819726cdfec.png">


* 해당 초록박스에 포함되는 부분을 네임서버 설정에 작성해준다.

<img width="988" alt="20230418_000013_route53_5" src="https://user-images.githubusercontent.com/102732425/232650590-7fc47969-69b9-4362-981f-48bb44aab2ec.png">


<details>
<summary>DNS 타입</summary>
<div markdown="1">
  <ul type="disc">
    <li> A 레코드 </li>
      <ul>
        <li type="circle">A 레코드 추가 시 서브도메인이 생성되어 IP로 사이트를 연결할 수 있다.</li>
      </ul>
    <li>MX 레코드</li>
      <ul>
        <li type="circle">메일 연결 시 사용</li>
        <li type="circle">설정 시 주소 끝에 "." 을 반드시 입력</li>
      </ul>
    <li>CNAME 레코드</li>
      <ul>
        <li type="circle">메일, 블로그 연결 등에 사용</li>
        <li type="circle">한글 도메인은 사용 업체에 따라 메일을 지원하지 않을 수 있다.</li>
      </ul>
    <li>TXT 레코드</li>
      <ul>
        <li type="circle">SPF 레코드 입력 시 사용</li>
        <li type="circle">사용 도메인 스팸 차단 방지 위해 SPF 레코드 등록 권장</li>
      </ul>
    <li>SRV 레코드</li>
      <ul>
        <li type="circle">대상 값 끝에 "."를 반드시 입력</li>
      </ul>
  </ul>
</div>
</details>

### 5. EC2 터미널 접속하여 `/etc/nginx/sites-available` 에 파일 생성

* default 파일을 수정해도 된다.

```
server {
        server_name   도메인명;
        root   /var/www/<실행할 html파일이 위치한 디렉토리>;
        index   index.html index.htm;

        location / {
                add_header 'Access-Control-Allow-Origin' '*'; # cors 설정. spring에서 설정한 경우, 중복 설정 시 충돌되기때문에 해당 설정은 제외해야함
                proxy_pass EC2 인스턴스 주소;
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }
}
```

### 6. `/etc/nginx/sites-enabled`에 심볼릭 링크 생성

* default 파일을 변경했다면 생략해도 된다.

```nginx
cd /etc/nginx/sites-enabled
```

```nginx
sudo ln -s /etc/nginx/sites-available/5에서_생성한_파일
```

### 7. Nginx 재시작

```nginx
sudo service nginx restart

```

<details>
<summary>실행이 안될 시</summary>
<div markdown="1">
nginx -t 명령어를 입력하여 설정 파일에 문법오류가 있는지 확인
</div>
</details>

---

## SSL 적용

### 1. certbot 설치

```nginx
sudo apt update
```

```nginx
sudo apt upgrade
```

```nginx
sudo apt-add-repository -r ppa:cerbot/cerbot
```

### 2. certbot의 Nginx 설치

* 필자는 Ubuntu 22.04를 사용해서 python3을 설치했다.
* Ubuntu 18.04이하인 경우 python-certbot-nginx로 설치하길 바란다.

```nginx
sudo apt install python3-certbot-nginx
```

### 3. SSL 인증서 발급

```nginx
sudo certbot --nginx -d 도메인명 -d www.도메인명
```

### 4. Nginx 설정 파일 변경

* ssl 인증서를 발급하게 되면 certbot이 자동으로 설정파일을 작성해준다.

```
server {
        # 포트 포워딩 설정
        server_name 도메인명;
        root /var/www/<실행할 html파일이 위치한 디렉토리>;
        index index.html index.htm;

        if ($host = 도메인명) {
            return 301 http://$host$request_uri;
        } # managed by Certbot

        listen 80;
        listen [::]:80;

        return 404; # managed by Certbot
}

server {
        # HTTPS configuration
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name 도메인명;

        ssl_certificate /etc/letsencrypt/live/도메인명/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/도메인명/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        # React 프론트 서버 proxy
        location / {
             proxy_pass 프론트 배포 주소;

             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Spring boot 백 서버 proxy
        location /api {
             proxy_pass 백 배포 주소;

             proxy_set_header Host $http_host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
        }
}
```

### 5. Nginx 재시작

```nginx
sudo service nginx restart
```

* 프론트 서버와 백 서버 모두 배포가 된 상태에서 해당 도메인으로 접속하게 되면 https로 접속되는걸 확인할 수 있다.

---

## SSE 통신 Nginx 사용 시 주의

필자는 프로젝트에서 SSE 통신을 활용한 실시간 알림을 구현했다.

분명 로컬에서 정상 작동하는 걸 확인하고 배포를 진행했으나 SSE 통신에서 간헐적으로 500에러가 발생했다.

Nginx Reverse Proxy를 사용했기 때문에 아래와 같은 원인들로 SSE 통신 시 에러가 발생했던 것이다.

1. Nginx는 Upstream으로 요청을 보낼 때, `HTTP/1.0` 을 사용한다.
2. `HTTP/1.1`은 지속 연결이 기본이지만 Nginx에서 WAS로 요청을 보낼 때 사용하는 **`HTTP/1.0`은 Connection: close 헤더를 사용하여 지속 연결을 닫아버린다**.
3. SSE 통신은 지속 연결이 되지 않으면 제대로 동작하지 않는다.

그래서 Nginx에 HTTP 버전을 1.1로, 헤더에 Connection '' 로 변경해주는 설정이 추가로 필요했다.

Nginx 설정 파일에서의 프록시 부분에 이와 같은 설정을 추가해주었다.

```
# React 프론트 서버 proxy
        location / {
             proxy_pass 프론트 배포 주소;

             ...

             proxy_set_header Connection ''; # 추가
             proxy_http_version 1.1; # 추가
        }

        # Spring boot 백 서버 proxy
        location /api {
             proxy_pass 백 배포 주소;

             ...

             proxy_set_header Connection ''; # 추가
             proxy_http_version 1.1; # 추가
        }
```

그리고 SSE 통신에서 서버는 응답에 `Transfer-Encoding: chunked`를 사용하는데, **Nginx의 proxy buffering 기능**은 서버의 응답을 버퍼에 저장해두었다가 버퍼가 차거나, 서버가 응답 데이터를 모두 보내고 나면 전송하는 기능이기에 SSE 통신의 **실시간성이 떨어지고** 제대로 동작하지 않는 상황이 발생할 수 있다.

따라서 proxy buffering 기능을 비활성화 하는 것이 좋지만, Nginx의 설정파일에서 비활성화를 하게되면 SSE 이외의 모든 통신에서도 비활성화되기에 비효율적이라고 볼 수 있다.

그래서 필자는 SSE 구현 코드 내에서 응답 시에 `X-Accel-Buffering: no` 헤더를 추가해주었다.

```java
@Override
public SseEmitter connection(String lastEventId, HttpServletResponse response) {
   
        ...

	response.setHeader("X-Accel-Buffering", "no");
  
        ...
 
	return emitter;
}
```

> 참고 블로그
>
> [bitkunst.tistory.com](https://bitkunst.tistory.com/entry/AWS-EC2-%EB%B0%B0%ED%8F%AC-5-Route-53-%EB%8F%84%EB%A9%94%EC%9D%B8-%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0-HTTPS)
>
> [yeonyeon.tistory.com](https://yeonyeon.tistory.com/253)
>
> [tecoble.techcourse.co.kr](https://tecoble.techcourse.co.kr/post/2022-10-11-server-sent-events/)
