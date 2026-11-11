"use client";

import Pagination from "@/components/reusable/Pagination";
import AdminFilterPopover from "@/components/reusable/dashboard/AdminFilterPopover";
import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeletePostBaccalaureateProgramMutation,
  useGetAllPostBaccalaureateProgramsQuery,
  useGetPostBaccalaureateCategoriesQuery,
} from "@/feature/slice/admin/academia/PostBaccalaureateSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import {
  PostBaccalaureateCategoryType,
  PostBaccalaureateProgramType,
} from "@/lib/type";
import { MoveUpRight, Plus, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PostBaccalaureateCategoryManager from "./PostBaccalaureateCategoryManager";
import PostBaccalaureateModal from "./PostBaccalaureateModal";

type ProgramTableRow = PostBaccalaureateProgramType & {
  rowNumber: number;
};

export default function PostBaccalaureate() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] =
    useState<PostBaccalaureateProgramType | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<PostBaccalaureateProgramType | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: stateResponse } = useGetAllStateQuery({});
  const { data: categoriesResponse } = useGetPostBaccalaureateCategoriesQuery();
  const { data: programsResponse, isLoading } =
    useGetAllPostBaccalaureateProgramsQuery({
      search: debouncedSearch || undefined,
      state_id: selectedStateId || undefined,
      category_id: selectedCategoryId || undefined,
      per_page: perPage,
      page: currentPage,
    });

  const [deleteProgram] = useDeletePostBaccalaureateProgramMutation();

  const states: Array<{ id: number; name: string }> = stateResponse?.data || [];
  const categories: PostBaccalaureateCategoryType[] =
    categoriesResponse?.data || [];
  const programs = useMemo(
    () => programsResponse?.data ?? [],
    [programsResponse?.data],
  );
  const pagination = programsResponse?.pagination;

  const tableRows: ProgramTableRow[] = useMemo(
    () =>
      programs.map((item, idx) => ({
        ...item,
        rowNumber: (currentPage - 1) * perPage + idx + 1,
      })),
    [programs, currentPage, perPage],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedStateId) count += 1;
    if (selectedCategoryId) count += 1;
    return count;
  }, [selectedStateId, selectedCategoryId]);

  const handleResetFilters = () => {
    setSelectedStateId("");
    setSelectedCategoryId("");
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: ProgramTableRow) => {
    setEditingProgram(row);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    try {
      await deleteProgram(deleteTarget.id).unwrap();
      toast.success("Post-baccalaureate program deleted.");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete program.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<ProgramTableRow>[] = [
    {
      header: "No.",
      accessor: "rowNumber",
      cell: (row) => (
        <span className="overflow-hidden text-[#0A0A0A] text-ellipsis text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.rowNumber}
        </span>
      ),
    },
    {
      header: "Program Name",
      accessor: "program_name",
      cell: (row) => (
        <div className="max-w-[260px]">
          <span className="block text-[#0A0A0A] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
            {row.program_name}
          </span>
          {row.location && (
            <span className="block text-xs text-gray-500 mt-0.5 truncate">
              {row.location}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "State",
      accessor: "state_name",
      cell: (row) => (
        <CustomBadge color="gray">
          {row.state_name || row.state || "—"}
        </CustomBadge>
      ),
    },
    {
      header: "Degree/Recognition",
      accessor: "degree_recognitions",
      cell: (row) => (
        <div className="flex flex-wrap gap-1.5 max-w-[260px]">
          {row.degree_recognitions && row.degree_recognitions.length > 0 ? (
            row.degree_recognitions.map((deg) => (
              <CustomBadge
                key={deg}
                color="green"
                className="text-[13px] font-normal text-[#0A0A0A]"
              >
                {deg}
              </CustomBadge>
            ))
          ) : (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
      ),
    },
    {
      header: "Map Pin (Lat,Long)",
      accessor: "map_pin",
      cell: (row) => {
        const lat = row.latitude ?? row.map_pin?.latitude;
        const lng = row.longitude ?? row.map_pin?.longitude;
        return lat && lng ? (
          <span className="text-[#006EFF] text-xs font-semibold">
            {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
          </span>
        ) : (
          <CustomBadge color="yellow">No Pin</CustomBadge>
        );
      },
    },
    {
      header: "Website",
      accessor: "website",
      cell: (row) =>
        row.website ? (
          <a
            href={
              /^https?:\/\//i.test(row.website)
                ? row.website
                : `https://${row.website}`
            }
            target="_blank"
            rel="noreferrer"
            className="flex gap-1 text-[#006EFF] items-center text-[14px] font-semibold leading-[132%] tracking-[0.06px] cursor-pointer"
          >
            <MoveUpRight className="h-4 w-4" /> visit
          </a>
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <CustomTitleDescription
        title="Manage Post-Baccalaureate Programs"
        description={`${(pagination?.total ?? programs.length).toLocaleString()} post-baccalaureate programs`}
        action={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add New Program
          </button>
        }
      />

      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:w-auto">
          <TabsTrigger value="programs" className="cursor-pointer">
            Programs ({pagination?.total ?? programs.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="cursor-pointer">
            Filter Categories ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="flex w-full flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#808897]" />
              <CustomInput
                aria-label="Search post-baccalaureate program"
                className="pl-8"
                placeholder="Search university, location, or website..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <AdminFilterPopover
              title="Filter programs"
              activeCount={activeFilterCount}
              onReset={handleResetFilters}
            >
              <div className="space-y-3">
                <CustomSelect
                  label="State"
                  value={selectedStateId || "default"}
                  onChange={(val) => {
                    setSelectedStateId(val === "default" ? "" : String(val));
                    setCurrentPage(1);
                  }}
                  options={[
                    { label: "All states", value: "default" },
                    ...states.map((st) => ({
                      label: st.name,
                      value: String(st.id),
                    })),
                  ]}
                  placeholder="All states"
                />

                <CustomSelect
                  label="Degree / Recognition"
                  value={selectedCategoryId || "default"}
                  onChange={(val) => {
                    setSelectedCategoryId(val === "default" ? "" : String(val));
                    setCurrentPage(1);
                  }}
                  options={[
                    { label: "All categories", value: "default" },
                    ...categories.map((cat) => ({
                      label: cat.name,
                      value: String(cat.id),
                    })),
                  ]}
                  placeholder="All categories"
                />
              </div>
            </AdminFilterPopover>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              Loading post-baccalaureate programs...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={tableRows}
              onEdit={handleOpenEdit}
              onDelete={(row) => setDeleteTarget(row)}
            />
          )}

          <Pagination
            page={pagination?.current_page || currentPage}
            pageSize={pagination?.per_page ?? perPage}
            total={pagination?.total ?? 0}
            totalPages={pagination?.last_page ?? 1}
            onPageChange={setCurrentPage}
            showPageSize
            onPageSizeChange={(size) => {
              setPerPage(size);
              setCurrentPage(1);
            }}
          />
        </TabsContent>

        <TabsContent value="categories">
          <PostBaccalaureateCategoryManager />
        </TabsContent>
      </Tabs>

      <PostBaccalaureateModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        editingProgram={editingProgram}
      />

      <CustomDeletModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
        title="Delete Post-Baccalaureate Program"
        description={`Are you sure you want to delete "${deleteTarget?.program_name || ""}"?`}
      />
    </div>
  );
}
