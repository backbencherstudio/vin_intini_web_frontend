import { Skeleton } from "@/components/ui/skeleton";

function GroupSkleton() {
  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="grid grid-cols-2 gap-1 shrink-0">
            <Skeleton className="h-16 w-16 rounded-sm" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-45 md:w-62.5" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-sm" />
              <Skeleton className="h-3 w-25" />
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-17.5 rounded-full" />
      </div>
    </div>
  );
}

export default GroupSkleton;
