import { ConnectionRequestType } from "@/lib/type";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { ConnectionActionButtons } from "./ConnectionActionButtons";
import emptyImage from "@/public/empty_user.jpg";
function ConnectionRequestCard({ item }: { item: ConnectionRequestType }) {
  return (
    <div>
      <article className="flex flex-col md:flex-row lg:gap-6 xl:gap-8 items-center justify-between gap-3 border-b border-borderColor py-3">
        <div className="flex h-full items-start flex-1 gap-3 ">
          <div className="flex md:h-16 md:w-16  w-12 h-12 items-center justify-center overflow-hidden rounded-full bg-bgColor">
            {item.id === 1 ? (
              <ImageIcon className="h-4 w-4 text-descriptionColor" />
            ) : (
              <Image
                src={item?.user?.profile_image_url || emptyImage  }
                alt={item?.user?.name}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <h4 className=" text-[18px] text-headerColor font-semibold">
              {item?.user?.name}
            </h4>
            <p className=" text-[14px] text-descriptionColor">
              {item?.user?.title}
            </p>
            <div
              className={`flex ${item?.mutual_connections?.length > 0 ? "justify-between" : "justify-end"}  items-center`}
            >
              {item?.mutual_connections?.length > 0 ? (
                <div className="mt-1 flex  items-center gap-1 text-[12px] text-grayColor1">
                  <Image
                    src={
                      item?.mutual_connections[0]?.profile_image_url ||
                      emptyImage
                    }
                    alt="mutual"
                    width={24}
                    height={24}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="truncate">
                    {item?.mutual_connections[0]?.name}{" "}
                    {item?.mutual_connections?.length > 1 &&
                      item?.mutual_connections?.length + "and others "}{" "}
                    mutual connections
                  </span>
                </div>
              ) : null}
              <div className="">
                {item?.status == "accepted" && (
                  <span className="text-[12px] text-grayColor1 font-semibold">
                    {item?.connected_since}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-fit justify-end items-center">
          <ConnectionActionButtons
            id={item?.id}
            userId={item?.user?.id}
            status={item?.status}
            isFollower={item?.is_following_back}
          />
        </div>
      </article>
    </div>
  );
}

export default ConnectionRequestCard;
