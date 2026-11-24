import Link from "next/link";
import Image from "next/image";
import logo from "@/public/b_logo.png";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 left-0 z-50 w-full bg-[#043940] text-[#07C3BB] font-normal leading-[150%] tracking-[0.08px] shadow-md transition-all"
    >
      <div className="container py-2.5 sm:py-3 md:py-3.5 min-h-[72px] md:min-h-[78px] grid grid-cols-[auto_auto] items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Logo"
            width={290}
            height={55}
            className="h-auto w-48 sm:w-64 md:w-72 max-w-full block"
            priority
          />
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-4 text-sm sm:text-base">
          <Link
            href="/login"
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 border border-[#07C3BB] rounded-lg sm:rounded-xl hover:bg-[#07C3BB] hover:text-white transition-all duration-300 font-medium cursor-pointer"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 border border-[#07C3BB] bg-[#07C3BB] text-white rounded-lg sm:rounded-xl hover:bg-transparent hover:text-[#07C3BB] transition-all duration-300 font-medium cursor-pointer"
          >
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
