"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { useGetInstitutionReportsQuery, useGetInstitutionStudentsQuery } from "@/feature/slice/admin/reports/adminReportApi";

export default function InstitutionReports() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<{ id: number | string; name: string } | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const { data, isLoading, isError } = useGetInstitutionReportsQuery({ search: search || undefined, page });
  const studentsQuery = useGetInstitutionStudentsQuery({ id: selected?.id ?? 0, search: studentSearch || undefined, page: studentPage, per_page: 10 }, { skip: !selected });
  const pagination = data?.pagination;
  const studentPagination = studentsQuery.data?.pagination;

  return <section className="space-y-6">
    <CustomTitleDescription title="Institution reports" description="Review enrollment and program activity by institution." action={<div className="relative w-full max-w-sm"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><CustomInput aria-label="Search institutions" className="pl-9" placeholder="Search institutions" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>} />
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <p className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">{pagination?.total ?? 0} institutions</p>
      {isLoading ? <p className="p-5 text-sm text-gray-500">Loading institution reports…</p> : null}
      {isError ? <p className="p-5 text-sm text-red-600">Institution reports could not be loaded.</p> : null}
      {!isLoading && !isError && !data?.data.length ? <p className="p-5 text-sm text-gray-500">No institutions found.</p> : null}
      {!!data?.data.length && <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm leading-5 text-gray-700"><thead className="border-b border-gray-200 bg-gray-50 text-sm font-medium leading-5 text-gray-600"><tr>{["No.", "Institution", "Students", "Current", "Completed", ""].map((heading, i) => <th key={heading || i} className="whitespace-nowrap px-4 py-3 text-left font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{data.data.map((row) => <tr key={row.id} className="transition-colors hover:bg-gray-50"><td className="px-4 py-3 align-middle text-gray-500">{row.sl_no}</td><td className="px-4 py-3 align-middle font-medium text-gray-800">{row.institution_name}</td><td className="px-4 py-3 align-middle">{row.total_students}</td><td className="px-4 py-3 align-middle">{row.present_students}</td><td className="px-4 py-3 align-middle">{row.completed_programs}</td><td className="px-4 py-3 align-middle"><button onClick={() => { setSelected({ id: row.id, name: row.institution_name }); setStudentPage(1); }} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"><Users className="h-3.5 w-3.5" /> Students</button></td></tr>)}</tbody></table></div>}
      {pagination && pagination.last_page > 1 && <Pager page={page} lastPage={pagination.last_page} onChange={setPage} />}
    </div>

    <CustomModal open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }} title={selected?.name ? `${selected.name} students` : "Institution students"} size="xl">
      <div className="space-y-4 p-2"><div className="relative w-full max-w-sm"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><CustomInput aria-label="Search students" className="pl-9" placeholder="Search students" value={studentSearch} onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }} /></div>
        {studentsQuery.isLoading ? <p className="text-sm text-gray-500">Loading students…</p> : studentsQuery.isError ? <p className="text-sm text-red-600">Students could not be loaded.</p> : <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm leading-5 text-gray-700"><thead className="border-b border-gray-200 bg-gray-50 text-sm font-medium leading-5 text-gray-600"><tr>{["Student", "Program", "Field", "Academic period", "Status"].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 text-left font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{studentsQuery.data?.data.map((student, index) => <tr key={`${student.student_email}-${index}`} className="transition-colors hover:bg-gray-50"><td className="px-4 py-3 align-middle"><p className="font-medium text-gray-800">{student.student_name || "Unknown"}</p><p className="text-xs text-gray-500">{student.student_email || "—"}</p></td><td className="px-4 py-3 align-middle">{student.program || "—"}</td><td className="px-4 py-3 align-middle">{student.field || "—"}</td><td className="px-4 py-3 align-middle">{student.academic_period}</td><td className="px-4 py-3 align-middle">{student.status}</td></tr>)}</tbody></table>{!studentsQuery.data?.data.length && <p className="p-4 text-sm text-gray-500">No students found.</p>}</div>}
        {studentPagination && studentPagination.last_page > 1 && <Pager page={studentPage} lastPage={studentPagination.last_page} onChange={setStudentPage} />}
      </div>
    </CustomModal>
  </section>;
}

function Pager({ page, lastPage, onChange }: { page: number; lastPage: number; onChange: (page: number) => void }) {
  return <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-4 text-sm"><button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-md border px-3 py-2 disabled:opacity-40">Previous</button><span className="text-gray-500">Page {page} of {lastPage}</span><button disabled={page >= lastPage} onClick={() => onChange(page + 1)} className="rounded-md border px-3 py-2 disabled:opacity-40">Next</button></div>;
}
