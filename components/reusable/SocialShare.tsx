import {
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/public/svgIcons/Icons";
import Link from "next/link";
function SocialShare() {
  const socialLinks = [
    // {
    //   href: "#",
    //   label: "Facebook",
    //   icon: <FaceBookIcon className="h-4 w-4" />,
    // },
    {
      href: "https://www.instagram.com/mindunitellc",
      label: "Instagram",
      icon: <InstagramIcon className="h-4 w-4" />,
    },
    {
      href: "https://www.linkedin.com/company/mind-unite",
      label: "LinkedIn",
      icon: <LinkedInIcon className="h-4 w-4" />,
    },
    {
      href: "#",
      label: "X",
      icon: <TwitterIcon className="h-4 w-4" />,
    },
  ];
  return (
    <div>
      <div className="flex items-center gap-2 text-primaryColor">
        {socialLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            aria-label={link.label}
            target="_blank"
            className=" rounded-full p-2 hover:bg-lightGreenColor/60 transition-all duration-200 hover:shadow-md shadow-lightGreenColor"
          >
            {link.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SocialShare;
