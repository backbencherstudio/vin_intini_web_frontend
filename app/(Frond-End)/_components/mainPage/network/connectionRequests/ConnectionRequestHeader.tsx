import Search from "@/components/reusable/Search";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function ConnectionRequestHeader() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-2">
        <div className="flex  items-center gap-3">
          <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
            Connection Request{" "}
            <span className="text-base text-grayColor1 font-normal">(15)</span>
          </h2>

          <div className="relative w-75 hidden md:block  max-w-full">
            <Search />
          </div>
        </div>

        <Link
          href="/mu/1/my-network/connection-requests"
          className="inline-flex items-center gap-1 text-[15px] font-semibold text-headerColor"
        >
          Show All
          <ArrowRight size={16} />
        </Link>
        <div className="relative w-75 mx-auto md:hidden  max-w-full">
          <Search />
        </div>
      </div>
    </div>
  );
}

export default ConnectionRequestHeader;
