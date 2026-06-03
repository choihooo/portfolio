import type { CommandHandler } from './types';

export const contact: CommandHandler = () => {
  const output = `
{bold}{cyan}  CONTACT{/cyan}{/bold}
  {dim}─────────────────────────────────────────────────────{/dim}

  {green}> {/green}{bold}Email{/bold}
    hochoi8621@gmail.com

  {green}> {/green}{bold}GitHub{/bold}
    https://github.com/choihooo

  {green}> {/green}{bold}Blog{/bold}
    https://blog.hozorica.com

  {green}> {/green}{bold}LinkedIn{/bold}
    https://www.linkedin.com/in/howuchoi/

  {dim}─────────────────────────────────────────────────────{/dim}
  {dim}프로젝트 협업, 기술 논의, 포트폴리오 관련 문의는 언제든 환영합니다.{/dim}
`;

  return { output: output.trim(), isHtml: false };
};
