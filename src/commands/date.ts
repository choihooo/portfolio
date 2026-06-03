import type { CommandHandler } from './types';

export const date: CommandHandler = () => {
  const now = new Date();
  const formatted = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  return {
    output: `{cyan}${formatted}{/cyan}`,
  };
};
