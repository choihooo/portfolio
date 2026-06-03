export interface CommandContext {
  args: string[];
  rawInput: string;
}

export interface CommandResult {
  output?: string;
  reactNode?: React.ReactNode;
  isHtml?: boolean;
  clear?: boolean;
}

export interface AiCommandResult extends CommandResult {
  reactNode: React.ReactNode;
}

export type CommandHandler = (
  ctx: CommandContext
) => Promise<CommandResult> | CommandResult;
