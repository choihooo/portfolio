import type { CommandHandler } from './types';

export const unknown: CommandHandler = (ctx) => {
  const cmd = ctx.rawInput.trim().split(/\s+/)[0];
  return {
    output: `{red}command not found:{/red} ${cmd}\n\nType {bold}help{/bold} to see available commands.`,
  };
};
