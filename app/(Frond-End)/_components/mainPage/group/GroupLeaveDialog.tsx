import { LogoutIcon } from "@/public/svgIcons/Icons";

function GroupLeaveDialog({ setIsNotify }: { setIsNotify: (value: boolean) => void }) {

  return (
    <div>
      <div className="md:p-6 p-4">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="flex justify-center items-center w-18 h-18 rounded-full bg-lightGreenColor border border-borderColor/20 ">
            <LogoutIcon />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-redColor">
              Leave Group?
            </h2>
            <p className="text-sm text-descriptionColor leading-[140%] mt-2">
              Are you sure you want to leave this group? You’ll no longer be
              able see post or access in this group!
            </p>
          </div>
          <div className="flex mt-6 items-center justify-center gap-3">
            <button className="px-6 rounded-full py-2 cursor-pointer  text-base font-semibold text-descriptionColor transition-all hover:bg-lightGreenColor active:scale-95" onClick={() => setIsNotify(false)}>
              Cancel
            </button>
            <button className="px-6 rounded-full bg-primaryColor py-2 cursor-pointer  text-base font-semibold text-white transition-all hover:bg-[#008c99] active:scale-95">
              Leave Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupLeaveDialog;
