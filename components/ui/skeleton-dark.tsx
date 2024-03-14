import { cn } from "@/lib/utils";

function SkeletonDark({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/50", className)}
      {...props}
    />
  );
}

export { SkeletonDark };
