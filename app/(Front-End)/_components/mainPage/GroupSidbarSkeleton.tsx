import { GroupCardSkeleton } from "@/components/reusable/All Skleton/GroupCardSkeleton";

export default function GroupSidbarSkeleton() {
  return (
    <aside className="rounded-md">
      <h3 className="text-lg font-semibold text-headerColor border-b border-borderColor pb-3 min-h-[66px] flex items-center">
        Groups you might be Interested
      </h3>

      <div className=" space-y-0">
        {Array.from({ length: 3 }).map((_, idx) => (
          <GroupCardSkeleton key={idx} />
        ))}
      </div>
    </aside>
  );
}
