import { Skeleton } from "@/components/ui/skeleton";

function IndustrySkleton() {
  return (
    <div className="w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex w-full flex-col items-stretch gap-6 mt-6">
          <Skeleton className="h-6 w-full rounded-md" />
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IndustrySkleton;
