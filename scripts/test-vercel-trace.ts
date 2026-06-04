import assert from "node:assert/strict";
import fs from "node:fs";

const nextConfig = fs.readFileSync("next.config.ts", "utf-8");

assert(
  !nextConfig.includes("serverExternalPackages"),
  "client-only AI packages must not be traced into serverless functions"
);

if (fs.existsSync(".next/server/app/page.js.nft.json")) {
  const pageTrace = fs.readFileSync(".next/server/app/page.js.nft.json", "utf-8");
  assert(
    !pageTrace.includes("@huggingface/transformers/.cache"),
    "server page trace must not include HuggingFace model cache"
  );
}

console.log("Vercel trace config ok");
