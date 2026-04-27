import GroupHeroSection from "@/app/(Frond-End)/_components/mainPage/group/GroupHeroSection";
import GroupMemberList from "@/app/(Frond-End)/_components/mainPage/group/GroupMemberList";
import GroupPostCreateSection from "@/app/(Frond-End)/_components/mainPage/group/GroupPostCreate";
import GroupPostList from "@/app/(Frond-End)/_components/mainPage/group/GroupPostList";

function page() {
  return (
    <div>
      <GroupHeroSection />
      <div className="md:hidden mt-4">
        <GroupMemberList />
      </div>
      <div className="mt-6">
        <GroupPostCreateSection />
      </div>
      <div className="mt-6">
        <GroupPostList />
      </div>
    </div>
  );
}

export default page;
