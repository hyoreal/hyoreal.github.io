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
- [ ] Step 2: MCP Server 구동
- [ ] Step 3: Claude Desktop 설정
- [ ] Step 4: 테스트

---

## 🔗 참고 자료

- UV 공식 문서: https://docs.astral.sh/uv/
- Mac 기본 쉘 확인: `echo $SHELL`
- PATH 개념: https://linuxize.com/post/how-to-add-directory-to-path-in-linux/

