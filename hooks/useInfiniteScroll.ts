import { useState, useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(data, isFetching, isLoading) {
  const [page, setPage] = useState(1);
  const [combinedData, setCombinedData] = useState([]);

  // Reset or append data when the API response changes
  useEffect(() => {
    if (data?.data) {
      setCombinedData((prev) => {
        const newItems = data.data.filter(
          (newItem) => !prev.some((oldItem) => oldItem.id === newItem.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  const observer = useRef(null);
  
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // If the bottom is reached and the current request returned data, load next
        if (entries[0].isIntersecting && data?.data?.length > 0) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, data]
  );

  return { page, combinedData, lastElementRef };
}