import GroupDetailsView from "@/app/(Front-End)/_components/mainPage/group/GroupDetailsView";

async function Page(props: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await props.params;

  return <GroupDetailsView groupId={groupId} />;
}

export default Page;
