"use client";

import MessageFileRenderer from "./MessageFileRenderer";
import MessageReactEmojiAction from "./MessageReactEmojiAction";

function MessageBubble({
  msg,
  onViewFile,
  onReact,
}: {
  msg: any;
  onViewFile: (url: string) => void;
  onReact: (messageId: number, emoji: string) => void;
}) {
  const isMine = msg?.is_mine;
  const content = (
    <>
      {msg?.message}
      {(msg?.type === "file" || msg?.type === "voice") && msg?.file_url && (
        <MessageFileRenderer
          msg={msg}
          variant={isMine ? "sender" : "receiver"}
          onViewFile={onViewFile}
        />
      )}
      {msg?.reactions && msg.reactions.length > 0 && (
        <div
          className={`flex items-center gap-1 absolute -bottom-3 ${
            isMine ? "-left-2" : "-right-2"
          } z-10`}
        >
          {msg.reactions.map((react: any, idx: number) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded-full shadow-md bg-white border border-gray-100 text-xs flex items-center gap-0.5"
            >
              <span>{react.reaction}</span>
              {react.count > 1 && (
                <span className="text-[10px] font-semibold text-gray-600">
                  {react.count}
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </>
  );

  if (isMine) {
    return (
      <div className="max-w-xs group/message ml-auto">
        <div className="flex items-center justify-end w-full   gap-2">
          <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
            <MessageReactEmojiAction
              onReact={onReact}
              type="sender"
              id={msg.id}
            />
          </div>
          <div className="border relative border-primaryColor bg-primaryColor text-whiteColor p-2 rounded-t-xl rounded-l-xl text-sm">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex group/message items-center gap-2">
      <div className="max-w-xs relative bg-[#F3F4F6] border border-[#F3F4F6]! p-2 rounded-t-xl rounded-r-xl text-sm">
        {content}
      </div>
      <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
        <MessageReactEmojiAction
          onReact={onReact}
          type="receiver"
          id={msg.id}
        />
      </div>
    </div>
  );
}

export default MessageBubble;