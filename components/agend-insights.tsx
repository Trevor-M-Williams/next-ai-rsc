import { ScrollArea } from "./ui/scroll-area";

export function AgendaInsights() {
  const insights = [
    {
      category: "CEO's Report",
      insight:
        "Stable growth despite economic uncertainties, with increased focus on sustainability and digital consumption.",
      recommendation:
        "Prioritize innovation in sustainability and digital engagement strategies to maintain and accelerate growth.",
    },
    {
      category: "Financial Report",
      insight:
        "Positive financial outlook with strategic investments in R&D for smart home products.",
      recommendation:
        "Increase investment in R&D, especially in smart home technologies, to capture emerging market opportunities.",
    },
    {
      category: "Sustainability & CSR",
      insight:
        "Significant achievements in sustainable sourcing and commitment to net-zero emissions by 2030.",
      recommendation:
        "Expand sustainable sourcing initiatives and accelerate actions towards achieving net-zero emissions.",
    },
    {
      category: "Product & Market Expansion",
      insight:
        "Launch of smart kitchen gadgets and focus on expansion in Southeast Asia.",
      recommendation:
        "Explore further product innovation and aggressively pursue expansion in Southeast Asia and other emerging markets.",
    },
    {
      category: "Digital Strategy & E-commerce",
      insight:
        "E-commerce growth driven by user-friendly website and AI-driven personalization.",
      recommendation:
        "Enhance the e-commerce platform with advanced AI for personalized experiences and expand digital marketing efforts.",
    },
    {
      category: "Human Resources & Talent Acquisition",
      insight:
        "High employee retention rates and focus on upskilling in digital competencies.",
      recommendation:
        "Invest in continuous learning and development programs, especially in digital skills, to retain and attract top talent.",
    },
    {
      category: "Strategic Partnerships & Collaborations",
      insight:
        "New collaborations with renewable energy firms to reduce carbon footprint.",
      recommendation:
        "Seek additional partnerships in renewable energy and other sustainable technologies to further reduce environmental impact.",
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
