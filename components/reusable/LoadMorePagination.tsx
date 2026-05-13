import { Loader } from "lucide-react";
import React from "react";

function LoadMorePagination({
  setPage,
  isFetching,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isFetching: boolean;
}) {
  return (
    <div className="flex justify-center w-full cursor-pointer">
      <button
        className="mt-4 px-4 py-2 cursor-pointer disabled:bg-bgColor disabled:text-grayColor1 disabled:cursor-not-allowed  bg-primaryColor text-white rounded"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={isFetching}
      >
        {isFetching ? <Loader className="animate-spin" /> : "Load More"}
      </button>
    </div>
  );
}

export default LoadMorePagination;
