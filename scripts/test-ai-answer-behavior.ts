import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("src/ai/ask-portfolio.ts", "utf-8");

assert(
  !source.includes("slice(0, 150)"),
  "search-only fallback must not hard-cut answers at 150 characters"
);
assert(
  source.includes("buildContextPreview"),
  "search-only fallback should use sentence-aware preview text"
);

console.log("AI answer behavior ok");
