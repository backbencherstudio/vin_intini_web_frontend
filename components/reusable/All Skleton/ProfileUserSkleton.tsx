import { Skeleton } from "@/components/ui/skeleton";

function ProfileUserSkleton() {
  return (
    <div>
      <div className="p-4 border-b border-borderColor">
        <div className="flex items-center gap-3">
          <div className="">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-45 md:w-62.5" />
            <Skeleton className="h-4 w-40 md:w-58" />
            <Skeleton className="h-4 w-30 md:w-48" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-9 w-17.5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default ProfileUserSkleton;
