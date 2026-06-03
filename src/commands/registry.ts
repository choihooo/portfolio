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

const metadata: CommandMeta[] = [
  {
    name: 'about',
    aliases: ['cat'],
    description: 'Who is Choi Ho?',
    group: 'portfolio',
    examples: ['/about'],
  },
  {
    name: 'projects',
    aliases: ['ls'],
    description: 'View portfolio projects',
    group: 'portfolio',
    examples: ['/projects', '/projects commerce-rebuild'],
  },
  {
    name: 'skills',
    aliases: [],
    description: 'Technical skills and proficiency',
    group: 'portfolio',
    examples: ['/skills'],
  },
  {
    name: 'experience',
    aliases: [],
    description: 'Work experience timeline',
    group: 'portfolio',
    examples: ['/experience'],
  },
  {
    name: 'contact',
    aliases: [],
    description: 'Contact links',
    group: 'portfolio',
    examples: ['/contact'],
  },
  {
    name: 'ai',
    aliases: [],
    description: 'Ask the portfolio AI anything',
    group: 'ai',
    examples: ['/ai 프론트엔드 최적화 경험이 있나요?'],
  },
  {
    name: 'help',
    aliases: ['?'],
    description: 'Show available commands',
    group: 'system',
    examples: ['/help'],
  },
  {
    name: 'clear',
    aliases: [],
    description: 'Clear the transcript',
    group: 'system',
    examples: ['/clear'],
  },
  {
    name: 'neofetch',
    aliases: [],
    description: 'Portfolio system info',
    group: 'system',
    examples: ['/neofetch'],
  },
  {
    name: 'date',
    aliases: [],
    description: 'Current date and time',
    group: 'system',
    examples: ['/date'],
  },
  {
    name: 'whoami',
    aliases: [],
    description: 'Identify the visitor',
    group: 'system',
    examples: ['/whoami'],
  },
];

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
  return metadata;
}

export function isKnownCommand(input: string): boolean {
  return normalizeCommandName(input) in commands;
}
