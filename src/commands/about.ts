import type { CommandHandler } from './types';

export const about: CommandHandler = () => {
  const intro = `
{bold}{cyan}  CHOI HO{/cyan}{/bold}
  {dim}─────────────────────────────────────────────────────{/dim}

{bold}TypeScript 기반 프론트엔드와 제품 구현 경험을 쌓아온 개발자입니다.{/bold}

어드민 서비스, 디자인 시스템, Electron 데스크톱 앱, AI 기반 웹 서비스를 만들며
사용자가 헷갈리지 않는 흐름과 팀원이 쓰기 편한 구조를 함께 고민해왔습니다.

{bold}Focus:{/bold}
  {green}> {/green}AI/AX frontend: 추천 이유 UI, 검색 근거 표시, background job
  {green}> {/green}Design systems: UI Kit, Storybook, i18n, package boundaries
  {green}> {/green}Frontend quality: TypeScript, accessibility, responsive UI, performance
  {green}> {/green}Operational products: admin systems, Electron/Tauri apps, deployment flow

{bold}Recent experience:{/bold}
  {cyan}야몬{/cyan} · 2026.03.02 - 2026.05.31
    UI Kit, Langboard CLI workflow, UROCK Electron AI search

  {cyan}아이겐코리아{/cyan} · 2025.03.04 - 2025.06.30
    TypeScript migration, i18n validation automation, admin architecture

  {dim}─────────────────────────────────────────────────────{/dim}
  {dim}Type {bold}/projects{/bold}, {bold}/skills{/bold}, or {bold}/ai 최호는 어떤 개발자야?{/bold}{/dim}
`;

  return {
    output: intro.trim(),
  };
};
