import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

const suggestedMessages = [
  {
    heading: "What's Apple trading at?",
    message: "/stock:AAPL",
  },
  {
    heading: "Show me Google's financials",
    message: "/financials:GOOG",
  },
  {
    heading: "Graph eps for the magnificient seven",
    message: "/chart:aapl,amzn,goog,meta,msft,nvda,tsla:eps",
  },
  {
    heading: "Compare debt leverage for Apple and Google",
    message: "Compare debt leverage for Apple and Google",
  },
];

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <p className="leading-normal text-muted-foreground">Quick Start:</p>
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {suggestedMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
