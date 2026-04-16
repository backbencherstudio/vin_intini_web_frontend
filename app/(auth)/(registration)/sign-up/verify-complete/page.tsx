import { VerifyIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";

function page() {
  return (
    <div className=" flex flex-col w-full py-12 justify-center ">
      <div className="flex justify-center w-full">
        <VerifyIcon />
      </div>
      <div className="mt-3 text-center">
        <p className="text-lg md:text-xl  lg:text-2xl font-medium">
          You email is Verified!
        </p>
        <Link
          href="#"
          className="bg-primaryColor text-center w-full block py-3 rounded-lg text-whiteColor hover:tracking-wider transition-all duration-300 mt-10 font-medium"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
