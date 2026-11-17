import GroupSidbarWrapper from "@/app/(Front-End)/_components/mainPage/GroupSidbarWrapper";
import SinglePostView from "@/app/(Front-End)/_components/mainPage/post/SinglePostView";
import PostCardSkleton from "@/app/(Front-End)/_components/mainPage/post/PostCardSkleton";
import { Suspense } from "react";

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="md:grid grid-cols-12 gap-6">
      <div className="md:col-span-8 col-span-12 space-y-6">
        <Suspense fallback={<PostCardSkleton />}>
          <SinglePostView id={id} />
        </Suspense>
      </div>
      <div className="col-span-4 hidden md:block border-l border-[#D2D2D5] pl-4 md:pl-6 h-full md:sticky md:top-25 md:h-[calc(100vh-5rem)] md:overflow-y-auto self-start">
        <GroupSidbarWrapper />
      </div>
    </div>
  );
}

