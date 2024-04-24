"use client";

import { useUIState, useActions } from "ai/rsc";
import { UserMessage } from "@/components/chat/message";

import { type AI } from "@/actions/chat/chat";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { ChatList } from "@/components/chat/chat-list";
import { EmptyScreen } from "@/components/chat/empty-screen";
import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <div className=" h-full overflow-auto">
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
    </div>
  );
}
