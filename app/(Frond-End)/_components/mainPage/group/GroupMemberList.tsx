import Image from "next/image";
import proImage from "@/public/profile.png"

const GroupMemberList = () => {
  
  const mutualCount = 236;
  const avatars = [
    proImage,
    proImage,
    proImage,
    proImage,
    proImage,
  ];

  return (
    <div className="max-w-[300px] rounded-xl border border-gray-100 bg-[#F8F9FA] p-5 shadow-sm">
      {/* Member Count Header */}
      <div className="mb-3 border-b border-gray-200 pb-3">
        <h2 className="text-[18px] font-bold text-[#1F2937]">10,000 Members</h2>
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
      <button className="w-full rounded-full bg-[#00A3B1] py-2.5 text-[15px] font-semibold text-white transition-all hover:bg-[#008c99] active:scale-95">
        Invite a Connection
      </button>
    </div>
  );
};

export default GroupMemberList;
