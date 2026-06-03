import type { CommandHandler } from './types';

interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    category: 'Frontend Core',
    skills: [
      { name: 'TypeScript', level: 95 },
      { name: 'JavaScript', level: 95 },
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'HTML/CSS', level: 90 },
    ],
  },
  {
    category: 'Product Surfaces',
    skills: [
      { name: 'Admin systems', level: 90 },
      { name: 'Design systems', level: 88 },
      { name: 'Electron apps', level: 78 },
      { name: 'React Native', level: 72 },
    ],
  },
  {
    category: 'AI Product Work',
    skills: [
      { name: 'RAG UX', level: 86 },
      { name: 'Vector search', level: 82 },
      { name: 'Agent workflows', level: 78 },
      { name: 'Node.js', level: 80 },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Storybook', level: 88 },
      { name: 'Figma', level: 80 },
      { name: 'GitHub Actions', level: 78 },
    ],
  },
  {
    category: 'Practices',
    skills: [
      { name: 'i18n workflows', level: 88 },
      { name: 'Performance Optimization', level: 90 },
      { name: 'Testing (Vitest)', level: 82 },
      { name: 'Accessibility', level: 85 },
    ],
  },
];

function renderBar(level: number, width: number = 20): string {
  const filled = Math.round((level / 100) * width);
  const partial = (level / 100) * width - filled;
  const empty = width - filled - (partial > 0.5 ? 1 : 0);

  const bar =
    '█'.repeat(filled) +
    (partial > 0.5 ? '▓' : '') +
    '░'.repeat(Math.max(0, empty));

  if (level >= 85) return `{green}${bar}{/green}`;
  if (level >= 70) return `{yellow}${bar}{/yellow}`;
  return `{cyan}${bar}{/cyan}`;
}

export const skills: CommandHandler = () => {
  const header = `
{bold}{cyan}  SKILLS & PROFICIENCY{/cyan}{/bold}
  {dim}─────────────────────────────────────────────────────────────{/dim}
`;

  const categories = skillCategories
    .map((cat) => {
      const skillLines = cat.skills
        .map((s) => {
          const name = s.name.padEnd(22);
          const bar = renderBar(s.level);
          const pct = String(s.level).padStart(3) + '%';
          return `    ${name} ${bar} {dim}${pct}{/dim}`;
        })
        .join('\n');

      return `\n  {bold}{yellow}${cat.category}{/yellow}{/bold}\n${skillLines}`;
    })
    .join('\n');

  return {
    output: `${header}\n${categories}\n`,
  };
};
