import { ImageIcon, Smile } from "lucide-react";
import Image from "next/image";

type CommentItem = {
  id: number;
  depth: number;
  showReply?: boolean;
};

const comments: CommentItem[] = [
  { id: 1, depth: 0, showReply: true },
  { id: 2, depth: 1 },
  { id: 3, depth: 1 },
  { id: 4, depth: 1 },
];

function CommentRow({
  depth,
  showReply = false,
}: {
  depth: number;
  showReply?: boolean;
}) {
  return (
    <div
      className={`${depth > 0 ? "ml-6 border-l border-borderColor pl-5" : ""}`}
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
              Profile Name
            </h4>
            <p className="truncate line-clamp-1 text-[13px] leading-5 text-descriptionColor">
              Title (whether its a concise or long title, all the text will be
              in single line. Truncate the sentence i...)
            </p>
          </div>
        </div>

        <span className="shrink-0 text-[14px] leading-5 text-headerColor">
          1h ago
        </span>
      </div>

      <p className="mt-2 pl-10 text-base leading-[150%] text-headerColor/90">
        I use figma 80% of my work. Even prefer it to Ps and Ai, because it's
        more comfortable. It's simply nicer smooth, nice to work with. I start
        projects for printing in figma and then export or recreate in other
        programs. That's it)
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

function PostComment() {
  return (
    <section className=" border-t border-borderColor  p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/profile.png"
            alt="Current user"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 rounded-xl border border-headerColor/40 bg-bgLightColor p-3">
          <textarea
            placeholder="type..."
            rows={2}
            className="w-full resize-none bg-transparent text-[16px] leading-6 text-headerColor placeholder:text-grayColor1 focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between border-t border-borderColor pt-2.5">
            <div className="flex items-center gap-3 text-descriptionColor">
              <button
                type="button"
                className="cursor-pointer hover:opacity-80"
                aria-label="Add image"
              >
                <ImageIcon size={16} />
              </button>
              <button
                type="button"
                className="cursor-pointer hover:opacity-80"
                aria-label="Add emoji"
              >
                <Smile size={16} />
              </button>
            </div>

            <button
              type="button"
              className="h-8 rounded-full bg-buttonColor px-5 text-[14px] font-semibold text-whiteColor hover:opacity-90 cursor-pointer"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {comments.map((item) => (
          <CommentRow
            key={item.id}
            depth={item.depth}
            showReply={item.showReply}
          />
        ))}
      </div>

      <button
        type="button"
        className="mt-6 text-[16px] font-semibold text-headerColor hover:opacity-80 cursor-pointer"
      >
        See all comments
      </button>
    </section>
  );
}

export default PostComment;
