import GroupHeroSection from "@/app/(Frond-End)/_components/mainPage/group/GroupHeroSection";
import GroupMemberList from "@/app/(Frond-End)/_components/mainPage/group/GroupMemberList";
import GroupPostCreateSection from "@/app/(Frond-End)/_components/mainPage/group/GroupPostCreate";
import GroupPostList from "@/app/(Frond-End)/_components/mainPage/group/GroupPostList";

async function page(props: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await props.params;

  return (
    <div>
      <GroupHeroSection groupId={groupId} />
      <div className="md:hidden mt-4">
        <GroupMemberList groupId={groupId} />
      </div>
      <div className="mt-6">
        <GroupPostCreateSection />
      </div>
      <div className="mt-6">
        <GroupPostList groupId={groupId} />
      </div>
    </div>
  );
}

export default page;
