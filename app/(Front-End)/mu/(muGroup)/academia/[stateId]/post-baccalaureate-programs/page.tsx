"use client";

import Pagination from "@/components/reusable/Pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPostBaccalaureateProgramsQuery } from "@/feature/slice/academia/academiaSlice";
import { PostBaccalaureateCategoryType } from "@/lib/type";
import { Limits } from "@/public/staticData";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";
import TableLoading from "../grad-undergrad-programs/_components/TableLoading";
import PostBaccalaureateTable from "./_components/PostBaccalaureateTable";

export default function PostBaccalaureateProgramsPage() {
  const params = useParams<{ stateId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const stateId = params?.stateId || "";
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const prevSearchRef = useRef<string>("");

  const { data, isLoading, isFetching } = useGetPostBaccalaureateProgramsQuery(
    {
      id: stateId,
      limit,
      page: currentPage,
      searchItem: search,
      category: selectedCategory === "all" ? "" : selectedCategory,
      sort,
    },
    { skip: !stateId },
  );

  const filterData = useMemo(() => {
    const categories: PostBaccalaureateCategoryType[] =
      data?.categories || [];
    return categories.map((category) => ({
      key: category.name,
      label: category.name,
    }));
  }, [data?.categories]);

  const handleSearch = useCallback((value: string) => {
    if (prevSearchRef.current === value) {
      return;
    }
    prevSearchRef.current = value;
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  const handleToggleSort = useCallback(() => {
    setSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", String(page));
    router.replace(`?${nextParams.toString()}`, { scroll: false });
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setCurrentPage(1);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", "1");
    router.replace(`?${nextParams.toString()}`, { scroll: false });
  };

  return (
    <div className="xl:pl-6 space-y-6 min-w-0">
      <AcademiHeader
        title="Post-Baccalaureate Programs"
        description="Select a University and Click Map Pin for Website."
        filterData={filterData}
        selectedDegree={selectedCategory}
        setSelectedDegree={handleFilterChange}
        onSearch={handleSearch}
        searchPlaceHolder="Search Degree/ University..."
      />

      {isLoading || isFetching ? (
        <TableLoading />
      ) : (
        <PostBaccalaureateTable
          data={data?.data || []}
          currentPage={currentPage}
          limit={limit}
          sort={sort}
          onToggleSort={handleToggleSort}
        />
      )}

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center sm:justify-end">
        <Pagination
          page={currentPage}
          pageSize={limit}
          total={data?.total ?? 0}
          totalPages={data?.total_page || data?.last_page || 1}
          onPageChange={handlePageChange}
        />
        <div className="mt-5">
          <Select
            value={limit.toString()}
            onValueChange={(value) => handleLimitChange(Number(value))}
          >
            <SelectTrigger className="bg-white min-w-20 focus-visible:border-[#A5A5AB] focus-visible:ring-0">
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Limits.map((item) => (
                  <SelectItem key={item} value={item.toString()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
