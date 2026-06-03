import type { CommandHandler } from './types';

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

const experiences: Experience[] = [
  {
    role: 'Frontend Developer',
    company: '야몬',
    period: '2026.03.02 - 2026.05.31',
    description:
      'UI Kit, Codex/agent 기반 Langboard CLI workflow, Electron 기반 AI 검색 제품을 다뤘습니다.',
    highlights: [
      'UI Kit 카탈로그 40개와 상세 문서 페이지 40개 구성',
      'selector-first CLI workflow로 median duration 31.6%, cost 35.4% 절감 확인',
      'UROCK Electron 앱의 metadata-aware search, media ingestion, evidence display 개선',
    ],
  },
  {
    role: 'Frontend Engineer Intern',
    company: '아이겐코리아',
    period: '2025.03.04 - 2025.06.30',
    description:
      '운영 중인 어드민 서비스의 TypeScript, i18n, 센터관리 구조를 개선했습니다.',
    highlights: [
      'TypeScript 마이그레이션으로 평균 빌드 시간 246.22초 -> 199.51초 단축',
      '다국어 누락 키 자동 검증 스크립트를 CI 품질 게이트로 연결',
      '하드코딩된 센터관리 구조를 API 기반 동적 렌더링으로 전환',
    ],
  },
];

export const experience: CommandHandler = () => {
  const header = `
{bold}{cyan}  EXPERIENCE{/cyan}{/bold}
  {dim}─────────────────────────────────────────────────────{/dim}
`;

  const timeline = experiences
    .map((exp, i) => {
      const connector = i === experiences.length - 1 ? '└──' : '├──';
      const marker = i === 0 ? '{green}●{/green}' : '{dim}○{/dim}';
      const highlightLines = exp.highlights
        .map((highlight) => `  │     {green}> {/green}${highlight}`)
        .join('\n');

      return `  ${marker} {bold}${exp.role}{/bold}
  │   ${'{cyan}' + exp.company + '{/cyan}'} · ${'{dim}' + exp.period + '{/dim}'}
  ${connector} ${exp.description}
${highlightLines}`;
    })
    .join('\n  │\n');

  return {
    output: `${header}\n${timeline}\n`,
  };
};
