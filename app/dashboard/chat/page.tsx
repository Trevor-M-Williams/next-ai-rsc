"use client";
import { useEffect, useRef } from "react";

import { useUIState, useActions } from "ai/rsc";
import { UserMessage } from "@/components/stocks/message";

import { type AI } from "../../../actions/chat";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { ChatList } from "@/components/chat/chat-list";
import { EmptyScreen } from "@/components/chat/empty-screen";
import { ChatInput } from "@/components/chat/chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  return (
    <ScrollArea className="h-screen">
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            <ChatList messages={messages} />
          </>
        ) : (
          <EmptyScreen
            submitMessage={async (message) => {
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage>{message}</UserMessage>,
                },
              ]);

              const responseMessage = await submitUserMessage(message);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
            }}
          />
        )}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <ChatInput
        setMessages={setMessages}
        submitUserMessage={submitUserMessage}
      />
    </ScrollArea>
  );
}
