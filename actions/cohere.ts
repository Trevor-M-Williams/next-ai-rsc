"use server";

import { CohereClient } from "cohere-ai";
import OpenAI from "openai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY as string,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

async function generateQuery(query: string) {
  // use openAI to craft a google search query from the user's input
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate an optimized search query from the user's input. Be concise! Today is ${new Date().toDateString()}.`,
        },
        { role: "user", content: query },
      ],
    });

    return completion.choices[0].message.content || query;
  } catch (error) {
    console.error("Error generating search query:", error);
    return query;
  }
}

export async function getSearchResults(query: string) {
  try {
    const searchQuery = await generateQuery(query);
    console.log("User query:", query);
    console.log("Optimized query:", searchQuery);
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
