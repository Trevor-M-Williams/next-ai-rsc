"use client";

import { useEffect, useState } from "react";
import { boardFiles, governanceFiles, personalFiles } from "@/data/files";
import { FileMetadata } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Subnav } from "@/components/subnav";

import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

export default function FilesPage() {
  const [activeLink, setActiveLink] = useState("Board");
  const [files, setFiles] = useState<FileMetadata[]>(boardFiles);
  const [file, setFile] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!activeLink) return;

    if (activeLink === "Board") {
      setFiles(boardFiles);
    }
    if (activeLink === "Governance") {
      setFiles(governanceFiles);
    }
    if (activeLink === "Personal") {
      setFiles(personalFiles);
    }

    setFile(null);
  }, [activeLink]);

  useEffect(() => {
    if (!file) return;

    getDownloadURL(ref(storage, "org_2XGE0bZ9jyAIWjosyPMJm58yylU/" + file))
      .then((url) => {
        setPdfUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [file]);

  return (
    <div className="flex h-full">
      <Subnav
        links={["Board", "Governance", "Personal"]}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      {file ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="PDF Viewer"
        ></iframe>
      ) : (
        <div className="flex-grow p-8 bg-background border overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <ScrollArea>
              <ul className="px-2">
                {files
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((file, index) => {
                    const kb = file.size / 1000;
                    let onClick = () => {
                      setFile(file.name);
                      setActiveLink("");
                    };
                    if (file.name === "Slide_Deck.pdf") {
                      onClick = () => {
                        window.open(
                          "https://cybertekiq.com/director-iq",
                          "_blank"
                        );
                      };
                    }

                    return (
                      <li key={index} onClick={onClick}>
                        <div className="w-full flex px-4 py-2 border-b items-center justify-between bg-white capitalize cursor-pointer hover:bg-accent">
                          <div className="text-lg">{file.title}</div>
                          <div className="shrink-0">
                            {kb > 1000
                              ? (kb / 1000).toFixed(2) + " MB"
                              : Math.floor(kb) + " KB"}
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
