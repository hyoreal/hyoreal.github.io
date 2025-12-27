---
layout: post

toc: true

title: "[AI 실전] MCP 실습 - SQLite DB 연결 및 조회 권한 설정"

date: 2025-12-13 11:50:00 +0900

comments: true

categories: [AI, MCP]

tags: [AI, MCP, SQLite, Claude]


---

### 1. 사전 준비 (Prerequisites)

#### 1.1. Claude Desktop App (MCP Host 역할)

**다운로드 및 설치:**

```bash
# 공식 사이트에서 다운로드
# https://claude.ai/download

# 설치 확인
ls ~/Library/Application\ Support/Claude/
# claude_desktop_config.json (설정 파일)
```

**요구사항:** macOS 12.0 이상

#### 1.2. uv (Python 패키지 매니저)

**설치:**

```bash
# uv 설치
brew install uv

# 또는 공식 설치 스크립트
curl -LsSf https://astral.sh/uv/install.sh | sh

# 확인
uvx --version
```

**uv란?**
- Python의 `npx`와 동일한 도구
- 패키지 설치 없이 바로 실행 가능
- `uvx mcp-server-sqlite` → SQLite MCP Server 즉시 실행

#### 1.3. SQLite DB 파일 (테스트용 더미 데이터)

**Mac에는 SQLite가 기본 내장:**

```bash
# 버전 확인
sqlite3 --version
# 3.43.2 (또는 다른 버전)

# 설치 안 되어 있다면
brew install sqlite
```

------

### 2. 더미 데이터 생성

#### 2.1. 프로젝트 디렉토리 생성

```bash
# MCP 실습용 디렉토리 생성
mkdir -p ~/projects/mcp-practice
cd ~/projects/mcp-practice

# 현재 위치 확인 (절대 경로 필요)
pwd
# /Users/username/projects/mcp-practice
```

#### 2.2. 더미 DB 생성 스크립트 작성

`create_dummy_db.py` 파일 생성 후 다음 코드 작성:

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

------

#### 2.3. 스크립트 실행

```bash
# 스크립트 실행
python3 create_dummy_db.py

# 출력:
# ✅ products.db 생성 완료!
# 총 10개의 상품이 등록되었습니다.

# DB 파일 확인
ls -lh products.db
# -rw-r--r--  1 user  staff    20K Dec 13 20:00 products.db

# 데이터 확인
sqlite3 products.db "SELECT COUNT(*) FROM products;"
# 10
```

------

### 3. 설정 (Configuration)

#### 3.1. 설정 파일 위치

**Mac 기준:**

```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**비유:** `application.yml`에 Datasource 정보 등록하는 것과 동일.

#### 3.2. JSON Config 작성

설정 파일 열기:

```bash
# 파일 열기
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 또는 vim/nano로
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**JSON Config 예시 (필수 포함):**

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

**⚠️ 주의사항:**
- `username`을 실제 Mac 사용자명으로 변경
- **절대 경로** 사용 필수 (상대 경로 불가)
- DB 파일 경로 정확히 입력

**절대 경로 확인:**

```bash
# 현재 디렉토리의 절대 경로 확인
pwd
# /Users/username/projects/mcp-practice

# products.db의 절대 경로
realpath products.db
# /Users/username/projects/mcp-practice/products.db
```

**설정 파일 구조 이해:**

```java
// JDBC 설정과 비교

// application.yml (Spring Boot)
spring:
  datasource:
    driver-class-name: org.sqlite.JDBC
    url: jdbc:sqlite:/path/to/db.db
    
// claude_desktop_config.json (MCP)
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",              // Driver (uvx로 실행)
      "args": [
        "mcp-server-sqlite",         // MCP Server 이름
        "--db-path",
        "/path/to/products.db"       // DB 경로
      ]
    }
  }
}
```

#### 3.3. Claude Desktop 재시작

```bash
# Claude Desktop 완전 종료
# Cmd + Q (강제 종료)

# 다시 실행
open -a "Claude"
```

**MCP 연결 확인:**
- Claude Desktop 하단에 **🔌 아이콘** 표시 확인
- 아이콘 클릭 시 "sqlite (1 tool available)" 표시 확인

------

### 4. 테스트 (Verification)

#### 4.1. 기본 조회 테스트

AI에게 질문:

```
사용자: "내 DB에 있는 'users' 테이블 스키마 알려줘"
또는
사용자: "가격이 1000원 이상인 상품 조회해줘"
```

**결과 확인:**
- AI가 스스로 SQL을 생성(`SELECT ...`)하고 실행하여 결과를 가져오는지 확인
- MCP Server를 통해 직접 DB 조회하는지 확인

#### 4.2. 테스트 시나리오 예시

**시나리오 1: 기본 조회**

```
사용자: "내 DB에 있는 상품 목록을 보여줘"

Claude:
[MCP를 통해 products.db 조회]
"products 테이블에 총 10개의 상품이 있습니다..."
```

**시나리오 2: 조건부 조회**

```
사용자: "가격이 100만원 이상인 상품 찾아줘"

Claude:
[SQL 자동 생성: SELECT * FROM products WHERE price >= 1000000]
[결과 분석 및 응답]
```

**시나리오 3: 집계 분석**

```
사용자: "카테고리별 평균 가격을 계산해줘"

Claude:
[집계 쿼리 자동 실행: SELECT category, AVG(price) FROM products GROUP BY category]
[결과 분석 및 응답]
```

------

### 5. 문제 해결 (Troubleshooting)

#### 5.1. MCP Server 아이콘이 안 보임

```bash
# 원인 1: 설정 파일 경로 오류
# 해결: 절대 경로 확인
realpath products.db

# 원인 2: JSON 문법 오류
# 해결: JSON 유효성 검사
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python3 -m json.tool

# 원인 3: uvx 설치 안 됨
# 해결: uvx 재설치
brew install uv
```

#### 5.2. "Permission Denied" 에러

```bash
# 원인: DB 파일 권한 문제
# 해결: 권한 부여
chmod 644 products.db
chmod 755 .
```

#### 5.3. Claude가 쿼리를 못 찾음

```bash
# 원인: 테이블이 비어있거나 스키마 문제
# 해결: 데이터 확인
sqlite3 products.db "SELECT COUNT(*) FROM products;"

# 스키마 확인
sqlite3 products.db ".schema products"
```

#### 5.4. MCP Server 실행 안 됨

```bash
# 원인: Python 환경 문제
# 해결: Python 버전 확인
python3 --version  # 3.10 이상 필요

# uvx 재설치
brew install uv
```

------

> 참고 자료
> - MCP 공식 문서: https://modelcontextprotocol.io/
> - Claude Desktop 다운로드: https://claude.ai/download
> - MCP SQLite Server: https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite
> - UV (Python 도구): https://docs.astral.sh/uv/

