import Link from "next/link";

export default function ComingSoonCard() {
  return (
    <div className="py-10 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 sm:py-12 md:py-16 lg:py-20 ">
      {/* Outer Card Container */}
      <div className="rounded-lg sm:rounded-xl bg-primaryColor/10 md:rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primaryColor">
            WATCH FOR ANNOUNCEMENTS
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1F2C]">
            Coming Soon!
          </h1>
        </div>

        {/* Content Paragraphs */}
        <div className="mx-auto mt-8  space-y-5 text-left text-base sm:text-lg leading-relaxed text-[#4A4C56]">
          <p>
            <span className="font-semibold text-primaryColor">
              Mind Unite Premium
            </span>{" "}
            subscribers will be able to search for and directly apply for jobs posted on the Mind Unite platform.
          </p>

          <p>
            <span className="font-semibold text-primaryColor">
              Mind Unite Premium-Industry
            </span>{" "}
            subscribers will be able to post their available positions- whether at a University, within a research lab, at a private practice, or within another corporation or industry seeking brain health professionals, let us connect you to our network.
          </p>

          {/* Divider & Bottom Notice */}
          <div className="border-t border-[#DDE3EA] pt-5">
            <p className=" text-[#4A4C56] leading-relaxed">
              For now, if you have a position you want to advertise, click the Contact Us button on the navbar and tell us about the position so we can advertise it for you!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/mu/contact-us"
            className="inline-flex items-center justify-center rounded-full bg-primaryColor px-8 py-3 text-sm sm:text-base font-medium text-white shadow-sm transition-all  active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}