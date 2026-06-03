---
id: ai-knowledge
title: "AI Knowledge Base"
sourceType: about
tags: [ai, rag, recommendation, agent, philosophy, portfolio]
---

## AI를 위한 확장 지식 베이스

이 문서는 포트폴리오 AI가 최호의 AI/AX 프론트엔드 경험, 기술적 의사결정, 커리어 방향을 답변할 때 참조하는 지식 베이스입니다.

## AI/AX 프론트엔드 관점

최호의 AI 경험은 “LLM API를 호출했다”보다 제품 흐름에 AI 결과를 어떻게 녹였는지에 가깝습니다. 추천 결과를 단순히 보여주는 대신 추천 이유, 점수 배지, 매칭 키워드, fallback 상태를 함께 설계해 사용자가 결과를 이해하고 클릭할 수 있도록 만드는 데 관심이 있습니다.

`study-admin`에서는 사용자 취향, 큐레이션 아이템, 스터디 글을 각각 임베딩 가능한 텍스트로 변환하고, pgvector 기반 벡터 추천을 `/curation`, `/posts` 추천 탭에 연결했습니다. 추천 결과에는 `summary`, `reasons`, `matchedKeywords`, `semanticScore`, `freshnessScore`, `popularityScore`를 포함해 사용자가 왜 추천됐는지 확인할 수 있게 했습니다.

## Agent workflow와 개발 생산성

야몬의 `goldentemplate-ui-core`에서는 Claude Code 중심이던 Langboard 작업 흐름에 Codex/agent 진입점을 추가하고, selector-first 기반 screenshotless CLI workflow를 정리했습니다. 이미지와 HTML 컨텍스트에 의존하던 무거운 입력을 줄이기 위해 command/runtime context를 slim하게 만들었고, dry-run benchmark로 duration, token, cost를 비교했습니다.

측정 결과, `/langboard-cli-work` prompt slimming 전후 비교에서 median input tokens는 10.3%, median duration은 7.4%, median cost는 4.2% 줄었습니다. post-slim 비교에서는 slim CLI가 기존 `/langboard-work` 대비 median duration 31.6%, median cost 35.4% 낮게 나오는 것을 확인했습니다. 이 경험은 AI 도구 사용 자체보다 AI agent가 일하기 좋은 진입 경로와 검증 기준을 만든 경험입니다.

## AI 검색과 근거 표시

UROCK 포렌식 Electron 앱에서는 metadata-aware Qdrant search, Tika metadata normalization, media ingestion, AI-planned search routing, evidence display를 다뤘습니다. 검색 결과 카드와 채팅 응답이 단순 목록에 머물지 않도록 파일명, 일치 위치, 결과 유형, 주요 근거를 함께 보여주는 방향으로 결과 설명력을 높였습니다.

검색과 채팅 흐름에서는 planner timeout, empty-result timeout, stale completion guard를 추가해 멈춰 보이거나 실패처럼 보이는 상태를 줄였습니다. 이 경험은 AI 검색 결과를 사용자가 신뢰하고 검토할 수 있도록 만드는 UI와 안정성 개선으로 설명할 수 있습니다.

## 기술적 의사결정

### 왜 Next.js인가?

최호는 Next.js를 사용자 화면, API Route, 비동기 후처리, 정적/동적 페이지를 한 프로젝트 안에서 연결하기 좋은 프레임워크로 봅니다. `study-admin`에서는 Next.js API Route와 `after()`를 활용해 사용자 응답과 임베딩 갱신을 분리했고, 웹 요청이 임베딩 서버 지연에 묶이지 않도록 설계했습니다.

### 왜 TypeScript인가?

TypeScript는 단순 타입 문법이 아니라 운영 중인 서비스의 유지보수성과 확장성을 높이는 장치로 사용합니다. 아이겐코리아에서는 노후화된 TypeScript 환경을 개선하고 strict 모드 전환 기반을 마련했으며, 평균 빌드 시간을 246.22초에서 199.51초로 약 19% 단축했습니다.

### 왜 디자인 시스템인가?

디자인 시스템은 화면을 예쁘게 통일하는 도구보다 팀이 반복해서 쓰는 프론트엔드 자산이라고 봅니다. 야몬의 `goldentemplate-ui`에서는 UI Kit 컴포넌트, 카탈로그, 상세 문서, i18n, props table, code example을 정리했고, HODS에서는 React, Next.js, React Native, tokens, icons 패키지를 분리한 멀티플랫폼 디자인 시스템을 실험했습니다.

## 커리어 방향

최호는 AI/AX 프론트엔드, 디자인 시스템, 데스크톱 앱, 운영형 어드민처럼 사용자 흐름과 팀 생산성을 함께 개선하는 영역에 강점이 있습니다. 앞으로도 AI 기능을 단순 데모로 끝내지 않고, 추천 이유 UI, 검색 근거 표시, background job, fallback, 측정 지표까지 포함한 실제 제품 흐름으로 만드는 경험을 확장하려고 합니다.
