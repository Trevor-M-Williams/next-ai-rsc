import { ReactNode, useEffect, useRef, useState } from "react";

import { UserMessage } from "@/components/stocks/message";
import { CommandDialog } from "@/components/chat/command-dialog";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/chat-command";
import { IconArrowElbow } from "@/components/ui/icons";
import Textarea from "react-textarea-autosize";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn, isMobile, sleep } from "@/lib/utils";
import { commands } from "./command-dialog";

function ChatCommands({
  inputValue,
  commandsRef,
  selectedCommand,
  setInputValue,
  inputRef,
}: {
  inputValue: string;
  commandsRef: React.RefObject<HTMLDivElement>;
  selectedCommand: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
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
                setInputValue(command.name + ":");
                inputRef.current?.focus();
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
  submitUserMessage: (query: string) => Promise<{
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
      if (!commandsOpen) return;
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

    if (event.key === "Enter" || event.key === "Return") {
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
    if (!inputRef.current) return;
    inputRef.current.addEventListener("blur", () => {
      window.scrollTo(0, 0);
    });
  }, []);

  return (
    <div
      className="absolute w-full max-w-2xl z-50 bottom-8 xl:bottom-0 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div className="sm:px-4">
        <div className="relative px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-xl sm:border md:py-4 xl:rounded-t-xl xl:rounded-b-none">
          {commandsOpen && (
            <ChatCommands
              inputValue={inputValue}
              commandsRef={commandsRef}
              selectedCommand={selectedCommand}
              setInputValue={setInputValue}
              inputRef={inputRef}
            />
          )}

          <form
            ref={formRef}
            onSubmit={async (e: any) => {
              e.preventDefault();

              // Blur focus on mobile
              if (isMobile()) {
                e.target["message"]?.blur();
                window.scrollTo(0, 0);
              }

              const query = inputValue.trim();
              setInputValue("");
              setCommandsOpen(false);

              if (!query) return;

              // Add user message UI
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage>{query}</UserMessage>,
                },
              ]);

              try {
                // Submit and get response message
                const responseMessage = await submitUserMessage(query);
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
              <CommandDialog formRef={formRef} setInputValue={setInputValue} />

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
