"use server";

import { createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { BotMessage } from "@/components/chat/message";
import { MarkdownProse } from "@/components/chat/markdown";

import { runOpenAICompletion } from "@/lib/utils";
import { z } from "zod";

import {
  getFinancialData,
  getPineconeContext,
  getSearchResults,
} from "@/actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const systemMessage = `\
  You are an ai assistant for board directors.
  You help them analyze company/industry/economic data.
  Use the chat history and context info to provide relevant responses.
  If relevant information is not found in the context, call get_search_results to get relevant data from the web.
  When providing company analysis, call get_search_results to find supporting data.
  If the user asks about financials specifically, call get_financial_data to get the financial statements for the companies.

  e.g. "Why is AAPL down this month?" -> get_search_results("AAPL stock news")
  e.g. "Compare eps for Apple and Google" -> get_financial_data(["AAPL", "GOOG"])

  Today is ${new Date().toDateString()}

  Messages inside [] indicate UI elements.
  "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
  "[Financial statements for GOOG]" means that the financial statements for GOOG are shown to the user.
`;

export async function handleAIResponse(
  reply: ReturnType<typeof createStreamableUI>,
  aiState: ReturnType<typeof getMutableAIState>
) {
  const messages = aiState.get();
  const prompt = messages[messages.length - 1].content;
  const { pineconeContext, pineconeCitations } =
    await getPineconeContext(prompt);

  const completion = runOpenAICompletion(openai, {
    model: "gpt-4-turbo",
    // model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
      {
        role: "function",
        name: "context",
        content: `
        Context: ${pineconeContext}
        `,
      },
    ],
    functions: [
      {
        name: "get_financial_data",
        description: "Get the financial statements for the listed companies.",
        parameters: z.object({
          symbols: z
            .array(z.string())
            .describe(
              "An array of the symbols of the companies. e.g. ['GOOG', 'AAPL', 'MSFT']"
            ),
        }),
      },
      {
        name: "get_search_results",
        description: "Get web search results.",
        parameters: z.object({
          query: z
            .string()
            .describe("An optimized search query based on the user's input."),
        }),
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(
      <BotMessage>
        <MarkdownProse content={content} />
      </BotMessage>
    );

    if (isFinal) {
      reply.done();
      aiState.done([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        { role: "assistant", content },
      ]);
    }
  });

  completion.onFunctionCall(
    "get_financial_data",
    async ({ symbols }: { symbols: string[] }) => {
      console.log("Function call: Get Financial Data", symbols);
      const financialDataForCompanies = [];

      for (const symbol of symbols) {
        const { balanceSheets, cashFlowStatements, incomeStatements } =
          await getFinancialData(symbol);

        financialDataForCompanies.push({
          symbol: symbol.toUpperCase(),
          balanceSheets,
          cashFlowStatements,
          incomeStatements,
        });
      }

      aiState.update([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "function",
          name: "get_financial_data",
          content: financialDataForCompanies
            .map(
              (companyData) => `
                Financial statements for ${companyData.symbol}:
                Balance sheets: ${JSON.stringify(companyData.balanceSheets)},
                Cash flow statements: ${JSON.stringify(companyData.cashFlowStatements)},
                Income statements: ${JSON.stringify(companyData.incomeStatements)}
              `
            )
            .join("\n\n"),
        },
      ]);

      const nestedCompletion = runOpenAICompletion(openai, {
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "Respond to the user's prompt using the given financial data.",
          },
          ...aiState.get().map((info: any) => ({
            role: info.role,
            content: info.content,
            name: info.name,
          })),
        ],
        temperature: 0,
      });

      nestedCompletion.onTextContent((content: string, isFinal: boolean) => {
        reply.update(
          <BotMessage>
            <MarkdownProse content={content} />
          </BotMessage>
        );

        if (isFinal) {
          reply.done();
          aiState.done([...aiState.get(), { role: "assistant", content }]);
        }
      });
    }
  );

  completion.onFunctionCall(
    "get_search_results",
    async ({ query }: { query: string }) => {
      console.log("Function call: Get Search Results", query);
      const { searchResults, searchCitations } = await getSearchResults(query);

      aiState.update([
        ...aiState.get().filter((info: any) => info.role !== "function"),
        {
          role: "function",
          name: "get_search_results",
          content: `
            Search results: ${searchResults}
            Search citations: {{${searchCitations}}}
          `,
        },
      ]);

      const nestedCompletion = runOpenAICompletion(openai, {
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "Respond to the user's prompt using the given search data.",
          },
          ...aiState.get().map((info: any) => ({
            role: info.role,
            content: info.content,
            name: info.name,
          })),
        ],
        temperature: 0,
      });

      nestedCompletion.onTextContent((content: string, isFinal: boolean) => {
        reply.update(
          <BotMessage>
            <MarkdownProse content={content} />
          </BotMessage>
        );

        if (isFinal) {
          reply.done();
          aiState.done([...aiState.get(), { role: "assistant", content }]);
        }
      });
    }
  );

  return {
    id: Date.now(),
    display: reply.value,
  };
}
