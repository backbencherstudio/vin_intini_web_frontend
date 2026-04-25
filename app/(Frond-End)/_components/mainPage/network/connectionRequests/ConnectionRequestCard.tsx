import { UserMinusIcon } from "@/public/svgIcons/Icons";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { ConnectionActionButtons } from "./ConnectionActionButtons";

function ConnectionRequestCard({
  item,
  allReadyFriends,
}: {
  item: any;
  allReadyFriends?: string;
}) {
  const handleConnectionAction = (id: number, type: string) => {
    console.log(`Action: ${type} for User ID: ${id}`);
  
  };

  const currentStatus = allReadyFriends || item.action || "none";
  return (
    <div>
      <article className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-borderColor py-3">
        <div className="flex h-full items-start gap-3">
          <div className="flex md:h-16 md:w-16  w-12 h-12 items-center justify-center overflow-hidden rounded-full bg-bgColor">
            {item.id === 1 ? (
              <ImageIcon className="h-4 w-4 text-descriptionColor" />
            ) : (
              <Image
                src="/profile.png"
                alt={item.name}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <h4 className=" text-[18px] text-headerColor font-semibold">
              {item.name}
            </h4>
            <p className=" text-[14px] text-descriptionColor">{item.title}</p>
            <div className="flex justify-between items-center">
              {item.mutualText ? (
                <div className="mt-1 flex items-center gap-1 text-[12px] text-grayColor1">
                  <Image
                    src="/profile.png"
                    alt="mutual"
                    width={24}
                    height={24}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="truncate">5 other mutual connections</span>
                </div>
              ) : null}
              <div>
                {allReadyFriends == "friend" && (
                  <span className="text-[12px] text-grayColor1 font-semibold">
                    Connected since 01 Feb, 2025
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-fit justify-end items-center">
        <ConnectionActionButtons
          id={item.id} 
          status={currentStatus} 
          onAction={handleConnectionAction} 
        />
      </div>
      </article>
    </div>
  );
}

export default ConnectionRequestCard;
