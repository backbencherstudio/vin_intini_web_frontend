"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 flex items-center justify-center min-h-screen p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {error?.message ||
              "An unexpected error occurred. Please try reloading the page."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-[#04a1b7] text-white hover:bg-[#03899c] transition cursor-pointer"
            >
              Reload Page
            </button>
            <a
              href="/mu/home"
              className="px-5 py-2 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
