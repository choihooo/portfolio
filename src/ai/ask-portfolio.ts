import { loadRagIndex } from "./load-rag-index";
import { embedQuery, preloadEmbedder } from "./embed";
import { searchChunks } from "./vector-search";
import { getLlmManager } from "./llm";
import type { AiResponse, RagChunk, SearchResult } from "./types";

let chunks: RagChunk[] | null = null;
let llmInitialized = false;
let llmAvailable = false;
let llmInitPromise: Promise<boolean> | null = null;
const MIN_RELEVANCE_SCORE = 0.82;

async function ensureLlmReady(
  onProgress?: (status: string) => void
): Promise<boolean> {
  const manager = getLlmManager();

  if (llmAvailable && manager.isReady()) {
    return true;
  }

  if (llmInitialized && !llmInitPromise) {
    return false;
  }

  if (!llmInitPromise) {
    llmInitialized = true;
    llmInitPromise = (async () => {
      onProgress?.("WebGPU 확인 중...");
      const hasGpu = await manager.detectWebGpu();

      if (!hasGpu) {
        return false;
      }

      manager.onProgress((_, text) => {
        onProgress?.(text);
      });
      onProgress?.("AI 모델 로딩 중... (최초 1회, 시간이 걸릴 수 있습니다)");
      return manager.init();
    })();
  }

  llmAvailable = await llmInitPromise;
  llmInitPromise = null;
  return llmAvailable;
}

export async function preloadPortfolioModel(
  onProgress?: (status: string) => void
): Promise<boolean> {
  onProgress?.("RAG 인덱스 로딩 중...");
  if (!chunks) {
    chunks = await loadRagIndex();
  }

  onProgress?.("Embedding 모델 로딩/워밍업 중...");
  await preloadEmbedder();

  return ensureLlmReady(onProgress);
}

export async function askPortfolio(
  question: string,
  onProgress?: (status: string) => void
): Promise<AiResponse> {
  // 1. Load index
  onProgress?.("인덱스 로딩 중...");
  if (!chunks) {
    chunks = await loadRagIndex();
  }

  // 2. Embed query
  onProgress?.("질문 분석 중...");
  const queryEmbedding = await embedQuery(question);

  // 3. Search
  onProgress?.("관련 문서 검색 중...");
  const results = filterRelevantResults(rankResultsForQuestion(
    question,
    searchChunks(queryEmbedding, chunks, 12)
  )).slice(0, 5);

  if (results.length === 0) {
    return {
      answer: "관련된 포트폴리오 데이터를 찾을 수 없습니다.",
      sources: [],
      mode: "search-only",
    };
  }

  // 4. Try LLM
  let answer = "";
  let mode: "llm" | "search-only" = "search-only";
  let modelName: string | undefined;

  const manager = getLlmManager();
  await ensureLlmReady(onProgress);

  if (llmAvailable && manager.isReady()) {
    try {
      const context = buildLlmContext(results);

      answer = await manager.generate(context, question);
      mode = "llm";
      modelName = manager.getModelName();
    } catch (err) {
      console.warn("LLM generation failed, falling back to search:", err);
      answer = buildSearchAnswer(results);
    }
  } else {
    answer = buildSearchAnswer(results);
  }

  return { answer, sources: results, mode, modelName };
}

export async function askPortfolioStream(
  question: string,
  callbacks: {
    onProgress?: (status: string) => void;
    onToken?: (token: string) => void;
  } = {}
): Promise<AiResponse> {
  const { onProgress, onToken } = callbacks;

  onProgress?.("인덱스 로딩 중...");
  if (!chunks) {
    chunks = await loadRagIndex();
  }

  onProgress?.("질문 분석 중...");
  const queryEmbedding = await embedQuery(question);
  onProgress?.("관련 문서 검색 중...");
  const results = filterRelevantResults(rankResultsForQuestion(
    question,
    searchChunks(queryEmbedding, chunks, 12)
  )).slice(0, 5);

  if (results.length === 0) {
    const answer = "관련된 포트폴리오 데이터를 찾을 수 없습니다.";
    onToken?.(answer);
    return {
      answer,
      sources: [],
      mode: "search-only",
    };
  }

  const manager = getLlmManager();
  await ensureLlmReady(onProgress);

  if (llmAvailable && manager.isReady()) {
    try {
      const context = buildLlmContext(results);

      onProgress?.("답변 생성 중...");
      const answer = await manager.generateStream(context, question, (token) => {
        onToken?.(token);
      });

      return {
        answer,
        sources: results,
        mode: "llm",
        modelName: manager.getModelName(),
      };
    } catch (err) {
      console.warn("LLM streaming failed, falling back to search:", err);
    }
  }

  const answer = buildSearchAnswer(results);
  onToken?.(answer);
  return {
    answer,
    sources: results,
    mode: "search-only",
  };
}

