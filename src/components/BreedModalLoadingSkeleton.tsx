import { Skeleton } from "@/components/ui/skeleton";

interface BreedModalLoadingSkeletonProps {
  count?: number;
}

export const BreedModalLoadingSkeleton = ({
  count = 9,
}: BreedModalLoadingSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-3">
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};
