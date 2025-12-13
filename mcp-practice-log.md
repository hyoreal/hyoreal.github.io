# MCP 실습 트러블슈팅 로그

> 이 문서는 MCP(Model Context Protocol) 실습 과정에서 발생한 문제와 해결 방법을 기록합니다.
> 나중에 "MCP 실습 후기" 포스팅에 활용할 예정입니다.

---

## 📅 실습 시작: 2025-12-13

---

## 🖥️ 실습 환경

### 하드웨어 & OS
- **CPU**: Apple Silicon (aarch64-apple-darwin)
- **OS**: macOS
- **Shell**: zsh (기본)

### 소프트웨어 버전
- **Python**: 3.14.2 (Homebrew)
- **UV**: 0.9.17 (2b5d65e61 2025-12-09)
- **SQLite**: 3.39.4 (2022-09-07)
- **Claude Desktop**: (버전 확인 예정)

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
# uvx 0.9.17 (2b5d65e61 2025-12-09)
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
# ✅ uvx 0.9.17 (2b5d65e61 2025-12-09)

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

## 🚨 Issue 2: 파일을 찾을 수 없음 (No such file or directory)

**발생 시점**: 2025-12-13 (Step 1: 더미 DB 생성)

### 증상

```bash
$ python3 create_dummy_db.py

/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/Resources/Python.app/Contents/MacOS/Python: 
can't open file '/Users/username/create_dummy_db.py': [Errno 2] No such file or directory
```

### 원인

1. **파일이 실제로 존재하지 않음**: `create_dummy_db.py` 스크립트 파일을 아직 생성하지 않음
2. **현재 위치 문제**: 홈 디렉토리(`~`)에서 실행했지만, 파일이 없는 상태

**개발자 비유:**
```java
// Java 클래스 파일이 없는데 실행하려는 상황
public class Main {
    public static void main(String[] args) {
        Class.forName("CreateDummyDB");  // ❌ ClassNotFoundException
    }
}

// Python 스크립트가 없는데 실행하려는 상황
python3 create_dummy_db.py  // ❌ FileNotFoundError
```

### 해결 방법

#### 단계 1: 프로젝트 디렉토리 생성 및 이동

```bash
# MCP 실습용 디렉토리 생성
mkdir -p ~/projects/mcp-practice
cd ~/projects/mcp-practice

# 현재 위치 확인
pwd
# /Users/username/projects/mcp-practice
```

#### 단계 2: Python 스크립트 파일 생성

**Option A: vi/vim 에디터 사용**

```bash
vi create_dummy_db.py
```

그리고 아래 코드를 복사하여 붙여넣기 (실습 가이드에서 제공):

```python
import sqlite3
from datetime import datetime

# 1. DB 파일 생성 및 연결
conn = sqlite3.connect('products.db')
cursor = conn.cursor()

# 2. 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL,
    created_at TEXT NOT NULL
)
''')

# 3. 더미 데이터 삽입
dummy_products = [
    ('MacBook Pro M3', 2590000, 'Laptop', 15, '2024-01-15'),
    ('iPhone 15 Pro', 1550000, 'Phone', 30, '2024-02-20'),
    ('AirPods Pro', 359000, 'Audio', 50, '2024-03-10'),
    ('iPad Air', 929000, 'Tablet', 20, '2024-04-05'),
    ('Apple Watch Ultra', 1149000, 'Wearable', 10, '2024-05-12'),
    ('Magic Keyboard', 149000, 'Accessory', 40, '2024-06-01'),
    ('Mac Mini M2', 799000, 'Desktop', 12, '2024-07-20'),
    ('Studio Display', 2090000, 'Monitor', 8, '2024-08-15'),
    ('HomePod Mini', 129000, 'Audio', 25, '2024-09-30'),
    ('AirTag 4pack', 149000, 'Accessory', 100, '2024-10-10'),
]

cursor.executemany('''
    INSERT INTO products (name, price, category, stock, created_at)
    VALUES (?, ?, ?, ?, ?)
''', dummy_products)

# 4. 커밋 및 종료
conn.commit()
conn.close()

print("✅ products.db 생성 완료!")
print(f"총 {len(dummy_products)}개의 상품이 등록되었습니다.")
```

**Option B: echo와 heredoc 사용 (간편)**

