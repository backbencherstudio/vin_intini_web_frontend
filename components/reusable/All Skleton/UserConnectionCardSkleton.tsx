import { Skeleton } from "@/components/ui/skeleton";

function UserConnectionCardSkleton() {
  return (
    <div>
      <div className="overflow-hidden rounded-md border border-borderColor bg-white">
        <Skeleton className="h-16 w-full rounded-none" />
        <div className="px-3 pb-3">
          <Skeleton className="-mt-6 h-12 w-12 rounded-full border-2 border-white" />
          <Skeleton className="mt-3 h-4 w-28" />
          <Skeleton className="mt-2 h-3 w-32" />
          <Skeleton className="mt-4 h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default UserConnectionCardSkleton;
