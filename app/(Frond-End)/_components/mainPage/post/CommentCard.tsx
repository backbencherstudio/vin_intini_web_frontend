import Image from "next/image";

export default function CommentRow({
  depth = 0,
  showReply = false,
  item,
}: {
  depth?: number;
  showReply?: boolean;
  item: any;
}) {
  return (
    <div
      className={`${depth > 0 ? "ml-6  pl-5" : " border-l border-borderColor h-full"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/profile.png"
              alt="Profile"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm leading-9 font-semibold text-headerColor">
              {item?.name || "Profile Name"}
            </h4>
            <p className="truncate line-clamp-1 text-[13px] leading-5 text-descriptionColor">
              {item?.title || "Title (whether its a concise or long title, all the text will be in single line. Truncate the sentence i...)"}
            </p>
          </div>
        </div>

        <span className="shrink-0 text-[14px] leading-5 text-headerColor">
          1h ago
        </span>
      </div>

      <p className="mt-2 pl-10 text-base leading-[150%] text-headerColor/90">
        {item?.message || "This is a sample comment."}
      </p>

      <div className="mt-2 pl-10 flex items-center gap-3 text-[15px] font-medium text-headerColor/85">
        <button type="button" className="cursor-pointer hover:opacity-80">
          Like
        </button>
        <span className="text-headerColor/65">10</span>
        {showReply && (
          <>
            <span className="text-headerColor/45">|</span>
            <button type="button" className="cursor-pointer hover:opacity-80">
              Reply
            </button>
            <span className="text-headerColor/65">100</span>
          </>
        )}
      </div>
    </div>
  );
}
