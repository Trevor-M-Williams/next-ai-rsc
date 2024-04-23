"use client";
import { useState, useEffect, useRef } from "react";
import { GovernanceSidebar } from "@/components/governance-sidebar";
import { MarkdownProse } from "@/components/chat/markdown";

import {
  auditMarkdown,
  compensationMarkdown,
  cybersecurityMarkdown,
  economicsMarkdown,
  financeMarkdown,
  innovationMarkdown,
  legalMarkdown,
  marketsMarkdown,
  regulationMarkdown,
  riskMarkdown,
  strategyMarkdown,
  sustainabilityMarkdown,
  technologyMarkdown,
} from "@/data/markdown";

export default function GovernancePage() {
  const [activeLink, setActiveLink] = useState("Audit");
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    switch (activeLink) {
      case "Audit":
        setContent(auditMarkdown);
        break;
      case "Compensation":
        setContent(compensationMarkdown);
        break;
      case "Cybersecurity":
        setContent(cybersecurityMarkdown);
        break;
      case "Economics":
        setContent(economicsMarkdown);
        break;
      case "Finance":
        setContent(financeMarkdown);
        break;
      case "Innovation":
        setContent(innovationMarkdown);
        break;
      case "Legal":
        setContent(legalMarkdown);
        break;
      case "Markets":
        setContent(marketsMarkdown);
        break;
      case "Regulation":
        setContent(regulationMarkdown);
        break;
      case "Risk":
        setContent(riskMarkdown);
        break;
      case "Strategy":
        setContent(strategyMarkdown);
        break;
      case "Sustainability":
        setContent(sustainabilityMarkdown);
        break;
      case "Technology":
        setContent(technologyMarkdown);
        break;
      default:
        setContent("");
    }
    // Scroll to the top whenever the active link changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeLink]);

  return (
    <div className="flex h-full">
      <GovernanceSidebar
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      <div
        ref={scrollRef}
        className="flex-grow p-8 bg-background border overflow-y-auto"
      >
        <MarkdownProse content={content} />
      </div>
    </div>
  );
}
