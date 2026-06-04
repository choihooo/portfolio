import assert from "node:assert/strict";
import fs from "node:fs";

type PackageJson = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  engines?: Record<string, string>;
  overrides?: Record<string, string>;
};

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8")) as PackageJson;

assert(pkg.scripts?.build?.includes("rag:build"), "production build must regenerate RAG index");
assert.equal(pkg.dependencies?.react, "19.2.4", "react must use patched 19.2.4");
assert.equal(pkg.dependencies?.["react-dom"], "19.2.4", "react-dom must use patched 19.2.4");
assert(pkg.engines?.node, "package.json must declare a Node engine");
assert.equal(pkg.overrides?.postcss, "^8.5.15", "transitive postcss must be patched");

console.log("Package config ok");
