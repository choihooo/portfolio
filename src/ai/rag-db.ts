import Dexie, { type Table } from "dexie";
import type { RagChunk } from "./types";

class RagDatabase extends Dexie {
  chunks!: Table<RagChunk, string>;
  meta!: Table<{ key: string; value: string }, string>;

  constructor() {
    super("PortfolioRAG");
    this.version(1).stores({
      chunks: "id, docId, sourceType",
      meta: "key",
    });
  }
}

const db = new RagDatabase();

export async function getCachedVersion(): Promise<string | undefined> {
  const entry = await db.meta.get("indexVersion");
  return entry?.value;
}

export async function setCachedVersion(version: string): Promise<void> {
  await db.meta.put({ key: "indexVersion", value: version });
}

export async function storeChunks(chunks: RagChunk[]): Promise<void> {
  await db.transaction("rw", db.chunks, db.meta, async () => {
    await db.chunks.clear();
    await db.chunks.bulkAdd(chunks);
  });
}

export async function getAllChunks(): Promise<RagChunk[]> {
  return db.chunks.toArray();
}

export { db };
