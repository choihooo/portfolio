import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  outputFileTracingExcludes: {
    "/*": [
      "node_modules/@huggingface/transformers/.cache/**/*",
      "node_modules/onnxruntime-node/**/*",
    ],
    "next-server": [
      "node_modules/@huggingface/transformers/.cache/**/*",
      "node_modules/onnxruntime-node/**/*",
    ],
  },
};

export default nextConfig;
