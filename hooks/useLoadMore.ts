import { useEffect, useState } from "react";

export function useLoadMore(
  data,
  isFetching,
  limit = 10,
  resetKey = undefined,
) {
  const [page, setPage] = useState(1);
  const [combinedData, setCombinedData] = useState([]);

  // Reset combined data when reset key changes (e.g., search query)
  useEffect(() => {
    if (resetKey === undefined) return;
    setCombinedData([]);
    setPage(1);
  }, [resetKey]);

  // Accumulate data from each page only when data is actually available
  useEffect(() => {
    if (!data?.data) return;
    if (isFetching) return;

    setCombinedData((prev) => {
      if (page === 1) {
        return data.data;
      }

      const merged = [...prev];
      data.data.forEach((newItem) => {
        const existingIndex = merged.findIndex(
          (oldItem) => oldItem.id === newItem.id,
        );

        if (existingIndex === -1) {
          merged.push(newItem);
        } else {
          merged[existingIndex] = newItem;
        }
      });

      return merged;
    });
  }, [data, page, isFetching]);

  const hasMore =
    data?.data && data?.data?.length > 0 && data?.data?.length === limit;

  return {
    page,
    setPage,
    combinedData,
    hasMore,
  };
}
