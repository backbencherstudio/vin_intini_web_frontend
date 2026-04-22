import { UserMinusIcon } from "@/public/svgIcons/Icons";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

function ConnectionRequestCard({
  item,
  allReadyFriends,
}: {
  item: any;
  allReadyFriends?: boolean;
}) {
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
                <span className="text-[12px] text-grayColor1 font-semibold">
                  Connected since 01 Feb, 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-end  w-full items-center gap-2">
          {allReadyFriends ? (
            <button
              type="button"
              className="rounded-full border border-borderColor hover:shadow-md w-9 h-9 flex justify-center items-center cursor-pointer  text-base text-headerColor hover:bg-bgColor"
            >
              {" "}
              <UserMinusIcon className="w-4 h-4" />
            </button>
          ) : item.action === "accept" ? (
            <>
              <button
                type="button"
                className="rounded-full px-3 cursor-pointer py-0.5 text-base text-headerColor hover:bg-bgColor"
              >
                Ignore
              </button>
              <button
                type="button"
                className="rounded-full border border-primaryColor px-4 py-0.5 text-base leading-[140%] font-medium text-primaryColor cursor-pointer hover:bg-primaryColor hover:text-whiteColor hover:shadow-md shadow-primaryColor/50 tracking-wide transition-all duration-200"
              >
                Accept
              </button>
            </>
          ) : item.action === "connected" ? (
            <>
              <button
                type="button"
                className="rounded-full border border-primaryColor px-4 py-0.5 text-base leading-[160%] font-medium text-primaryColor cursor-pointer hover:bg-primaryColor hover:text-whiteColor hover:shadow-md shadow-primaryColor/50 tracking-wide transition-all duration-200"
              >
                View profile
              </button>
              <button
                type="button"
                className="p-1 text-descriptionColor cursor-pointer hover:bg-bgColor rounded-full"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="p-1 text-descriptionColor cursor-pointer hover:bg-bgColor rounded-full"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

export default ConnectionRequestCard;
