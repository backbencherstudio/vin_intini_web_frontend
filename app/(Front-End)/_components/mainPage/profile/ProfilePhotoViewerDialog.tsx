"use client";

import {
  DialogDescription,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProfilePhotoMode = "profile" | "cover";

type ProfilePhotoViewerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ProfilePhotoMode;
  onModeChange: (mode: ProfilePhotoMode) => void;
  userName: string;
  profileSrc: string | StaticImageData;
  coverSrc: string | StaticImageData;
  hasCustomProfile?: boolean;
  hasCustomCover?: boolean;
  profileLabel?: string;
  coverLabel?: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function ProfilePhotoViewerDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
  userName,
  profileSrc,
  coverSrc,
  hasCustomProfile = true,
  hasCustomCover = true,
  profileLabel = "Profile Photo",
  coverLabel = "Cover Photo",
}: ProfilePhotoViewerDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);

  const isCover = mode === "cover";
  const activeSrc = isCover ? coverSrc : profileSrc;
  const activeIsCustom = isCover ? hasCustomCover : hasCustomProfile;
  const activeLabel = isCover ? coverLabel : profileLabel;

  const clampZoom = (next: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(next.toFixed(2))));

  const updateZoom = useCallback((nextZoom: number) => {
    const clamped = clampZoom(nextZoom);
    setZoom(clamped);
    if (clamped <= 1) {
      setPan({ x: 0, y: 0 });
    }
  }, []);

  const handleSelectMode = useCallback(
    (nextMode: ProfilePhotoMode) => {
      if (nextMode === mode) return;
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsDragging(false);
      onModeChange(nextMode);
    },
    [mode, onModeChange],
  );

  useEffect(() => {
    if (!open) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        handleSelectMode(mode === "profile" ? "cover" : "profile");
      } else if (event.key === "+" || event.key === "=") {
        updateZoom(zoom + 0.5);
      } else if (event.key === "-") {
        updateZoom(zoom - 0.5);
      } else if (event.key === "0") {
        updateZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, mode, zoom, handleSelectMode, updateZoom]);

  const handleStageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    updateZoom(zoom + delta);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragOriginRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragOriginRef.current) return;
    const dx = e.clientX - dragOriginRef.current.x;
    const dy = e.clientY - dragOriginRef.current.y;
    const maxOffset = (zoom - 1) * 280;
    setPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, dragOriginRef.current.panX + dx)),
      y: Math.max(-maxOffset, Math.min(maxOffset, dragOriginRef.current.panY + dy)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragOriginRef.current = null;
  };

  const switchMode = () => handleSelectMode(isCover ? "profile" : "cover");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-999! bg-black/95 backdrop-blur-md" />
        <DialogPrimitive.Content
          aria-label={`${userName} - ${activeLabel}`}
          className="fixed inset-0 z-9999! flex h-dvh w-screen flex-col overflow-hidden bg-[#07090d]/95 text-white outline-none"
        >
          <VisuallyHidden>
            <DialogTitle>{`${userName} - ${activeLabel}`}</DialogTitle>
            <DialogDescription>
              Full-screen responsive preview for profile and cover photos
            </DialogDescription>
          </VisuallyHidden>

          {/* Full-Width Translucent Top Bar */}
          <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/45 px-3.5 py-2.5 sm:px-6 sm:py-3.5 backdrop-blur-md shrink-0">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                <Image
                  src={profileSrc}
                  alt={userName}
                  width={80}
                  height={80}
                  unoptimized={typeof profileSrc === "string"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm sm:text-base font-semibold text-white leading-tight">
                  {userName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/70 font-medium">
                    {activeLabel}
                  </span>
                  {!activeIsCustom && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Desktop/Tablet Switcher */}
              <div
                role="tablist"
                aria-label="Photo type"
                className="hidden sm:inline-flex items-center rounded-full bg-white/10 p-1 border border-white/10"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "profile"}
                  onClick={() => handleSelectMode("profile")}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    mode === "profile"
                      ? "bg-white text-headerColor shadow-xs"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {profileLabel}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "cover"}
                  onClick={() => handleSelectMode("cover")}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    mode === "cover"
                      ? "bg-white text-headerColor shadow-xs"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {coverLabel}
                </button>
              </div>

              <DialogPrimitive.Close
                aria-label="Close viewer"
                className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
          </header>

          {/* Mobile Switcher Strip */}
          <div
            role="tablist"
            aria-label="Photo type"
            className="grid grid-cols-2 gap-2 border-b border-white/10 bg-black/30 px-3.5 py-2 sm:hidden shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "profile"}
              onClick={() => handleSelectMode("profile")}
              className={`rounded-full py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                mode === "profile"
                  ? "bg-primaryColor text-white shadow-xs"
                  : "bg-white/10 text-white/80 border border-white/10"
              }`}
            >
              {profileLabel}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "cover"}
              onClick={() => handleSelectMode("cover")}
              className={`rounded-full py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                mode === "cover"
                  ? "bg-primaryColor text-white shadow-xs"
                  : "bg-white/10 text-white/80 border border-white/10"
              }`}
            >
              {coverLabel}
            </button>
          </div>

          {/* Full-Screen Stage */}
          <div
            onWheel={handleStageWheel}
            className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden select-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_68%)]"
          >
            {/* Left / Right desktop toggle arrows */}
            <button
              type="button"
              onClick={switchMode}
              aria-label={isCover ? "View profile photo" : "View cover photo"}
              title={
                isCover ? "Switch to Profile Photo" : "Switch to Cover Photo"
              }
              className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 backdrop-blur-md transition hover:bg-white/20 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={switchMode}
              aria-label={isCover ? "View profile photo" : "View cover photo"}
              title={
                isCover ? "Switch to Profile Photo" : "Switch to Cover Photo"
              }
              className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 backdrop-blur-md transition hover:bg-white/20 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Centered Photo Canvas (click outside image to close when not zoomed) */}
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget && zoom <= 1) {
                  onOpenChange(false);
                }
              }}
              onDoubleClick={() => updateZoom(zoom > 1 ? 1 : 2)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative flex h-full w-full items-center justify-center p-3 pb-18 sm:px-20 sm:py-8 sm:pb-20 overflow-hidden ${
                zoom > 1
                  ? isDragging
                    ? "cursor-grabbing touch-none"
                    : "cursor-grab touch-none"
                  : "cursor-zoom-in"
              }`}
            >
              <Image
                key={mode}
                src={activeSrc}
                alt={`${userName} - ${activeLabel}`}
                width={1920}
                height={1280}
                unoptimized={typeof activeSrc === "string"}
                draggable={false}
                sizes="100vw"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 180ms ease-out",
                }}
                className="max-h-full max-w-full w-auto h-auto object-contain select-none rounded-lg shadow-2xl"
              />
            </div>

            {/* Bottom Floating Glass Control Dock */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-white backdrop-blur-md border border-white/15 shadow-2xl max-w-[92vw]">
              <button
                type="button"
                onClick={() => updateZoom(zoom - 0.5)}
                disabled={zoom <= MIN_ZOOM}
                title="Zoom out (-)"
                aria-label="Zoom out"
                className="rounded-full p-1.5 transition hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="min-w-10 text-center text-xs font-medium tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => updateZoom(zoom + 0.5)}
                disabled={zoom >= MAX_ZOOM}
                title="Zoom in (+)"
                aria-label="Zoom in"
                className="rounded-full p-1.5 transition hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              {zoom > 1 && (
                <button
                  type="button"
                  onClick={() => updateZoom(1)}
                  title="Reset zoom (0)"
                  aria-label="Reset zoom"
                  className="rounded-full border-l border-white/15 pl-2 pr-1.5 py-1.5 transition hover:bg-white/15 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
              {typeof activeSrc === "string" && activeSrc.length > 0 && (
                <a
                  href={activeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open original image"
                  aria-label="Open original image"
                  className="inline-flex items-center gap-1 rounded-full border-l border-white/15 pl-2.5 pr-1.5 py-1 text-xs font-medium text-white/90 transition hover:text-white cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Original</span>
                </a>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
