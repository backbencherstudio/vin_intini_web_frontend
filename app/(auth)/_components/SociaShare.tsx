"use client";

import { AppleIcon, GoogleIcon } from "@/public/svgIcons/Icons";
import { useGetGoogleQuery } from "@/feature/slice/socialLogin/socialLoginSlice";
import { useState } from "react";
import toast from "react-hot-toast";

function SocialShare() {
  const { data, isLoading, isError, refetch } =
    useGetGoogleQuery("googleLogin");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleSignIn = () => {
    if (data?.url) {
      setIsRedirecting(true);
      window.location.href = data.url;
      return;
    }

    if (isError) {
      toast.error("Unable to connect to Google service. Retrying...");
      refetch();
    }
  };

  return (
    <div>
      <div className="text-blackColor flex flex-col gap-3 text-sm">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isRedirecting}
          className="flex justify-center active:scale-95 cursor-pointer font-semibold items-center gap-2 w-full border border-borderColor hover:shadow-sm duration-200 transition-all px-4 py-3 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          {isRedirecting ? "Connecting to Google..." : "Sign in with Google"}
        </button>
        <button
          type="button"
          className="flex active:scale-95 justify-center cursor-pointer font-semibold w-full items-center gap-2 border border-borderColor hover:shadow-sm duration-200 transition-all px-4 py-3 rounded-full"
        >
          <AppleIcon />
          Sign in with Apple
        </button>
      </div>
    </div>
  );
}

export default SocialShare;
