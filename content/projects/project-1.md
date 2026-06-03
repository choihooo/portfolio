---
id: project-study-admin-recommendation
title: "study-admin 맞춤 추천 시스템"
slug: study-admin-recommendation
sourceType: project
tags: [nextjs, react, typescript, ai, recommendation, embedding, pgvector]
year: 2026
url: ""
github: ""
status: completed
---

## 프로젝트 개요

`study-admin`은 블로그 스터디 운영을 돕는 사이드 프로젝트입니다. 최호는 이 프로젝트에서 사용자 취향과 콘텐츠를 각각 임베딩으로 변환하고, `/curation`, `/posts`에 벡터 기반 맞춤 추천과 추천 이유 UI를 구현했습니다.

## 문제 상황

기존 큐레이션 추천은 사용자 관심사 태그와 콘텐츠 태그가 겹치는 개수로 정렬하는 방식이었습니다. 하지만 실제 큐레이션 글은 태그가 비어 있거나 불완전한 경우가 있어, 태그 overlap만으로는 추천 품질을 안정적으로 확보하기 어려웠습니다.

스터디원이 올린 글(`/posts`)도 최신순이나 인기순 외에 사용자 관심사와 맞는 글을 보여주는 맞춤 추천 흐름이 필요했습니다. 추천 결과를 단순히 보여주는 것뿐 아니라, 사용자가 왜 추천됐는지 이해할 수 있는 추천 이유 UI도 필요했습니다.

## 해결 방법

### 임베딩 텍스트 설계

- 사용자 취향: `part + interests + bio`
- 큐레이션 아이템: `title + description + tags + sourceName`
- 스터디 글: `title + description + author part/interests/bio + round`

이렇게 사용자, 큐레이션, 포스트를 각각 임베딩 가능한 텍스트로 변환하는 규칙을 만들었습니다.

### 벡터 추천 구조

- `pgvector` 기반 `vector(768)` 저장 구조와 HNSW 인덱스 마이그레이션을 추가했습니다.
- `member_preference_embeddings`, `post_embeddings`, `curation_items.embedding` 기반 추천용 데이터 모델을 정리했습니다.
- 봇 서버의 `EmbeddingService`에서 Ollama와 OpenAI-compatible provider를 모두 지원하도록 구성했습니다.
- Next.js `after()`를 활용해 사용자 응답 이후 봇 내부 API로 임베딩 갱신을 비동기 요청하도록 설계했습니다.

### 추천 점수와 이유 UI

큐레이션 추천은 의미 유사도 65%, 최신성 20%, 기존 relevanceScore 15%를 조합했습니다. 포스트 추천은 의미 유사도 70%, 최신성 15%, 인기 10%, 작성자 친화도 5%를 반영했습니다.

추천 결과에는 `summary`, `reasons`, `matchedKeywords`, `semanticScore`, `freshnessScore`, `popularityScore`를 포함했습니다. 프론트에서는 맞춤 추천 탭, 추천 이유, 점수 배지를 보여줘 사용자가 추천 근거를 확인할 수 있게 했습니다.

## 기술 스택

- **프레임워크:** Next.js, React
- **언어:** TypeScript
- **데이터:** Supabase, Drizzle ORM, pgvector
- **AI:** Ollama, OpenAI-compatible embeddings
- **백그라운드 처리:** Discord Bot 내부 API, 백필 스크립트
- **테스트:** Vitest property test

## 성과 및 임팩트

- PR `6667ea9 feat: 임베딩 기반 맞춤 추천 추가 (#84)` 기준 43개 파일 변경, `+4970 / -256`
- `/curation`과 `/posts`에 맞춤 추천 탭 추가
- 사용자 취향, 큐레이션 아이템, 스터디 글 3종 임베딩 파이프라인 구성
- 내부 임베딩 API 4종과 백필 스크립트 3종 추가
- 임베딩 서버 지연이나 실패가 글 등록/프로필 저장 흐름을 막지 않도록 사용자 요청과 임베딩 갱신 분리
- 32명 규모 스터디 운영 환경에서 추천 탭 클릭률 약 20% 증가, 추천 카드 상세 진입 CTR 약 15% 개선 방향성 확인

## 배운 점

AI 추천은 유사도 계산만으로 완성되지 않았습니다. 사용자가 결과를 신뢰하려면 추천 이유, 매칭 키워드, 점수 배지, fallback 상태가 같이 필요했습니다. 또 임베딩 갱신을 사용자 요청 흐름과 분리해야 기능이 느려지거나 외부 서버 장애에 묶이지 않는다는 점을 배웠습니다.
