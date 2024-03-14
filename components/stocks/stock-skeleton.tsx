import { SkeletonDark } from "@/components/ui/skeleton-dark";

export const StockSkeleton = () => {
  return (
    <div className="p-4 rounded-xl bg-zinc-950 text-green-400 border border-zinc-900">
      <SkeletonDark className="w-16 h-8 rounded-md" />
      <SkeletonDark className="mt-1 w-32 h-8 rounded-md" />
      <SkeletonDark className="mt-2 w-full h-56 rounded-md" />
    </div>
  );
};
