"use client";
import { URL } from "@/config/app.config";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@/public/svgIcons/Icons";
import { useGetGoogleQuery } from "@/feature/slice/socialLogin/socialLoginSlice";
import { useRouter } from "next/navigation";

function SocialShare() {

    const { data, isLoading, error } = useGetGoogleQuery("googleLogin");
    const router = useRouter();

  return (
    <div>
      <div className="text-blackColor flex flex-col gap-3 text-sm  ">
        <button
          onClick={()=>{
            if(data?.url){
              router.push(data.url);
            }
          }}
          className="flex justify-center active:scale-95 cursor-pointer font-semibold items-center gap-2  w-full border border-borderColor hover:shadow-sm duration-200 transition-all px-4 py-3 rounded-full"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        {/* <button className="flex active:scale-95 justify-center text-[#1877F2] cursor-pointer font-semibold w-full items-center gap-2 border border-borderColor hover:shadow-sm duration-200 transition-all px-4 py-3 rounded-full">
          <FacebookIcon />
          Sign in with Facebook
        </button> */}
        <button className="flex active:scale-95 justify-center cursor-pointer font-semibold w-full items-center gap-2 border border-borderColor hover:shadow-sm duration-200 transition-all px-4 py-3 rounded-full">
          <AppleIcon />
          Sign in with Apple
        </button>
      </div>
    </div>
  );
}

export default SocialShare;
