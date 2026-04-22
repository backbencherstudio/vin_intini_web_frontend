import { Skeleton } from "@/components/ui/skeleton";

function ConnectionRequestSkleton() {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-72" />
          <Skeleton className="h-3 w-52" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-14 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}

export default ConnectionRequestSkleton;
