import { ScrollArea } from "../ui/scroll-area";

export function IndustryInsights2() {
  const insights = [
    {
      category: "Cybersecurity Measures",
      insight:
        "With increasing cyber threats in the tech industry, companies are investing more in comprehensive cybersecurity solutions.",
      recommendation:
        "Enhance cybersecurity measures by adopting advanced security technologies and continuous monitoring of IT infrastructure.",
    },
    {
      category: "Cloud Computing Expansion",
      insight:
        "The demand for cloud services continues to grow, driven by businesses shifting to remote work and cloud-based solutions.",
      recommendation:
        "Expand cloud offerings and infrastructure to meet growing market demands and ensure high reliability and scalability.",
    },
    {
      category: "Data Analytics and AI",
      insight:
        "There is a surge in using data analytics and artificial intelligence to drive decision-making and improve customer experiences.",
      recommendation:
        "Invest in AI and machine learning technologies to enhance data processing capabilities and deliver personalized services.",
    },
    {
      category: "Software Development Trends",
      insight:
        "Agile and DevOps methodologies are increasingly popular, reflecting the need for faster development cycles and more collaborative work environments.",
      recommendation:
        "Adopt and refine agile methodologies and DevOps practices to enhance software development efficiency and product quality.",
    },
    {
      category: "IoT and Smart Technology",
      insight:
        "Internet of Things (IoT) and smart technology integration are proliferating, offering new opportunities for business automation and customer interaction.",
      recommendation:
        "Develop new IoT solutions and integrate smart technologies into existing products to improve functionality and consumer engagement.",
    },
    {
      category: "Strategic Tech Partnerships",
      insight:
        "Partnerships with other tech firms and academic institutions are crucial for fostering innovation and staying ahead in competitive markets.",
      recommendation:
        "Forge partnerships with industry leaders and academic entities to leverage shared knowledge and drive technological advancements.",
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
