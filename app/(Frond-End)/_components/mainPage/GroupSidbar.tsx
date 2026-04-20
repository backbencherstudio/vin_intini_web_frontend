import ButtonReuseable from "@/components/reusable/CustomButton";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon } from "lucide-react";

type GroupItem = {
  id: number;
  name: string;
  membersLabel: string;
  isJoined?: boolean;
  isFirst?: boolean;
};

const groups: GroupItem[] = [
  {
    id: 1,
    name: "Figma Product Community",
    membersLabel: "Group members count",
    isFirst: true,
  },
  {
    id: 2,
    name: "Figma Product Community",
    membersLabel: "Group members count",
    isJoined: true,
  },
  {
    id: 3,
    name: "Figma Product Community",
    membersLabel: "Group members count",
  },
  {
    id: 4,
    name: "Figma Product Community",
    membersLabel: "Group members count",
  },
  {
    id: 5,
    name: "Figma Product Community",
    membersLabel: "Group members count",
  },
];

function FigmaMark() {
  return (
    <div className="relative h-10 w-10 shrink-0">
      <span className="absolute left-0 top-0 h-3.5 w-3.5 rounded-full bg-[#f24e1e]" />
      <span className="absolute left-3.5 top-0 h-3.5 w-3.5 rounded-full bg-[#ff7262]" />
      <span className="absolute left-0 top-3.5 h-3.5 w-3.5 rounded-full bg-[#a259ff]" />
      <span className="absolute left-3.5 top-3.5 h-3.5 w-3.5 rounded-full bg-[#1abcfe]" />
      <span className="absolute left-0 top-7 h-3.5 w-3.5 rounded-full bg-[#0acf83]" />
    </div>
  );
}

function GroupSidbar() {
  return (
    <aside className="rounded-md ">
      <h3 className="text-[18px] py-3 font-semibold text-headerColor">
        Groups you might be Interested
      </h3>

      <div className=" space-y-0">
        {groups.map((group, index) => (
          <div
            key={group.id}
            className="border-t border-borderColor py-4 first:pt-5"
          >
            <div className="flex items-start gap-3">
              {group.isFirst ? (
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-md bg-bgColor text-[#70757f]">
                  <ImageIcon size={30} strokeWidth={1.8} />
                </div>
              ) : (
                <FigmaMark />
              )}

              <div className="min-w-0 flex-1">
                <p className="text-base md:text-lg leading-[150%]  font-semibold text-headerColor">
                  {group.name}
                </p>

                <div className="mt-1.5 flex items-center gap-2 text-grayColor1">
                  <GroupUserIcon />
                  <span className="text-[13px] leading-5">
                    {group.membersLabel}
                  </span>
                </div>
              </div>
            </div>

            <ButtonReuseable
              type="button"
              className={`py-0.5! px-4! border rounded-full!  ${group.isJoined ? "border-primaryColor! bg-primaryColor! text-whiteColor!" : "border-headerColor!  text-headerColor! bg-whiteColor! hover:border-primaryColor! hover:text-primaryColor! hover:bg-primaryColor/10!"} mt-4!`}
              title={group.isJoined ? "Joined" : "Join"}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}

export default GroupSidbar;
