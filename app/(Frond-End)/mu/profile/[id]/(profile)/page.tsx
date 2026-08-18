import ProfileAbout from "@/app/(Frond-End)/_components/mainPage/profile/ProfileAbout";

import ProfileEducationList from "@/app/(Frond-End)/_components/mainPage/profile/Education/ProfileEducationList";
import ProfileExpreance from "@/app/(Frond-End)/_components/mainPage/profile/expreance/ProfileExpreance";
import ProfileHeroSection from "@/app/(Frond-End)/_components/mainPage/profile/ProfileHeroSection";
import ProfileLockDesign from "@/app/(Frond-End)/_components/mainPage/profile/ProfileLockDesign";
import ProfilePostList from "@/app/(Frond-End)/_components/mainPage/profile/ProfilePostList";

async function page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const protect = true;
  const isprofile = false;
  return (
    <div className="space-y-6">
      <ProfileHeroSection userId={id} protect={protect} isprofile={isprofile} />
      {!protect ? (
        <div>
          <ProfileAbout userId={id} />
          <ProfilePostList />
          <ProfileExpreance userId={id} />
          <ProfileEducationList userId={id} />
        </div>
      ) : (
        <ProfileLockDesign />
      )}
    </div>
  );
}

export default page;
