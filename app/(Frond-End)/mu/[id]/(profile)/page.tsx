import ProfileAbout from "@/app/(Frond-End)/_components/mainPage/profile/ProfileAbout";
import ProfileExpreance from "@/app/(Frond-End)/_components/mainPage/profile/ProfileExpreance";
import ProfileHeroSection from "@/app/(Frond-End)/_components/mainPage/profile/ProfileHeroSection";
import ProfilePostList from "@/app/(Frond-End)/_components/mainPage/profile/ProfilePostList";

function page() {
  return (
    <div className="space-y-6">
      <ProfileHeroSection />
      <ProfileAbout />
      <ProfilePostList />
      <ProfileExpreance />
    </div>
  );
}

export default page;
