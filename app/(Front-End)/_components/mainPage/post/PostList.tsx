import { fetchWrapper } from "@/lib/fetch-wrapper";
import PostListClient from "./PostListClient";

const limit = 10;

export default async function PostList({ url }: { url?: string }) {
  let initialData = { data: [] } as any;

  try {
    initialData = await fetchWrapper(url);
  } catch (err) {
    console.error("PostList server fetch error:", err);
  }

  return (
    <PostListClient initialData={initialData} initialUrl={url} limit={limit} />
  );
}
