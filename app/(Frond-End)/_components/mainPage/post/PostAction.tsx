import RootDialog from "@/components/reusable/RootDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSendRequestMutation } from "@/feature/slice/connect/connectSlice";
import { setPostType } from "@/feature/slice/postCompose/postComposeSlice";
import { useGetProfileByIdQuery } from "@/feature/slice/user/userSlice";
import { PostFeedType } from "@/lib/type";
import {
  DeleteIcon,
  DotIcon,
  EditeIcon,
  UserBanIcon,
} from "@/public/svgIcons/Icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import DeleteGroup from "../group/DeleteGroup";
import GroupPostCreateDialog from "../group/GroupPostCreateDialog";
import GroupUserBanDialog from "../group/GroupUserBanDialog";
import PostAccessModal from "./PostAccessModal";
import PostGroupListModal from "./PostGroupListModal";
import PostModal from "./PostModal";
type PostCardProps = {
  post?: PostFeedType;
  meta?: any;
};
function PostAction({ post, meta }: PostCardProps) {
  const { can_edit, media, is_connected, user } = post || {};
  const { id: userId } = user || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isGroupEdited, setIsGroupEdited] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [action_label, setActionLabel] = useState("Connect");
  const dispatch = useDispatch();
  const { postType } = useSelector((state: any) => state.postCompose);
  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const { data: userProfile } = useGetProfileByIdQuery(userId);
  const handleSetPostType = (type: string) => {
    dispatch(setPostType(type as any));
  };
  const [isBanUser, setIsBanUser] = useState(false);

  const handleConnect = async () => {
    const payload = {
      user_id: user.id,
    };

    try {
      const result = await sendRequest({ payload }).unwrap();
      toast.success(result.message || "Connection request sent!");
      setActionLabel("Sent request");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send connection request.");
    }
  };

  return (
    <div>
      <div className="flex items-center relative gap-1.5">
        {!is_connected && !meta?.is_own_profile && !meta?.is_connected && (
          <button
            onClick={handleConnect}
            disabled={
              isLoading ||
              action_label !== "Connect" ||
              userProfile?.data?.connection_status?.action_label === "Pending"
            }
            type="button"
            className={`h-7 disabled:bg-bgColor disabled:cursor-not-allowed disabled:tracking-normal disabled:text-grayColor1 disabled:border-0  rounded-full border px-3 text-sm font-medium transition-all duration-200 hover:tracking-widest cursor-pointer 
             hover:border-buttonColor hover:bg-buttonColor hover:text-whiteColor
               
            `}
          >
            {isLoading
              ? "Sending..."
              : userProfile?.data?.connection_status?.action_label === "Pending"
                ? "Request sent"
                : action_label}
          </button>
        )}
        {(can_edit || meta?.is_creator || meta?.is_own_profile) && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="cursor-pointer border rounded-sm p-1.5 focus:outline-0">
              <DotIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3    w-full">
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
                className={"cursor-pointer px-0 text-nowrap "}
              >
                <DeleteIcon />
                Delete post
              </DropdownMenuItem>
              {post?.visibility === "groups" && can_edit && (
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    setMenuOpen(false);
                    setIsGroupEdited(true);
                  }}
                  className={"cursor-pointer px-0"}
                >
                  <EditeIcon />
                  Edit post
                </DropdownMenuItem>
              )}

              {post?.visibility !== "groups" && can_edit && (
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    setMenuOpen(false);
                    setIsEdited(true);
                  }}
                  className={"cursor-pointer px-0"}
                >
                  <EditeIcon />
                  Edit post
                </DropdownMenuItem>
              )}
              {post?.visibility === "groups" &&
                meta?.is_creator &&
                !post?.can_edit && (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      setMenuOpen(false);
                      setIsBanUser(true);
                    }}
                    className="cursor-pointer px-0"
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
          groupId={meta?.group_id}
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
      {isGroupEdited && (
        <GroupPostCreateDialog
          open={isGroupEdited}
          groupId={post?.group?.id}
          setOpen={setIsGroupEdited}
          postData={post}
        />
      )}
    </div>
  );
}

export default PostAction;
