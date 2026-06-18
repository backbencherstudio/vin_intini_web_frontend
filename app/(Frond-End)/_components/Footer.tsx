"use client";
import Image from "next/image";
import Link from "next/link";
import { FaceBookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/public/svgIcons/Icons";
import logo from "@/public/logo.png";
import bgImage from "@/public/images/landingpage-footer.svg";
import { PiTiktokLogo } from "react-icons/pi";

const socialMediaLinks = [
  // {
  //   name: "Facebook",
  //   url: "https://www.facebook.com",
  //   Icon: FaceBookIcon
  // },
  {
    name: "Instagram",
    url: "https://www.instagram.com/mindunitellc",
    Icon: <InstagramIcon className="w-4.5 text-primaryColor"/>
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/mind-unite",
    Icon: <LinkedInIcon className="w-4.5 text-primaryColor"/>
  },
  {
    name: "Twitter",
    url: "https://x.com/mindUnite",
    Icon: <TwitterIcon className="w-4.5 text-primaryColor"/>
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@mindunite",
    Icon: <PiTiktokLogo className="text-2xl text-primaryColor"/>
  }
]

export default function Footer() {
  return (
    <footer
      className="px-4 container"
      style={{
        backgroundImage: `url("${bgImage.src}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat"
      }}
    >
      <div
        className=" text-white py-12 bg-[#ffffff7a] backdrop-blur-xs lg:bg-transparent lg:backdrop-blur-none"
      >
        <div className="flex flex-col sm:flex-row items-start justify-between pb-4">
          <Image
            src={logo}
            alt="Logo"
            width={305}
            height={100}
            className=""
          />
          <p className="text-center sm:text-start sm:pt-4 text-[#404040] text-lg lg:text-xl 2xl:text-2xl font-light leading-[130%] tracking-[0.12px] sm:max-w-77.75">The networking platform for brain health professionals and students.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-primaryColor text-sm sm:text-base font-medium sm:font-semibold tracking-[0.08px] leading-[150%]">Communicate. Collaborate. Connect.</h2>
            <ul className="flex items-center gap-2">
              {socialMediaLinks.map((link) => {
                const { Icon, url } = link;
                return (
                  <li>
                    <Link href={url} target="_blank" className="p-2 block">
                      {Icon}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <p className="text-center sm:text-start text-[#A5A5AB] text-sm font-light leading-[140%] tracking-[0.07px]">© 2026 Mind Unite, All right Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
