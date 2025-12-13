# MCP 실습 트러블슈팅 로그

> 이 문서는 MCP(Model Context Protocol) 실습 과정에서 발생한 문제와 해결 방법을 기록합니다.
> 나중에 "MCP 실습 후기" 포스팅에 활용할 예정입니다.

---

## 📅 실습 시작: 2025-12-13

---

## 🚨 Issue 1: UV 설치 시 .bash_profile Permission Denied

**발생 시점**: 2025-12-13 (Step 2: Python & UV 설치)

### 증상

```bash
$ curl -LsSf https://astral.sh/uv/install.sh | sh

downloading uv 0.9.17 aarch64-apple-darwin
no checksums to verify
installing to /Users/username/.local/bin
  uv
  uvx
everything's installed!
sh: line 1463: /Users/username/.bash_profile: Permission denied
sh: line 1464: /Users/username/.bash_profile: Permission denied

To add $HOME/.local/bin to your PATH, either restart your shell or run:

    source $HOME/.local/bin/env (sh, bash, zsh)
    source $HOME/.local/bin/env.fish (fish)
```

### 원인

1. **UV 설치 자체는 성공** (`uv`, `uvx`가 `/Users/username/.local/bin`에 정상 설치됨)
2. **PATH 자동 등록 실패**: `.bash_profile` 파일에 대한 쓰기 권한이 없어서 설치 스크립트가 PATH를 자동으로 추가하지 못함
3. 결과적으로 `uvx` 명령어를 터미널에서 바로 사용할 수 없는 상태

**개발자 비유:**
```java
// 라이브러리는 설치됐지만 (UV 바이너리 설치 완료)
jar installed: ✅

// 클래스패스에 등록 안 됨 (PATH 미등록)
CLASSPATH not configured: ❌

// 결과: import 불가
import com.uv.tool; // ❌ Cannot find symbol
```

### 해결 방법

#### 방법 1: 수동으로 PATH 추가 (임시, 현재 세션만 유효)

```bash
# zsh 사용자 (Mac 기본 쉘)
source $HOME/.local/bin/env

# bash 사용자
source $HOME/.local/bin/env

# fish 사용자
source $HOME/.local/bin/env.fish
```

**확인:**
```bash
uvx --version
# uvx 0.9.17
```

#### 방법 2: 쉘 설정 파일에 영구 등록 (권장)

**zsh 사용자 (Mac 기본):**

```bash
# .zshrc에 PATH 추가
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc

# 설정 적용
source ~/.zshrc

# 확인
uvx --version
```

**bash 사용자:**

```bash
# .bash_profile 권한 확인 및 수정
chmod 644 ~/.bash_profile

# PATH 추가
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bash_profile

# 설정 적용
source ~/.bash_profile
```

#### 방법 3: .bash_profile 권한 문제 해결 (근본 원인 해결)

```bash
# 1. 현재 권한 확인
ls -la ~/.bash_profile
# -r--r--r--  (읽기 전용) ← 문제!

# 2. 권한 수정 (소유자에게 쓰기 권한 부여)
chmod 644 ~/.bash_profile
# 또는
chmod u+w ~/.bash_profile

# 3. 권한 확인
ls -la ~/.bash_profile
# -rw-r--r--  (쓰기 가능) ← 해결!

# 4. UV 설치 스크립트 재실행 (선택)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 적용한 해결책

**선택한 방법: 방법 2 (zsh 영구 설정)**

```bash
# 1. PATH 영구 등록
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc

# 2. 즉시 적용
source ~/.zshrc

# 3. 정상 동작 확인
uvx --version
# ✅ uvx 0.9.17

# 4. MCP Server 실행 테스트
uvx mcp-server-sqlite --help
# ✅ 정상 실행됨
```

### 교훈

1. **UV는 설치됐지만 PATH가 없으면 사용 불가**
   - Java 개발자 관점: JAR는 있지만 CLASSPATH 미설정
   
2. **Mac은 zsh가 기본 쉘**
   - `.bash_profile`이 아니라 `.zshrc` 수정 필요
   
3. **권한 문제는 `chmod`로 해결**
   - `chmod 644` = 소유자 읽기/쓰기, 그룹/기타 읽기만

4. **환경 변수 추가 후 반드시 `source`**
   - 새 터미널 열거나 `source` 명령어로 즉시 적용

### 다음 단계

- ✅ UV 설치 완료
- ✅ PATH 등록 완료
- 🎯 다음: SQLite DB 생성 (Step 1)

---

## 📝 실습 진행 상황

- [x] Prerequisites 준비
  - [x] Claude Desktop 설치
  - [x] Python 설치
  - [x] UV 설치 ✅ (트러블슈팅 완료)
  - [ ] SQLite 확인
- [ ] Step 1: 더미 DB 생성
- [ ] Step 2: MCP Server 구동
- [ ] Step 3: Claude Desktop 설정
- [ ] Step 4: 테스트

---

## 🔗 참고 자료

- UV 공식 문서: https://docs.astral.sh/uv/
- Mac 기본 쉘 확인: `echo $SHELL`
- PATH 개념: https://linuxize.com/post/how-to-add-directory-to-path-in-linux/

