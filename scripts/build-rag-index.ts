import fs from "fs";
import path from "path";
import fg from "fast-glob";
import matter from "gray-matter";
import { createHash } from "crypto";

interface ChunkInput {
  docId: string;
  chunkNo: number;
  title: string;
  sourceType: string;
  tags: string[];
  sourcePath: string;
  headingPath: string[];
  slug?: string;
  year?: number;
  status?: string;
  github?: string;
  url?: string;
  text: string;
}

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
  year?: number;
  status?: string;
  github?: string;
  url?: string;
  text: string;
  embedding: number[];
}

interface RagIndex {
  version: string;
  embeddingModel: string;
  embeddingDims: number;
  chunkerVersion: string;
  createdAt: string;
  chunks: RagChunk[];
}

const EMBEDDING_MODEL = "Xenova/multilingual-e5-small";
const CHUNKER_VERSION = "1.1.0";
const CHUNK_TARGET_MIN = 200;
const CHUNK_TARGET_MAX = 500;
const OUTPUT_DIR = "public/rag";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.v1.json");

interface TextChunk {
  text: string;
  headingPath: string[];
}

function getVersionHashPayload(chunks: RagChunk[]) {
  return chunks.map((chunk) => ({
    id: chunk.id,
    docId: chunk.docId,
    chunkNo: chunk.chunkNo,
    title: chunk.title,
    sourceType: chunk.sourceType,
    tags: chunk.tags,
    sourcePath: chunk.sourcePath,
    headingPath: chunk.headingPath,
    slug: chunk.slug,
    year: chunk.year,
    status: chunk.status,
    github: chunk.github,
    url: chunk.url,
    text: chunk.text,
  }));
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getHeadingText(line: string): string {
  return line.replace(/^#{1,6}\s*/, "").trim();
}

function splitBlocks(section: string): string[] {
  return section
    .split(/\n{2,}/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .trim()
    )
    .filter(Boolean);
}

function splitLargeBlock(block: string): string[] {
  if (block.length <= CHUNK_TARGET_MAX) return [block];

  const lines = block.split("\n").filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const line of lines) {
    if (current && current.length + line.length + 1 > CHUNK_TARGET_MAX) {
      chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? "\n" : "") + line;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function appendChunk(chunks: TextChunk[], next: TextChunk): void {
  const trimmed = next.text.trim();
  if (!trimmed) return;

  if (chunks.length > 0 && trimmed.length < CHUNK_TARGET_MIN) {
    const previous = chunks[chunks.length - 1];
    if (previous.text.length + trimmed.length + 2 <= CHUNK_TARGET_MAX + CHUNK_TARGET_MIN) {
      previous.text = `${previous.text}\n\n${trimmed}`;
      return;
    }
  }

  chunks.push({ ...next, text: trimmed });
}

function mergeTinyChunks(chunks: TextChunk[]): TextChunk[] {
  const merged: TextChunk[] = [];

  for (const chunk of chunks) {
    if (chunk.text.length < CHUNK_TARGET_MIN && merged.length > 0) {
      const previous = merged[merged.length - 1];
      previous.text = `${previous.text}\n\n${chunk.text}`;
    } else {
      merged.push({ ...chunk });
    }
  }

  if (merged.length > 1 && merged[0].text.length < CHUNK_TARGET_MIN) {
    const [first, second, ...rest] = merged;
    return [
      {
        ...second,
        headingPath: first.headingPath.length ? first.headingPath : second.headingPath,
        text: `${first.text}\n\n${second.text}`,
      },
      ...rest,
    ];
  }

  return merged;
}

function chunkText(text: string): TextChunk[] {
  const chunks: TextChunk[] = [];
  const sections = text.split(/(?=^#{1,3}\s)/m).filter((section) => section.trim());

  for (const section of sections) {
    const firstLine = section.trim().split("\n")[0] ?? "";
    const headingPath = /^#{1,3}\s/.test(firstLine) ? [getHeadingText(firstLine)] : [];
    const blocks = splitBlocks(section).flatMap(splitLargeBlock);
    let current = "";

    for (const block of blocks) {
      if (current && current.length + block.length + 2 > CHUNK_TARGET_MAX) {
        appendChunk(chunks, { text: current, headingPath });
        current = block;
      } else {
        current += (current ? "\n\n" : "") + block;
      }
    }

    appendChunk(chunks, { text: current, headingPath });
  }

  return mergeTinyChunks(chunks);
}

async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  console.log(`Loading embedding model: ${EMBEDDING_MODEL}...`);

  // Dynamic import for Node.js compatibility
  const { pipeline } = await import("@huggingface/transformers");
  const embedder = await pipeline("feature-extraction", EMBEDDING_MODEL, {
    dtype: "fp32",
  });

  console.log(`Generating embeddings for ${texts.length} chunks...`);
  const embeddings: number[][] = [];

  // Process in batches of 8
  const BATCH_SIZE = 8;
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const prefixed = batch.map((t) => `passage: ${t}`);

    const output = await embedder(prefixed, {
      pooling: "mean",
      normalize: true,
    });

    // output.data is Float32Array, dims = output.dims[1]
    const dims = output.dims[1];
    for (let j = 0; j < batch.length; j++) {
      const start = j * dims;
      const embedding = Array.from(output.data.slice(start, start + dims));
      embeddings.push(embedding);
    }

    console.log(`  Embedded ${Math.min(i + BATCH_SIZE, texts.length)}/${texts.length}`);
  }

  return embeddings;
}

async function main() {
  console.log("=== Building RAG Index ===\n");

  // 1. Find all markdown files
  const contentDir = path.resolve("content");
  const files = await fg("**/*.md", { cwd: contentDir, absolute: true });
  console.log(`Found ${files.length} content files:\n${files.map((f) => `  - ${path.relative(contentDir, f)}`).join("\n")}\n`);

  // 2. Parse and chunk
  const allChunkInputs: ChunkInput[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data: frontmatter, content } = matter(raw);

    const docId =
      frontmatter.id ?? path.relative(contentDir, file).replace(/\.md$/, "");
    const title = frontmatter.title ?? docId;
    const sourceType = frontmatter.sourceType ?? "about";
    const tags: string[] = frontmatter.tags ?? [];
    const relativePath = path.relative(contentDir, file);
    const url = normalizeOptionalString(frontmatter.url);
    const github = normalizeOptionalString(frontmatter.github);
    const slug = normalizeOptionalString(frontmatter.slug);
    const status = normalizeOptionalString(frontmatter.status);
    const year = normalizeOptionalNumber(frontmatter.year);

    const chunks = chunkText(content);

    for (let i = 0; i < chunks.length; i++) {
      allChunkInputs.push({
        docId,
        chunkNo: i,
        title,
        sourceType,
        tags,
        sourcePath: relativePath,
        headingPath: chunks[i].headingPath,
        slug,
        year,
        status,
        github,
        url,
        text: chunks[i].text,
      });
    }
  }

  console.log(`Total chunks: ${allChunkInputs.length}\n`);

  if (allChunkInputs.length === 0) {
    console.warn("No chunks generated. Check content files.");
    process.exit(1);
  }

  // 3. Generate embeddings
  const texts = allChunkInputs.map((c) => c.text);
  const embeddings = await generateEmbeddings(texts);

  // 4. Build index
  const chunks: RagChunk[] = allChunkInputs.map((input, i) => ({
    id: `${input.docId}-${input.chunkNo}`,
    docId: input.docId,
    chunkNo: input.chunkNo,
    title: input.title,
    sourceType: input.sourceType,
    tags: input.tags,
    sourcePath: input.sourcePath,
    headingPath: input.headingPath,
    slug: input.slug,
    year: input.year,
    status: input.status,
    github: input.github,
    url: input.url,
    text: input.text,
    embedding: embeddings[i],
  }));

  // 5. Version hash
  const contentHash = createHash("md5")
    .update(
      JSON.stringify({
        embeddingModel: EMBEDDING_MODEL,
        chunkerVersion: CHUNKER_VERSION,
        chunks: getVersionHashPayload(chunks),
      })
    )
    .digest("hex")
    .slice(0, 8);

  const version = `v1-${contentHash}-${CHUNKER_VERSION}`;

  const index: RagIndex = {
    version,
    embeddingModel: EMBEDDING_MODEL,
    embeddingDims: embeddings[0]?.length ?? 384,
    chunkerVersion: CHUNKER_VERSION,
    createdAt: "1970-01-01T00:00:00.000Z",
    chunks,
  };

  // 6. Write output
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));
  const sizeMB = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);

  console.log(`\n=== RAG Index Built ===`);
  console.log(`  Version:    ${version}`);
  console.log(`  Chunks:     ${chunks.length}`);
  console.log(`  Dimensions: ${index.embeddingDims}`);
  console.log(`  Output:     ${OUTPUT_FILE} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
