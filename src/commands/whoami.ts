import type { CommandHandler } from './types';

export const whoami: CommandHandler = () => {
  return {
    output: `{green}visitor{/green}\n\n{dim}Welcome, traveler. You've stumbled upon Choi Ho's portfolio.{/dim}\n{dim}Feel free to explore — type {bold}help{/bold} to get started.{/dim}`,
  };
};
