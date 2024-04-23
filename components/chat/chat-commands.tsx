import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/chat-command";

import { cn } from "@/lib/utils";
import { commands } from "./command-dialog";

export function ChatCommands({
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
