import proImage from "@/public/profile.png";
import Image from "next/image";

const GroupMemberList = () => {
  const mutualCount = 236;
  const avatars = [proImage, proImage, proImage, proImage, proImage];

  return (
    <div className="space-y-4">
      <div className="max-w-full rounded-xl border border-borderColor/30 bg-bgLightColor p-4 ">
        {/* Member Count Header */}
        <div className="mb-3 border-b border-gray-200 pb-3">
          <h2 className="text-[18px] font-bold text-headerColor">
            10,000 Members
          </h2>
        </div>

        {/* Mutual Connections Section */}
        <div className="mb-6">
          <p className="mb-3 text-[14px] text-gray-500">
            {mutualCount} mutual connections
          </p>

          <div className="flex items-center">
            {/* Avatar Stack */}
            <div className="flex -space-x-3 overflow-hidden">
              {avatars.map((src, index) => (
                <div
                  key={index}
                  className="inline-block h-10 w-10 rounded-full border-2 border-white bg-gray-200"
                >
                  <Image
                    src={src}
                    alt={`User ${index + 1}`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              ))}
            </div>

            {/* Remaining Count Badge */}
            <div className="z-10 -ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-[12px] font-medium text-gray-600 shadow-sm">
              {mutualCount}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="px-6 rounded-full bg-primaryColor py-2 cursor-pointer  text-sm lg:text-base font-semibold text-white transition-all hover:bg-[#008c99] active:scale-95">
          Invite a Connection
        </button>
      </div>
      <div className="max-w-full rounded-xl border border-borderColor/30 bg-bgLightColor p-4 ">
        <div className="mb-3 border-b border-borderColor/90 pb-3">
          <h2 className="text-lg font-semibold text-headerColor">Admin</h2>
        </div>

        {/* Mutual Connections Section */}
        <div className="">
          <div className="flex items-start gap-2">
            {/* Avatar Stack */}
            <div className="flex h-10  w-10 overflow-hidden">
              <Image
                src={proImage}
                alt={`User profile`}
                width={40}
                height={40}
                className="h-full w-full object-cover rounded-full"
              />
            </div>

            <div className="flex-1">
              <h4 className="text-base md:text-lg font-semibold text-headerColor">
                Vin Intini
              </h4>
              <p className="text-sm text-descriptionColor line-clamp-2">
                Scaling Businesses with Strategy, Systems & AI | Digital
                Marketing & Brand Growth Strategist | Automation & CRM (Zoho)
                Helping brands turn attention into revenue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupMemberList;
