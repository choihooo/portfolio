import type { CommandHandler } from "./types";
import { askPortfolio } from "@/ai/ask-portfolio";

export const ai: CommandHandler = async (ctx) => {
  const question = ctx.args.join(" ").trim();

  if (!question) {
    return {
      output: `{yellow}사용법:{/yellow} {bold}ai <질문>{/bold}\n\n예시:\n  ai 프론트엔드 최적화 경험이 있나요?\n  ai 가장 임팩트 있었던 프로젝트는?\n  ai React/Next.js 경험을 알려줘`,
    };
  }

  try {
    const response = await askPortfolio(question, () => {
      // Progress is handled via react node updates
    });

    const sourceLines = response.sources
      .map((source, index) => {
        const score = Math.round(source.score * 100);
        return `  {dim}[${index + 1}]{/dim} {blue}${source.chunk.title}{/blue} {dim}${score}% · ${source.chunk.sourceType}{/dim}`;
      })
      .join("\n");

    return {
      output: `{yellow}ANSWER{/yellow} {dim}${
        response.mode === "llm" ? response.modelName ?? "llm" : "search-only"
      }{/dim}\n${response.answer}\n\n{yellow}SOURCES{/yellow}\n${sourceLines}`,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    // Check if RAG index exists
    if (message.includes("Failed to fetch")) {
      return {
        output: `{red}RAG 인덱스를 찾을 수 없습니다.{/red}\n\n{dim}먼저 빌드 스크립트를 실행하세요:\n  npm run rag:build{/dim}`,
      };
    }

    return {
      output: `{red}AI 어시스턴트 오류:{/red} ${message}`,
    };
  }
};
