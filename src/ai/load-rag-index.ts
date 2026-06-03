import type { RagChunk, RagIndex } from "./types";
import {
  getCachedVersion,
  setCachedVersion,
  storeChunks,
  getAllChunks,
} from "./rag-db";

let cachedChunks: RagChunk[] | null = null;

export async function loadRagIndex(): Promise<RagChunk[]> {
  if (cachedChunks) return cachedChunks;

  try {
    const response = await fetch("/rag/index.v1.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch RAG index: ${response.status}`);
    }

    const index: RagIndex = await response.json();

    // Validate basic shape
    if (!index.version || !Array.isArray(index.chunks)) {
      throw new Error("Invalid RAG index format");
    }

    validateRagIndex(index);

    try {
      const cachedVersion = await getCachedVersion();

      if (cachedVersion === index.version) {
        const chunks = await getAllChunks();
        if (chunks.length === index.chunks.length) {
          cachedChunks = chunks;
          return cachedChunks;
        }
      }
    } catch (error) {
      console.warn("RAG IndexedDB cache read failed, using fetched index:", error);
    }

    try {
      await storeChunks(index.chunks);
      await setCachedVersion(index.version);
    } catch (error) {
      console.warn("RAG IndexedDB cache write failed, using memory cache:", error);
    }

    cachedChunks = index.chunks;
    return cachedChunks;
  } catch (err) {
    console.error("Failed to load RAG index:", err);
    throw err;
  }
}

function validateRagIndex(index: RagIndex): void {
  if (!index.version || !Array.isArray(index.chunks)) {
    throw new Error("Invalid RAG index format");
  }

  if (!index.embeddingDims || index.embeddingDims <= 0) {
    throw new Error("Invalid RAG embedding dimensions");
  }

  for (const chunk of index.chunks) {
    if (
      !chunk.id ||
      !chunk.docId ||
      !chunk.text ||
      !Array.isArray(chunk.embedding) ||
      chunk.embedding.length !== index.embeddingDims ||
      chunk.embedding.some((value) => !Number.isFinite(value))
    ) {
      throw new Error(`Invalid RAG chunk: ${chunk.id || "unknown"}`);
    }
  }
}
