"use client";

import { Button } from "@/components/ui/button";

export function AnalysisSidebar({
  activeLink,
  setActiveLink,
}: {
  activeLink: string;
  setActiveLink: (link: string) => void;
}) {
  const links = ["Company", "Industry", "Financials"];
  const buttonClassName = "w-full justify-start text-base h-8";

  return (
    <div className="h-full border-r px-6 py-6 flex flex-col justify-between bg-background">
      <div>
        <div className="flex flex-col gap-2">
          {links.map((link) => {
            return (
              <Button
                tabIndex={-1}
                key={link}
                variant="ghost"
                className={`${buttonClassName} ${
                  activeLink === link ? "bg-secondary" : ""
                }`}
                onClick={() => setActiveLink(link)}
              >
                <span>{link}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
