import type { CommandHandler } from './types';
import { help } from './help';
import { about } from './about';
import { projectsHandler } from './projects';
import { skills } from './skills';
import { experience } from './experience';
import { contact } from './contact';
import { clear } from './clear';
import { ai } from './ai';
import { neofetch } from './neofetch';
import { date } from './date';
import { whoami } from './whoami';
import { unknown } from './unknown';
import { commandMetadata } from './metadata';

export type CommandGroup = 'portfolio' | 'ai' | 'system';

export interface CommandMeta {
  name: string;
  aliases: string[];
  description: string;
  group: CommandGroup;
  examples?: string[];
}

const commands: Record<string, CommandHandler> = {
  help,
  about,
  projects: projectsHandler,
  skills,
  experience,
  contact,
  clear,
  ai,
  neofetch,
  date,
  whoami,
};

const aliases: Record<string, string> = {
  ls: 'projects',
  cat: 'about',
  '?': 'help',
};

export function normalizeCommandName(input: string): string {
  const normalizedInput = input.trim().toLowerCase();
  return aliases[normalizedInput] ?? normalizedInput;
}

export function resolveCommand(input: string): CommandHandler {
  const commandName = normalizeCommandName(input);
  return commands[commandName] ?? unknown;
}

export function getCommandNames(): string[] {
  return Object.keys(commands).sort();
}

export function getCommandMetadata(): CommandMeta[] {
  return commandMetadata;
}

export function isKnownCommand(input: string): boolean {
  return normalizeCommandName(input) in commands;
}
