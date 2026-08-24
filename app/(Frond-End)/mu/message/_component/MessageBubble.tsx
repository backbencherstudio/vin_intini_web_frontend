import dayjs from "dayjs";
import MessageFileRenderer from "./MessageFileRenderer";
import MessageReactEmojiAction from "./MessageReactEmojiAction";
import MessageReactions from "./MessageReactions";

interface MessageBubbleProps {
  msg: any;
  onReact: (messageId: number, emoji: string) => void;
  onViewFile: (url: string) => void;
}

const TIME_FORMAT = "hh:mm A";
const HOVER_ACTIONS_CLASS =
  "opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200";

function BubbleContent({
  msg,
  variant,
  onViewFile,
}: {
  msg: any;
  variant: "sender" | "receiver";
  onViewFile: (url: string) => void;
}) {
  return (
    <>
      {msg?.message}
      {(msg?.type === "file" || msg?.type === "voice") && msg?.file_url && (
        <MessageFileRenderer
          msg={msg}
          variant={variant}
          onViewFile={onViewFile}
        />
      )}
      <MessageReactions reactions={msg?.reactions} variant={variant} />
    </>
  );
}

export default function MessageBubble({
  msg,
  onReact,
  onViewFile,
}: MessageBubbleProps) {
  if (!msg.is_mine) {
    return (
      <div className="flex group/message items-center gap-2">
        <div className="max-w-xs relative bg-[#F3F4F6] border border-[#F3F4F6]! p-2 rounded-t-xl rounded-r-xl text-sm">
          <BubbleContent
            msg={msg}
            variant="receiver"
            onViewFile={onViewFile}
          />
        </div>
        <div>
          <span className="text-[12px] text-nowrap text-gray-400">
            {dayjs(msg?.created_at).format(TIME_FORMAT)}
          </span>
          <div className={HOVER_ACTIONS_CLASS}>
            <MessageReactEmojiAction
              onReact={onReact}
              type="receiver"
              id={msg.id}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xs group/message ml-auto">
      <div className="flex items-center justify-end w-full gap-2">
        <div className="flex flex-col items-end">
          <span className="text-[12px] text-nowrap text-gray-400">
            {dayjs(msg?.created_at).format(TIME_FORMAT)}
          </span>
          <div className={HOVER_ACTIONS_CLASS}>
            <MessageReactEmojiAction
              onReact={onReact}
              type="sender"
              id={msg.id}
            />
          </div>
        </div>

        <div className="border relative border-primaryColor bg-primaryColor text-whiteColor p-2 rounded-t-xl rounded-l-xl text-sm">
          <BubbleContent msg={msg} variant="sender" onViewFile={onViewFile} />
        </div>
      </div>
    </div>
  );
}
