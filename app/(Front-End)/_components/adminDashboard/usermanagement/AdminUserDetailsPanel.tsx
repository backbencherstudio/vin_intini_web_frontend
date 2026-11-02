"use client";

import { useGetAdminUserDetailsQuery } from "@/feature/slice/admin/user-management";
import userPlaceholder from "@/public/images/admin/parterner.png";
import Image from "next/image";

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-borderColor bg-white p-4">
      <h2 className="mb-3 text-base font-semibold text-headerColor">{title}</h2>
      {children}
    </section>
  );
}

export default function AdminUserDetailsPanel({
  userId,
}: {
  userId: string | number;
}) {
  const { data: response, isLoading, isError, refetch } =
    useGetAdminUserDetailsQuery(userId);
  const user = response?.data;

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-grayColor1">Loading user details…</p>;
  }

  if (isError || !user) {
    return (
      <div role="alert" className="py-10 text-center">
        <p className="text-sm text-redColor">Could not load this user’s details.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const profile = user.profile;
  const stats = [
    ["Connections", user.stats?.connections_count ?? user.total_connections ?? 0],
    ["Followers", user.stats?.followers_count ?? 0],
    ["Posts", user.stats?.posts_count ?? 0],
    ["Comments", user.stats?.comments_count ?? 0],
  ] as const;
  const professions = Array.isArray(profile?.profession)
    ? profile.profession.join(", ")
    : profile?.profession;

  return (
    <div className="space-y-6 pb-2">
      <header className="overflow-hidden rounded-lg border border-borderColor bg-white">
        <div
          className="h-32 bg-sectionColor bg-cover bg-center"
          style={user.cover_image_url ? { backgroundImage: `url(${user.cover_image_url})` } : undefined}
        />
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-center gap-3 sm:-mt-12">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white">
              <Image
                src={user.profile_image_url || userPlaceholder}
                alt={`${user.full_name} profile`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 sm:pb-1">
              <h1 className="truncate text-xl font-semibold text-headerColor">
                {user.full_name}
              </h1>
              <p className="truncate text-sm text-grayColor1">
                {user.title || user.username || user.email}
              </p>
              <p className="text-xs capitalize text-grayColor1">
                {user.tier?.replaceAll("_", " ")} · {user.status}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-sm sm:text-right">
            <span className="text-grayColor1">Email</span>
            <span className="break-all text-headerColor">{user.email}</span>
            <span className="text-grayColor1">Phone</span>
            <span className="text-headerColor">{user.mobile || "—"}</span>
            <span className="text-grayColor1">Location</span>
            <span className="text-headerColor">{user.location || "—"}</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-borderColor bg-white p-3">
            <p className="text-xs text-grayColor1">{label}</p>
            <p className="mt-1 text-lg font-semibold text-headerColor">{value}</p>
          </div>
        ))}
      </section>

      <DetailSection title="About">
        <p className="whitespace-pre-wrap text-sm leading-6 text-descriptionColor">
          {user.about || profile?.about || "No profile summary provided."}
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-grayColor1">Profession</dt><dd className="text-headerColor">{professions || "—"}</dd></div>
          <div><dt className="text-grayColor1">Education</dt><dd className="text-headerColor">{profile?.highest_degree || "—"}</dd></div>
          <div><dt className="text-grayColor1">Field of study</dt><dd className="text-headerColor">{profile?.field_study || "—"}</dd></div>
          <div><dt className="text-grayColor1">Member since</dt><dd className="text-headerColor">{user.member_since || user.joined_at || "—"}</dd></div>
        </dl>
        {!!profile?.skills?.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill.id} className="rounded-full bg-primaryColor/10 px-3 py-1 text-xs font-medium text-primaryColor">
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </DetailSection>

      <DetailSection title="Subscription and company">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div><p className="text-grayColor1">Plan</p><p className="text-headerColor">{user.subscription?.plan_name || "Basic"}</p></div>
          <div><p className="text-grayColor1">Billing</p><p className="text-headerColor">{user.subscription?.billing_rate ? `${user.subscription.billing_rate} / ${user.subscription.billing_cycle || "billing period"}` : "—"}</p></div>
          <div><p className="text-grayColor1">Company</p><p className="text-headerColor">{user.industry?.name || user.current_company?.name || "—"}</p></div>
          <div><p className="text-grayColor1">Graduated institution</p><p className="text-headerColor">{user.graduated_institution?.name || "—"}</p></div>
        </div>
      </DetailSection>

      {!!user.experiences?.length && (
        <DetailSection title="Experience">
          <div className="space-y-4">
            {user.experiences.map((experience) => (
              <article key={experience.id} className="border-b border-borderColor pb-3 last:border-0 last:pb-0">
                <h3 className="text-sm font-semibold text-headerColor">{experience.title || "Position"}</h3>
                <p className="text-sm text-grayColor1">{experience.company_name || "Company unavailable"}</p>
                <p className="text-xs text-grayColor1">{[experience.employment_type, experience.formatted_period, experience.formatted_location].filter(Boolean).join(" · ")}</p>
              </article>
            ))}
          </div>
        </DetailSection>
      )}

      {!!user.educations?.length && (
        <DetailSection title="Education">
          <div className="space-y-4">
            {user.educations.map((education) => (
              <article key={education.id} className="border-b border-borderColor pb-3 last:border-0 last:pb-0">
                <h3 className="text-sm font-semibold text-headerColor">{education.degree || "Education"}{education.field_study ? ` · ${education.field_study}` : ""}</h3>
                <p className="text-sm text-grayColor1">{education.institution_name || "Institution unavailable"}</p>
                {education.formatted_period && <p className="text-xs text-grayColor1">{education.formatted_period}</p>}
              </article>
            ))}
          </div>
        </DetailSection>
      )}

      <DetailSection title={`Recent activity (${user.activity?.total_posts ?? 0} posts, ${user.activity?.total_comments ?? 0} comments)`}>
        <div className="space-y-4">
          {user.activity?.posts?.map((post) => (
            <article key={`post-${post.id}`} className="border-b border-borderColor pb-3 last:border-0 last:pb-0">
              <p className="whitespace-pre-wrap text-sm text-descriptionColor">{post.description || "Post with no text"}</p>
              <p className="mt-1 text-xs text-grayColor1">{post.created_at_formatted || post.created_at || ""} · {post.total_like ?? 0} likes · {post.total_comment ?? 0} comments</p>
            </article>
          ))}
          {user.activity?.comments?.map((comment) => (
            <article key={`comment-${comment.id}`} className="border-b border-borderColor pb-3 last:border-0 last:pb-0">
              <p className="whitespace-pre-wrap text-sm text-descriptionColor">{comment.comment || "Comment with no text"}</p>
              <p className="mt-1 text-xs text-grayColor1">{comment.created_at_formatted || comment.created_at || ""}{comment.post?.description_snippet ? ` · On: ${comment.post.description_snippet}` : ""}</p>
            </article>
          ))}
          {!user.activity?.posts?.length && !user.activity?.comments?.length && (
            <p className="text-sm text-grayColor1">No recent activity.</p>
          )}
        </div>
      </DetailSection>
    </div>
  );
}
