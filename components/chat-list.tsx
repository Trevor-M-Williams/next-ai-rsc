export function ChatList({ messages }: { messages: any[] }) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => {
        const messageChildren = message.display.props.children;
        if (typeof messageChildren === "string") {
          if (
            messageChildren.startsWith("/chart:") ||
            messageChildren.startsWith("/financials:") ||
            messageChildren.startsWith("/stock:")
          )
            return;
        }
        return (
          <div key={index} className="pb-4">
            {message?.display || "No message to display"}
          </div>
        );
      })}
    </div>
  );
}
