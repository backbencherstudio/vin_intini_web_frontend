import logoPreview from "@/public/images/company-logo-1.png";
import coverPreview from "@/public/images/cover imager.png";
import Image from "next/image";

function GroupHeroSection() {
  return (
    <div className="relative h-40 md:h-48 w-full bg-gradient-to-r rounded-md from-cyan-100 to-blue-200">
      <Image
        src={coverPreview}
        className="w-full h-full object-cover rounded-md"
        alt="Cover"
        fill
      />

      {/* Floating Logo Box */}
      <div className="absolute -bottom-12 left-8 h-20 w-20 bg-bgLightColor rounded-md flex items-center justify-center">
        <Image
          src={logoPreview}
          className="w-full h-full object-cover rounded-md"
          alt="Logo"
          fill
        />
      </div>
    </div>
  );
}

export default GroupHeroSection;