```bash
cat > create_dummy_db.py << 'EOF'
import sqlite3
from datetime import datetime

# 1. DB 파일 생성 및 연결
conn = sqlite3.connect('products.db')
cursor = conn.cursor()

# 2. 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL,
    created_at TEXT NOT NULL
)
''')

# 3. 더미 데이터 삽입
dummy_products = [
    ('MacBook Pro M3', 2590000, 'Laptop', 15, '2024-01-15'),
    ('iPhone 15 Pro', 1550000, 'Phone', 30, '2024-02-20'),
    ('AirPods Pro', 359000, 'Audio', 50, '2024-03-10'),
    ('iPad Air', 929000, 'Tablet', 20, '2024-04-05'),
    ('Apple Watch Ultra', 1149000, 'Wearable', 10, '2024-05-12'),
    ('Magic Keyboard', 149000, 'Accessory', 40, '2024-06-01'),
    ('Mac Mini M2', 799000, 'Desktop', 12, '2024-07-20'),
    ('Studio Display', 2090000, 'Monitor', 8, '2024-08-15'),
    ('HomePod Mini', 129000, 'Audio', 25, '2024-09-30'),
    ('AirTag 4pack', 149000, 'Accessory', 100, '2024-10-10'),
]

cursor.executemany('''
    INSERT INTO products (name, price, category, stock, created_at)
    VALUES (?, ?, ?, ?, ?)
''', dummy_products)

# 4. 커밋 및 종료
conn.commit()
conn.close()

print("✅ products.db 생성 완료!")
print(f"총 {len(dummy_products)}개의 상품이 등록되었습니다.")
EOF
```

#### 단계 3: 파일 생성 확인

```bash
# 파일 존재 확인
ls -lh create_dummy_db.py
# -rw-r--r--  1 user  staff   1.2K Dec 13 20:00 create_dummy_db.py ✅

# 파일 내용 미리보기
head -5 create_dummy_db.py
```

#### 단계 4: 스크립트 실행

```bash
python3 create_dummy_db.py

# 출력:
# ✅ products.db 생성 완료!
# 총 10개의 상품이 등록되었습니다.
```

#### 단계 5: DB 파일 확인

```bash
# DB 파일 생성 확인
ls -lh products.db
# -rw-r--r--  1 user  staff    20K Dec 13 20:00 products.db ✅

# 데이터 확인
sqlite3 products.db "SELECT COUNT(*) FROM products;"
# 10

# 가장 비싼 상품 3개 조회
sqlite3 products.db "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;"
# MacBook Pro M3|2590000
# Studio Display|2090000
# iPhone 15 Pro|1550000
```

### 적용한 해결책

```bash
# 1. 프로젝트 디렉토리 생성
mkdir -p ~/projects/mcp-practice
cd ~/projects/mcp-practice

# 2. 스크립트 파일 생성 (cat 사용)
cat > create_dummy_db.py << 'EOF'
[... Python 코드 ...]
EOF

# 3. 실행
python3 create_dummy_db.py
# ✅ products.db 생성 완료!
# 총 10개의 상품이 등록되었습니다.

# 4. 확인
ls -lh
# create_dummy_db.py  (1.2K)
# products.db         (20K)
```

### 교훈

1. **파일을 먼저 만들어야 실행 가능**
   - Java 개발자 관점: `.java` 파일 없이 `javac` 실행 불가
   
2. **프로젝트 디렉토리를 먼저 만들자**
   - 홈 디렉토리(`~`)에 파일 흩어지는 것 방지
   - 체계적인 파일 관리
   
3. **작업 디렉토리 확인 습관**
   - `pwd` 명령어로 현재 위치 확인
   - `ls` 명령어로 파일 존재 확인

4. **Python 버전 확인됨**
   - Python 3.14.2가 Homebrew로 설치되어 있음
   - `/opt/homebrew/Cellar/python@3.14/3.14.2/` 경로

### 다음 단계

- ✅ 프로젝트 디렉토리 생성
- ✅ Python 스크립트 파일 생성
- ✅ products.db 생성 완료 (10개 상품)
- 🎯 다음: MCP Server 구동 (Step 2)

---

## 🚨 Issue 3: MCP Server가 vi 명령어를 JSON으로 파싱 시도

**발생 시점**: 2025-12-13 (Step 2: MCP Server 구동)

### 증상

```bash
$ uvx mcp-server-sqlite --db-path ./products.db

Installed 36 packages in 45ms
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json
Received exception from stream: 1 validation error for JSONRPCMessage
  Invalid JSON: expected value at line 1 column 1 
  [type=json_invalid, input_value='vi ~/Library/Application...e_desktop_config.json\n', input_type=str]
{"method":"notifications/message","params":{"level":"error","logger":"mcp.server.exception_handler","data":"Internal Server Error"},"jsonrpc":"2.0"}

Received exception from stream: 1 validation error for JSONRPCMessage
  Invalid JSON: EOF while parsing a value at line 2 column 0
```

