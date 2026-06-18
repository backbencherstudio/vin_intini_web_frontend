import Link from "next/link";

export default function Page() {
  return (
    <div className="py-10 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 sm:py-12 md:py-16 lg:py-20">
      <div
        className="rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-6 md:space-y-8"
        style={{
          background:
            "linear-gradient(179deg, rgba(253, 253, 253, 0.10) -63.29%, rgba(1, 120, 242, 0.10) 98.84%)",
        }}
      >
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primaryColor">
            Watch for Announcements
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-headerColor leading-tight">
            Coming Soon!
          </h1>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 text-left">
          <p className="text-sm sm:text-base md:text-lg text-grayColor1 leading-relaxed">
            <span className="font-semibold text-primaryColor">
              Mind Unite Premium
            </span>{" "}
            subscribers will be able to search for and directly apply for jobs
            posted on the Mind Unite platform.
          </p>

          <p className="text-sm sm:text-base md:text-lg text-grayColor1 leading-relaxed">
            <span className="font-semibold text-primaryColor">
              Mind Unite Premium-Industry
            </span>{" "}
            subscribers will be able to post their available positions — whether
            at a University, within a research lab, private practice, or other
            corporation or industry partners in search of brain health
            professionals.
          </p>

          <div className="border-t border-borderColor pt-4 mt-4">
            <p className="text-sm sm:text-base md:text-lg text-grayColor1 leading-relaxed">
              For now, if you have a position you want to advertise, click the
              Contact Us button below and tell us about the position so we can
              advertise it for you!
            </p>
          </div>
        </div>

        <Link
          href="/mu/contact-us"
          className="inline-block px-8 py-3 bg-buttonColor text-whiteColor font-medium rounded-full hover:opacity-90 transition-opacity active:scale-95 text-sm sm:text-base"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
