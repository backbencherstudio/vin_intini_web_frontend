import Search from "@/components/reusable/Search";
import { Skeleton } from "@/components/ui/skeleton";
import { suggestedProfiles } from "@/public/demoData/DemoData";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ConnectionRequestList from "./connectionRequests/ConnectionRequestList";

function ConnectionRequestSection({
  isLoading = false,
}: {
  isLoading?: boolean;
}) {
  return (
    <section className="w-full bg-white px-2 pb-4 pt-2 md:px-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-2">
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
            Connection Request{" "}
            <span className="text-base text-grayColor1 font-normal">(15)</span>
          </h2>

          <div className="relative w-[220px] max-w-full">
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

      <h3 className="mb-4 mt-8 text-[34px] font-semibold text-headerColor">
        Connect With New Network
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`card-skeleton-${index}`}
                className="overflow-hidden rounded-md border border-borderColor bg-white"
              >
                <Skeleton className="h-16 w-full rounded-none" />
                <div className="px-3 pb-3">
                  <Skeleton className="-mt-6 h-12 w-12 rounded-full border-2 border-white" />
                  <Skeleton className="mt-3 h-4 w-28" />
                  <Skeleton className="mt-2 h-3 w-32" />
                  <Skeleton className="mt-4 h-3 w-24" />
                  <Skeleton className="mt-3 h-8 w-full rounded-full" />
                </div>
              </div>
            ))
          : suggestedProfiles.map((profile) => (
              <article
                key={profile.id}
                className="overflow-hidden rounded-md border border-borderColor bg-white"
              >
                <Image
                  src="/images/feature-img.jpg"
                  alt="profile cover"
                  width={350}
                  height={90}
                  className="h-16 w-full object-cover"
                />

                <div className="px-3 pb-3">
                  <div className="-mt-6 h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-gray-100">
                    <Image
                      src="/profile.png"
                      alt={profile.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h4 className="mt-3 line-clamp-2 min-h-[36px] text-[22px] font-semibold leading-[1.2] text-headerColor">
                    {profile.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 min-h-[30px] text-[13px] leading-[1.2] text-descriptionColor">
                    {profile.role}
                  </p>

                  <p className="mt-4 flex items-center gap-1 text-[11px] text-descriptionColor">
                    <Image
                      src="/profile.png"
                      alt="mutual"
                      width={16}
                      height={16}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    <span className="truncate">{profile.mutualText}</span>
                  </p>

                  <button
                    type="button"
                    className="mt-3 h-8 w-full rounded-full border border-[#cfd5da] text-[14px] font-medium text-[#1f9cd6] hover:bg-[#eff9fe]"
                  >
                    {profile.buttonText}
                  </button>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}

export default ConnectionRequestSection;
