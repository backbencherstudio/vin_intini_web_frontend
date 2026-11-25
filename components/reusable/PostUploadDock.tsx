"use client";

import {
  dismissUpload,
  toggleMinimize,
} from "@/feature/slice/postUpload/postUploadSlice";
import { RootState } from "@/feature/store";
import { cn } from "@/lib/utils";
import {
  cancelBackgroundPostUpload,
  retryBackgroundPostUpload,
} from "@/services/postUploadService";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Loader2,
  RefreshCw,
  Video,
  X,
} from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PostUploadDock() {
  const dispatch = useDispatch();
  const {
    active,
    isMinimized,
    stage,
    progress,
    loadedBytes,
    totalBytes,
    fileName,
    fileSize,
    isVideo,
    error,
    successMessage,
    postExcerpt,
  } = useSelector((state: RootState) => state.postUpload);

  if (!active) return null;

  const formatMb = (bytes: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <aside
      aria-label="Upload manager"
      className="fixed bottom-4 right-4 z-[99999] w-[320px] sm:w-[360px] overflow-hidden rounded-lg border border-borderColor bg-white shadow-xl"
    >
      {/* Header bar (always visible, fixed height) */}
      <div className="flex h-11 items-center justify-between border-b border-borderColor bg-gray-50/90 px-3.5">
        <div className="flex items-center gap-2 overflow-hidden">
          {stage === "uploading" && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primaryColor" />
          )}
          {stage === "processing" && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-500" />
          )}
          {stage === "success" && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          )}
          {stage === "error" && (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}

          <div className="truncate text-xs font-semibold text-headerColor">
            {stage === "uploading" && `Uploading post (${progress}%)`}
            {stage === "processing" &&
              (isVideo ? "Processing video..." : "Publishing post...")}
            {stage === "success" && (successMessage || "Post published successfully")}
            {stage === "error" && "Upload failed"}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(toggleMinimize())}
            className="cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 transition-colors"
            title={isMinimized ? "Expand" : "Collapse"}
          >
            {isMinimized ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => cancelBackgroundPostUpload()}
            className="cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-200/70 hover:text-gray-700 transition-colors"
            title={stage === "uploading" ? "Cancel upload" : "Close"}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {!isMinimized && (
        <div className="p-3.5 space-y-3">
          {/* File summary */}
          {(fileName || postExcerpt) && (
            <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-[#F8FAFC] px-2.5 py-2 text-xs text-headerColor">
              {isVideo ? (
                <Video className="h-3.5 w-3.5 shrink-0 text-primaryColor" />
              ) : (
                <ImageIcon className="h-3.5 w-3.5 shrink-0 text-primaryColor" />
              )}
              <span className="truncate font-medium">
                {fileName || postExcerpt}
              </span>
              {fileSize && (
                <span className="shrink-0 text-gray-400 font-mono text-[11px]">
                  ({fileSize})
                </span>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-200",
                  stage === "uploading" && "bg-primaryColor",
                  stage === "processing" && "w-full bg-amber-500 animate-pulse",
                  stage === "success" && "w-full bg-emerald-500",
                  stage === "error" && "w-full bg-rose-500",
                )}
                style={
                  stage === "uploading"
                    ? { width: `${Math.max(4, progress)}%` }
                    : undefined
                }
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>
                {stage === "uploading" && `Uploading... ${progress}%`}
                {stage === "processing" &&
                  (isVideo
                    ? "Optimizing video on server..."
                    : "Optimizing image & saving post...")}
                {stage === "success" && "Complete"}
                {stage === "error" && (error || "Upload failed")}
              </span>

              {stage === "uploading" && totalBytes > 0 && (
                <span className="font-mono text-gray-400">
                  {formatMb(loadedBytes)} / {formatMb(totalBytes)}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons on error */}
          {stage === "error" && (
            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => cancelBackgroundPostUpload()}
                className="cursor-pointer rounded border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => retryBackgroundPostUpload()}
                className="flex items-center gap-1 cursor-pointer rounded bg-primaryColor px-2.5 py-1 text-xs font-semibold text-white hover:bg-primaryColor/90 transition"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
