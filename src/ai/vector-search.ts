import type { RagChunk, SearchResult } from "./types";

function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    return Number.NEGATIVE_INFINITY;
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[i])) {
      return Number.NEGATIVE_INFINITY;
    }
    sum += a[i] * b[i];
  }
  return sum;
}

export function searchChunks(
  queryEmbedding: number[],
  chunks: RagChunk[],
  topK = 5
): SearchResult[] {
  const scored: SearchResult[] = chunks.map((chunk) => ({
    chunk,
    score: dotProduct(queryEmbedding, chunk.embedding),
  })).filter((result) => Number.isFinite(result.score));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
