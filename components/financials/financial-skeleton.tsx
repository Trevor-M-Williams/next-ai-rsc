import { Skeleton } from "@/components/ui/skeleton";

export const FinancialSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-10 rounded-md" />
      <Skeleton className="mt-2 w-full h-96 rounded-md" />
    </div>
  );
};
