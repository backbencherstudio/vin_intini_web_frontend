"use client";

import { DeletIcon, EditIcon, ViewIcon } from "@/public/svgIcons/AdminIcon";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];

  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
};

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
}: DataTableProps<T>) {
  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="admin-data-table w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium leading-5 text-gray-600"
                >
                  {col.header}
                </th>
              ))}

              {(onEdit || onDelete || onView) && (
                <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium leading-5 text-gray-600">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3 align-middle text-sm leading-5 text-gray-700 ${
                        col.className || ""
                      }`}
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessor
                          ? String(row[col.accessor] ?? "")
                          : null}
                    </td>
                  ))}

                  {(onEdit || onDelete || onView) && (
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center justify-center gap-3">
                        {onView && (
                          <button
                            type="button"
                            onClick={() => onView(row)}
                            className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <ViewIcon className="w-4 h-4" />
                          </button>
                        )}

                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <DeletIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length + (onEdit || onDelete || onView ? 1 : 0)
                  }
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