### 원인

1. **MCP Server가 정상 실행됨** (패키지 36개 설치 완료)
2. **잘못된 입력**: MCP Server가 실행 중인 상태에서 `vi` 명령어를 입력함
3. **JSON-RPC 프로토콜 위반**: MCP Server는 `stdin`으로 JSON-RPC 메시지를 기다리는데, `vi` 명령어가 입력되어 JSON 파싱 실패

**개발자 비유:**
```java
// REST API 서버가 JSON을 기다리는데 HTML을 보낸 상황
@PostMapping("/api")
public Response handleRequest(@RequestBody String json) {
    // 기대: {"action": "query"}
    // 실제: "vi ~/Library/..."
    // 결과: JSON 파싱 에러 ❌
}

// MCP Server도 동일
// 기대: {"jsonrpc":"2.0", "method":"initialize", ...}
// 실제: "vi ~/Library/..."
// 결과: Invalid JSON ❌
```

**MCP Server의 동작 방식:**
```java
// MCP Server는 stdio(표준 입출력)로 통신
public class MCPServer {
    public void run() {
        while (true) {
            // stdin에서 JSON-RPC 메시지 대기
            String input = readFromStdin();
            
            // JSON으로 파싱 시도
            JSONRPCMessage message = parseJSON(input);
            
            // 처리
            handleMessage(message);
        }
    }
}

// vi 명령어가 입력되면
// parseJSON("vi ~/Library/...") → ❌ JSON 파싱 실패!
```

### 해결 방법

#### 핵심 이해: MCP Server는 "백그라운드 서비스"

MCP Server는 터미널에서 직접 실행하는 게 아니라, **Claude Desktop이 자동으로 실행하는 백그라운드 프로세스**예요.

```java
// 잘못된 이해
// "MCP Server를 내가 직접 실행하고, Claude에 연결한다" ❌

// 올바른 이해
// "Claude Desktop이 MCP Server를 자동으로 실행한다" ✅

public class ClaudeDesktop {
    public void start() {
        // 설정 파일 읽기
        Config config = readConfig("claude_desktop_config.json");
        
        // MCP Server 자동 실행
        for (ServerConfig server : config.getMcpServers()) {
            Process process = Runtime.exec(server.getCommand());
            // MCP Server가 백그라운드에서 실행됨
        }
    }
}
```

#### 올바른 실습 순서

**Step 2-1: MCP Server 수동 테스트 (선택 사항)**

```bash
# 프로젝트 디렉토리에서
cd ~/projects/mcp-practice

# MCP Server 실행 (테스트만)
uvx mcp-server-sqlite --db-path ./products.db

# 출력:
# Installed 36 packages in 45ms
# [서버가 대기 중... 여기서 멈춤]

# 테스트 완료! Ctrl+C로 종료
# ^C (Ctrl+C 입력)
```

**⚠️ 주의:**
- 이 상태에서는 아무것도 입력하지 마세요!
- MCP Server는 JSON-RPC 메시지만 이해해요
- 일반 명령어(`vi`, `ls` 등)를 입력하면 JSON 파싱 에러 발생

**Step 2-2: Claude Desktop 설정 (핵심)**

```bash
# 새 터미널 열기 (Cmd+T) 또는 MCP Server 종료 후

# 설정 파일 수정
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 또는 VS Code로
open -a "Visual Studio Code" ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**설정 파일 내용:**

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/username/projects/mcp-practice/products.db"
      ]
    }
  }
}
```

**⚠️ 중요: 절대 경로 사용**

```bash
# 절대 경로 확인
cd ~/projects/mcp-practice
realpath products.db

# 출력 예시:
# /Users/username/projects/mcp-practice/products.db

# 이 경로를 설정 파일에 사용!
```

**Step 2-3: Claude Desktop 재시작**

```bash
# 1. Claude Desktop 완전 종료
# Cmd + Q (강제 종료)

# 2. 다시 실행
open -a "Claude"

# 3. Claude Desktop이 자동으로 MCP Server 실행
# → 이제 백그라운드에서 동작 중!
```

### 적용한 해결책

```bash
# 1. MCP Server 테스트 (Ctrl+C로 종료)
cd ~/projects/mcp-practice
uvx mcp-server-sqlite --db-path ./products.db
# [대기 중...]
# ^C (종료)

# 2. 절대 경로 확인
realpath products.db
# /Users/username/projects/mcp-practice/products.db

# 3. Claude Desktop 설정
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 내용:
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/username/projects/mcp-practice/products.db"
      ]
    }
  }
}

# 4. Claude Desktop 재시작
# Cmd+Q → 종료
# open -a "Claude" → 실행

# 5. 연결 확인
# Claude Desktop 하단에 🔌 아이콘 확인
```

