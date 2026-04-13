import Link from "next/link";

export default function Navbar() {
  const containerClass = "px-4 py-2 sm:px-8 sm:py-3 md:px-16 md:py-4 lg:px-24 lg:py-4 xl:px-32 xl:py-4 2xl:px-[240px] 2xl:py-4"
  return (
    <header
      className={`bg-[#043940] ${containerClass}`}
    >
      {/* ...content... */}
    </header>
  );
}
