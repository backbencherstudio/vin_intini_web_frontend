import Search from "@/components/reusable/Search";
import SaveJobsList from "../_component/SaveJobsList";

export default function SavedJobsPage() {
  return (
    <main className="w-full">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderColor pb-3 min-h-[66px]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor leading-tight">
            Saved Jobs
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Saved your most favorite jobs.
          </p>
        </div>
        <div className="w-full sm:w-65">
          <Search placeHolder="Search Job..." />
        </div>
      </header>
      <div>
        <SaveJobsList />
      </div>
    </main>
  );
}
