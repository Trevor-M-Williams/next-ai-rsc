import { cn } from "@/lib/utils";

export async function Metric({
  title,
  value,
  unit,
  bg,
}: {
  title: string;
  value: string;
  unit?: string;
  bg: string;
}) {
  return (
    <div
      className={cn(
        "h-full flex items-center justify-center text-white cursor-pointer gap-4 lg:gap-6",
        bg
      )}
    >
      <div className="flex items-center justify-center text-5xl lg:text-6xl xl:text-7xl">
        {value}
        <span className="text-3xl">{unit}</span>
      </div>
      <div className="w-24 text-base leading-tight lg:text-lg lg:leading-tight">
        {title}
      </div>
    </div>
  );
}
