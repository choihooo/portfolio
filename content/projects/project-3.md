---
id: project-hods-design-system
title: "HODS 멀티플랫폼 디자인 시스템"
slug: hods-design-system
sourceType: project
tags: [react, nextjs, react-native, typescript, design-system, storybook, vitest]
year: 2026
url: ""
github: ""
status: completed
---

## 프로젝트 개요

HODS는 토큰 컴파일러와 웹 컴포넌트 프로토타입을 React, Next.js, React Native, tokens, icons 패키지로 확장한 멀티플랫폼 디자인 시스템 프로젝트입니다. 단순 컴포넌트 구현이 아니라 Storybook, docs, package entrypoint, CI, npm release workflow까지 포함한 디자인 시스템 운영 구조를 실험했습니다.

## 문제 상황

초기 토큰 컴파일러와 웹 컴포넌트 프로토타입을 실제로 재사용 가능한 패키지 구조로 정리할 필요가 있었습니다. 웹만이 아니라 Next.js와 React Native surface에서도 유사한 디자인 토큰과 컴포넌트 API를 사용할 수 있게 만드는 실험이 필요했습니다.

디자인 시스템은 컴포넌트 몇 개를 만드는 것으로 끝나지 않습니다. 패키지 경계, 문서화, Storybook, 타입 정의, release workflow까지 함께 구성되어야 재사용 가능한 프론트엔드 자산이 됩니다.

## 해결 방법

### 패키지 구조

- pnpm workspace 기반 `@hozorica/hods-*` 패키지 구조로 재구성했습니다.
- `tokens`, `icons`, `react`, `react-native`, `next` 패키지로 책임을 분리했습니다.
- React, React Native, Next.js별 component entrypoint와 README, docs catalog를 추가했습니다.

### 컴포넌트와 문서화

- 토큰 컴파일러 MVP와 테스트를 만들었습니다.
- React component library와 full HTML demo를 구성했습니다.
- Storybook 기반 component stories를 추가했습니다.
- React, React Native, Next.js surface에서 디자인 토큰과 컴포넌트 API를 어떻게 유지할지 실험했습니다.

### 배포와 검증

- CI와 npm release workflow를 구성했습니다.
- Vitest 기반 테스트를 추가했습니다.
- 패키지별 README와 docs catalog를 정리해 사용자가 entrypoint와 설치 방식을 이해할 수 있도록 했습니다.

## 기술 스택

- **언어:** TypeScript
- **프레임워크:** React, Next.js, React Native
- **문서화:** Storybook
- **패키지 관리:** pnpm workspace
- **테스트:** Vitest
- **배포:** GitHub Actions, npm release workflow

## 성과 및 임팩트

- 패키지 5개 구성: `tokens`, `icons`, `react`, `react-native`, `next`
- React stories 31개 구성
- React source 68개, React Native source 30개, Next source 36개 수준으로 확장
- 대표 대규모 커밋 `8d1dd2f feat: build multi-platform design system` 기준 174 files, `+24201 / -7460`
- `c7e5767 Add npm release workflow`로 release workflow 구성
- `7300eca Prepare npm packages for initial release`로 초기 npm 패키지 배포 준비

## 배운 점

디자인 시스템은 UI 컴포넌트 구현보다 패키지 경계와 사용 경험이 더 중요했습니다. React와 React Native API를 어디까지 동일하게 유지하고, 어디서 플랫폼 차이를 허용할지 결정해야 했습니다. 또한 Storybook과 docs는 단순 전시가 아니라 컴포넌트를 재사용 가능한 자산으로 만드는 핵심 장치라는 점을 확인했습니다.
