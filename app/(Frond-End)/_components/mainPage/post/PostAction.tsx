import RootDialog from "@/components/reusable/RootDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setPostType } from "@/feature/slice/postCompose/postComposeSlice";
import { PostFeedType } from "@/lib/type";
import {
  DeleteIcon,
  DotIcon,
  EditeIcon,
  UserBanIcon,
} from "@/public/svgIcons/Icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteGroup from "../group/DeleteGroup";
import GroupUserBanDialog from "../group/GroupUserBanDialog";
import PostAccessModal from "./PostAccessModal";
import PostGroupListModal from "./PostGroupListModal";
import PostModal from "./PostModal";
type PostCardProps = {
  post?: PostFeedType;
};
function PostAction({ post }: PostCardProps) {
  const { can_edit, media, is_connected } = post || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const dispatch = useDispatch();
  const { postType } = useSelector((state: any) => state.postCompose);

  const handleSetPostType = (type: string) => {
    dispatch(setPostType(type as any));
  };
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
                className={"cursor-pointer "}
              >
                <DeleteIcon />
                Delete post
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setIsEdited(true);
                }}
                className={"cursor-pointer "}
              >
                <EditeIcon />
                Edit post
              </DropdownMenuItem>
              {post?.visibility === "groups" && (
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
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isBanUser && (
        <GroupUserBanDialog open={isBanUser} setOpen={setIsBanUser} />
      )}
      {isDeleted && (
        <DeleteGroup
          open={isDeleted}
          setOpen={setIsDeleted}
          postId={post?.id}
        />
      )}
      {isEdited && (
        <RootDialog open={isEdited} setOpen={setIsEdited}>
          {postType == "Post_write" ? (
            <PostModal
              setOpen={setIsEdited}
              setPostType={handleSetPostType}
              postData={post}
            />
          ) : postType == "post_access" ? (
            <PostAccessModal setPostType={handleSetPostType} />
          ) : (
            <PostGroupListModal setPostType={handleSetPostType} />
          )}
        </RootDialog>
      )}
    </div>
  );
}

export default PostAction;
