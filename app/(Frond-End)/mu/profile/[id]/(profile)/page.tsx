import ProfileAbout from "@/app/(Frond-End)/_components/mainPage/profile/ProfileAbout";

import ProfileEducationList from "@/app/(Frond-End)/_components/mainPage/profile/Education/ProfileEducationList";
import ProfileExpreance from "@/app/(Frond-End)/_components/mainPage/profile/expreance/ProfileExpreance";
import ProfileHeroSection from "@/app/(Frond-End)/_components/mainPage/profile/ProfileHeroSection";
import ProfilePostList from "@/app/(Frond-End)/_components/mainPage/profile/ProfilePostList";

async function page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return (
    <div className="space-y-6">
      <ProfileHeroSection userId={id} />
      <ProfileAbout userId={id} />
      <ProfilePostList />
      <ProfileExpreance userId={id} />
      <ProfileEducationList userId={id} />
    </div>
  );
}

export default page;
