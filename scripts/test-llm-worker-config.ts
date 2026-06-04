import assert from "node:assert/strict";
import fs from "node:fs";

const workerSource = fs.readFileSync("src/ai/llm-worker.ts", "utf-8");
const managerSource = fs.readFileSync("src/ai/llm.ts", "utf-8");
const tokenConstant = workerSource.match(/COMPLETION_MAX_TOKENS\s*=\s*(\d+)/);
const timeoutConstant = managerSource.match(/GENERATION_TIMEOUT_MS\s*=\s*(\d[\d_]*)/);
assert(tokenConstant, "worker must define COMPLETION_MAX_TOKENS");
assert(timeoutConstant, "LLM manager must define GENERATION_TIMEOUT_MS");
const maxTokens = Number(tokenConstant[1]);
const timeoutMs = Number(timeoutConstant[1].replaceAll("_", ""));
const tokenUsages = [...workerSource.matchAll(/max_tokens:\s*COMPLETION_MAX_TOKENS/g)];

assert(tokenUsages.length >= 2, "worker must configure max_tokens for both generation paths");
assert(
  maxTokens >= 1024,
  `max_tokens should be high enough to avoid short portfolio answers being cut off: ${maxTokens}`
);
assert(
  timeoutMs >= 120_000,
  `generation timeout should allow 1024 local tokens on slower devices: ${timeoutMs}`
);

assert(
  workerSource.includes('finishReason !== "length"'),
  "worker must detect finish_reason length truncation"
);
assert(
  workerSource.includes("토큰 한도"),
  "worker must tell the user when an answer was truncated by token limit"
);

console.log("LLM worker config ok");
