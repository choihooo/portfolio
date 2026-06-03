import type { CommandHandler } from './types';

interface Project {
  slug: string;
  name: string;
  description: string;
  tech: string[];
  year: string;
  highlights: string[];
}

const projects: Project[] = [
  {
    slug: 'study-admin',
    name: 'study-admin 맞춤 추천 시스템',
    description:
      '스터디 운영 서비스에서 사용자 취향과 콘텐츠를 임베딩으로 변환하고 /curation, /posts에 맞춤 추천 탭과 추천 이유 UI를 구현했습니다.',
    tech: ['Next.js', 'TypeScript', 'pgvector', 'Ollama'],
    year: '2026',
    highlights: [
      '사용자, 큐레이션, 포스트 3종 임베딩 파이프라인 구성',
      '추천 이유, 매칭 키워드, semantic/freshness/popularity 점수 배지 제공',
      'PR #84 기준 43개 파일 변경, +4970/-256',
    ],
  },
  {
    slug: 'bugi-download',
    name: '거부기린 다운로드 랜딩',
    description:
      '데스크톱 앱 다운로드 전환을 위한 React/Vite 랜딩을 만들고 SEO, GA4, i18n, 이미지 성능 최적화를 적용했습니다.',
    tech: ['React', 'Vite', 'TypeScript', 'GA4', 'i18next'],
    year: '2026',
    highlights: [
      'Mobile Performance 25 -> 87, Desktop Performance 17 -> 93',
      'Mobile LCP 40.5s -> 3.8s, Desktop LCP 10.5s -> 1.7s',
      'production build 산출물 약 36MB -> 1.2MB',
    ],
  },
  {
    slug: 'hods',
    name: 'HODS 멀티플랫폼 디자인 시스템',
    description:
      'React, Next.js, React Native, tokens, icons 패키지로 나눈 멀티플랫폼 디자인 시스템을 실험하고 문서화했습니다.',
    tech: ['React', 'Next.js', 'React Native', 'Storybook', 'Vitest'],
    year: '2026',
    highlights: [
      'tokens, icons, react, react-native, next 5개 패키지 구성',
      'React stories 31개와 플랫폼별 entrypoint 구성',
      'CI와 npm release workflow 준비',
    ],
  },
];

function listProjects(): string {
  const header = `{bold}{cyan}  PROJECTS{/cyan}{/bold}\n  {dim}─────────────────────────────────────────────────────{/dim}\n`;

  const rows = projects
    .map(
      (p, i) =>
        `  {green}${String(i + 1).padStart(2)}{/green}  {bold}${p.name}{/bold} ${'{dim}' + '—'.padEnd(3) + '{/dim}'} ${p.tech.join(', ')}  ${'{yellow}' + p.year + '{/yellow}'}`
    )
    .join('\n');

  const footer = `\n\n{dim}Type {bold}projects <name>{/bold} for details. e.g. {bold}projects study-admin{/bold}{/dim}`;

  return `${header}\n${rows}${footer}`;
}

function showProject(slug: string): string {
  const normalized = slug.toLowerCase();
  const project = projects.find(
    (p) => p.slug === normalized || p.name.toLowerCase().includes(normalized)
  );

  if (!project) {
    return `{red}Project not found:{/red} ${slug}\n\nType {bold}projects{/bold} to see all available projects.`;
  }

  const details = `
{bold}{cyan}  ${project.name}{/cyan}{/bold}  ${'{yellow}' + project.year + '{/yellow}'}  ${'{dim}' + project.tech.join(' · ') + '{/dim}'}
  {dim}─────────────────────────────────────────────────────{/dim}

  ${project.description}

  {bold}Highlights:{/bold}
${project.highlights.map((h) => `  {green}> {/green}${h}`).join('\n')}

  {bold}Tech Stack:{/bold}
${project.tech.map((t) => `  {cyan}[+]{/cyan} ${t}`).join('\n')}
`;

  return details.trim();
}

export const projectsHandler: CommandHandler = (ctx) => {
  if (ctx.args.length === 0) {
    return { output: listProjects() };
  }
  return { output: showProject(ctx.args[0]) };
};
