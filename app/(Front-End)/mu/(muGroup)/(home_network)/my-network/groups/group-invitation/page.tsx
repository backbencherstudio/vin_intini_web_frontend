import GroupInvitetionAllList from "@/app/(Front-End)/_components/mainPage/group/GroupInvitetionAllList";
import { fetchWrapper } from "@/lib/fetch-wrapper";
export const dynamic = "force-dynamic";
const limit = 9;
async function Page() {
  let initialData = { data: [] } as any;
  try {
    initialData = await fetchWrapper(
      `/group-invitations/requests?page=1&per_page=${limit}`,
    );
  } catch (err) {
    console.error("PostList server fetch error:", err);
  }
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Group Invitations</h1>
      <GroupInvitetionAllList initialData={initialData} limit={limit} />
    </div>
  );
}

export default Page;
