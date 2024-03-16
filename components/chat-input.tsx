import { ReactNode, useEffect, useRef, useState } from "react";

import { UserMessage } from "@/components/stocks/message";

import Textarea from "react-textarea-autosize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn, sleep } from "@/lib/utils";

const commands = [
  {
    name: "/stock",
  },
  {
    name: "/financials",
  },
];

function ChatCommands({
  inputValue,
  commandsRef,
  selectedCommand,
}: {
  inputValue: string;
  commandsRef: React.RefObject<HTMLDivElement>;
  selectedCommand?: string;
}) {
  return (
    <Command className="focus:border-none focus:outline-none">
      <CommandInput
        placeholder="Type a command or search..."
        value={inputValue}
      />
      <CommandList>
        <CommandGroup ref={commandsRef} heading="Commands">
          {commands.map((command, i) => (
            <CommandItem
              key={i}
              className={cn(
                "flex justify-between py-2 cursor-pointer hover:bg-accent",
                selectedCommand === command.name
                  ? "bg-accent"
                  : "bg-transparent"
              )}
              onSelect={() => {
                console.log(command.name);
              }}
            >
              <div className="text-lg">{command.name}</div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

type ChatInputProps = {
  setMessages: (
    v:
      | {
          id: number;
          display: ReactNode;
        }[]
      | ((
          v_: {
            id: number;
            display: ReactNode;
          }[]
        ) => {
          id: number;
          display: ReactNode;
        }[])
  ) => void;
  submitUserMessage: (content: string) => Promise<{
    id: number;
    display: JSX.Element;
  }>;
};

export function ChatInput({ setMessages, submitUserMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<string>(
    commands[0].name
  );

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  async function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const index = commands.findIndex(
        (command) => command.name === selectedCommand
      );
      const nextIndex =
        (index + (event.key === "ArrowUp" ? -1 : 1)) % commands.length;

      if (nextIndex < 0) {
        setSelectedCommand(commands[commands.length - 1].name);
      } else if (nextIndex > commands.length - 1) {
        setSelectedCommand(commands[0].name);
      } else {
        setSelectedCommand(commands[nextIndex].name);
      }

      return;
    }

    if (event.key === "Enter") {
      if (commandsOpen) {
        setCommandsOpen(false);
        event.preventDefault();
        setInputValue(selectedCommand + ":");
      } else if (!event.shiftKey && !event.nativeEvent.isComposing) {
        formRef.current?.requestSubmit();
        event.preventDefault();
      }

      return;
    }

    if (event.key === "Tab" && commandsOpen) {
      event.preventDefault();
      setInputValue(selectedCommand + ":");
    }

    // set selected command to the value of the first child of commandsRef
    await sleep(10);
    if (commandsRef.current) {
      const firstCommand = commandsRef.current.lastChild?.firstChild
        ?.firstChild as HTMLElement;
      if (!firstCommand) {
        setSelectedCommand("");
        setCommandsOpen(false);
        return;
      }

      const command = firstCommand.textContent;
      setSelectedCommand(command || "");
    }
  }

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
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="relative px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          {commandsOpen && (
            <ChatCommands
              inputValue={inputValue}
              commandsRef={commandsRef}
              selectedCommand={selectedCommand}
            />
          )}
          <form
            ref={formRef}
            onSubmit={async (e: any) => {
              e.preventDefault();

              // Blur focus on mobile
              if (window.innerWidth < 600) {
                e.target["message"]?.blur();
              }

              const value = inputValue.trim();
              setInputValue("");
              setCommandsOpen(false);

              if (!value) return;

              // Add user message UI
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage>{value}</UserMessage>,
                },
              ]);

              try {
                // Submit and get response message
                const responseMessage = await submitUserMessage(value);
                setMessages((currentMessages) => [
                  ...currentMessages,
                  responseMessage,
                ]);
              } catch (error) {
                // You may want to show a toast or trigger an error state.
                console.error(error);
              }
            }}
          >
            <div className="relative flex flex-col w-full px-8 max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 w-8 h-8 p-0 rounded-full top-4 bg-background sm:left-4"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.reload();
                    }}
                  >
                    <IconPlus />
                    <span className="sr-only">New Chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Chat</TooltipContent>
              </Tooltip>

              <Textarea
                ref={inputRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                placeholder="Send a message."
                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                name="message"
                rows={1}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setCommandsOpen(e.target.value.startsWith("/"));
                }}
              />
              <div className="absolute right-0 top-4 sm:right-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={inputValue === ""}
                    >
                      <IconArrowElbow />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
