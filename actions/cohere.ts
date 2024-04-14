"use server";

import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY as string,
});

export async function getSearchResults(query: string) {
  try {
    if (!query) return { searchResults: "", searchCitations: [] };

    const chatStream = await cohere.chatStream({
      message: query,
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
