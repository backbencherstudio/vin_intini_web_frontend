import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileHeroSkeleton() {
  return (
    <section className="animate-pulse">
      {/* 1. Cover Image Skeleton */}
      <div className="h-40 md:h-48 w-full bg-gray-200 rounded-md relative">
        {/* Floating Profile Image Box Skeleton */}
        <div className="absolute -bottom-10 left-4 flex justify-between w-[calc(100%-32px)]">
          <div className="h-20 w-20 bg-bgLightColor rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
            <Skeleton className="h-full w-full rounded-full bg-gray-300" />
          </div>
          
          {/* Edit Icon Button Skeleton */}
          <div className="mt-11">
             <Skeleton className="h-6 w-6 rounded-md bg-gray-300" />
          </div>
        </div>
      </div>

      {/* 2. Content Section Skeleton */}
      <div className="mt-12 border-b border-borderColor pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          
          {/* Left Side: Name and Info */}
          <div className="col-span-2 space-y-3">
            {/* Name */}
            <Skeleton className="h-7 w-48 bg-gray-200 rounded-md" />
            
            {/* Title / Profession */}
            <Skeleton className="h-4 w-64 bg-gray-200 rounded-md" />
            
            {/* Location */}
            <Skeleton className="h-4 w-32 bg-gray-200 rounded-md" />
            
            {/* Connection Count */}
            <div className="flex items-center gap-2.5 mt-2">
              <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
              <Skeleton className="h-4 w-24 bg-gray-200 rounded-md" />
            </div>
          </div>

          {/* Right Side: Work & Education */}
          <div className="space-y-4 col-span-1 mt-2 md:mt-0">
            {/* Experience */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-md bg-gray-200" />
              <Skeleton className="h-4 w-full max-w-50 bg-gray-200 rounded-md" />
            </div>
            
            {/* Education */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-md bg-gray-200" />
              <Skeleton className="h-4 w-full max-w-50 bg-gray-200 rounded-md" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}