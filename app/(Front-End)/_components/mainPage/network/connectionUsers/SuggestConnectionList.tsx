import Error from "@/components/reusable/Error";
import { fetchWrapper } from "@/lib/fetch-wrapper";
import SuggestConnectionListClient from "./SuggestConnectionListClient";

async function SuggestConnectionList({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  const query = searchQuery || "";
  const limit = 20;

  let suggestedConnections = { data: [] } as any;
  try {
    suggestedConnections = await fetchWrapper(
      `/connections/suggestions?per_page=${limit}&search=${encodeURIComponent(query)}`,
    );
  } catch (error) {
    console.error("SuggestConnectionList server fetch error:", error);
    return <Error />;
  }

  return (
    <SuggestConnectionListClient
      key={query}
      initialResponse={suggestedConnections}
      limit={limit}
      searchQuery={searchQuery}
    />
  );
}

export default SuggestConnectionList;
