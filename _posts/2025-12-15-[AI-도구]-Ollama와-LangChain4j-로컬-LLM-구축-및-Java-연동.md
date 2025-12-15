---
layout: post

toc: true

title: "[AI 도구] Ollama와 LangChain4j - 로컬 LLM 구축 및 Java 연동"

date: 2025-12-15 22:40:00 +0900

comments: true

categories: [AI 도구]

tags: [AI, Ollama, LangChain4j, LLM, Local AI, Java, Spring]


---

### 1. Ollama 정의

#### 개념

**로컬 PC에서 복잡한 설정 없이 LLM을 실행하는 런타임**

#### 비유: Docker for LLM

```dockerfile
# Docker: 컨테이너로 애플리케이션 실행
docker run nginx

# Ollama: 로컬에서 LLM 모델 실행
ollama run llama3.1
```

**Docker가 애플리케이션 배포를 단순화한 것처럼, Ollama는 LLM 실행을 단순화함**

#### 특징

- **자동 REST API 제공**: `localhost:11434` 엔드포인트 자동 생성
- **모델 관리 자동화**: 모델 다운로드 및 실행 자동 처리
- **설정 최소화**: 복잡한 GPU 설정, 환경 변수 설정 불필요

------

### 2. LangChain vs LangChain4j

#### LangChain (Python)

**파이썬 생태계의 LLM 오케스트레이션 프레임워크 표준**

- LLM 호출, 프롬프트 체이닝, 메모리 관리 등 제공
- OpenAI, Anthropic, Hugging Face 등 다양한 LLM 지원

#### LangChain4j (Java)

**LangChain의 개념을 Java/Spring 생태계에 맞게 포팅한 라이브러리**

- Spring AI의 강력한 경쟁자
- Java/Spring 개발자 친화적 API
- Ollama, OpenAI, Anthropic 등 다양한 LLM 지원

#### 비교

| 구분 | LangChain | LangChain4j |
|------|-----------|-------------|
| **언어** | Python | Java |
| **생태계** | Python ML 생태계 | Java/Spring 생태계 |
| **사용 시나리오** | 데이터 분석, ML 파이프라인 | 엔터프라이즈 애플리케이션 통합 |

------

### 3. 아키텍처 흐름

#### 전체 구조

```
Java Application (Client)
    ↓
LangChain4j (Library)
    ↓
HTTP Request
    ↓
Ollama Server (localhost:11434)
    ↓
LLM Model (GPU/CPU)
```

#### 컴포넌트 역할

- **Java Application**: 비즈니스 로직 실행
- **LangChain4j**: LLM 호출 추상화, 프롬프트 체이닝
- **Ollama**: LLM 모델 실행 및 API 제공
- **LLM Model**: 실제 추론 수행

------

### 4. Ollama 설치 및 실행

#### Step 1: 설치 (Mac)

```bash
brew install ollama
```

#### Step 2: 서비스 실행

```bash
ollama serve
```

**서비스 실행 시 `localhost:11434`에서 REST API 자동 제공**

#### Step 3: 모델 다운로드 및 실행

```bash
# Llama 3.1 8B 모델 다운로드 및 실행
ollama run llama3.1
```

**최초 실행 시 모델 자동 다운로드**

#### Step 4: API 테스트

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1",
  "prompt": "Why is the sky blue?"
}'
```

**REST API를 통한 LLM 호출 확인**

------

### 5. LangChain4j 통합

#### 의존성 추가

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-ollama</artifactId>
    <version>0.29.1</version>
</dependency>
```

#### 기본 사용법

```java
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;

public class OllamaExample {
    public static void main(String[] args) {
        // Ollama 서버 연결
        ChatLanguageModel model = OllamaChatModel.builder()
            .baseUrl("http://localhost:11434")
            .modelName("llama3.1")
            .build();
        
        // LLM 호출
        String response = model.generate("Why is the sky blue?");
        System.out.println(response);
    }
}
```

#### Spring Boot 통합

```java
@Configuration
public class OllamaConfig {
    
    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OllamaChatModel.builder()
            .baseUrl("http://localhost:11434")
            .modelName("llama3.1")
            .temperature(0.7)
            .build();
    }
}
```

```java
@Service
public class AIService {
    
    private final ChatLanguageModel chatModel;
    
    public AIService(ChatLanguageModel chatModel) {
        this.chatModel = chatModel;
    }
    
    public String generateResponse(String prompt) {
        return chatModel.generate(prompt);
    }
}
```

------

### 6. 장점

#### 비용 절감

- **API 비용 0원**: 외부 LLM API 호출 비용 없음
- **인프라 비용 최소화**: 로컬 PC에서 실행

#### 보안

- **데이터 외부 전송 없음**: 민감한 데이터를 외부로 전송하지 않음
- **온프레미스 실행**: 회사 내부 네트워크에서만 동작

#### 개발 환경

- **오프라인 개발 가능**: 인터넷 연결 없이도 LLM 개발 가능
- **빠른 반복 개발**: API 호출 지연 없이 즉시 테스트

#### 유연성

- **다양한 모델 지원**: Llama, Mistral, CodeLlama 등 선택 가능
- **모델 교체 용이**: 코드 변경 없이 다른 모델로 전환 가능

------

### 7. 실전 활용 예시

#### 예시 1: 코드 리뷰 자동화

```java
@Service
public class CodeReviewService {
    
    private final ChatLanguageModel chatModel;
    
    public String reviewCode(String code) {
        String prompt = String.format("""
            다음 Java 코드를 리뷰해줘:
            
            %s
            
            다음 관점에서 분석해줘:
            1. 성능 이슈
            2. 보안 취약점
            3. 코드 품질
            """, code);
        
        return chatModel.generate(prompt);
    }
}
```

#### 예시 2: 문서 자동 생성

```java
@Service
public class DocumentationService {
    
    private final ChatLanguageModel chatModel;
    
    public String generateDocumentation(String className, String code) {
        String prompt = String.format("""
            다음 Java 클래스를 분석하여 Javadoc을 생성해줘:
            
            클래스명: %s
            코드:
            %s
            """, className, code);
        
        return chatModel.generate(prompt);
    }
}
```

------

### 8. 주의사항

#### 성능 고려사항

- **로컬 리소스 사용**: CPU/GPU 리소스 직접 사용
- **모델 크기**: 큰 모델은 메모리 부족 가능
- **응답 시간**: 클라우드 API 대비 느릴 수 있음

#### 모델 선택

- **Llama 3.1 8B**: 일반적인 용도, 메모리 8GB 이상 권장
- **Mistral 7B**: 코드 생성에 특화
- **CodeLlama**: 코드 관련 작업에 최적화

#### 프로덕션 환경

- **로컬 환경**: 개발/테스트 환경에 적합
- **프로덕션**: 서버 배포 시 리소스 모니터링 필요

------

### 9. 정리

#### 핵심 포인트

- **Ollama**: 로컬 LLM 실행을 단순화하는 런타임
- **LangChain4j**: Java/Spring 생태계의 LLM 오케스트레이션 라이브러리
- **비용 절감**: API 비용 없이 로컬에서 LLM 활용
- **보안**: 데이터 외부 전송 없이 온프레미스 실행

#### 활용 시나리오

- 개발 환경에서 LLM 기능 테스트
- 민감한 데이터를 다루는 애플리케이션
- 오프라인 개발 환경 구축
- API 비용 절감이 필요한 프로젝트

#### 다음 단계

- LangChain4j의 고급 기능 (메모리 관리, 프롬프트 체이닝)
- Spring AI와의 비교 및 선택 가이드
- 프로덕션 환경 배포 전략

