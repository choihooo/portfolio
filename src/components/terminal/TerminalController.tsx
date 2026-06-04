"use client";

import {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type CommandMeta,
  getCommandMetadata,
  isKnownCommand,
  normalizeCommandName,
  resolveCommand,
} from "@/commands/registry";
import { askPortfolioStream } from "@/ai/ask-portfolio";
import type { SearchResult } from "@/ai/types";

type Message =
  | { id: string; type: "welcome" }
  | { id: string; type: "user"; content: string }
  | { id: string; type: "command"; command: string; output: string | ReactNode }
  | { id: string; type: "pending"; query: string; status: string }
  | {
      id: string;
      type: "answer";
      query: string;
      answer: string;
      sources: SearchResult[];
      mode: "llm" | "search-only";
      modelName?: string;
    }
  | { id: string; type: "error"; message: string };

const QUICK_PROMPTS = [
  "프론트엔드 최적화 경험이 있나요?",
  "가장 임팩트 있었던 프로젝트는?",
  "AI/RAG 관련 경험을 요약해줘",
];

const COLOR_MAP: Record<string, string> = {
  green: "var(--color-terminal-green)",
  yellow: "var(--color-terminal-yellow)",
  blue: "var(--color-terminal-blue)",
  red: "var(--color-terminal-red)",
  purple: "var(--color-terminal-purple)",
  cyan: "var(--color-terminal-cyan)",
  dim: "var(--color-terminal-dim)",
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function splitInput(input: string) {
  const slash = input.startsWith("/");
  const commandInput = slash ? input.slice(1).trim() : input.trim();
  const [rawName = "", ...args] = commandInput.split(/\s+/);

  return {
    slash,
    commandInput,
    rawName,
    commandName: normalizeCommandName(rawName),
    args,
  };
}

function completeSlashInput(input: string, commandName: string) {
  const [, rest = ""] = input.match(/^\/\S*\s*(.*)$/) ?? [];
  return rest ? `/${commandName} ${rest}` : `/${commandName} `;
}

function parseColoredText(text: string): ReactNode[] {
  const normalized = text.replaceAll("{br}", "\n");
  const parts: ReactNode[] = [];
  const regex = /\{\/?(green|yellow|blue|red|purple|cyan|dim|bold)\}/g;
  const linkRegex = /(https?:\/\/[^\s]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  const stack: string[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  const linkifyText = (value: string) => {
    const nodes: ReactNode[] = [];
    let linkLastIndex = 0;
    let linkMatch: RegExpExecArray | null;
    linkRegex.lastIndex = 0;

    while ((linkMatch = linkRegex.exec(value)) !== null) {
      if (linkMatch.index > linkLastIndex) {
        nodes.push(value.slice(linkLastIndex, linkMatch.index));
      }

      const href = linkMatch[0].startsWith("http")
        ? linkMatch[0]
        : `mailto:${linkMatch[0]}`;
      nodes.push(
        <a
          key={`link-${key++}`}
          className="command-link"
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          {linkMatch[0]}
        </a>
      );
      linkLastIndex = linkMatch.index + linkMatch[0].length;
    }

    if (linkLastIndex < value.length) {
      nodes.push(value.slice(linkLastIndex));
    }

    return nodes.length > 0 ? nodes : [value];
  };

  const pushText = (value: string) => {
    if (!value) return;

    const colorTag = [...stack].reverse().find((tag) => tag !== "bold");
    const style = {
      color: colorTag ? COLOR_MAP[colorTag] : undefined,
      fontWeight: stack.includes("bold") ? 700 : undefined,
    };

    if (style.color || style.fontWeight) {
      parts.push(
        <span key={key++} style={style}>
          {linkifyText(value)}
        </span>
      );
    } else {
      parts.push(...linkifyText(value));
    }
  };

  while ((match = regex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      pushText(normalized.slice(lastIndex, match.index));
    }

    const token = match[0];
    const tag = match[1];

    if (token.startsWith("{/")) {
      const index = stack.lastIndexOf(tag);
      if (index >= 0) {
        stack.splice(index, 1);
      }
    } else {
      stack.push(tag);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    pushText(normalized.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [normalized];
}

function CommandOutput({ output }: { output: string }) {
  const lines = output.split("\n");

  return (
    <pre className="command-output">
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {parseColoredText(line)}
          {index < lines.length - 1 ? "\n" : null}
        </span>
      ))}
    </pre>
  );
}

function SlashCommandMenu({
  items,
  selectedIndex,
  menuId,
  onSelect,
}: {
  items: CommandMeta[];
  selectedIndex: number;
  menuId: string;
  onSelect: (command: CommandMeta) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      id={menuId}
      className="app-command-menu"
      role="listbox"
      aria-label="Slash commands"
    >
      <div className="app-command-menu-header">commands</div>
      {items.map((command, index) => (
        <button
          type="button"
          key={command.name}
          id={`${menuId}-${command.name}`}
          className={
            index === selectedIndex
              ? "app-command-row app-command-row-selected"
              : "app-command-row"
          }
          role="option"
          aria-selected={index === selectedIndex}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() => onSelect(command)}
        >
          <span className="app-command-name">/{command.name}</span>
          <span className="app-command-description">{command.description}</span>
        </button>
      ))}
      <div className="app-command-menu-footer">tab to complete · enter to run</div>
    </div>
  );
}

type ModelPhase = "loading" | "ready" | "fallback";

function ModelStatusMessage({
  phase,
  status,
}: {
  phase: ModelPhase;
  status: string;
}) {
  const title =
    phase === "loading"
      ? "모델 로딩 중"
      : phase === "ready"
        ? "모델 로딩 완료"
        : "검색 모드 준비 완료";

  return (
    <article className="message message-assistant model-status-message">
      <div className="message-avatar">CH</div>
      <div className="message-body">
        <div className="model-loading-title">
          <span>{title}</span>
          {phase === "loading" ? (
            <span className="loading-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          ) : (
            <span className="model-ready-indicator" aria-hidden="true" />
          )}
        </div>
        <p className="muted-text">{status}</p>
      </div>
    </article>
  );
}

function MessageView({
  message,
  onQuickPrompt,
}: {
  message: Message;
  onQuickPrompt?: (prompt: string) => void;
}) {
  if (message.type === "welcome") {
    return (
      <article className="message message-assistant message-welcome">
        <div className="message-avatar">CH</div>
        <div className="message-body">
          <div className="message-heading">Choi Ho Portfolio</div>
          <p>
            프로젝트, 기술 스택, 경험을 대화형으로 탐색할 수 있습니다. 자연어로
            질문하거나 composer에서 <span className="inline-code">/</span>를 눌러
            명령을 선택하세요.
          </p>
          <div className="quick-prompt-grid">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="quick-prompt"
                onClick={() => onQuickPrompt?.(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (message.type === "user") {
    return (
      <article className="message message-user">
        <div className="message-avatar">YOU</div>
        <div className="message-body">
          <p>{message.content}</p>
        </div>
      </article>
    );
  }

  if (message.type === "command") {
    return (
      <article className="message message-assistant">
        <div className="message-avatar">CH</div>
        <div className="message-body">
          {typeof message.output === "string" ? (
            <CommandOutput output={message.output} />
          ) : (
            message.output
          )}
        </div>
      </article>
    );
  }

  if (message.type === "pending") {
    return (
      <article className="message message-assistant message-pending">
        <div className="message-avatar">CH</div>
        <div className="message-body">
          <p className="muted-text">{message.status}</p>
        </div>
      </article>
    );
  }

  if (message.type === "answer") {
    return (
      <article className="message message-assistant">
        <div className="message-avatar">CH</div>
        <div className="message-body">
          <p className="answer-text">{message.answer}</p>
          {message.sources.length > 0 ? (
            <div className="source-list">
              <div className="source-label">sources</div>
              {message.sources.map((source, index) => (
                <div key={source.chunk.id} className="source-row">
                  <span>[{index + 1}]</span>
                  <strong>{source.chunk.title}</strong>
                  <span>
                    {Math.round(source.score * 100)}% · {source.chunk.sourceType}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className="message message-error">
      <div className="message-avatar">ERR</div>
      <div className="message-body">
        <div className="message-heading">Error</div>
        <p>{message.message}</p>
      </div>
    </article>
  );
}

export default function TerminalController() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", type: "welcome" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [commandMenuDismissed, setCommandMenuDismissed] = useState(false);
  const [modelPhase] = useState<ModelPhase>("fallback");
  const [modelStatus] = useState(
    "검색 모드로 바로 질문할 수 있습니다. 로컬 AI는 가능할 때만 사용합니다."
  );
  const threadEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commandMetadata = useMemo(() => getCommandMetadata(), []);
  const commandMenuId = "slash-command-menu";

  const slashQuery = input.startsWith("/")
    ? input.slice(1).split(/\s+/)[0].toLowerCase()
    : "";
  const showCommandMenu = input.startsWith("/") && !busy && !commandMenuDismissed;
  const commandMenuItems = useMemo(() => {
    if (!showCommandMenu) return [];
    return commandMetadata
      .filter((command) => {
        if (!slashQuery) return true;
        return (
          command.name.includes(slashQuery) ||
          command.aliases.some((alias) => alias.includes(slashQuery))
        );
      })
      .slice(0, 8);
  }, [commandMetadata, showCommandMenu, slashQuery]);

  useEffect(() => {
    if (selectedCommandIndex >= commandMenuItems.length) {
      setSelectedCommandIndex(0);
    }
  }, [commandMenuItems.length, selectedCommandIndex]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, modelPhase, modelStatus]);

  useEffect(() => {
    if (busy) return;

    const frameId = window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [busy]);

  const append = (message: Message) => {
    setMessages((current) => [...current, message]);
  };

  const replaceMessage = (id: string, nextMessage: Message) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? nextMessage : message))
    );
  };

  const updateAnswerMessage = (
    id: string,
    updater: (message: Extract<Message, { type: "answer" }>) => Message
  ) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id && message.type === "answer"
          ? updater(message)
          : message
      )
    );
  };

  const runAiQuestion = async (query: string) => {
    const pendingId = createId("pending");
    const answerId = createId("answer");
    append({
      id: pendingId,
      type: "pending",
      query,
      status: "Searching portfolio index",
    });

    let answerStarted = false;

    try {
      const response = await askPortfolioStream(query, {
        onProgress: (status) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === pendingId && message.type === "pending"
                ? { ...message, status }
                : message
            )
          );
        },
        onToken: (token) => {
          if (!answerStarted) {
            answerStarted = true;
            replaceMessage(pendingId, {
              id: answerId,
              type: "answer",
              query,
              answer: "",
              sources: [],
              mode: "llm",
            });
          }

          updateAnswerMessage(answerId, (message) => ({
            ...message,
            answer: `${message.answer}${token}`,
          }));
        },
      });

      if (answerStarted) {
        updateAnswerMessage(answerId, (message) => ({
          ...message,
          answer: response.answer,
          sources: response.sources,
          mode: response.mode,
          modelName: response.modelName,
        }));
      } else {
        replaceMessage(pendingId, {
          id: answerId,
          type: "answer",
          query,
          answer: response.answer,
          sources: response.sources,
          mode: response.mode,
          modelName: response.modelName,
        });
      }
    } catch (err) {
      replaceMessage(answerStarted ? answerId : pendingId, {
        id: createId("error"),
        type: "error",
        message: err instanceof Error ? err.message : "알 수 없는 오류",
      });
    }
  };

  const runCommand = async (rawInput: string) => {
    const { slash, commandInput, rawName, commandName, args } = splitInput(rawInput);

    if (commandName === "clear") {
      setMessages([{ id: "welcome", type: "welcome" }]);
      return;
    }

    if (commandName === "ai") {
      const question = args.join(" ").trim();
      if (!question) {
        append({
          id: createId("command"),
          type: "command",
          command: "ai",
          output:
            "{yellow}사용법:{/yellow} {bold}/ai <질문>{/bold}\n\n예시:\n  /ai 프론트엔드 최적화 경험이 있나요?\n  /ai 가장 임팩트 있었던 프로젝트는?",
        });
        return;
      }
      await runAiQuestion(question);
      return;
    }

    const handler =
      slash && !isKnownCommand(commandName)
        ? resolveCommand(commandName)
        : resolveCommand(rawName);
    const result = await handler({
      args: slash && !isKnownCommand(commandName) ? [] : args,
      rawInput: commandInput,
    });

    if (result.clear) {
      setMessages([{ id: "welcome", type: "welcome" }]);
      return;
    }

    append({
      id: createId("command"),
      type: "command",
      command: commandName,
      output: result.reactNode ?? result.output ?? "",
    });
  };

  const selectCommand = (command: CommandMeta) => {
    setInput(completeSlashInput(input, command.name));
    setCommandMenuDismissed(true);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const submitValue = async (rawValue: string) => {
    if (busy) return;

    const value = rawValue.trim();
    if (!value) return;

    setInput("");
    setSelectedCommandIndex(0);
    setCommandMenuDismissed(false);
    append({ id: createId("user"), type: "user", content: value });
    setBusy(true);

    try {
      const { commandName } = splitInput(value);
      const shouldRunCommand = value.startsWith("/") || isKnownCommand(commandName);
      if (shouldRunCommand) {
        await runCommand(value);
      } else {
        await runAiQuestion(value);
      }
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    await submitValue(input);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandMenu && commandMenuItems.length > 0) {
      if (event.key === "Escape") {
        event.preventDefault();
        setCommandMenuDismissed(true);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedCommandIndex((current) =>
          current >= commandMenuItems.length - 1 ? 0 : current + 1
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedCommandIndex((current) =>
          current <= 0 ? commandMenuItems.length - 1 : current - 1
        );
        return;
      }

      if (event.key === "Tab" && !event.shiftKey) {
        event.preventDefault();
        const selected = commandMenuItems[selectedCommandIndex];
        if (selected) {
          setInput(completeSlashInput(input, selected.name));
        }
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  const welcomeMessages = messages.filter((message) => message.type === "welcome");
  const chatMessages = messages.filter((message) => message.type !== "welcome");
  const activeCommand = commandMenuItems[selectedCommandIndex];
  const activeCommandId =
    showCommandMenu && activeCommand ? `${commandMenuId}-${activeCommand.name}` : undefined;

  return (
    <div className="codex-app">
      <main className="codex-main">
        <header className="codex-header">
          <div>
            <div className="codex-kicker">choiho.dev</div>
            <h1>Portfolio chat</h1>
          </div>
        </header>

        <section
          className="codex-thread"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {welcomeMessages.map((message) => (
            <MessageView
              key={message.id}
              message={message}
              onQuickPrompt={submitValue}
            />
          ))}
          {chatMessages.length === 0 ? (
            <ModelStatusMessage phase={modelPhase} status={modelStatus} />
          ) : null}
          {chatMessages.map((message) => (
            <MessageView key={message.id} message={message} />
          ))}
          <div ref={threadEndRef} />
        </section>

        <form className="codex-composer-shell" onSubmit={handleSubmit}>
          <div className="composer-wrap">
            <SlashCommandMenu
              items={commandMenuItems}
              selectedIndex={selectedCommandIndex}
              menuId={commandMenuId}
              onSelect={selectCommand}
            />
            <div className="codex-composer">
              <textarea
                ref={textareaRef}
                value={input}
                disabled={busy}
                onChange={(event) => {
                  setInput(event.target.value);
                  setSelectedCommandIndex(0);
                  setCommandMenuDismissed(false);
                }}
                onKeyDown={handleKeyDown}
                aria-label="Message Choi Ho Portfolio"
                aria-controls={showCommandMenu ? commandMenuId : undefined}
                aria-expanded={showCommandMenu}
                aria-activedescendant={activeCommandId}
                aria-autocomplete="list"
                aria-busy={busy}
                autoComplete="off"
                name="message"
                role="combobox"
                placeholder="Message Choi Ho Portfolio"
                rows={1}
              />
              <button type="submit" disabled={busy || input.trim().length === 0}>
                Send
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
