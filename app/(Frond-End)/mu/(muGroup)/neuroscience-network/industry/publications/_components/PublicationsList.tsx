"use client";

import { useState, useMemo } from "react";
import { PublicationCard as PublicationCardType } from "../_mock/publicationsData";
import { PublicationCard } from "./PublicationCard";
import { PublicationsPagination } from "./PublicationsPagination";

interface PublicationsListProps {
  publications: PublicationCardType[];
}

export const PublicationsList = ({ publications }: PublicationsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const DEMO_TOTAL_PAGES = 3;

  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    if (start >= publications.length) {
      return [];
    }

    return publications.slice(start, end);
  }, [publications, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full flex-col pb-20">
        {paginatedPublications.length > 0 ? (
          paginatedPublications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center border-b border-[#DFE1E7] bg-[#F6F8FA] p-12">
            <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
              No more publications to display on this page
            </p>
          </div>
        )}
      </div>

      {/* <div className="flex justify-end pb-10">
        <PublicationsPagination
          currentPage={currentPage}
          totalPages={DEMO_TOTAL_PAGES}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div> */}
    </div>
  );
};
