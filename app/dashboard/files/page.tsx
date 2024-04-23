"use client";

import { useEffect, useState } from "react";
import { boardFiles, governanceFiles, personalFiles } from "@/data/files";
import { FileMetadata } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Subnav } from "@/components/subnav";

export default function FilesPage() {
  const [activeLink, setActiveLink] = useState("Board");
  const [files, setFiles] = useState<FileMetadata[]>(boardFiles);

  useEffect(() => {
    if (activeLink === "Board") {
      setFiles(boardFiles);
    }
    if (activeLink === "Governance") {
      setFiles(governanceFiles);
    }
    if (activeLink === "Personal") {
      setFiles(personalFiles);
    }
  }, [activeLink]);

  return (
    <div className="flex h-full">
      <Subnav
        links={["Board", "Governance", "Personal"]}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      <div className="flex-grow p-8 bg-background border overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <ScrollArea>
            <ul className="px-2">
              {files
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((file, index) => {
                  const kb = file.size / 1000;
                  let href = `/dashboard/files/${file.name}`;
                  if (file.name === "Slide_Deck.pdf") {
                    href = "https://www.cybertekiq.com/director-iq";
                  }

                  return (
                    <li key={index}>
                      <a
                        href={href}
                        target={
                          file.name === "Slide_Deck.pdf" ? "_blank" : "_self"
                        }
                        className="w-full flex px-4 py-2 border-b items-center justify-between bg-white capitalize cursor-pointer hover:bg-accent"
                      >
                        <div className="text-lg">{file.title}</div>
                        <div className="shrink-0">
                          {kb > 1000
                            ? (kb / 1000).toFixed(2) + " MB"
                            : Math.floor(kb) + " KB"}
                        </div>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
