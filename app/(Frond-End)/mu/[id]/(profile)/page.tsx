import ProfileAbout from "@/app/(Frond-End)/_components/mainPage/profile/ProfileAbout";
import ProfileHeroSection from "@/app/(Frond-End)/_components/mainPage/profile/ProfileHeroSection";

function page() {
  return (
    <div className="space-y-6">
      <ProfileHeroSection />
      <ProfileAbout />
    </div>
  );
}

export default page;
