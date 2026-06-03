// This file runs inside a Web Worker
// It loads WebLLM and handles LLM inference off the main thread

import {
  CreateMLCEngine,
  type InitProgressReport,
  type MLCEngine,
} from "@mlc-ai/web-llm";

type WorkerRequest =
  | { type: "init"; requestId: string }
  | {
      type: "generate";
      requestId: string;
      data: {
        messages: Array<{ role: "system" | "user"; content: string }>;
      };
    }
  | {
      type: "generate-stream";
      requestId: string;
      data: {
        messages: Array<{ role: "system" | "user"; content: string }>;
      };
    };

let engine: MLCEngine | null = null;

const MODEL_CANDIDATES = [
  "Qwen3.5-0.8B-q4f16_1-MLC",
  "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
];

function stripThinking(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>\s*/gi, "")
    .replace(/<\/?think>/gi, "")
    .trimStart();
}

async function tryLoadModel(): Promise<string | null> {
  for (const modelId of MODEL_CANDIDATES) {
    try {
      self.postMessage({
        type: "progress",
        data: { progress: 0, text: `Loading ${modelId}...` },
      });

      engine = await CreateMLCEngine(modelId, {
        initProgressCallback: (progress: InitProgressReport) => {
          self.postMessage({
            type: "progress",
            data: {
              progress: Math.round(progress.progress * 100),
              text: progress.text,
            },
          });
        },
      });

      return modelId;
    } catch (err) {
      console.warn(`Failed to load ${modelId}:`, err);
      engine = null;
    }
  }
  return null;
}

function postMessageForRequest(
  requestId: string,
  type: "ready" | "generated" | "generated-chunk" | "error",
  data: unknown
) {
  self.postMessage({ requestId, type, data });
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const message = e.data;
  const { requestId } = message;

  switch (message.type) {
    case "init": {
      try {
        const loadedModel = await tryLoadModel();
        if (loadedModel) {
          postMessageForRequest(requestId, "ready", { model: loadedModel });
        } else {
          postMessageForRequest(requestId, "error", {
            error: "No compatible model could be loaded",
          });
        }
      } catch (error) {
        postMessageForRequest(requestId, "error", {
          error: String(error),
        });
      }
      break;
    }

    case "generate": {
      if (!engine) {
        postMessageForRequest(requestId, "error", {
          error: "Engine not initialized",
        });
        return;
      }

      try {
        const activeEngine = engine;
        const reply = await activeEngine.chat.completions.create({
          messages: message.data.messages,
          max_tokens: 512,
          temperature: 0.2,
          top_p: 0.8,
          frequency_penalty: 0.4,
          presence_penalty: 0,
          repetition_penalty: 1.08,
          extra_body: { enable_thinking: false },
        });
        const text = stripThinking(reply.choices[0]?.message?.content ?? "");
        postMessageForRequest(requestId, "generated", { text });
      } catch (error) {
        postMessageForRequest(requestId, "error", {
          error: String(error),
        });
      }
      break;
    }

    case "generate-stream": {
      if (!engine) {
        postMessageForRequest(requestId, "error", {
          error: "Engine not initialized",
        });
        return;
      }

      try {
        const activeEngine = engine;
        const stream = await activeEngine.chat.completions.create({
          messages: message.data.messages,
          max_tokens: 512,
          temperature: 0.2,
          top_p: 0.8,
          frequency_penalty: 0.4,
          presence_penalty: 0,
          repetition_penalty: 1.08,
          extra_body: { enable_thinking: false },
          stream: true,
        });

        let rawText = "";
        let visibleText = "";
        let insideThinking = false;
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta.content ?? "";
          if (!delta) continue;
          rawText += delta;
          insideThinking =
            /<think>/i.test(rawText) && !/<\/think>/i.test(rawText.split(/<think>/i).pop() ?? "");

          if (insideThinking) {
            continue;
          }

          const nextVisibleText = stripThinking(rawText);
          const visibleDelta = nextVisibleText.slice(visibleText.length);
          if (!visibleDelta) continue;

          visibleText = nextVisibleText;
          postMessageForRequest(requestId, "generated-chunk", { delta: visibleDelta });
        }

        postMessageForRequest(requestId, "generated", { text: stripThinking(rawText) });
      } catch (error) {
        postMessageForRequest(requestId, "error", {
          error: String(error),
        });
      }
      break;
    }
  }
};
