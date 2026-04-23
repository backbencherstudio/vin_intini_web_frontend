import Image from "next/image";

function ConnectionUserCard({ profile }: any) {
  return (
    <div>
      <article className="overflow-hidden group rounded-md hover:bg-lightGreenColor/20 hover:border-lightGreenColor hover:shadow-lg transition-all duration-200 flex flex-col h-full justify-between border border-borderColor bg-white">
        <div className="">
          <Image
            src="/images/feature-img.jpg"
            alt="profile cover"
            width={650}
            height={150}
            className="h-18 w-full object-cover"
          />
          <div>
            <div className="-mt-10 h-18 w-18 overflow-hidden mx-auto rounded-full border-2 border-white bg-gray-100">
              <Image
                src="/profile.png"
                alt={profile.name}
                width={150}
                height={150}
                className="h-full group-hover:scale-110 transition-transform duration-200 w-full object-cover"
              />
            </div>
            <div className="text-center">
              <h4 className="mt-3 line-clamp-2  text-base font-semibold leading-[1.2] text-headerColor">
                {profile.name}
              </h4>
              <p className="mt-1.5 line-clamp-3  text-[14px] leading-[1.2] text-descriptionColor">
                {profile.role}
              </p>
            </div>
          </div>
        </div>
        <div className="px-3  pb-3">
          <div className="mt-4 flex items-center gap-1 text-[11px] text-descriptionColor">
            <Image
              src="/profile.png"
              alt="mutual"
              width={24}
              height={24}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="truncate">{profile.mutualText}</span>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="mt-3 px-8 py-1 rounded-lg leading-[140%] border border-lightGreenColor hover:border-primaryColor cursor-pointer hover:shadow-lg shadow-primaryColor/50 text-[14px] text-primaryColor hover:bg-primaryColor font-semibold hover:text-whiteColor transition-colors duration-200 "
            >
              {profile.buttonText}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ConnectionUserCard;
