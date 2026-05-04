import { Skeleton } from "@/components/ui/skeleton";

export default function CommentRowSkeleton() {
  return (
    <div className="relative mb-6 w-full">
      <div className="flex items-start gap-2.5">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32" /> 
          <Skeleton className="h-3 w-52" /> 
        </div>
        <Skeleton className="h-4 w-12 shrink-0 ml-auto" />
      </div>
      <div className="mt-2 pl-10">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-4 w-16" /> 
          <div className="h-3 w-px bg-borderColor/20" /> 
          <Skeleton className="h-4 w-16" /> 
        </div>
      </div>
    </div>
  );
}