function buildSearchAnswer(results: SearchResult[]): string {
  if (results.length === 0) return "";

  const topResults = results.slice(0, 3);
  let answer = "관련 포트폴리오 문서를 찾았습니다:\n\n";

  for (const r of topResults) {
    const text = cleanContextText(r.chunk.text);
    const preview = text.slice(0, 150);
    answer += `[${r.chunk.title}]\n${preview}${text.length > 150 ? "..." : ""}\n\n`;
  }

  return answer.trim();
}

function buildLlmContext(results: SearchResult[]): string {
  return results
    .slice(0, 4)
    .map((r) => {
      const text = cleanContextText(r.chunk.text).slice(0, 800);
      const section = r.chunk.headingPath?.length
        ? ` > ${r.chunk.headingPath.join(" > ")}`
        : "";
      return `[${r.chunk.id} | ${r.chunk.title}${section}]: ${text}`;
    })
    .join("\n\n");
}

function filterRelevantResults(results: SearchResult[]): SearchResult[] {
  return results.filter((result) => result.score >= MIN_RELEVANCE_SCORE);
}

function rankResultsForQuestion(
  question: string,
  results: SearchResult[]
): SearchResult[] {
  const normalized = question.toLowerCase();

  const preferredTypes = new Set<RagChunk["sourceType"]>();
  if (/프로젝트|project|포트폴리오|구현|개발/.test(normalized)) {
    preferredTypes.add("project");
    preferredTypes.add("resume");
  }
  if (/경력|경험|회사|직무|resume|experience/.test(normalized)) {
    preferredTypes.add("resume");
    preferredTypes.add("project");
  }
  if (/기술|스택|skill|react|next|typescript|성능|최적화/.test(normalized)) {
    preferredTypes.add("resume");
    preferredTypes.add("project");
    preferredTypes.add("about");
  }

  return [...results].sort((a, b) => {
    return (
      scoreResultForQuestion(normalized, b, preferredTypes) -
      scoreResultForQuestion(normalized, a, preferredTypes)
    );
  });
}

function scoreResultForQuestion(
  normalizedQuestion: string,
  result: SearchResult,
  preferredTypes: Set<RagChunk["sourceType"]>
): number {
  const chunk = result.chunk;
  const haystack = `${chunk.title} ${chunk.docId} ${chunk.tags.join(" ")} ${chunk.text}`
    .toLowerCase()
    .replace(/\s+/g, " ");
  let boost = preferredTypes.has(chunk.sourceType) ? 0.08 : 0;

  if (/연락|contact|email|메일|깃허브|github|linkedin|블로그|blog/.test(normalizedQuestion)) {
    boost += chunk.title === "Contact" || chunk.docId === "contact" ? 0.28 : -0.04;
  }

  if (/경력|회사|재직|기간|이력|experience|career/.test(normalizedQuestion)) {
    boost += chunk.sourceType === "resume" ? 0.22 : -0.03;
    boost += /frontend developer @|frontend engineer intern @|경력|2026\.03|2025\.03/.test(haystack)
      ? 0.08
      : 0;
  }

  if (/성능|최적화|performance|lcp|lighthouse|빌드|속도/.test(normalizedQuestion)) {
    boost += /performance|lcp|lighthouse|빌드|성능|최적화|거부기린/.test(haystack)
      ? 0.16
      : 0;
    boost += /project-bugi-download|거부기린 다운로드|lighthouse|lcp/.test(haystack) ? 0.1 : 0;
  }

  if (/\b(ai|rag|agent|llm|ax)\b|추천|임베딩|embedding|검색/.test(normalizedQuestion)) {
    const aiMatch =
      /\b(ai|rag|agent|llm|embedding)\b|추천|임베딩|검색|qdrant|pgvector|study-admin|metadata-aware/.test(
        haystack
      );
    boost += aiMatch ? 0.22 : -0.08;
    boost += /ai-knowledge|study-admin|urock|goldentemplate-ui-core/.test(haystack)
      ? 0.08
      : 0;
  }

  if (/디자인 시스템|design system|storybook|컴포넌트|ui kit|hods/.test(normalizedQuestion)) {
    boost += /디자인 시스템|design system|storybook|컴포넌트|ui kit|hods|goldentemplate/.test(haystack)
      ? 0.16
      : 0;
  }

  return result.score + boost;
}

function cleanContextText(text: string): string {
  return text
    .replace(/TODO:\s*/g, "")
    .replace(/\bTODO\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getLlmStatus() {
  const manager = getLlmManager();
  return {
    ready: manager.isReady(),
    loading: manager.isLoading(),
    webGpu: manager.isWebGpuAvailable(),
    model: manager.getModelName(),
  };
}
