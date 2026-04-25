import GroupHeroSection from "@/app/(Frond-End)/_components/mainPage/group/GroupHeroSection";
import GroupPostCreateSection from "@/app/(Frond-End)/_components/mainPage/group/GroupPostCreate";
import GroupPostList from "@/app/(Frond-End)/_components/mainPage/group/GroupPostList";

function page() {
  return (
    <div>
      <GroupHeroSection />
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
