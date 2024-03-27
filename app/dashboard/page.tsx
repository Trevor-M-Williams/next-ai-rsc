import { cn } from "@/lib/utils";

export default function HomePage() {
  const cardClass = "bg-white rounded-md shadow-sm";

  return (
    <div
      className="h-screen grid grid-rows-5 gap-4 p-4"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 3.25fr",
        gridTemplateRows: "1fr 1fr 1fr 1fr 8vw",
      }}
    >
      <div className={cn(cardClass, "col-span-2 row-span-1")}></div>
      <div className={cn(cardClass, "col-span-2 row-span-1")}></div>
      <div className={cn(cardClass, "col-span-2 row-span-1")}></div>
      <div className={cn(cardClass, "col-span-1 row-span-3")}></div>
      <div className={cn(cardClass, "col-span-6 row-span-2")}></div>
      <div className={cn(cardClass, "col-span-3 row-span-2")}></div>
      <div className={cn(cardClass, "col-span-3 row-span-2")}></div>
      <div className={cn(cardClass, "col-span-1 row-span-2")}></div>
    </div>

    // <div className="h-screen grid grid-cols-3 grid-rows-5 gap-4 p-4">
    //   <div className="col-span-1 row-span-1 bg-white"></div>
    //   <div className="col-span-1 row-span-1 bg-white"></div>
    //   <div className="col-span-1 row-span-3 bg-white"></div>
    //   <div className="col-span-2 row-span-2 bg-white"></div>
    //   <div className="col-span-1 row-span-2 bg-white"></div>
    //   <div className="col-span-1 row-span-2 bg-white"></div>
    //   <div className="col-span-1 row-span-2 bg-white"></div>
    // </div>
  );
}
