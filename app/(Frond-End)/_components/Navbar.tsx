import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header
      className={`w-full bg-[#043940] text-[#07C3BB] font-normal leading-[150%] tracking-[0.08px]`}
    >
      <div className="container py-4! grid grid-cols-[auto_auto] items-center justify-between gap-4">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={256}
            height={50}
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
          <Link href="/login" className="px-2 sm:px-4 py-0.5 sm:py-2 border border-[#07C3BB] rounded-lg sm:rounded-xl hover:rounded-md hover:bg-[#07C3BB] hover:text-white transition-all duration-300">
            Sign in
          </Link>
          <Link href="/register" className="px-2 sm:px-4 py-0.5 sm:py-2 border border-[#07C3BB] bg-[#07C3BB] text-white rounded-lg sm:rounded-xl hover:rounded-md hover:bg-transparent hover:text-[#07C3BB] transition-all duration-300">
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
