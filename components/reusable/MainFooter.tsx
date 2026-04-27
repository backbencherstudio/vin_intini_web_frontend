import {
  FaceBookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";

function MainFooter() {
  const year = new Date().getFullYear();
  const socialLinks = [
    {
      href: "#",
      label: "Facebook",
      icon: <FaceBookIcon className="h-4 w-4" />,
    },
    {
      href: "#",
      label: "Instagram",
      icon: <InstagramIcon className="h-4 w-4" />,
    },
    {
      href: "#",
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
    <footer className="  border-t border-[#DFE1E7] bg-whiteColor py-10">
      <div className="container py-5 sm:py-6">
        <div className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/black_Logo.png"
                  alt="Logo"
                  width={256}
                  height={50}
                />
              </Link>
            </div>

            <p className="max-w-81.25 text-left text-base md:text-xl lg:text-2xl leading-tight text-[#54565a]">
              The networking platform for brain health professionals and
              students.
            </p>
          </div>

          <div className="h-px w-full bg-[#c9cccf]" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[14px] md:text-base font-medium text-primaryColor">
                Communicate. Collaborate. Connect.
              </p>
              <div className="flex items-center gap-2 text-primaryColor">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className=" rounded-full p-2 hover:bg-lightGreenColor/60 transition-all duration-200 hover:shadow-md shadow-lightGreenColor"
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>

            <p className="text-right text-sm text-[#A5A5AB]">
              &copy; {year} Mind Unite, All right Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
