import type { CommandHandler } from './types';

export const help: CommandHandler = () => {
  const output = `
{bold}Available commands{/bold}

{bold}Navigation{/bold}
{green}/about{/green}       Who is Choi Ho?
{green}/projects{/green}    View portfolio projects
{green}/skills{/green}      Technical skills and proficiency
{green}/experience{/green}  Work experience timeline
{green}/contact{/green}     Get in touch

{bold}AI{/bold}
{green}/ai{/green}          Ask the portfolio AI anything

{bold}System{/bold}
{green}/help{/green}        Show this help message
{green}/clear{/green}       Clear this chat
{green}/date{/green}        Current date and time

{dim}Tip: You can type / to open the command menu below the chat.{/dim}
`;

  return { output: output.trim() };
};
