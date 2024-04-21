import { ScrollArea } from "@/components/ui/scroll-area";

export function AgendaInsights2() {
  const insights = [
    {
      category: "Cloud & Enterprise Solutions",
      insight:
        "Robust growth in cloud services driven by the shift to hybrid work environments.",
      recommendation:
        "Expand our cloud infrastructure and enhance enterprise solutions to support remote and hybrid work models.",
    },
    {
      category: "AI & Machine Learning",
      insight:
        "Significant advancements in AI algorithms improving product recommendations and customer interactions.",
      recommendation:
        "Increase investment in AI research and development to stay ahead of emerging trends and applications.",
    },
    {
      category: "Cybersecurity Enhancements",
      insight:
        "Increased threats in cybersecurity with the expansion of remote work.",
      recommendation:
        "Strengthen our cybersecurity frameworks and introduce new security solutions tailored for remote work scenarios.",
    },
    {
      category: "Data Privacy Regulations",
      insight:
        "New global data privacy regulations requiring updates to compliance policies.",
      recommendation:
        "Review and revise our data handling and privacy procedures to ensure compliance with international standards.",
    },
    {
      category: "Software Development",
      insight:
        "New software releases have been well received, but deployment cycles are longer than industry average.",
      recommendation:
        "Optimize our software development processes to shorten release cycles and improve time-to-market.",
    },
    {
      category: "International Expansion",
      insight:
        "Opportunities for growth in Asian and European markets are underexploited.",
      recommendation:
        "Develop localized strategies for Asia and Europe to capture market share and build regional partnerships.",
    },
    {
      category: "Innovation & Technology Partnerships",
      insight:
        "Potential to leverage partnerships with tech startups to enhance product offerings.",
      recommendation:
        "Engage with technology startups for innovation partnerships, focusing on AI, IoT, and smart technologies.",
    },
  ];

  return (
    <div className="h-full flex flex-col gap-2 py-4">
      <div className="ml-4 text-lg font-semibold">Q2 Board Meeting Prep</div>
      <ScrollArea className="flex-grow overflow-auto px-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="space-y-2 pb-2 mb-2 border-b last:border-none"
          >
            <div className="text-sm font-bold">{insight.category}</div>
            <div className="text-sm font-medium">Summary</div>
            <div className="text-sm">{insight.insight}</div>
            <div className="text-sm font-medium text-blue-500">Insight</div>
            <div className="text-sm">{insight.recommendation}</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
