import 'dotenv/config';
import { Pinecone } from "@pinecone-database/pinecone";

export type CreateMemoryParams = {
  vectors: number[] | undefined
  metadata: Record<string, any>
  messageId: string
}

export type QueryMemoryParams = {
  queryVector: number[]
  limit?: number
  metadata?: Record<string, any>
}


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY!});

const cohortChatgptIndex = pc.Index('chat');

export async function createMemory({vectors,metadata,messageId}:CreateMemoryParams) {
  await cohortChatgptIndex.upsert([{
    id: messageId,
    values: vectors,
    metadata
  }])
}

export async function queryMemory({queryVector, limit=5,metadata}:QueryMemoryParams){
  const data = await cohortChatgptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata? metadata : undefined,
    includeMetadata: true,
  })
  return data.matches
}