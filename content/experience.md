---
id: experience
title: "Experience"
sourceType: resume
tags: [experience, career, frontend, ai, admin, design-system]
---

## 경력

### Frontend Developer @ 야몬

**2026.03.02 - 2026.05.31**

야몬에서는 프론트엔드 계약직으로 UI Kit, 사내 Langboard CLI workflow, Electron 기반 AI 검색 제품을 다뤘습니다. 핵심 메시지는 AI/DX 도구화, 디자인 시스템, 데스크톱 AI 검색 제품 경험입니다.

**주요 업무:**

- `goldentemplate-ui`에서 UI Kit 컴포넌트 시스템과 컴포넌트 쇼케이스를 구축했습니다.
- 한/영 i18n locale prefix 라우팅을 도입하고, 하드코딩된 텍스트를 번역 키 구조로 전환했습니다.
- React 기반 atom/molecule 컴포넌트를 확장하고 Astro UI 일부를 React 컴포넌트로 마이그레이션했습니다.
- `goldentemplate-ui-core`에서 Codex/agent가 사내 Langboard 작업 흐름에 진입할 수 있도록 selector-first CLI workflow를 개선했습니다.
- UROCK 포렌식 Electron 앱에서 metadata-aware Qdrant search, media ingestion, evidence display, Electron main process 모듈 분리를 다뤘습니다.

**성과:**

- UI Kit 카탈로그 컴포넌트 40개와 상세 문서 페이지 40개를 구성했습니다.
- variation 100개, props table 40개, code example 60개를 정리해 컴포넌트 사용법을 문서화했습니다.
- `goldentemplate-ui-core` prompt slimming으로 명령어 문서 크기를 1,095 words에서 437 words로 줄였습니다.
- dry-run benchmark 기준 median input tokens 10.3%, median duration 7.4%, median cost 4.2%를 줄였습니다.
- post-slim 비교에서 slim CLI가 기존 workflow 대비 median duration 31.6%, median cost 35.4% 낮게 나오는 것을 확인했습니다.
- UROCK 검색 평가 데이터셋 50건과 ingestion 샘플 10개 기준 Top-5 hit rate 100.0%, MRR 1.000, evidence coverage 100.0%를 확인했습니다.

**사용 기술:** TypeScript, Electron, Svelte, Qdrant, Apache Tika, Ollama, Astro, React, Tailwind CSS, Node.js, Vitest

---

### Frontend Engineer Intern @ 아이겐코리아

**2025.03.04 - 2025.06.30**

아이겐코리아는 빅데이터 기반 개인화 추천 및 마케팅 솔루션을 제공하는 회사입니다. 최호는 운영 중인 어드민 서비스에서 하드코딩 제거, TypeScript 마이그레이션, 다국어 검증 자동화처럼 유지보수 비용과 배포 리스크를 줄이는 프론트엔드 플랫폼 개선을 수행했습니다.

**주요 업무:**

- 노후화된 TypeScript 환경을 strict 모드 전환 목표로 단계별 마이그레이션했습니다.
- 최신 라이브러리 적용 시 반복되던 버전 충돌 문제를 줄이도록 TypeScript 설정과 코드베이스를 정비했습니다.
- 한국어 JSON 기준으로 영문, 중문, 일문 번역 파일의 누락 키를 자동 추출하는 스크립트를 만들고 CI에 연결했습니다.
- 30개 이상의 센터 정보가 하드코딩되어 새 센터 추가 때마다 코드 수정과 배포가 필요하던 바운스사 어드민 구조를 API 기반 동적 렌더링으로 개선했습니다.
- Recoil atom/selector와 LocalStorage effect를 활용해 센터 데이터 상태관리와 캐싱 흐름을 설계했습니다.
- 센터별/전체 통계에 목표 달성률과 YoY 지표를 추가하고, Recharts 기반 복합 차트와 엑셀 다운로드 연동을 구현했습니다.

**성과:**

- 평균 빌드 시간을 246.22초에서 199.51초로 약 19% 단축했습니다.
- 신규 센터 추가가 프론트엔드 코드 수정과 재배포를 요구하지 않는 데이터 기반 구조로 바뀌었습니다.
- 다국어 누락 키를 PR 단계에서 차단할 수 있는 품질 게이트를 구성했습니다.

**사용 기술:** TypeScript, React-i18next, Recoil, Axios, Recharts, Excel Export, AWS CodeCommit, AWS CodePipeline

---

## 활동

### CMC

**2026.05 - 현재**

프론트엔드 개발 파트로 활동을 시작했습니다.

### 한국대학생IT경영학회 큐시즘

**2021.08 - 2025.12**

프론트엔드 개발 파트와 운영 활동에 참여했습니다. SKT DEVOCEAN 마이페이지 개선 과제에서 활동 캘린더 기능을 실 사이트에 적용했고, 경영총괄팀 기획 팀원으로 네트워킹 행사 기획에도 참여했습니다.

### 유데미 러닝크루 리더 2기

**2025.02 - 2025.04**

Next.js 15와 React 강의 스터디를 리드했습니다.

---

## 수상 및 기타

- 2025.12 한국대학생IT경영학회 32기 밋업 프로젝트 대상
- 2025.10 SW중심대학 2025 해커톤 SUMTECH 장려상
- 2025.09 직행 기업 연계 프로젝트 우수상
- 2024.12 KT&G 상상 유니브 왓에버 아이디어톤 대상
- 2024.10 부산 해양 데이터 해커톤 장려상
- 2021.11 2021 대학생 하계 논문 학술대회 금상
- 2025.05 Chromium 문서 기여: 더 이상 존재하지 않는 MacViews release plan 링크 제거 변경이 main 브랜치에 머지됨

---

## 학력 및 자격

- 한국공학대학교 컴퓨터공학전공, 2024.03 - 2026.02
- 공주대학교 소프트웨어전공, 2020.03 - 2024.02
- SQL 개발자(SQLD), 2025.07.18
