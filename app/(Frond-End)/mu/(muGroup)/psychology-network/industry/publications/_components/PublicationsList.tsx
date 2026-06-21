

import { IndustryCategoryType } from "@/lib/type";
import { PublicationCard } from "./PublicationCard";

export const PublicationsList = ({
  industryData,
}: {
  industryData: IndustryCategoryType[];
}) => {


  return (
    <div className="flex w-full flex-col items-stretch gap-4">
      {/* <div className="w-full min-w-0">
        <FilterTabs
          activeCategoryId={activeCategoryId}
          onFilterChange={handleFilterChange}
          industryData={industryData}
        />
      </div> */}

      <div className="flex w-full flex-col">
        {industryData[0]?.industry_item?.length > 0 ? (
          industryData[0]?.industry_item?.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center border-b border-[#DFE1E7] bg-[#F6F8FA] p-12">
            <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
              No publications found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
