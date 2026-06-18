import { PlusUserIcon } from "@/public/svgIcons/Icons";
import { Sparkles } from "lucide-react";
import Link from "next/link";

function ConnectionNotFound({description , title}: {description?: string, title?: string}) {
  return (
    <div>
      {" "}
      <div className="flex  mt-4 flex-col items-center justify-center p-6 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
        <div className="relative mb-6">
          <div className="bg-blue-50 p-4 rounded-full">
            <PlusUserIcon className="text-primaryColor w-5 h-5 opacity-80" />
          </div>
          <Sparkles
            size={24}
            className="text-yellow-400 absolute -top-2 -right-2 animate-pulse"
          />
        </div>
        <div className="text-center max-w-sm">
          <h3 className="text-xl font-semibold text-dark-800 mb-2">
            {title || "No Pending Requests"}
          </h3>
          <p className="text-grayColor1 text-sm md:text-base mb-6">
            {description || "You're all caught up! Why not explore and connect with people you might know?"}
          </p>
        </div>
        <Link
          href="/mu/my-network"
          className="flex items-center gap-2 px-6 py-3 bg-buttonColor text-white rounded-full font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          Explore Suggestions
        </Link>
      </div>
    </div>
  );
}

export default ConnectionNotFound;
