import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPlus } from "@/components/ui/icons";

import ChartIcon from "@mui/icons-material/BarChart";
import FinancialsIcon from "@mui/icons-material/AttachMoney";
import StockIcon from "@mui/icons-material/ShowChart";

import { sleep } from "@/lib/utils";

const commands = [
  {
    name: "/chart",
    icon: <ChartIcon fontSize="large" />,
    message: "/chart:AAPL,META,GOOG,MSFT:netIncomeRatio",
  },
  {
    name: "/financials",
    icon: <FinancialsIcon fontSize="large" />,
    message: "/financials:GOOG,MSFT",
  },
  {
    name: "/stock",
    icon: <StockIcon fontSize="large" />,
    message: "/stock:AAPL,META",
  },
];

export function CommandDialog({
  formRef,
  setInputValue,
}: {
  formRef: React.RefObject<HTMLFormElement>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="absolute left-0 flex items-center justify-center border w-8 h-8 p-0 rounded-full top-4 bg-background hover:bg-muted sm:left-4">
          <IconPlus />
          <span className="sr-only">New Command</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Commands</DialogTitle>
          <div className="grid grid-cols-4 p-4">
            {commands.map((command) => (
              <Button
                key={command.name}
                variant={"outline"}
                className="h-20 w-20 flex items-center gap-2"
                onClick={async () => {
                  setInputValue(command.message);
                  await sleep(10);
                  formRef.current?.requestSubmit();
                  setOpen(false);
                }}
              >
                {command.icon}
              </Button>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
