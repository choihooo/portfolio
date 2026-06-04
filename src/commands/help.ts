import type { CommandHandler } from './types';
import { commandMetadata } from './metadata';

const groupLabels = {
  portfolio: "Portfolio",
  ai: "AI",
  system: "System",
} as const;

export const help: CommandHandler = () => {
  const groups = commandMetadata.reduce<Record<string, typeof commandMetadata>>(
    (acc, command) => {
      acc[command.group] ??= [];
      acc[command.group].push(command);
      return acc;
    },
    {}
  );

  const sections = (["portfolio", "ai", "system"] as const)
    .map((group) => {
      const commands = groups[group] ?? [];
      const rows = commands
        .map((command) => {
          const aliases = command.aliases.length
            ? ` {dim}(${command.aliases.map((alias) => `/${alias}`).join(", ")}){/dim}`
            : "";
          return `{green}/${command.name.padEnd(11)}{/green}${aliases} ${command.description}`;
        })
        .join("\n");

      return `{bold}${groupLabels[group]}{/bold}\n${rows}`;
    })
    .join("\n\n");

  const output = `{bold}Available commands{/bold}\n\n${sections}\n\n{dim}Tip: Type / to open the command menu. Tab completes a selected command; Enter runs exactly what you typed.{/dim}`;

  return { output: output.trim() };
};
