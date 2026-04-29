import { Skeleton } from "@/components/ui/skeleton";

export function GroupCardSkeleton() {
  return (
    <div className="border-t border-borderColor py-4 first:pt-5">
      <div className="flex items-start gap-3">
        {/* Logo/Image Skeleton */}
        <Skeleton className="xl:h-18 xl:w-18 w-11 h-11 lg:w-14 lg:h-14 shrink-0 rounded-md bg-gray-200" />

        <div className="min-w-0 flex-1">
          {/* Group Name Skeleton */}
          <Skeleton className="h-5 lg:h-6 w-[70%] mb-2 bg-gray-200" />

          {/* Members Info Skeleton */}
          <div className="mt-1.5 flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-gray-200" />
            <Skeleton className="h-4 w-[40%] bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <Skeleton className="mt-3 h-8 w-24 rounded-full bg-gray-200" />
    </div>
  );
}