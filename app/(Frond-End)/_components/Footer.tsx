"use client";
import SocialShare from "@/components/reusable/SocialShare";
import bgImage from "@/public/images/landingpage-footer.svg";
import logo from "@/public/logo.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="px-4 container "
      style={{
        backgroundImage: `url("${bgImage.src}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" text-white py-12 bg-[#ffffff7a] backdrop-blur-xs lg:bg-transparent lg:backdrop-blur-none">
        <div className="flex flex-col sm:flex-row items-start justify-between pb-4 ">
          <Image src={logo} alt="Logo" width={305} height={58} className="" />
          <div className="flex flex-col items-center sm:items-start space-y-2 w-80 ">
            <p className="text-center sm:text-start sm:pt-4 text-[#404040] text-lg lg:text-xl 2xl:text-2xl font-light leading-[130%] tracking-[0.12px]  w-full h-60">
              The networking platform for brain health professionals and
              students.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start space-y-2">
            <h2 className="text-primaryColor text-sm sm:text-base font-medium sm:font-semibold tracking-[0.08px] leading-[150%]">
              Communicate. Collaborate. Connect.
            </h2>
            <SocialShare />
          </div>
          <p className="text-center sm:text-start text-[#A5A5AB] text-sm font-light leading-[140%] tracking-[0.07px]">
            © 2026 Mind Unite, All right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
