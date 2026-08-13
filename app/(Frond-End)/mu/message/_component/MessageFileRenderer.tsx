"use client";

import { FileText, Film, Headphones, ImageIcon } from "lucide-react";

function MessageFileRenderer({
  msg,
  variant,
  onViewFile,
}: {
  msg: any;
  variant: "sender" | "receiver";
  onViewFile?: (url: string) => void;
}) {
  const category = (msg?.file_category || "").toLowerCase();
  const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(
    msg?.file_name || msg?.file_url,
  );
  const isVideo =
    category === "video" ||
    /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(msg?.file_name || msg?.file_url);
  const isAudio =
    category === "audio" ||
    /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(msg?.file_name || msg?.file_url);
  const isPdf =
    category === "pdf" || /\.pdf$/i.test(msg?.file_name || msg?.file_url);

  const chipClass =
    variant === "sender"
      ? " flex items-center gap-2 bg-white text-headerColor rounded-lg px-3 py-2 text-xs cursor-pointer"
      : " flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-xs cursor-pointer";

  if (isImage) {
    return (
      <img
        src={msg?.file_url}
        alt={msg?.file_name || "image"}
        loading="lazy"
        onClick={() => onViewFile?.(msg?.file_url)}
        className="max-h-60 rounded-lg object-cover cursor-pointer"
      />
    );
  }

  if (isVideo) {
    return (
      <video
        src={msg?.file_url}
        controls
        preload="metadata"
        className="max-h-60 rounded-lg bg-black w-72"
      >
        <track kind="captions" />
      </video>
    );
  }

  if (isAudio) {
    return (
      <div className="flex items-center gap-2 bg-white/40 rounded-lg px-1 py-1">
        <Headphones className="shrink-0" />
        <audio
          src={msg?.file_url}
          controls
          preload="metadata"
          className="h-8 w-52"
        />
      </div>
    );
  }

  return (
    <div className={chipClass} onClick={() => onViewFile?.(msg?.file_url)}>
      {isPdf ? (
        <FileText className="w-4 h-4" />
      ) : (
        <ImageIcon className="w-4 h-4" />
      )}
      <span className="truncate max-w-40">
        {msg?.file_name || (isPdf ? "PDF File" : "File")}
      </span>
      {isPdf && <Film className="w-3.5 h-3.5 opacity-60" />}
    </div>
  );
}

export default MessageFileRenderer;
