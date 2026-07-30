import { Skeleton } from "@/components/ui/skeleton";

export default function TermsSkeletonLoader() {
  return (
    <div className="w-full max-w-5xl border rounded-2xl mt-10 mx-auto p-4 md:p-6 space-y-8 font-sans">
      {/* 1. Header Banner Skeleton (Terms & Conditions Box) */}
      <Skeleton className="w-full h-16 md:h-20 rounded-xl md:rounded-2xl bg-teal-600/20 animate-pulse flex items-center justify-center">
        <Skeleton className="h-6 md:h-8 w-48 md:w-64 bg-teal-700/30 rounded-md" />
      </Skeleton>

      {/* 2. Top Title & Date Info */}
      <div className="space-y-3 pt-2">
        {/* Main Document Title */}
        <Skeleton className="h-6 w-44 rounded-md" />

        {/* Last Updated Date Line */}
        <Skeleton className="h-4 w-72 rounded-md" />

        {/* Intro Paragraph */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-[92%] rounded-md" />
        </div>
      </div>

      {/* 3. Section 1: Emergency Disclaimer & Bullet Points */}
      <div className="space-y-3">
        {/* Section Heading */}
        <Skeleton className="h-5 w-80 rounded-md" />
        {/* Description Line */}
        <Skeleton className="h-4 w-[96%] rounded-md" />
        <Skeleton className="h-4 w-[75%] rounded-md" />

        {/* Bullet List Skeleton */}
        <div className="pl-6 space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full shrink-0" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full shrink-0" />
            <Skeleton className="h-4 w-56 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full shrink-0" />
            <Skeleton className="h-4 w-60 rounded-md" />
          </div>
        </div>
      </div>

      {/* 4. Section 2: Services Provided */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-48 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-[98%] rounded-md" />
          <Skeleton className="h-4 w-[60%] rounded-md" />
        </div>
      </div>

      {/* 5. Section 3: Eligibility */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-36 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-[85%] rounded-md" />
        </div>
      </div>

      {/* 6. Section 4: Appointments and Payments */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-60 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[90%] rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-[70%] rounded-md" />
        </div>
      </div>
    </div>
  );
}
