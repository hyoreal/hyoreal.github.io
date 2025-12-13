---
layout: post

toc: true

title: "[AI 실전] MCP 실습 가이드: AI에게 내 로컬 DB(SQLite) 조회 권한 주기"

date: 2025-12-13 19:40:00 +0900

comments: true

categories: [AI, Hands-On]

tags: [AI, MCP, Claude, SQLite, 실습, Hands-On, Model Context Protocol]


---

### 백문이 불여일타, 이제 직접 연결해봅시다 💻

[지난 포스팅](https://hyoreal.github.io/posts/AI-%EA%B8%B0%EC%B4%88-MCP-AI%EC%97%90%EA%B2%8C-%EC%86%90%EA%B3%BC-%EB%B0%9C%EC%9D%84-%EB%8B%AC%EC%95%84%EC%A3%BC%EB%8A%94-%ED%91%9C%EC%A4%80-%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4/)에서 MCP(Model Context Protocol)의 이론을 배웠어요. JDBC처럼 AI와 데이터 소스를 표준 방식으로 연결하는 프로토콜이라는 걸 알았죠.

하지만 **이론만으로는 부족해요!** 마치 JDBC를 처음 배울 때 `Connection`, `Statement` 개념만 읽고 끝내지 않듯이, MCP도 직접 손으로 해봐야 진짜 이해가 돼요.

오늘은 **MCP 실습 가이드**를 작성할 거예요. 이 가이드를 따라 하면:
- ✅ 내 맥북에 SQLite DB를 만들고
- ✅ Claude Desktop과 MCP로 연결하고
- ✅ AI가 직접 내 DB를 조회하게 만들 수 있어요!

"Claude야, 내 DB에서 가장 비싼 상품 찾아줘" → 실제로 동작하는 그날까지! 🚀

------

### 1. 이론 복습: MCP가 뭐였더라? 🤔

#### 간단 요약

```java
// Before MCP: 데이터 복붙
개발자: [DB 쿼리 실행]
       [결과 복사]
       [ChatGPT에 붙여넣기]
       "이거 분석해줘"

// After MCP: AI가 직접 접근
개발자: "Claude야, 내 DB의 products 테이블 분석해줘"
Claude: [MCP로 DB 직접 조회]
       [자동 분석 및 응답]
```

**핵심 컴포넌트:**
- **MCP Host**: AI 애플리케이션 (예: Claude Desktop)
- **MCP Client**: AI 모델 (예: Claude)
- **MCP Server**: 데이터 소스 (예: SQLite MCP Server)

```
┌─────────────────┐
│ Claude Desktop  │ ← MCP Host
│  (MCP Host)     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌────▼──────────┐
│ Claude AI       │  │ SQLite MCP    │
│ (MCP Client)    │  │ Server        │
└─────────────────┘  └───────┬───────┘
                             │
                       ┌─────▼──────┐
                       │ products.db│
                       │ (내 로컬DB)│
                       └────────────┘
```

------

### 2. 실습 준비물 (Prerequisites) 📦

#### 준비물 1: Claude Desktop App (Mac)

**다운로드:**
- 공식 사이트: https://claude.ai/download
- 요구사항: macOS 12.0 이상

**설치 확인:**

```bash
# 설치 후 확인
ls ~/Library/Application\ Support/Claude/

# 출력 예시:
# claude_desktop_config.json (설정 파일)
```

------

#### 준비물 2: Python & UV

MCP Server를 실행하려면 Python 환경이 필요해요.

**Python 설치 (Mac):**

```bash
# Homebrew로 설치
brew install python

# 확인
python3 --version
# Python 3.11.5 (또는 3.10 이상이면 OK)
```

**UV 설치 (Python 패키지 관리 도구):**

```bash
# UV 설치
curl -LsSf https://astral.sh/uv/install.sh | sh

# 확인
uvx --version
# uvx 0.1.0 (또는 최신 버전)
```

**UV란?**
- Python의 `npx`와 같은 도구
- 패키지를 설치하지 않고 바로 실행 가능
- `uvx mcp-server-sqlite` → SQLite MCP Server 즉시 실행

------

#### 준비물 3: SQLite (Mac에 기본 내장)

```bash
# Mac에는 SQLite가 이미 설치되어 있어요
sqlite3 --version
# 3.43.2 (또는 다른 버전)

# 설치 안 되어 있다면
brew install sqlite
```

------

### 3. 실습 시나리오: Step-by-Step Guide 🛠️

#### 전체 흐름 미리보기

```bash
# Step 0: 프로젝트 디렉토리 생성
mkdir -p ~/projects/mcp-practice
cd ~/projects/mcp-practice

# Step 1: 더미 DB 생성
vi create_dummy_db.py  # 파일 생성 후 코드 작성
python3 create_dummy_db.py

# Step 2: MCP Server 실행 (테스트)
uvx mcp-server-sqlite --db-path ./products.db

# Step 3: Claude Desktop 설정
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Step 4: Claude Desktop 재시작 후 테스트
"Claude야, 내 DB의 상품 목록 보여줘"
```

------

### Step 0: 프로젝트 디렉토리 준비 📁

실습을 위한 작업 공간을 먼저 만들어요.

```bash
# MCP 실습용 디렉토리 생성
mkdir -p ~/projects/mcp-practice

# 디렉토리로 이동
cd ~/projects/mcp-practice

# 현재 위치 확인
pwd
# /Users/yourname/projects/mcp-practice
```

**왜 필요한가요?**
- 홈 디렉토리(`~`)에 파일이 흩어지는 것 방지
- 나중에 파일을 찾기 쉽게 체계적으로 관리
- Claude Desktop 설정에서 **절대 경로**가 필요함

------

### Step 1: 더미 데이터 생성 📊

#### 1-1. Python 스크립트 파일 생성

**방법 A: vi/vim 에디터 사용 (추천)**

```bash
# vi 에디터로 파일 생성
vi create_dummy_db.py
```

vi 에디터가 열리면:
1. `i` 키를 눌러 입력 모드로 전환
2. 아래 Python 코드를 **복사하여 붙여넣기** (Cmd+V)
3. `ESC` 키를 눌러 명령 모드로 전환
4. `:wq` 입력 후 `Enter` (저장하고 종료)

**방법 B: cat 명령어 사용 (vi가 어려우면)**

```bash
cat > create_dummy_db.py << 'EOF'
# [아래 Python 코드 전체를 여기에 붙여넣기]
EOF
```

**방법 C: 텍스트 에디터 사용 (가장 쉬움)**

```bash
# VS Code나 다른 에디터로 열기
open -a "Visual Studio Code" create_dummy_db.py
# 또는
open -e create_dummy_db.py  # TextEdit로 열기
```

------

#### 1-2. Python 코드 작성

`create_dummy_db.py` 파일에 다음 코드를 작성하세요:

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

#### 1-3. 파일 생성 확인

```bash
# 파일이 제대로 생성되었는지 확인
ls -lh create_dummy_db.py
# -rw-r--r--  1 user  staff   1.2K Dec 13 20:00 create_dummy_db.py

# 파일 내용 미리보기 (처음 5줄)
head -5 create_dummy_db.py
# import sqlite3
# from datetime import datetime
# ...
```

------

#### 1-4. 스크립트 실행

```bash
# 현재 디렉토리 확인 (중요!)
pwd
# /Users/yourname/projects/mcp-practice

# 스크립트 실행
python3 create_dummy_db.py

# 출력:
# ✅ products.db 생성 완료!
# 총 10개의 상품이 등록되었습니다.
```

------

#### 1-5. DB 파일 및 데이터 확인

```bash
# DB 파일 생성 확인
ls -lh products.db
# -rw-r--r--  1 user  staff    20K Dec 13 20:00 products.db ✅

# 데이터 개수 확인
sqlite3 products.db "SELECT COUNT(*) FROM products;"
# 10

# 가장 비싼 상품 3개 조회
sqlite3 products.db "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;"
# MacBook Pro M3|2590000
# Studio Display|2090000
# iPhone 15 Pro|1550000
```

**⚠️ 트러블슈팅:**
- 만약 `can't open file` 오류가 발생하면:
  - `pwd`로 현재 위치 확인
  - `ls create_dummy_db.py`로 파일 존재 확인
  - 파일이 없다면 위 과정 다시 진행

------

#### Option B: SQL로 직접 생성 (고급)

```bash
# SQLite 쉘 실행
sqlite3 products.db
```

```sql
-- 테이블 생성
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL,
    created_at TEXT NOT NULL
);

-- 데이터 삽입
INSERT INTO products (name, price, category, stock, created_at) VALUES
('MacBook Pro M3', 2590000, 'Laptop', 15, '2024-01-15'),
('iPhone 15 Pro', 1550000, 'Phone', 30, '2024-02-20'),
('AirPods Pro', 359000, 'Audio', 50, '2024-03-10'),
('iPad Air', 929000, 'Tablet', 20, '2024-04-05'),
('Apple Watch Ultra', 1149000, 'Wearable', 10, '2024-05-12'),
('Magic Keyboard', 149000, 'Accessory', 40, '2024-06-01'),
('Mac Mini M2', 799000, 'Desktop', 12, '2024-07-20'),
('Studio Display', 2090000, 'Monitor', 8, '2024-08-15'),
('HomePod Mini', 129000, 'Audio', 25, '2024-09-30'),
('AirTag 4pack', 149000, 'Accessory', 100, '2024-10-10');

-- 확인
SELECT * FROM products;

-- 종료
.exit
```

------

#### DB 생성 확인

```bash
# SQLite로 확인
sqlite3 products.db "SELECT COUNT(*) FROM products;"
# 10

sqlite3 products.db "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;"
# MacBook Pro M3|2590000
# Studio Display|2090000
# iPhone 15 Pro|1550000
```

------

### Step 2: MCP Server 구동 테스트 🚀

Claude Desktop과 연결하기 전에, MCP Server가 잘 동작하는지 테스트해봐요.

#### MCP Server 실행

```bash
# SQLite MCP Server 실행
uvx mcp-server-sqlite --db-path ./products.db

# 출력:
# Starting SQLite MCP Server...
# Database: /Users/me/projects/mcp-test/products.db
# Server running on stdio...
```

**동작 방식:**
```java
// JDBC Driver 로딩과 유사
Class.forName("org.sqlite.JDBC");  // SQLite JDBC Driver

// MCP Server도 비슷
uvx mcp-server-sqlite  // SQLite MCP Server 실행
```

------

#### 테스트 (선택 사항)

MCP Server가 표준 입출력(stdio)으로 통신하는지 확인:

```bash
# 수동 테스트 (JSON-RPC 형식)
echo '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' | \
uvx mcp-server-sqlite --db-path ./products.db

# 응답 (JSON-RPC 형식):
# {"jsonrpc":"2.0","result":{"capabilities":{...}},"id":1}
```

**이해하기:**
```java
// JDBC Connection 테스트
Connection conn = DriverManager.getConnection("jdbc:sqlite:products.db");
boolean isValid = conn.isValid(5);  // 연결 확인

// MCP Server 테스트
// JSON-RPC로 "initialize" 메시지 전송
// 응답이 오면 서버가 정상 동작하는 것
```

------

### Step 3: Claude Desktop 연결 설정 🔧

이제 Claude Desktop에게 "이 MCP Server를 사용해"라고 알려줘야 해요.

#### 설정 파일 위치

```bash
# Mac
~/Library/Application Support/Claude/claude_desktop_config.json

# 파일 열기
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 또는 vim/nano로
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

------

#### 설정 파일 내용

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/YOUR_USERNAME/projects/mcp-test/products.db"
      ]
    }
  }
}
```

**⚠️ 주의사항:**
- `YOUR_USERNAME`을 실제 Mac 사용자명으로 변경
- **절대 경로**를 사용해야 해요 (상대 경로 안 됨!)
- DB 파일 경로를 정확히 입력

**절대 경로 확인:**

```bash
# 현재 디렉토리의 절대 경로 확인
pwd
# /Users/myname/projects/mcp-test

# products.db의 절대 경로
realpath products.db
# /Users/myname/projects/mcp-test/products.db
```

------

#### 설정 파일 구조 이해

```java
// JDBC 설정과 비교

// application.yml (Spring Boot)
spring:
  datasource:
    driver-class-name: org.sqlite.JDBC  // Driver
    url: jdbc:sqlite:/path/to/db.db     // DB 경로
    
// claude_desktop_config.json (MCP)
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",                 // Driver (uvx로 실행)
      "args": [
        "mcp-server-sqlite",            // MCP Server 이름
        "--db-path",
        "/path/to/products.db"          // DB 경로
      ]
    }
  }
}
```

------

#### 여러 MCP Server 등록 (고급)

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/me/projects/products.db"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/me/projects"
      ]
    },
    "postgres": {
      "command": "uvx",
      "args": [
        "mcp-server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}
```

**이해하기:**
```java
// JDBC에서 여러 DB 설정
@Configuration
public class DataSourceConfig {
    
    @Bean("sqliteDB")
    public DataSource sqliteDataSource() {
        return DataSourceBuilder.create()
            .driverClassName("org.sqlite.JDBC")
            .url("jdbc:sqlite:products.db")
            .build();
    }
    
    @Bean("postgresDB")
    public DataSource postgresDataSource() {
        return DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .url("jdbc:postgresql://localhost/mydb")
            .build();
    }
}

// MCP도 동일하게 여러 서버 등록 가능!
```

------

### Step 4: 테스트 - Claude에게 말 걸기 🗣️

#### Claude Desktop 재시작

```bash
# 1. Claude Desktop 완전 종료
# Cmd + Q (강제 종료)

# 2. 다시 실행
open -a "Claude"

# 또는 Spotlight로 "Claude" 검색 후 실행
```

------

#### MCP 연결 확인

Claude Desktop을 열면 하단에 **🔌 아이콘**(또는 망치 아이콘)이 보여야 해요.

```
┌──────────────────────────────────┐
│ Claude                           │
├──────────────────────────────────┤
│                                  │
│  [대화 내용]                      │
│                                  │
├──────────────────────────────────┤
│  메시지 입력...          🔌 (1)  │ ← MCP Server 연결됨!
└──────────────────────────────────┘
```

**🔌 아이콘 클릭 시:**
```
Connected MCP Servers:
- sqlite (1 tool available)
  - read_query: Execute SELECT queries
```

------

#### 테스트 시나리오 1: 기본 조회

```
사용자: "내 DB에 있는 상품 목록을 보여줘"

Claude:
[MCP를 통해 products.db 조회]

"products 테이블에 다음과 같은 상품들이 있습니다:

1. MacBook Pro M3 - 2,590,000원 (Laptop)
2. iPhone 15 Pro - 1,550,000원 (Phone)
3. AirPods Pro - 359,000원 (Audio)
4. iPad Air - 929,000원 (Tablet)
5. Apple Watch Ultra - 1,149,000원 (Wearable)
...

총 10개의 상품이 등록되어 있습니다."
```

------

#### 테스트 시나리오 2: 분석 요청

```
사용자: "가장 비싼 상품 3개를 찾아줘"

Claude:
[SQL 자동 생성 및 실행]

"가장 비싼 상품 Top 3:

🥇 1위: MacBook Pro M3 - 2,590,000원
🥈 2위: Studio Display - 2,090,000원
🥉 3위: iPhone 15 Pro - 1,550,000원

이 3개 상품의 총 가격은 6,230,000원입니다."
```

------

#### 테스트 시나리오 3: 복잡한 분석

```
사용자: "카테고리별 평균 가격과 재고를 분석해줘"

Claude:
[집계 쿼리 자동 실행]

"카테고리별 분석 결과:

📱 Phone
   - 평균 가격: 1,550,000원
   - 평균 재고: 30개

💻 Laptop
   - 평균 가격: 2,590,000원
   - 평균 재고: 15개

🎧 Audio
   - 평균 가격: 244,000원
   - 평균 재고: 37.5개

📊 총 재고 가치: 약 1억 2천만원"
```

------

#### 내부 동작 이해 (개발자 시점)

```java
// Claude가 내부적으로 하는 일

public class ClaudeMCPClient {
    
    public String handleUserQuery(String query) {
        // 사용자: "가장 비싼 상품 찾아줘"
        
        // Step 1: 의도 파악
        String intent = analyzeIntent(query);
        // → "SELECT query 필요함"
        
        // Step 2: SQL 생성
        String sql = generateSQL(intent);
        // → "SELECT name, price FROM products ORDER BY price DESC LIMIT 1"
        
        // Step 3: MCP로 쿼리 실행
        MCPRequest request = new MCPRequest(
            "read_query",
            Map.of("sql", sql)
        );
        
        MCPResponse response = mcpServer.execute(request);
        // → {"name": "MacBook Pro M3", "price": 2590000}
        
        // Step 4: 결과를 자연어로 변환
        return generateNaturalLanguage(response);
        // → "가장 비싼 상품은 MacBook Pro M3로, 가격은 2,590,000원입니다."
    }
}
```

------

### 4. 문제 해결 (Troubleshooting) 🔧

#### 문제 1: MCP Server 아이콘이 안 보여요

```bash
# 원인 1: 설정 파일 경로 오류
# 해결: 절대 경로 확인
realpath products.db

# 원인 2: JSON 문법 오류
# 해결: JSON 유효성 검사
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python3 -m json.tool

# 원인 3: uvx 설치 안 됨
# 해결: uvx 재설치
curl -LsSf https://astral.sh/uv/install.sh | sh
```

------

#### 문제 2: "Permission Denied" 에러

```bash
# 원인: DB 파일 권한 문제
# 해결: 권한 부여
chmod 644 products.db

# 디렉토리 권한도 확인
chmod 755 .
```

------

#### 문제 3: Claude가 쿼리를 못 찾아요

```bash
# 원인: 테이블이 비어있거나 스키마 문제
# 해결: 데이터 확인
sqlite3 products.db "SELECT COUNT(*) FROM products;"

# 스키마 확인
sqlite3 products.db ".schema products"
```

------

#### 문제 4: MCP Server 실행 안 됨

```bash
# 원인: Python 환경 문제
# 해결: Python 버전 확인
python3 --version  # 3.10 이상 필요

# uvx 재설치
pip3 install --upgrade uv

# 수동으로 MCP Server 설치 후 실행
pip3 install mcp-server-sqlite
python3 -m mcp_server_sqlite --db-path ./products.db
```

------

### 5. 다음 단계 예고 🎯

#### 이 가이드로 준비 완료!

이제 여러분(그리고 저)은:
- ✅ MCP의 이론을 이해했어요
- ✅ 실습을 위한 환경 설정 방법을 알았어요
- ✅ 더미 DB를 만드는 방법을 알았어요
- ✅ Claude Desktop과 연결하는 방법을 알았어요

------

#### 다음 포스팅 예고

**"[AI 실전] MCP 실습 후기: 삽질 로그와 해결 과정"**

다음 포스팅에서는:
1. **실제 연결 시도**: 이 가이드대로 직접 해본 결과
2. **삽질 로그**: 뭐가 안 됐고 어떻게 해결했는지
3. **실전 팁**: 문서에 없는 노하우
4. **확장 실습**: Postgres, Notion 등 다른 MCP Server도 연결

```java
// 예상 시나리오

실습 Day 1:
❌ uvx 명령어 안 먹힘 (PATH 문제)
✅ 해결: export PATH="$HOME/.local/bin:$PATH"

실습 Day 2:
❌ Claude가 테이블을 못 찾음 (스키마 이슈)
✅ 해결: Products → products (대소문자 구분)

실습 Day 3:
✅ 드디어 성공! 🎉
✅ Claude가 내 로컬 DB를 조회함!

실습 Day 4:
🚀 Postgres MCP Server도 연결 성공!
🚀 두 DB를 동시에 조회하는 쿼리 실행!
```

------

### 6. 마치며 🎓

```java
/**
 * MCP 실습 로드맵
 */
public class MCPLearningPath {
    
    // ✅ Step 1: 이론 학습 (완료!)
    void learnTheory() {
        // MCP = AI의 JDBC
        // Host, Client, Server 구조
        // Resources, Tools, Prompts
    }
    
    // ✅ Step 2: 가이드 숙지 (지금 여기!)
    void readGuide() {
        // 준비물 확인
        // 단계별 설치 방법
        // 설정 파일 작성법
    }
    
    // 🎯 Step 3: 직접 실습 (다음 포스팅)
    void handOn() {
        // 실제로 연결해보기
        // 문제 발생 시 해결
        // 성공 경험 공유
    }
    
    // 🚀 Step 4: 응용 (미래)
    void advanced() {
        // 커스텀 MCP Server 개발
        // 회사 DB와 연결
        // 자동화 워크플로우 구축
    }
}
```

**핵심 포인트:**

| Before | After |
|--------|-------|
| 이론만 읽고 끝 | 직접 손으로 해보기 |
| "MCP가 뭔지 알겠어" | "MCP를 내 PC에 설치했어" |
| "JDBC랑 비슷하구나" | "실제로 DB 조회가 되네!" |
| 개념 이해 70% | 실전 이해 100% |

------

**준비됐나요?** 🎯

이 가이드를 북마크해두고, 시간 날 때 차근차근 따라 해보세요!

저도 이 가이드대로 직접 실습한 후, 생생한 후기를 가져오겠습니다. 성공하든 삽질하든, 모든 과정을 솔직하게 공유할게요!

**"백문이 불여일타"** - 백 번 읽는 것보다 한 번 쳐보는 게 낫습니다. 🚀

------

> 참고 자료
> - MCP 공식 문서: https://modelcontextprotocol.io/
> - Claude Desktop 다운로드: https://claude.ai/download
> - MCP SQLite Server: https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite
> - UV (Python 도구): https://docs.astral.sh/uv/

