import { ScrollArea } from "@/components/ui/scroll-area";

export function Articles2() {
  const headlines = [
    {
      publisher: "TechCrunch",
      title: "ABC Technologies Leads with Groundbreaking AI Solutions",
      date: "1d",
    },
    {
      publisher: "The Verge",
      title: "Inside ABC Technologies' Latest Smart Device Launch",
      date: "2d",
    },
    {
      publisher: "Wired",
      title: "How ABC Technologies is Shaping the Future of Internet of Things",
      date: "3d",
    },
    {
      publisher: "Bloomberg",
      title: "ABC Technologies Announces Expansion into European Markets",
      date: "4d",
    },
    {
      publisher: "Forbes",
      title: "ABC Technologies' Strategy to Dominate the Global Tech Scene",
      date: "4d",
    },
    {
      publisher: "The New York Times",
      title: "ABC Technologies Sets New Standards in Cybersecurity",
      date: "5d",
    },
    {
      publisher: "The Economist",
      title: "Economic Impact of ABC Technologies' R&D Investments",
      date: "6d",
    },
    {
      publisher: "Business Insider",
      title: "ABC Technologies' Vision for a Connected World",
      date: "6d",
    },
    {
      publisher: "MarketWatch",
      title: "ABC Technologies' Stock Soars After Successful Product Launch",
      date: "1w",
    },
    {
      publisher: "The Wall Street Journal",
      title:
        "ABC Technologies Poised for Unprecedented Growth in the Next Quarter",
      date: "1w",
    },
    {
      publisher: "CNET",
      title: "ABC Technologies Unveils New Cloud Computing Service",
      date: "1w",
    },
    {
      publisher: "The Guardian",
      title: "ABC Technologies Leads with Sustainability in Tech",
      date: "1w",
    },
    {
      publisher: "Environmental News Network",
      title: "ABC Technologies' Commitment to Reducing E-Waste",
      date: "1w",
    },
    {
      publisher: "Fast Company",
      title: "How ABC Technologies is Reimagining the Digital Workspace",
      date: "2w",
    },
    {
      publisher: "Parenting Today",
      title: "ABC Technologies' Family-Friendly Apps Gain Popularity",
      date: "2w",
    },
  ];

  return (
    <div className="h-full flex flex-col gap-2 py-4">
      <div className="ml-4 text-lg font-semibold">Recent Articles</div>
      <ScrollArea className="flex-grow overflow-auto px-4">
        {headlines.map((headline, index) => (
          <div
            key={index}
            className="space-y-2 pb-2 mb-2 border-b last:border-none"
          >
            <div className="text-sm">{headline.title}</div>
            <div className="flex justify-between text-sm text-gray-500">
              <div>{headline.publisher}</div>
              <div>{headline.date}</div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
