import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import CommentBoxArea from "./CommentBoxArea";
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
    <section className=" border-t border-borderColor comment-section py-4 md:py-4">
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
        <div className="flex-1">
          <CommentBoxArea />
        </div>
      </div>

      <div className="mt-4 space-y-4 ">
        <Accordion type="single" collapsible defaultValue="replies">
          {mainComment.map((item) => (
            <AccordionItem
              value="replies"
              className="border-b-0 relative after:content-[''] after:top-0 after:left-0  after:ml-1  after:w-2 after:h-full after:bg-blue-500 after:rounded-full "
              key={item?.id}
            >
              <AccordionTrigger className="py-3 pb-6  text-[15px] cursor-pointer font-semibold text-headerColor hover:no-underline">
                <CommentRow item={item} depth={0} />
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
