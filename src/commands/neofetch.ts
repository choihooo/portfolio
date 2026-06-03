import type { CommandHandler } from './types';

export const neofetch: CommandHandler = () => {
  const logo = `
{cyan}       ╭──────────╮{/cyan}
{cyan}       │ ▄▄▄▄▄▄▄ │{/cyan}
{cyan}       │ █      █ │{/cyan}
{cyan}       │ █  ◈   █ │{/cyan}
{cyan}       │ █      █ │{/cyan}
{cyan}       │ █▄▄▄▄▄▄█ │{/cyan}
{cyan}       │ ▀▀▀▀▀▀▀ │{/cyan}
{cyan}       ╰──────────╯{/cyan}
{cyan}        ╱ CHOI HO ╲{/cyan}
{cyan}       ╱  PORTFOLIO ╲{/cyan}
{cyan}      ╰──────────────╯{/cyan}`;

  const info = `
{bold}  OS:{/bold}          Web
{bold}  Host:{/bold}        Portfolio
{bold}  Kernel:{/bold}      Next.js 16
{bold}  Shell:{/bold}       Portfolio TUI
{bold}  Resolution:{/bold}  Responsive
{bold}  Theme:{/bold}      Dark
{bold}  Terminal:{/bold}    Custom React shell
{bold}  Language:{/bold}    TypeScript / Korean / English

{bold}  Uptime:{/bold}      Since 2019
{bold}  Packages:{/bold}    3 projects shipped
{bold}  CPU:{/bold}         Caffeine-fueled brain @ 3.2GHz
{bold}  Memory:{/bold}      128MB / ∞GB (still learning)

{green}  ■■■■■■■■■■{/green}{yellow}■■■■■{/yellow}{red}■■■{/red}{dim}■{/dim}`;

  return {
    output: `${logo}\n${info}`,
  };
};
