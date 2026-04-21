import CreatePostSection from "@/app/(Frond-End)/_components/mainPage/CreatePostSection";
import GroupSidbar from "@/app/(Frond-End)/_components/mainPage/GroupSidbar";
import PostList from "@/app/(Frond-End)/_components/mainPage/post/PostList";

function page() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-6">
        <CreatePostSection />
        <div>
          <PostList />
        </div>
      </div>
      <div className="col-span-4 border-l border-[#D2D2D5] pl-4 md:pl-6 h-full">
        <GroupSidbar />
      </div>
    </div>
  );
}

export default page;
