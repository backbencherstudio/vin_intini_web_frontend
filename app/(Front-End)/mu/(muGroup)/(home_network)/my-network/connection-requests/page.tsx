import ConnectionRequestsTabContainer from "@/app/(Front-End)/_components/mainPage/network/connectionRequests/ConnectionRequestsTabContainer";
import SuggestConnectionList from "@/app/(Front-End)/_components/mainPage/network/connectionUsers/SuggestConnectionList";

async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams) || {};
  const rawSearch = params.search;
  const searchQuery = Array.isArray(rawSearch)
    ? rawSearch[0] || ""
    : rawSearch || "";
  return (
    <div>
      <ConnectionRequestsTabContainer />
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-semibold leading-[120%] text-headerColor">
          Connect With New Network
        </h3>

        <SuggestConnectionList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default Page;