### 교훈

1. **MCP Server는 백그라운드 서비스**
   - 직접 실행하는 게 아니라 Claude Desktop이 실행
   - Java 비유: Tomcat 서버 (직접 명령 입력 안 함)
   
2. **stdio는 JSON-RPC 전용**
   - 일반 명령어 입력하면 안 됨
   - REST API처럼 정해진 프로토콜만 사용
   
3. **수동 테스트는 선택 사항**
   - MCP Server가 잘 동작하는지만 확인
   - 확인 후 바로 Ctrl+C로 종료
   
4. **절대 경로 필수**
   - `./products.db` (상대 경로) ❌
   - `/Users/username/projects/mcp-practice/products.db` (절대 경로) ✅
   - Claude Desktop은 다른 디렉토리에서 실행되므로

5. **설정 파일 수정 시 새 터미널 사용**
   - MCP Server 실행 중인 터미널에서는 명령어 입력 금지
   - 새 터미널 탭 열기 (Cmd+T)

### 다음 단계

- ✅ MCP Server 정상 동작 확인
- ✅ Claude Desktop 설정 완료
- 🎯 다음: Claude Desktop에서 테스트 (Step 4)

---

## 🚨 Issue 4: Claude가 DB에 접근할 수 없다고 답변

**발생 시점**: 2025-12-13 (Step 4: Claude Desktop 테스트)

### 증상

Claude Desktop에서 "내 DB에 있는 상품 개수를 세어줘"라고 요청했을 때:

```
안녕하세요! 데이터베이스에 있는 상품 개수를 세어드리고 싶지만, 
제가 직접 데이터베이스에 접근할 수 있는 권한은 없습니다.
하지만 다음과 같은 방법으로 도움을 드릴 수 있습니다:
1. SQL 쿼리 작성
2. 파일 기반 데이터 확인
3. 스크립트 작성
...
```

**기대한 동작:**
- Claude가 MCP를 통해 `products.db`를 직접 조회
- 상품 개수(10개)를 바로 답변

**실제 동작:**
- Claude가 MCP Server를 인식하지 못함
- DB 접근 불가능하다고 답변

### 원인

1. **Claude Desktop 설정 파일은 정상**: `claude_desktop_config.json`에 MCP Server 설정이 올바르게 되어 있음
2. **`uvx` 명령어를 찾을 수 없음**: Claude Desktop이 실행될 때 PATH에 `~/.local/bin`이 포함되지 않음
3. **결과**: Claude Desktop이 MCP Server를 실행하려고 시도하지만 `uvx` 명령어를 찾지 못해 실패

**개발자 비유:**
```java
// application.yml에 설정은 있지만
spring:
  datasource:
    driver-class-name: org.sqlite.JDBC  // ✅ 설정 있음

// 실제로는 JDBC Driver JAR가 CLASSPATH에 없음
// → ClassNotFoundException 발생 ❌

// MCP도 동일
// claude_desktop_config.json에 설정은 있지만
{
  "command": "uvx"  // ✅ 설정 있음
}

// 실제로는 uvx가 PATH에 없음
// → Command not found 발생 ❌
```

**Claude Desktop의 실행 환경:**
```java
// Claude Desktop은 GUI 애플리케이션
// 쉘의 PATH 설정을 따르지 않음!

// 터미널에서 실행 (PATH 포함)
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/Users/me/.local/bin  // ✅ uvx 경로 포함

// Claude Desktop에서 실행 (시스템 기본 PATH만)
PATH=/usr/bin:/bin:/usr/sbin:/sbin  // ❌ ~/.local/bin 없음
```

### 해결 방법

#### 방법 1: 전체 경로 사용 (권장)

Claude Desktop 설정 파일에서 `uvx` 대신 **전체 경로**를 사용해요.

**Step 1: `uvx` 전체 경로 확인**

```bash
# uvx 위치 확인
ls -la ~/.local/bin/uvx
# -rwxr-xr-x  1 user  staff  336672 Dec 10 07:50 /Users/username/.local/bin/uvx

# 또는
which uvx
# /Users/username/.local/bin/uvx
```

**Step 2: 설정 파일 수정**

```bash
# 설정 파일 열기
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**수정 전:**
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",  // ❌ PATH에 없으면 실행 실패
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/username/projects/mcp-practice/products.db"
      ]
    }
  }
}
```

