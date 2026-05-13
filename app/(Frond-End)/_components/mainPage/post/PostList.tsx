import { fetchWrapper } from "@/src/utils/fetchWrapper";
import PostListClient from "./PostListClient";

const limit = 10;

export default async function PostList() {
  let initialData = { data: [] } as any;
  try {
    initialData = await fetchWrapper(`/newsfeed?page=1&per_page=${limit}`);
  } catch (err) {
    console.error("PostList server fetch error:", err);
  }

  return <PostListClient initialData={initialData} limit={limit} />;
}
