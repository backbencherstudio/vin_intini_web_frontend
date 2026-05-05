import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostFeedType } from "@/lib/type";
import { DeleteIcon, DotIcon, UserBanIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";
import DeleteGroup from "../group/DeleteGroup";
import GroupUserBanDialog from "../group/GroupUserBanDialog";
type PostCardProps = {
  post?: PostFeedType;
};
function PostAction({ post }: PostCardProps) {
  const { can_edit, media, is_connected } = post || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  console.log(is_connected);

  const [isBanUser, setIsBanUser] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {!is_connected && (
          <button
            type="button"
            className={`h-7  rounded-full border px-3 text-sm font-medium transition-all duration-200 hover:tracking-widest cursor-pointer 
             hover:border-buttonColor hover:bg-buttonColor hover:text-whiteColor
               
            `}
          >
            {"Connect"}
          </button>
        )}
        {can_edit && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="cursor-pointer border rounded-sm p-1.5 focus:outline-0">
              <DotIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3">
              <h4 className="text-base font-semibold leading-[140%] text-headerColor md:text-lg">
                Action
              </h4>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setIsDeleted(true);
                }}
                className="cursor-pointer"
              >
                <DeleteIcon /> Delete post
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setIsBanUser(true);
                }}
                className="cursor-pointer"
              >
                <UserBanIcon /> Ban User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isBanUser && (
        <GroupUserBanDialog open={isBanUser} setOpen={setIsBanUser} />
      )}
      {isDeleted && <DeleteGroup open={isDeleted} setOpen={setIsDeleted} />}
    </div>
  );
}

export default PostAction;