**수정 후:**
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "/Users/username/.local/bin/uvx",  // ✅ 전체 경로 사용
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/username/projects/mcp-practice/products.db"
      ]
    }
  }
}
```

**⚠️ 중요: `username`을 실제 사용자명으로 변경!**

```bash
# 현재 사용자명 확인
whoami
# hyoreal51

# 또는
echo $USER
# hyoreal51
```

**Step 3: Claude Desktop 재시작**

```bash
# 1. Claude Desktop 완전 종료
# Cmd + Q (강제 종료)

# 2. 다시 실행
open -a "Claude"

# 3. MCP 연결 확인
# 하단에 🔌 아이콘 확인
```

#### 방법 2: 시스템 PATH에 추가 (고급)

GUI 애플리케이션도 인식할 수 있도록 시스템 레벨 PATH 설정:

```bash
# /etc/paths.d/ 디렉토리 확인
ls -la /etc/paths.d/

# 새 파일 생성 (sudo 필요)
sudo sh -c 'echo "/Users/username/.local/bin" > /etc/paths.d/uvx'

# 또는 launchd 설정 (더 복잡)
# ~/.MacOSX/environment.plist 파일 생성
```

**⚠️ 주의:**
- 시스템 레벨 설정은 권한이 필요하고 복잡해요
- 방법 1(전체 경로)이 더 간단하고 안전해요

### 적용한 해결책

```bash
# 1. uvx 전체 경로 확인
ls -la ~/.local/bin/uvx
# -rwxr-xr-x  1 hyoreal51  staff  336672 Dec 10 07:50 /Users/hyoreal51/.local/bin/uvx

# 2. 설정 파일 수정
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 수정 내용:
{
  "mcpServers": {
    "sqlite": {
      "command": "/Users/hyoreal51/.local/bin/uvx",  // 전체 경로로 변경
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/hyoreal51/projects/mcp-practice/products.db"
      ]
    }
  }
}

# 3. Claude Desktop 재시작
# Cmd+Q → 종료
# open -a "Claude" → 실행

# 4. 테스트
# "내 DB에 있는 상품 개수를 세어줘"
# → ✅ "products 테이블에 총 10개의 상품이 있습니다"
```

### 교훈

1. **GUI 애플리케이션은 쉘 PATH를 따르지 않음**
   - 터미널에서 `uvx`가 동작해도 Claude Desktop은 못 찾을 수 있음
   - Java 비유: IDE에서 실행할 때와 터미널에서 실행할 때 CLASSPATH가 다를 수 있음
   
2. **전체 경로 사용이 안전함**
   - 상대 경로나 PATH 의존성 제거
   - 명확하고 예측 가능한 동작
   
3. **설정 파일 수정 후 반드시 재시작**
   - Claude Desktop은 시작 시에만 설정 파일을 읽음
   - 재시작하지 않으면 변경사항 적용 안 됨
   
4. **MCP 연결 확인 방법**
   - Claude Desktop 하단의 🔌 아이콘 확인
   - 클릭해서 "Connected MCP Servers" 목록 확인

### 다음 단계

- ✅ MCP Server 정상 동작 확인
- ✅ Claude Desktop 설정 완료 (전체 경로 사용)
- ✅ Claude Desktop 재시작
- 🎯 다음: Claude Desktop에서 실제 테스트 (Step 4)

---

## 📝 실습 진행 상황

- [x] Prerequisites 준비
  - [x] Claude Desktop 설치
  - [x] Python 설치
    - 설치 버전: **Python 3.14.2 (Homebrew)**
  - [x] UV 설치 ✅ (트러블슈팅 완료)
    - 설치 버전: **uvx 0.9.17 (2b5d65e61 2025-12-09)**
  - [x] SQLite 확인 ✅
    - 설치 버전: **SQLite 3.39.4 (2022-09-07)**
- [x] Step 1: 더미 DB 생성 ✅ (트러블슈팅 완료)
  - 프로젝트 디렉토리: **~/projects/mcp-practice/**
  - DB 파일: **products.db (10개 상품)**
- [x] Step 2: MCP Server 구동 ✅ (트러블슈팅 완료)
  - MCP Server: **mcp-server-sqlite (36 packages)**
  - 동작 방식 이해: **백그라운드 서비스**
- [ ] Step 3: Claude Desktop 설정
- [ ] Step 4: 테스트

---

## 🔗 참고 자료

- UV 공식 문서: https://docs.astral.sh/uv/
- Mac 기본 쉘 확인: `echo $SHELL`
- PATH 개념: https://linuxize.com/post/how-to-add-directory-to-path-in-linux/

