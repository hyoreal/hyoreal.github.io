# AI 학습 로드맵 - Tech Wiki 스타일 재배치 계획

## 로드맵 순서 및 제목 변경 계획

| 로드맵 순서 | 변경할 카테고리 | 변경할 제목 (Title) | 설정할 시간 (Date) | 원본 파일명 (참고용) |
| :-- | :-- | :-- | :-- | :-- |
| 1 | [AI 기초] | LLM 작동 원리 - Token, Next Token Prediction, Hallucination | 2025-10-29 10:00:00 | 개발자가-본-LLM의-실체-마법이-아니라-확률-통계인-이유.md |
| 2 | [AI 도구] | Cursor IDE - 설치 및 Codebase 인덱싱 설정 | 2025-10-29 10:10:00 | Cursor-Codebase-Feature-Guide.md |
| 3 | [AI 기초] | Context Window와 RAG - LLM 메모리 구조 및 Stateless 특성 | 2025-10-29 10:20:00 | LLM의-메모리-구조-Context-Window와-RAG.md |
| 4 | [AI 기초] | Transformer 아키텍처 - Self-Attention과 DB Self Join 비유 | 2025-10-29 10:30:00 | 백엔드-개발자를-위한-LLM과-Transformer-이해하기.md |
| 5 | [AI 실전] | 프롬프트 엔지니어링 기초 - P.C.T.O 프레임워크 | 2025-10-29 10:40:00 | Prompt-Engineering-Guide-for-Developers.md |
| 6 | [AI 실전] | 프롬프트 설계 - Temperature, Persona, 함수 호출 관점 | 2025-10-29 10:50:00 | 프롬프트-엔지니어링-함수-설계-관점.md |
| 7 | [AI 실전] | Few-Shot Learning과 Chain of Thought (CoT) - 고급 기법 | 2025-10-29 11:00:00 | Few-Shot과-Chain-of-Thought-고급-테크닉.md |
| 8 | [AI 실전] | Zero-shot, Few-shot, CoT 비교 및 선택 가이드 | 2025-10-29 11:10:00 | Advanced-Prompt-Techniques.md |
| 9 | [AI 실전] | System Prompting과 자동화 - .cursorrules 설정 | 2025-10-29 11:20:00 | 나만의-AI-사수-만들기-System-Prompting과-자동화.md |
| 10 | [AI 기초] | SDD (Spec-Driven Development) - 스펙 주도 개발 방법론 | 2025-10-29 11:30:00 | SDD-AI-시대의-새로운-개발-방법론.md |
| 11 | [AI 기초] | MCP (Model Context Protocol) - JDBC 비유와 표준 인터페이스 | 2025-10-29 11:40:00 | MCP-AI에게-손과-발을-달아주는-표준-인터페이스.md |
| 12 | [AI 실전] | MCP 실습 - SQLite DB 연결 및 조회 권한 설정 | 2025-10-29 11:50:00 | MCP-실습-가이드-내-로컬-DB에-AI-연결하기.md |
| 13 | [AI 실전] | MCP 트러블슈팅 - 4가지 이슈 및 해결 방법 | 2025-10-29 12:00:00 | MCP-실습-후기-트러블슈팅-정리.md |

---

## 제목 변경 규칙 적용 내역

### 변경 전 → 변경 후

1. **"AI는 요술램프가 아닙니다: 확률의 함정"**  
   → **"LLM 작동 원리 - Token, Next Token Prediction, Hallucination"**
   - 감성적 표현 제거, 핵심 개념 나열

2. **"3년차 개발자가 Cursor를 쓰고 야근이 사라졌다"**  
   → **"Cursor IDE - 설치 및 Codebase 인덱싱 설정"**
   - 서술어 제거, 명사형으로 변경

3. **"LLM은 HTTP처럼 Stateless: Context Window와 RAG 완전 정리"**  
   → **"Context Window와 RAG - LLM 메모리 구조 및 Stateless 특성"**
   - 비유 표현 제거, 핵심 키워드 중심

4. **"백엔드 개발자가 이해한 LLM과 Transformer (feat. DB Self Join)"**  
   → **"Transformer 아키텍처 - Self-Attention과 DB Self Join 비유"**
   - 주어 제거, 핵심 개념 중심

