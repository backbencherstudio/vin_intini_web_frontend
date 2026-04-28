"use client";

import CommentSkleton from "@/components/reusable/All Skleton/CommentSkleton";
import { useEffect, useState } from "react";

const commentActivities = Array.from({ length: 7 }).map((_, index) => ({
  id: index + 1,
  activity: "You commented on a post",
  time: "6d",
  comment: "This is comment",
}));

function ProfileComment() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-2">
      {isLoading
        ? Array.from({ length: 7 }).map((_, index) => (
            <CommentSkleton key={`profile-comment-skeleton-${index}`} />
          ))
        : commentActivities.map((item) => (
            <article key={item.id} className="border-b border-borderColor py-3">
              <p className="text-sm font-normal leading-[1.35] text-descriptionColor">
                <span>{item.activity}</span>
                <span className="mx-1">•</span>
                <span>{item.time}</span>
              </p>
              <p
                className="mt-1 text-base md:text-lg
               font-normal leading-[1.35] text-headerColor"
              >
                {item.comment}
              </p>
            </article>
          ))}
    </div>
  );
}

export default ProfileComment;
