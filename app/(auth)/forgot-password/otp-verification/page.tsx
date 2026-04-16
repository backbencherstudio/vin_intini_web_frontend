"use client";

import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
} from "@/feature/slice/auth/authSlice";
import { FileIcon, LeftAngleBracketIcon } from "@/public/svgIcons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function page() {
  const otpLength = 4;
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [verifyMail, setVerifyMail] = useState<string>("");
  const [verifyOtp, { isLoading, isError, isSuccess }] = useVerifyOtpMutation();
  const router = useRouter();
  const [
    forgotPassword,
    { isLoading: isForgotPasswordLoading, isError: isForgotPasswordError },
  ] = useForgotPasswordMutation();
  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (email) {
      setVerifyMail(email);
    }
  }, []);
  const handleChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const nextOtp = [...otp];
    const chars = digitsOnly.split("");

    chars.forEach((char, charIndex) => {
      const targetIndex = index + charIndex;
      if (targetIndex < otpLength) {
        nextOtp[targetIndex] = char;
      }
    });

    setOtp(nextOtp);

    const nextIndex = Math.min(index + chars.length, otpLength - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Backspace") return;

    if (otp[index]) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    if (index > 0) {
      const nextOtp = [...otp];
      nextOtp[index - 1] = "";
      setOtp(nextOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedValue) return;

    const nextOtp = [...otp];
    const chars = pastedValue.slice(0, otpLength - index).split("");

    chars.forEach((char, charIndex) => {
      nextOtp[index + charIndex] = char;
    });

    setOtp(nextOtp);

    const nextFocusIndex = Math.min(index + chars.length, otpLength - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };
  const handleResendClick = async () => {
    try {
      await forgotPassword(verifyMail).unwrap();
      toast.success("OTP resent successfully.");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleClick = async () => {
    try {
      const enteredOtp = otp.join("");
      const response = await verifyOtp({
        email: verifyMail,
        otp: enteredOtp,
      }).unwrap();

      toast.success(response?.message || "OTP verified successfully.");

      router.push("/forgot-password/reset-password");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
    // Here you can add the logic to verify the OTP, e.g., make an API call
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-14 min-h-full bg-muted/40 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-[#DFE1E7] bg-white p-5 sm:p-6 md:p-7">
        <div className="flex flex-col items-center text-center">
          <div className="w-18 h-18 rounded-full bg-linear-to-t to-primaryColor/48 text-primaryColor flex items-center justify-center">
            <div className="w-13 h-13 border border-[#B6CFC0] rounded-full bg-white text-primaryColor flex items-center justify-center ">
              <FileIcon />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-[#1D1F2C]">
            OTP Verification
          </h1>
          <p className="mt-2 text-sm text-[#4A4C56] max-w-72.5">
            We have sent a verification code to email address
            <span className="block font-semibold text-[#1D1F2C]">
              {verifyMail}
            </span>
          </p>
        </div>

        <div className="mt-6 flex gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength={1}
              inputMode="numeric"
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              className="h-12 w-full rounded-lg border border-[#DFE1E7] bg-[#F5F6FA] text-center text-[#1D1F2C] focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#4A4C56]">
            Haven&apos;t you got the OTP yet?
          </p>
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isForgotPasswordLoading}
            className="mt-2 text-sm font-medium  text-primaryColor hover:opacity-80 transition-opacity disabled:text-gray-400 cursor-pointer disabled:hover:opacity-100 disabled:cursor-not-allowed"
          >
            {isForgotPasswordLoading ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading || otp.some((digit) => digit === "")}
          className="mt-6 w-full cursor-pointer disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed h-11 rounded-lg bg-primaryColor text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-4 flex items-center justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-[#808191] hover:text-[#4A4C56] transition-colors"
          >
            <LeftAngleBracketIcon />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
