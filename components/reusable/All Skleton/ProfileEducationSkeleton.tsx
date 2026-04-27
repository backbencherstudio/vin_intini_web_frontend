import { Skeleton } from "@/components/ui/skeleton";

function ProfileEducationSkeleton() {
  return (
    <div className="border-b border-borderColor py-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-11 w-11 rounded-sm" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <div className="mt-4 space-y-2 pl-14">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default ProfileEducationSkeleton;
