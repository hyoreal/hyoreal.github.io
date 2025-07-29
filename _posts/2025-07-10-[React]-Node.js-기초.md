---
layout: post

toc: true

title: "[REACT] Node.js 기초"

comments: true

categories: [Front-End]

tags: [Front-End]


---

Node.js 기초

---

## Node.js

### 1. Node.js 란?

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
  
  해당 에러는 패키지 설치 과정에서 PUBKEY가 등록되지 않아 발생하는 오류이다.
  위 에러메세지의 PUBKEY를 복사한 후 아래 key등록 명령어를 입력한다.
  
  <code>
    sudo apt-key adv --keyserver  keyserver.ubuntu.com --recv-keys {16자리 PUBKEY}
  </code>
</div>
</details>

