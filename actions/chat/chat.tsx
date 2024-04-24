"use server";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";

import { BotMessage } from "@/components/chat/message";
import { spinner } from "@/components/spinner";

import { handleAIResponse } from "./ai";
import { handleCommand } from "./commands";

async function submitUserMessage(query: string) {
  "use server";
  const content = query;
  try {
    const aiState = getMutableAIState<typeof AI>();
    aiState.update([
      ...aiState.get(),
      {
        role: "user",
        content,
      },
    ]);

    const reply = createStreamableUI(
      <BotMessage className="items-center">{spinner}</BotMessage>
    );

    if (content.startsWith("/")) {
      const response = await handleCommand(content, reply, aiState);
      return response;
    } else {
      const response = await handleAIResponse(reply, aiState);
      return response;
    }
  } catch (error) {
    console.log(error);
    return {
      id: Date.now(),
      display: <BotMessage>Sorry, something went wrong.</BotMessage>,
    };
  }
}

// --------------------- Create AI --------------------- //

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
