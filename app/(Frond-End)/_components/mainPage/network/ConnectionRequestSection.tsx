import Search from "@/components/reusable/Search";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ConnectionRequestList from "./connectionRequests/ConnectionRequestList";
import SuggestConnectionList from "./connectionUsers/SuggestConnectionList";

function ConnectionRequestSection({
  isLoading = false,
}: {
  isLoading?: boolean;
}) {
  return (
    <section className="w-full bg-white  pb-4 pt-2 md:px-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-2">
        <div className="flex  items-center gap-3">
          <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
            Connection Request{" "}
            <span className="text-base text-grayColor1 font-normal">(15)</span>
          </h2>

          <div className="relative w-[300px] hidden md:block  max-w-full">
            <Search />
          </div>
        </div>

        <Link
          href="/mu/id/connection_requests"
          className="inline-flex items-center gap-1 text-[15px] font-semibold text-headerColor"
        >
          Show All
          <ArrowRight size={16} />
        </Link>
      </div>
      <div>
        <ConnectionRequestList />
      </div>
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-semibold leading-[120%] text-headerColor">
          Connect With New Network
        </h3>

        <SuggestConnectionList />
      </div>
    </section>
  );
}

export default ConnectionRequestSection;
