import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ImageIcon, Smile } from "lucide-react";
import Image from "next/image";
import CommentRow from "./CommentCard";

type CommentItem = {
  id: number;
  depth?: number;
  message?: string;
  showReply?: boolean;
  replyComments?: CommentItem[];
};

const mainComment: CommentItem[] = [
  {
    id: 1,
    showReply: true,
    message: "This is a sample comment.",
    replyComments: [
      { id: 2, message: "This is a sample comment reply one." },
      { id: 3, message: "This is a sample comment reply two." },
      { id: 4, message: "This is a sample comment reply three." },
    ],
  },
];

function PostComment() {
  return (
    <section className=" border-t border-borderColor comment-section  p-4">
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

      <div className="mt-4 space-y-4 ">
        <Accordion type="single" collapsible defaultValue="replies">
          {mainComment.map((item) => (
            <AccordionItem
              value="replies"
              className="border-b-0 "
              key={item?.id}
            >
              <AccordionTrigger className="py-2 pl-10 text-[15px] cursor-pointer font-semibold text-headerColor hover:no-underline">
                <CommentRow item={item}  />
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="space-y-5">
                  {item?.replyComments.map((reply) => (
                    <CommentRow key={reply.id} item={reply} depth={1} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