5. **"내 명령을 AI가 못 알아듣는 이유: 프롬프트 엔지니어링 완벽 가이드"**  
   → **"프롬프트 엔지니어링 기초 - P.C.T.O 프레임워크"**
   - 감성적 표현 제거, 핵심 프레임워크 명시

6. **"프롬프트는 함수 설계다: AI에게 함수 호출하듯 명령하기"**  
   → **"프롬프트 설계 - Temperature, Persona, 함수 호출 관점"**
   - 비유 표현 제거, 핵심 파라미터 나열

7. **"AI의 지능을 해킹하자: Few-Shot과 Chain of Thought (CoT)"**  
   → **"Few-Shot Learning과 Chain of Thought (CoT) - 고급 기법"**
   - 자극적 표현 제거, 기술 용어 중심

8. **"AI에게 일을 제대로 시키는 노하우: Zero-shot, Few-shot, CoT 완벽 정리"**  
   → **"Zero-shot, Few-shot, CoT 비교 및 선택 가이드"**
   - 감성적 표현 제거, 비교 가이드 형식

9. **"나만의 AI 사수 만들기: System Prompting과 자동화"**  
   → **"System Prompting과 자동화 - .cursorrules 설정"**
   - 감성적 표현 제거, 실전 설정 중심

10. **"SDD: AI 시대, 코딩보다 스펙 작성이 중요한 이유"**  
    → **"SDD (Spec-Driven Development) - 스펙 주도 개발 방법론"**
    - 감성적 표현 제거, 방법론 명시

11. **"MCP: AI에게 손과 발을 달아주는 표준 인터페이스 (feat. JDBC)"**  
    → **"MCP (Model Context Protocol) - JDBC 비유와 표준 인터페이스"**
    - 감성적 표현 제거, 프로토콜 명시

12. **"MCP 실습 가이드: AI에게 내 로컬 DB(SQLite) 조회 권한 주기"**  
    → **"MCP 실습 - SQLite DB 연결 및 조회 권한 설정"**
    - 서술어 제거, 명사형으로 변경

13. **"MCP 실습 후기: 4가지 트러블슈팅과 해결 과정"**  
    → **"MCP 트러블슈팅 - 4가지 이슈 및 해결 방법"**
    - 서술어 제거, 명사형으로 변경

---

## 로드맵 순서 결정 근거

### 초반부 (1-4): 기초 개념 + 실용 도구
- **1순위**: LLM 작동 원리 (확률 통계 기반 이해)
- **2순위**: Cursor IDE (바로 사용 가능한 도구)
- **3순위**: Context Window와 RAG (메모리 구조 이해)
- **4순위**: Transformer 아키텍처 (핵심 구조 이해)

### 중반부 (5-9): 프롬프트 엔지니어링 실전
- **5순위**: 프롬프트 엔지니어링 기초 (P.C.T.O)
- **6순위**: 프롬프트 설계 (Temperature, Persona)
- **7순위**: Few-Shot, CoT 고급 기법
- **8순위**: Zero-shot, Few-shot, CoT 비교
- **9순위**: System Prompting 자동화

### 후반부 (10-13): 고급 활용 및 실습
- **10순위**: SDD 방법론 (AI 시대 개발 방식)
- **11순위**: MCP 기초 이론 (표준 인터페이스)
- **12순위**: MCP 실습 (SQLite 연결)
- **13순위**: MCP 트러블슈팅 (문제 해결)

---

## 카테고리 분류

### [AI 기초]
- LLM 작동 원리 (Token, Next Token Prediction, Hallucination)
- Transformer 아키텍처
- Context Window와 RAG
- MCP 프로토콜 개념
- SDD 방법론

### [AI 실전]
- 프롬프트 엔지니어링 기법
- Few-Shot, CoT 등 고급 테크닉
- System Prompting
- MCP 실습 및 활용

### [AI 도구]
- Cursor IDE 사용법

---

## Date 시간 설정 규칙

- **시작 시간**: 2025-12-13 10:00:00
- **간격**: 10분 간격으로 순차 배정
- **목적**: 블로그에서 로드맵 순서대로 정렬되도록
