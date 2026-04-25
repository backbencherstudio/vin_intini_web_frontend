"use client";
import Image from "next/image";
import Link from "next/link";
import { FaceBookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/public/svgIcons/Icons";

const socialMediaLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    Icon: FaceBookIcon
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    Icon: InstagramIcon
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    Icon: LinkedInIcon
  },
  {
    name: "Twitter",
    url: "https://twitter.com",
    Icon: TwitterIcon
  }
]

export default function Footer() {
  return (
    <footer
      className="px-4 container"
      style={{
        backgroundImage: 'url("/images/landingpage-footer.svg")',
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
            src="/logo.png"
            alt="Logo"
            width={305}
            height={100}
            className=""
          />
          <p className="text-center sm:text-start sm:pt-4 text-[#404040] text-lg lg:text-xl 2xl:text-2xl font-light leading-[130%] tracking-[0.12px] sm:max-w-[311px]">The networking platform for brain health professionals and students.</p>
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
                      <Icon className="w-4.5 text-primaryColor" />
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
