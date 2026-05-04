"use client";

import postImage from "@/public/images/testimonial/banner1.png";
import { useEffect, useState } from "react";
import PostCard from "../post/PostCard";
import PostCardSkleton from "../post/PostCardSkleton";

const postItems: any[] = [
  {
    id: 1,
    authorName: "Profile Name",
    image: postImage,
    authorTitle:
      "Title (whether its a concise or long title, all the text will be in on single line. Truncate th...",
    timeAgo: "1h ago",
    contentLines:
      "Imagine changing one color And watching 200 screens update instantly...",
    previewTitle: "Component Specific Token",
  },
  {
    id: 2,
    authorName: "UI Design Team",
    image: postImage,

    authorTitle: "Design Systems and Accessibility",
    timeAgo: "4h ago",
    contentLines:
      "Token-driven theming helps products scale faster. Keep your primitives consistent for every screen.",
    previewTitle: "Global + Alias + Component",
    isConnected: true,
  },
];

function ProfileAllPost() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className=" grid-cols-1 md:grid-cols-2 grid gap-4">
      {isLoading
        ? Array.from({ length: 2 }).map((_, index) => (
            <PostCardSkleton key={index} />
          ))
        : postItems.map((post) => <PostCard key={post.id} post={post} />)}
    </section>
  );
}

export default ProfileAllPost;
