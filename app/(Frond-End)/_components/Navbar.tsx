import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header
      className={`w-full bg-[#043940] text-[#07C3BB] font-normal leading-[150%] tracking-[0.08px]`}
    >
      <div className="container py-4! flex items-center justify-between">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={256}
          height={50}
        />
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 border border-[#07C3BB] rounded-xl hover:bg-[#07C3BB] hover:text-white transition-colors duration-300">
            Sign in
          </Link>
          <Link href="/register" className="px-4 py-2 border border-[#07C3BB] bg-[#07C3BB] text-white rounded-xl hover:bg-transparent hover:text-[#07C3BB] transition-colors duration-300">
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
