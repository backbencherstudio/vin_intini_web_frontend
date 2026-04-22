import { Clock3, ImageIcon, X } from "lucide-react";
import Image from "next/image";

function ConnectionRequestCard({ item }: { item: any }) {
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
            {item.mutualText ? (
              <p className="mt-1 flex items-center gap-1  text-[12px] text-grayColor1">
                <Clock3 className="h-3 w-3" />
                {item.mutualText}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 justify-end  w-full items-center gap-2">
          {item.action === "accept" ? (
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
