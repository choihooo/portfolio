// Shared types for RAG system

export interface RagChunk {
  id: string;
  docId: string;
  chunkNo: number;
  title: string;
  sourceType: "resume" | "project" | "blog" | "about";
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

export interface RagIndex {
  version: string;
  embeddingModel: string;
  embeddingDims: number;
  chunkerVersion: string;
  createdAt: string;
  chunks: RagChunk[];
}

export interface SearchResult {
  chunk: RagChunk;
  score: number;
}

export interface AiResponse {
  answer: string;
  sources: SearchResult[];
  mode: "llm" | "search-only";
  modelName?: string;
}
