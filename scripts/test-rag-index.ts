import fs from "fs";
import path from "path";

interface RagChunk {
  id: string;
  docId: string;
  chunkNo: number;
  title: string;
  sourceType: string;
  tags: string[];
  sourcePath?: string;
  headingPath?: string[];
  slug?: string;
  text: string;
  embedding: number[];
}

interface RagIndex {
  version: string;
  embeddingModel: string;
  embeddingDims: number;
  chunkerVersion: string;
  chunks: RagChunk[];
}

const INDEX_FILE = path.resolve("public/rag/index.v1.json");
const REQUIRED_DOCS = new Set([
  "about",
  "contact",
  "experience",
  "skills",
  "ai-knowledge",
  "project-study-admin-recommendation",
  "project-bugi-download",
  "project-hods-design-system",
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  assert(fs.existsSync(INDEX_FILE), `RAG index not found: ${INDEX_FILE}`);

  const index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8")) as RagIndex;
  assert(index.version.startsWith("v1-"), "index version must start with v1-");
  assert(index.embeddingModel === "Xenova/multilingual-e5-small", "unexpected embedding model");
  assert(index.embeddingDims === 384, "unexpected embedding dimensions");
  assert(index.chunkerVersion === "1.1.0", "unexpected chunker version");
  assert(Array.isArray(index.chunks) && index.chunks.length >= 20, "too few RAG chunks");

  const ids = new Set<string>();
  const docIds = new Set<string>();

  for (const chunk of index.chunks) {
    assert(chunk.id && !ids.has(chunk.id), `duplicate or missing chunk id: ${chunk.id}`);
    ids.add(chunk.id);
    docIds.add(chunk.docId);

    assert(Number.isInteger(chunk.chunkNo) && chunk.chunkNo >= 0, `invalid chunkNo: ${chunk.id}`);
    assert(chunk.title.trim().length > 0, `missing title: ${chunk.id}`);
    assert(chunk.sourceType.trim().length > 0, `missing sourceType: ${chunk.id}`);
    assert(Array.isArray(chunk.tags), `tags must be an array: ${chunk.id}`);
    assert(chunk.sourcePath?.endsWith(".md"), `missing sourcePath metadata: ${chunk.id}`);
    assert(chunk.text.trim().length >= 120, `chunk is too short: ${chunk.id}`);
    assert(!/\bTODO\b|placeholder|Coming soon/i.test(chunk.text), `placeholder text found: ${chunk.id}`);
    assert(Array.isArray(chunk.embedding), `missing embedding: ${chunk.id}`);
    assert(chunk.embedding.length === index.embeddingDims, `embedding dimension mismatch: ${chunk.id}`);
    assert(chunk.embedding.every(Number.isFinite), `non-finite embedding value: ${chunk.id}`);
  }

  for (const requiredDoc of REQUIRED_DOCS) {
    assert(docIds.has(requiredDoc), `required doc missing from index: ${requiredDoc}`);
  }

  const projectChunks = index.chunks.filter((chunk) => chunk.sourceType === "project");
  assert(projectChunks.length >= 6, "expected multiple project chunks");
  assert(
    projectChunks.some((chunk) => chunk.slug === "study-admin-recommendation"),
    "study-admin project slug missing"
  );
  assert(
    projectChunks.some((chunk) => chunk.slug === "bugi-download"),
    "bugi-download project slug missing"
  );

  console.log(`RAG index ok: ${index.chunks.length} chunks, ${docIds.size} docs, ${index.version}`);
}

main();
