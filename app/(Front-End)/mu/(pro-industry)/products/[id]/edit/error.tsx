"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product edit page error:", error);
  }, [error]);

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4 text-center">
      <div className="p-6 bg-white border border-borderColor rounded-2xl shadow-xs space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-headerColor">
          Unable to Load Product Edit Page
        </h2>
        <p className="text-sm text-descriptionColor leading-relaxed">
          {error?.message ||
            "Something went wrong while loading this product. Please try again or return to your products dashboard."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2 text-sm font-medium rounded-lg border border-borderColor hover:bg-gray-50 transition cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/mu/products"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-primaryColor text-white hover:bg-primaryColor/90 transition"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
