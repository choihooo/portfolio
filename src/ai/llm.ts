const SYSTEM_PROMPT = `너는 최호의 포트폴리오 AI Assistant다.
반드시 제공된 context만 근거로 답변해라.
context에 없는 내용은 추측하지 말고, 포트폴리오 데이터에서 찾을 수 없다고 말해라.
한국어 질문에는 자연스러운 한국어로만 답해라.
문서 조각을 그대로 이어 붙이지 말고 역할, 프로젝트, 성과를 종합해서 답해라.
기본 답변은 5~8문장으로 작성해라.
사용자가 자세한 설명이나 긴 답변을 요청하면 2~4개 문단으로 나누어 핵심 근거, 프로젝트 맥락, 사용 기술, 성과를 충분히 설명해라.`;

type ProgressCallback = (progress: number, text: string) => void;

type GpuNavigator = Navigator & {
  gpu?: {
    requestAdapter: () => Promise<unknown | null>;
  };
};

type WorkerMessage =
  | { type: "progress"; data: { progress: number; text: string } }
  | { requestId: string; type: "ready"; data: { model: string } }
  | { requestId: string; type: "generated-chunk"; data: { delta: string } }
  | { requestId: string; type: "generated"; data: { text: string } }
  | { requestId: string; type: "error"; data: { error: string } };

const INIT_TIMEOUT_MS = 120_000;
const GENERATION_TIMEOUT_MS = 60_000;

function createRequestId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

class LlmManager {
  private worker: Worker | null = null;
  private ready = false;
  private modelName: string | undefined;
  private webGpuAvailable = false;
  private loading = false;
  private progressCallback: ProgressCallback | null = null;
  private generationQueue: Promise<unknown> = Promise.resolve();

  async detectWebGpu(): Promise<boolean> {
    try {
      const nav = navigator as GpuNavigator;
      if (!nav.gpu) return false;
      const adapter = await nav.gpu.requestAdapter();
      this.webGpuAvailable = adapter !== null;
      return this.webGpuAvailable;
    } catch {
      this.webGpuAvailable = false;
      return false;
    }
  }

  isReady(): boolean {
    return this.ready;
  }

  isWebGpuAvailable(): boolean {
    return this.webGpuAvailable;
  }

  isLoading(): boolean {
    return this.loading;
  }

  getModelName(): string | undefined {
    return this.modelName;
  }

  onProgress(cb: ProgressCallback): void {
    this.progressCallback = cb;
  }

  async init(): Promise<boolean> {
    if (this.ready) return true;
    if (this.loading) return false;

    const hasGpu = await this.detectWebGpu();
    if (!hasGpu) return false;

    this.loading = true;

    try {
      this.worker = new Worker(
        new URL("./llm-worker.ts", import.meta.url),
        { type: "module" }
      );

      return new Promise((resolve) => {
        const requestId = createRequestId("init");
        const timeoutId = window.setTimeout(() => {
          cleanup();
          this.loading = false;
          const w = this.worker;
          this.worker = null;
          w?.terminate();
          console.warn("LLM worker init timed out");
          resolve(false);
        }, INIT_TIMEOUT_MS);

        const cleanup = () => {
          window.clearTimeout(timeoutId);
          this.worker?.removeEventListener("message", handleMessage);
          this.worker?.removeEventListener("error", handleError);
          this.worker?.removeEventListener("messageerror", handleError);
        };

        const handleError = (event: Event | ErrorEvent) => {
          cleanup();
          this.loading = false;
          const w = this.worker;
          this.worker = null;
          w?.terminate();
          console.warn("LLM worker init failed:", event);
          resolve(false);
        };

        const handleMessage = (e: MessageEvent<WorkerMessage>) => {
          const { type, data } = e.data;

          if (type === "progress" && this.progressCallback) {
            this.progressCallback(data.progress, data.text);
            return;
          }

          if (!("requestId" in e.data) || e.data.requestId !== requestId) {
            return;
          }

          if (type === "ready") {
            this.ready = true;
            this.loading = false;
            this.modelName = data.model;
            cleanup();
            resolve(true);
          }

          if (type === "error") {
            this.loading = false;
            const w = this.worker;
            this.worker = null;
            w?.terminate();
            console.warn("LLM worker error:", data.error);
            cleanup();
            resolve(false);
          }
        };

        this.worker!.addEventListener("message", handleMessage);
        this.worker!.addEventListener("error", handleError);
        this.worker!.addEventListener("messageerror", handleError);
        this.worker!.postMessage({ type: "init", requestId });
      });
    } catch (err) {
      this.loading = false;
      console.warn("Failed to initialize LLM:", err);
      return false;
    }
  }

  async generate(context: string, question: string): Promise<string> {
    return this.enqueueGeneration(() =>
      this.runGeneration("generate", context, question)
    );
  }

  async generateStream(
    context: string,
    question: string,
    onToken: (token: string) => void
  ): Promise<string> {
    return this.enqueueGeneration(() =>
      this.runGeneration("generate-stream", context, question, onToken)
    );
  }

  private async enqueueGeneration(task: () => Promise<string>): Promise<string> {
    const run = this.generationQueue.then(task, task);
    this.generationQueue = run.catch(() => undefined);
    return run;
  }

  private async runGeneration(
    type: "generate" | "generate-stream",
    context: string,
    question: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    if (!this.ready || !this.worker) {
      throw new Error("LLM not ready");
    }

    return new Promise((resolve, reject) => {
      const requestId = createRequestId(type);
      const timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error("LLM generation timed out"));
      }, GENERATION_TIMEOUT_MS);

      const cleanup = () => {
        window.clearTimeout(timeoutId);
        this.worker?.removeEventListener("message", handleMessage);
        this.worker?.removeEventListener("error", handleError);
        this.worker?.removeEventListener("messageerror", handleError);
      };

      const handleError = (event: Event | ErrorEvent) => {
        cleanup();
        reject(new Error(`LLM worker failed: ${event.type}`));
      };

      const handleMessage = (e: MessageEvent<WorkerMessage>) => {
        if (!("requestId" in e.data) || e.data.requestId !== requestId) {
          return;
        }

        if (e.data.type === "generated-chunk") {
          onToken?.(e.data.data.delta);
        }

        if (e.data.type === "generated") {
          cleanup();
          resolve(e.data.data.text);
        }

        if (e.data.type === "error") {
          cleanup();
          reject(new Error(e.data.data.error));
        }
      };

      this.worker!.addEventListener("message", handleMessage);
      this.worker!.addEventListener("error", handleError);
      this.worker!.addEventListener("messageerror", handleError);
      this.worker!.postMessage({
        type,
        requestId,
        data: {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Context:\n${context}\n\nQuestion: ${question}`,
            },
          ],
        },
      });
    });
  }

  destroy(): void {
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.loading = false;
  }
}

// Singleton
let instance: LlmManager | null = null;

export function getLlmManager(): LlmManager {
  if (!instance) {
    instance = new LlmManager();
  }
  return instance;
}

export { LlmManager };
