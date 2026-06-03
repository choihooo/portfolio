---
id: project-bugi-download
title: "거부기린 다운로드 랜딩"
slug: bugi-download
sourceType: project
tags: [react, vite, typescript, landing, seo, ga4, i18n, performance]
year: 2026
url: "https://choihooo.github.io/bugi-download/"
github: "https://github.com/kusitms-bugi/FE"
status: completed
---

## 프로젝트 개요

거부기린은 AI가 자세를 실시간으로 모니터링해 거북목을 방지하고 바른 자세 습관을 돕는 디지털 헬스케어 데스크톱 서비스입니다. 이 프로젝트에서는 데스크톱 앱 다운로드 전환을 위한 React/Vite 랜딩 페이지를 만들고, 반응형 UI, SEO, GA4 이벤트 측정, 한영 i18n, 이미지 성능 개선까지 진행했습니다.

## 문제 상황

데스크톱 앱을 사용자가 내려받기 전 제품 가치를 이해할 수 있는 다운로드 랜딩 페이지가 필요했습니다. 단순 소개 페이지가 아니라 모바일, 태블릿, 데스크톱에서 깨지지 않는 반응형 화면과 검색/공유 최적화가 필요했습니다.

또 다운로드 버튼, FAQ, CTA, 스크롤 같은 사용자 행동을 추적해 이후 개선 기준을 만들 필요가 있었습니다. 한국어와 영어 사용자 모두를 받을 수 있도록 locale 전환과 텍스트 overflow 대응도 필요했습니다.

## 해결 방법

### 랜딩 페이지 구현

- Vite/React 기반 다운로드 페이지를 구현했습니다.
- hero, keypoint, FAQ, CTA, footer 섹션을 구성했습니다.
- Figma asset을 반영해 모바일/태블릿/데스크톱 레이아웃을 분리했습니다.
- layout overflow를 수정하고 i18next 기반 `ko/en` locale을 구성했습니다.

### SEO와 이벤트 측정

- SEO meta, Open Graph, JSON-LD를 추가했습니다.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, OG thumbnail을 추가했습니다.
- GA4 event utility를 만들고 다운로드, 이메일, FAQ, CTA, hero, scroll 관련 이벤트 추적을 붙였습니다.

### 성능 개선

초기 Lighthouse baseline은 Mobile Performance 25점, Desktop Performance 17점이었습니다. 병목은 큰 PNG/JPG 이미지였습니다.

- 4MB대 hero mock 이미지를 viewport별 WebP로 변환해 52KB/28KB/16KB 수준으로 축소했습니다.
- 2.5MB대 why background 이미지를 WebP로 변환해 16KB/8KB 수준으로 축소했습니다.
- keypoint, CTA 배경 이미지를 WebP로 변환하고 실제 표시 크기에 맞춰 resize했습니다.
- hero 이미지는 `fetchPriority="high"`, 아래 섹션 이미지는 `loading="lazy"`를 적용했습니다.
- 참조되지 않는 원본 PNG/JPG를 제거했습니다.

## 기술 스택

- **프레임워크:** React, Vite
- **언어:** TypeScript
- **스타일링:** CSS, Responsive UI
- **분석:** GA4
- **SEO:** Open Graph, JSON-LD, sitemap, robots, manifest
- **i18n:** i18next

## 성과 및 임팩트

| 지표 | 개선 전 | 개선 후 |
|------|---------|---------|
| Mobile Performance | 25 | 87 |
| Desktop Performance | 17 | 93 |
| Mobile LCP | 40.5s | 3.8s |
| Desktop LCP | 10.5s | 1.7s |
| Mobile TBT | 6,960ms | 80ms |
| Desktop TBT | 1,710ms | 0ms |
| SEO | 100 | 100 |
| Accessibility | 95+ | 95+ |
| Production build size | 약 36MB | 약 1.2MB |

대표 작업 근거:

- `964256d feat: implement download page responsive` 기준 71 files, `+4173`
- `6c2c1ff feat: add GA4 event tracking for user interactions` 기준 5 files, `+159 / -6`
- `8d0409b feat: add i18n Korean/English and fix layout overflow issues` 기준 17 files, `+1455 / -932`

## 배운 점

제품 랜딩은 UI 구현만으로 끝나지 않습니다. 검색과 공유 기본값, 이벤트 측정, i18n, 이미지 성능까지 함께 정리해야 실제 배포 가능한 페이지가 됩니다. 특히 이미지 최적화는 Lighthouse 지표와 사용자 체감 로딩을 동시에 크게 바꿀 수 있다는 점을 확인했습니다.
