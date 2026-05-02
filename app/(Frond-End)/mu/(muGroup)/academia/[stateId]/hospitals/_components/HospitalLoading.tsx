import React from 'react';

const HospitalLoading = () => {
  // 10 rows to match your UI
  const rows = Array.from({ length: 10 });

  return (
    // <div className="w-full max-w-5xl mx-auto p-4 space-y-6 animate-pulse">
    <div className="w-full overflow-hidden animate-pulse">
      {/* Title Placeholder */}
      <div className="h-9 w-72 bg-slate-200 rounded-lg mb-6" />

      {/* Tabs Placeholder */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        <div className="h-8 w-32 bg-slate-200/50 rounded-md" /> {/* Active Tab */}
        <div className="h-8 w-32 bg-slate-200/50 rounded-md" />
        <div className="h-8 w-44 bg-slate-200/50 rounded-md" />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="bg-[#F1F5F9] h-12 flex items-center px-6 gap-4 border-b border-slate-100">
          <div className="w-8 h-4 bg-slate-300 rounded" />
          <div className="w-32 h-4 bg-slate-300 rounded" />
          <div className="ml-auto w-32 h-4 bg-slate-300 rounded text-right" />
        </div>

        {/* Table Body Rows */}
        <div className="divide-y divide-slate-50">
          {rows.map((_, index) => (
            <div
              key={index}
              className={`flex items-center px-6 py-4 gap-4 ${index % 2 === 1 ? 'bg-[#F8FAFC]/60' : 'bg-white'}`}
            >
              {/* SL Column */}
              <div className="w-8 h-4 bg-slate-200 rounded" />

              {/* Hospital Name Column */}
              <div className="w-1/3 h-4 bg-slate-200 rounded-md" />

              {/* University Name Column (Aligned Right) */}
              <div className="ml-auto w-1/4 h-4 bg-slate-100 rounded-md" />
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 flex justify-end items-center gap-2 bg-white border-t border-slate-50">
          <div className="h-8 w-20 bg-slate-100 rounded-md" /> {/* Prev */}
          <div className="h-8 w-8 bg-slate-200 rounded-md" /> {/* 1 */}
          <div className="h-8 w-20 bg-slate-100 rounded-md" /> {/* Next */}
          <div className="h-8 w-16 bg-slate-100 rounded-md ml-2" /> {/* Limit */}
        </div>
      </div>
    </div>
  );
};

export default HospitalLoading;