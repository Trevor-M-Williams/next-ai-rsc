"use server";

import { getMutableAIState } from "ai/rsc";
import { CohereClient } from "cohere-ai";
import OpenAI from "openai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY as string,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

async function generateQuery() {
  try {
    const aiState = await getMutableAIState();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate an optimized search query from the user's input. Be concise! Today is ${new Date().toDateString()}.`,
        },
        ...aiState.get(),
      ],
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating search query:", error);
    return "";
  }
}

export async function getSearchResults() {
  try {
    const searchQuery = await generateQuery();
    console.log("Optimized query:", searchQuery);
    if (!searchQuery) return { searchResults: "", searchCitations: [] };

    const chatStream = await cohere.chatStream({
      message: searchQuery,
      connectors: [{ id: "web-search" }],
    });

    for await (const event of chatStream) {
      if (event.eventType === "search-results") {
        const searchResults =
          event.documents
            ?.map((doc) => doc.snippet)
            .join("\n\n")
            .slice(-5000) || "";
        const searchCitations = event.documents?.map((doc) => doc.url) || [];
        return { searchResults, searchCitations };
      }
    }

    return { searchResults: "", searchCitations: [] };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { searchResults: "", searchCitations: [] };
  }
}
