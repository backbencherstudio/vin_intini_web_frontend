import { Skeleton } from "@/components/ui/skeleton";

export function GroupMemberListSkeleton() {
  return (
    <div className="space-y-4">
      {/* 1. Member Count & Mutual Section Skeleton */}
      <div className="max-w-full rounded-xl border border-borderColor/30 bg-bgLightColor p-4">
        {/* Header Skeleton */}
        <div className="mb-3 border-b border-gray-200 pb-3">
          <Skeleton className="h-6 w-32 bg-gray-200" />
        </div>

        {/* Mutual Connections Section */}
        <div className="mb-6">
          <Skeleton className="mb-3 h-4 w-40 bg-gray-200" />

          <div className="flex items-center">
            {/* Avatar Stack Skeleton */}
            <div className="flex -space-x-3 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-gray-200"
                />
              ))}
            </div>
            {/* Badge Skeleton */}
            <Skeleton className="z-10 -ml-3 h-10 w-10 rounded-full border-2 border-white bg-white shadow-sm" />
          </div>
        </div>

        {/* Action Button Skeleton */}
        <Skeleton className="h-10 w-44 rounded-full bg-gray-200" />
      </div>

      {/* 2. Admin Section Skeleton */}
      <div className="max-w-full rounded-xl border border-borderColor/30 bg-bgLightColor p-4">
        {/* Header Skeleton */}
        <div className="mb-3 border-b border-borderColor/90 pb-3">
          <Skeleton className="h-6 w-20 bg-gray-200" />
        </div>

        <div className="flex items-start gap-2">
          {/* Admin Avatar Skeleton */}
          <Skeleton className="h-10 w-10 rounded-full shrink-0 bg-gray-200" />

          <div className="flex-1 space-y-2">
            {/* Name Skeleton */}
            <Skeleton className="h-5 w-32 bg-gray-200" />
            {/* Description Skeletons */}
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-[80%] bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
