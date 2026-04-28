import { Skeleton } from "@/components/ui/skeleton";

function CommentSkleton() {
  return (
    <div>
      {" "}
      <div className="border-b border-borderColor py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-34" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="mt-2 h-5 w-28" />
      </div>
    </div>
  );
}

export default CommentSkleton;
