import RootDialog from "@/components/reusable/RootDialog";
import { setPostType } from "@/feature/slice/postCompose/postComposeSlice";
import { useDispatch, useSelector } from "react-redux";
import PostAccessModal from "../post/PostAccessModal";
import PostGroupListModal from "../post/PostGroupListModal";
import PostModal from "../post/PostModal";

function CreatePostDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const dispatch = useDispatch();
  const { postType } = useSelector((state: any) => state.postCompose);
  const handleSetPostType = (type: string) => {
    dispatch(setPostType(type as any));
  };

  return (
    <div>
      <RootDialog open={isOpen} setOpen={setIsOpen}>
        {postType == "Post_write" ? (
          <PostModal setOpen={setIsOpen} setPostType={handleSetPostType} />
        ) : postType == "post_access" ? (
          <PostAccessModal setPostType={handleSetPostType} />
        ) : (
          <PostGroupListModal setPostType={handleSetPostType} />
        )}
      </RootDialog>
    </div>
  );
}

export default CreatePostDialog;
