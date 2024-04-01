import { ScrollArea } from "./ui/scroll-area";

export function IndustryInsights() {
  const insights = [
    {
      category: "Sustainability Initiatives",
      insight:
        "Increasing consumer demand for sustainable and eco-friendly products is pushing major CPG companies to revamp their product lines and packaging solutions.",
      recommendation:
        "Intensify efforts in sustainability, from sourcing to packaging, and communicate these initiatives effectively to consumers.",
    },
    {
      category: "E-commerce and Digital Engagement",
      insight:
        "The rapid acceleration of e-commerce sales has underscored the importance of digital channels for CPG companies, with a significant shift towards online shopping and direct-to-consumer models.",
      recommendation:
        "Invest in enhancing online platforms and digital marketing strategies to improve consumer engagement and capitalize on e-commerce growth.",
    },
    {
      category: "Supply Chain Resilience",
      insight:
        "Supply chain disruptions have highlighted the need for flexibility and resilience in operations, driving CPG companies to innovate and diversify their supply chain strategies.",
      recommendation:
        "Develop more agile, transparent, and resilient supply chain models to mitigate risks and ensure consistent product availability.",
    },
    {
      category: "Consumer Behavior Insights",
      insight:
        "Changing consumer preferences and behaviors, particularly towards health and wellness products, are influencing product development and marketing strategies.",
      recommendation:
        "Leverage consumer insights to guide product innovation, focusing on health, wellness, and convenience to meet evolving consumer demands.",
    },
    {
      category: "Technological Innovations",
      insight:
        "Technological advancements, including AI and IoT, are transforming CPG manufacturing, marketing, and consumer engagement, enabling personalized experiences and operational efficiencies.",
      recommendation:
        "Embrace cutting-edge technologies to optimize operations, enhance product personalization, and streamline the consumer journey.",
    },
    {
      category: "Collaborations and Partnerships",
      insight:
        "Strategic partnerships between CPG companies and technology firms, sustainability initiatives, or distribution channels are becoming increasingly vital for growth and innovation.",
      recommendation:
        "Seek out and establish strategic partnerships to drive innovation, expand market reach, and strengthen sustainability efforts.",
    },
  ];

  return (
    <div className="h-full flex flex-col gap-2 py-4">
      <div className="ml-4 text-lg font-semibold">Industry Snapshot</div>
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
