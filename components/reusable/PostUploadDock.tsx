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

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <aside
        aria-label="Upload status dock"
        className="fixed bottom-5 right-5 z-[99999] flex items-center gap-2.5 rounded-full border border-borderColor bg-white/95 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-[1.02]"
      >
        {stage === "uploading" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-primaryColor" />
            <span className="text-xs font-semibold text-headerColor">
              Uploading {progress}%
            </span>
          </>
        )}

        {stage === "processing" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span className="text-xs font-semibold text-amber-600">
              Processing video...
            </span>
          </>
        )}

        {stage === "success" && (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">
              Post published!
            </span>
          </>
        )}

        {stage === "error" && (
          <>
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-semibold text-rose-600">
              Upload failed
            </span>
          </>
        )}

        <button
          type="button"
          onClick={() => dispatch(toggleMinimize())}
          className="ml-1 cursor-pointer rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-headerColor"
          title="Expand"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>

        {(stage === "success" || stage === "error") && (
          <button
            type="button"
            onClick={() => dispatch(dismissUpload())}
            className="cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </aside>
    );
  }

  // Expanded Dock Card View
  return (
    <aside
      aria-label="Background upload manager"
      className="fixed bottom-5 right-5 z-[99999] w-[330px] sm:w-[380px] overflow-hidden rounded-xl border border-borderColor bg-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-borderColor bg-gray-50/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          {stage === "uploading" && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primaryColor/10 text-primaryColor">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </div>
          )}
          {stage === "processing" && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </div>
          )}
          {stage === "success" && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          )}
          {stage === "error" && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-headerColor">
              {stage === "uploading" && "Publishing your post..."}
              {stage === "processing" && "Processing & optimizing video..."}
              {stage === "success" && (successMessage || "Post published successfully!")}
              {stage === "error" && "Post upload failed"}
            </h4>
            <p className="text-[11px] text-gray-500">
              {stage === "uploading" && "Uploading media to server"}
              {stage === "processing" && "Encoding video for fast playback"}
              {stage === "success" && "Now visible on your newsfeed"}
              {stage === "error" && "An error occurred during submission"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => dispatch(toggleMinimize())}
            className="cursor-pointer rounded-md p-1.5 text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 transition-colors"
            title="Minimize"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => cancelBackgroundPostUpload()}
            className="cursor-pointer rounded-md p-1.5 text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 transition-colors"
            title={stage === "uploading" ? "Cancel upload" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3">
        {/* File / Excerpt Badge */}
        {(fileName || postExcerpt) && (
          <div className="flex items-center gap-2 rounded-lg border border-borderColor bg-[#F8FAFC] p-2.5 text-xs text-headerColor">
            {isVideo ? (
              <Video className="h-4 w-4 shrink-0 text-primaryColor" />
            ) : (
              <span className="text-base leading-none">✍️</span>
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

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                stage === "uploading" && "bg-gradient-to-r from-primaryColor to-[#00c4cc]",
                stage === "processing" && "w-full bg-amber-500 animate-pulse",
                stage === "success" && "w-full bg-emerald-500",
                stage === "error" && "w-full bg-rose-500",
              )}
              style={
                stage === "uploading"
                  ? { width: `${Math.max(5, progress)}%` }
                  : undefined
              }
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <span>
              {stage === "uploading" && `Uploading... ${progress}%`}
              {stage === "processing" && "Almost ready..."}
              {stage === "success" && "100% complete"}
              {stage === "error" && "Failed"}
            </span>

            {stage === "uploading" && totalBytes > 0 && (
              <span className="font-mono text-gray-400">
                {formatMb(loadedBytes)} / {formatMb(totalBytes)}
              </span>
            )}
          </div>
        </div>

        {/* Action button if error */}
        {stage === "error" && (
          <div className="pt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => cancelBackgroundPostUpload()}
              className="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => retryBackgroundPostUpload()}
              className="flex items-center gap-1.5 cursor-pointer rounded-md bg-primaryColor px-3 py-1.5 text-xs font-semibold text-white hover:bg-primaryColor/90 transition"
            >
              <RefreshCw className="h-3 w-3" />
              Retry Upload
            </button>
          </div>
        )}

        {/* Subtext info */}
        {stage !== "error" && (
          <p className="text-[11px] text-gray-400 leading-tight">
            💡 You can freely navigate, browse the feed, or close modals — your post will keep publishing smoothly in the background.
          </p>
        )}
      </div>
    </aside>
  );
}
