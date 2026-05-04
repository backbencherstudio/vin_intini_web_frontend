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
    <div className={`${depth > 0 ? "ml-6  pl-5" : " "} relative`}>
      {depth > 0 && (
        <div className="pointer-events-none absolute -left-2.5 -top-4.5 h-9 w-7 rounded-bl-2xl border-l border-b border-borderColor" />
      )}
      <div className="flex items-start gap-2.5">
        <div className="h-8 w-8  overflow-hidden rounded-full">
          <Image
            src={item?.user?.profile_image || "/empty_user.jpg"}
            alt="Profile"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm leading-[140%] font-semibold text-headerColor">
            {item?.user?.name || "Profile Name"}
          </h4>
          <p className=" line-clamp-1 text-[13px] wf font-normal text-descriptionColor">
            {item?.user?.title ||
              "Title (whether its a concise or long title, all the text will be in single line. Truncate the sentence i...)"}
          </p>
        </div>
        <p className="ml-auto shrink-0 font-semibold w-fit text-[14px] leading-5 text-descriptionColor">
          1h ago
        </p>
      </div>

      <p className="mt-2 pl-10 text-base font-normal leading-[150%] text-descriptionColor">
        {item?.comment || "This is a sample comment."}
      </p>

      <div className="mt-2 pl-10 flex items-center gap-3 text-[14px] font-semibold text-descriptionColor">
        <button
          type="button"
          className="cursor-pointer text-descriptionColor hover:opacity-80"
        >
          Like • 100
        </button>

        {depth == 0 && (
          <>
            <span className="text-headerColor/45">|</span>

            <button
              type="button"
              className="cursor-pointer text-descriptionColor hover:opacity-80"
            >
              Reply • 100
            </button>
          </>
        )}
      </div>
    </div>
  );
}
