import { ScrollArea } from "../ui/scroll-area";

export function Articles() {
  const headlines = [
    {
      publisher: "The New York Times",
      title:
        "GenGoods Inc: Pioneering the Future of Eco-Friendly Consumer Products",
      date: "2d",
    },
    {
      publisher: "The Guardian",
      title:
        "How GenGoods' Vision for Sustainability is Changing the CPG Landscape",
      date: "2d",
    },
    {
      publisher: "Forbes",
      title: "Meet the Company Making Every Product Count for a Greener Planet",
      date: "3d",
    },
    {
      publisher: "TechCrunch",
      title:
        "From Personal Care to Tech: How GenGoods is Leading with Innovation and Sustainability",
      date: "5d",
    },
    {
      publisher: "Bloomberg",
      title:
        "GenGoods' Explosive Growth: A Testament to Global Demand for Sustainable Goods",
      date: "6d",
    },
    {
      publisher: "Fast Company",
      title:
        "Sustainable Living Made Easy: GenGoods Expands its Eco-Friendly Product Lines",
      date: "6d",
    },
    {
      publisher: "Wired",
      title:
        "The Secret Behind GenGoods: Marrying Tradition with Tech for a Sustainable Tomorrow",
      date: "6d",
    },
    {
      publisher: "The Economist",
      title:
        "GenGoods Inc. Unveils Smart Home Products, Setting New Standards in Eco-Living",
      date: "1w",
    },
    {
      publisher: "Business Insider",
      title:
        "Eco-Conscious and Tech-Savvy: GenGoods' Strategy to Win Over the Global Market",
      date: "1w",
    },
    {
      publisher: "Environmental News Network",
      title:
        "Beyond Profit: How GenGoods' Green Initiative is Making Waves in Environmental Conservation",
      date: "1w",
    },
    {
      publisher: "The Wall Street Journal",
      title:
        "From North America to the World: The Global Journey of GenGoods Inc.",
      date: "2w",
    },
    {
      publisher: "MarketWatch",
      title:
        "Organic, Non-GMO, and Now Closer Than Ever: GenGoods Launches in Emerging Markets",
      date: "2w",
    },
    {
      publisher: "Parenting Today",
      title:
        "Why GenGoods is the Brand of Choice for Eco-Conscious Families and Businesses",
      date: "2w",
    },
    {
      publisher: "CNET",
      title:
        "Innovation Meets Sustainability: Inside GenGoods' R&D Push for Smarter Consumer Goods",
      date: "3w",
    },
    {
      publisher: "The Verge",
      title: "GenGoods Inc: Building a Greener World, One Product at a Time",
      date: "3w",
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
