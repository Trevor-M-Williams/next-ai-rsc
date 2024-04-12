"use server";

import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

export async function getPineconeContext() {
  const prompt = "What are the key governance trends?";
  const pineconeMatches = await queryPinecone(prompt);

  if (pineconeMatches.length > 0) {
    const pineconeContext = pineconeMatches
      .map((match: PineconeMatch) => {
        const fileName = match.metadata?.filename
          ? ` (File: ${match.metadata.filename})`
          : "";
        const text = match.metadata?.text || "";
        return fileName + "\n" + text;
      })
      .join("\n\n")
      .slice(-30000);

    const regex = /\(File: (.*?)\.txt\)/g;
    const matches = pineconeContext.matchAll(regex);
    let citations = [];
    for (const match of matches) {
      citations.push(match[1]);
    }

    return { pineconeContext, citations };
  } else {
    console.log("no matches");
    return { pineconeContext: "", citations: [] };
  }
}

async function queryPinecone(query: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const queryEmbedding = response.data[0].embedding;
  const queryRequest = {
    topK: 30,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  };

  const queryResponse = await pinecone.index("nacd").query(queryRequest);
  const matches: PineconeMatch[] = queryResponse.matches;
  return matches;
}
