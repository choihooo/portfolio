type FeatureExtractionOutput = {
  data: Float32Array;
};

type FeatureExtractionPipeline = (
  input: string,
  options: { pooling: "mean"; normalize: boolean }
) => Promise<FeatureExtractionOutput>;

let embedder: FeatureExtractionPipeline | null = null;
let embedderInitPromise: Promise<void> | null = null;
let embedderWarmupPromise: Promise<void> | null = null;

async function initEmbedder() {
  if (embedder) return;
  if (embedderInitPromise) return embedderInitPromise;

  embedderInitPromise = (async () => {
    const { pipeline } = await import("@huggingface/transformers");
    embedder = (await pipeline(
      "feature-extraction",
      "Xenova/multilingual-e5-small",
      { dtype: "fp32" }
    )) as FeatureExtractionPipeline;
  })().catch((error) => {
    embedder = null;
    embedderInitPromise = null;
    throw error;
  });

  await embedderInitPromise;
  embedderInitPromise = null;
}

export async function embedQuery(question: string): Promise<number[]> {
  await initEmbedder();

  if (!embedder) {
    throw new Error("Embedder failed to initialize");
  }

  const output = await embedder(`query: ${question}`, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data as Float32Array);
}

export async function preloadEmbedder(): Promise<void> {
  await initEmbedder();

  if (!embedder) {
    throw new Error("Embedder failed to initialize");
  }

  if (!embedderWarmupPromise) {
    embedderWarmupPromise = embedder("query: portfolio warmup", {
      pooling: "mean",
      normalize: true,
    })
      .then(() => undefined)
      .catch((error) => {
        embedderWarmupPromise = null;
        throw error;
      });
  }

  await embedderWarmupPromise;
}
