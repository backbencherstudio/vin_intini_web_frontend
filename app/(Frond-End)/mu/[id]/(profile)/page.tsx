import ProfileAbout from "@/app/(Frond-End)/_components/mainPage/profile/ProfileAbout";
import ProfileEducationList from "@/app/(Frond-End)/_components/mainPage/profile/ProfileEducationList";
import ProfileExpreance from "@/app/(Frond-End)/_components/mainPage/profile/ProfileExpreance";
import ProfileHeroSection from "@/app/(Frond-End)/_components/mainPage/profile/ProfileHeroSection";
import ProfilePostList from "@/app/(Frond-End)/_components/mainPage/profile/ProfilePostList";

async function page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  console.log(id, "Profile ID");

  return (
    <div className="space-y-6">
      <ProfileHeroSection userId={id} />
      <ProfileAbout userId={id} />
      <ProfilePostList />
      <ProfileExpreance />
      <ProfileEducationList />
    </div>
  );
}

export default page;
