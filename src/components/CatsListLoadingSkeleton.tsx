import { Skeleton } from "@/components/ui/skeleton";

interface CatsListLoadingSkeletonProps {
  count?: number;
}

export const CatsListLoadingSkeleton = ({
  count = 9,
}: CatsListLoadingSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <Skeleton className="w-full h-48" />
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
};
