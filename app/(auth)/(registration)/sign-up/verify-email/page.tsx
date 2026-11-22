"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  useRegSendOTPMutation,
  useRegVerifyOtpMutation,
} from "@/feature/slice/auth/authSlice";
import { setToken } from "@/lib/token";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const otpLength = 4;
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [verifyMail, setVerifyMail] = useState<string>("");
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [customEmail, setCustomEmail] = useState<string>("");
  const [regVerifyOtp, { isLoading, isError }] = useRegVerifyOtpMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [regSendOTP, { isLoading: isRegSendOTPLoading }] =
    useRegSendOTPMutation();

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    const localEmail =
      typeof window !== "undefined" ? localStorage.getItem("regEmail") : null;
    const resolvedEmail = queryEmail || localEmail || "";

    if (resolvedEmail) {
      setVerifyMail(resolvedEmail);
      setCustomEmail(resolvedEmail);
      if (typeof window !== "undefined") {
        localStorage.setItem("regEmail", resolvedEmail);
      }
    } else {
      setIsEditingEmail(true);
    }
  }, [searchParams]);

  const handleSaveEmail = () => {
    const trimmed = customEmail.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setVerifyMail(trimmed);
    if (typeof window !== "undefined") {
      localStorage.setItem("regEmail", trimmed);
    }
    setIsEditingEmail(false);
  };

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
    const emailToUse = verifyMail || customEmail.trim();
    if (!emailToUse) {
      toast.error("Please enter your registered email address.");
      setIsEditingEmail(true);
      return;
    }
    try {
      const response = await regSendOTP(emailToUse).unwrap();
      toast.success(response?.message || "OTP resent successfully.");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to resend OTP. Please try again.",
      );
    }
  };

  const handleClick = async () => {
    const emailToUse = verifyMail || customEmail.trim();
    if (!emailToUse) {
      toast.error("Please enter your registered email address.");
      setIsEditingEmail(true);
      return;
    }
    try {
      const enteredOtp = otp.join("");

      const response = await regVerifyOtp({
        email: emailToUse,
        otp: enteredOtp,
      }).unwrap();

      toast.success(response?.message || "OTP verified successfully.");
      await setToken(response?.token || response?.data?.token || "");
      router.push("/sign-up/verify-complete");
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="">
        <div className="flex flex-col items-center text-center">
          <h1 className="mt-4 pb-1 md:text-xl text-lg lg:text-2xl font-semibold text-headerColor">
            OTP Verification
          </h1>
          <p className="mt-2 text-sm text-descriptionColor ">
            We’ve sent an OTP to{" "}
            <span className="font-semibold text-headerColor">
              ‘{verifyMail || "your registered email"}’
            </span>
            {verifyMail && (
              <button
                type="button"
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="ml-2 text-xs text-primaryColor font-medium underline cursor-pointer hover:opacity-80"
              >
                {isEditingEmail ? "Close" : "Change email"}
              </button>
            )}
          </p>

          {isEditingEmail && (
            <div className="mt-3 flex items-center gap-2 w-full max-w-sm">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Enter registered email"
                className="h-10 px-3 text-sm border border-grayColor1 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primaryColor"
              />
              <button
                type="button"
                onClick={handleSaveEmail}
                className="h-10 px-4 text-xs font-semibold bg-primaryColor text-white rounded-md hover:opacity-90 active:scale-95 transition-all"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div
          className={`mt-10 flex ${isError ? "border-redColor " : ""} rounded-md border max-w-48.25 mx-auto border-grayColor1 `}
        >
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
              className={`h-13 ${isError ? "border-redColor text-redColor " : ""} ${index === 0 ? "border-none rounded-l-md" : index === otpLength - 1 ? "rounded-r-md" : "border-l"} w-full border-l border-grayColor1 text-center text-headerColor text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primaryColor/60 `}
            />
          ))}
        </div>
        <div className="text-center mt-2">
          {isError && (
            <span className="text-sm text-redColor">
              OTP didn’t match! Try again
            </span>
          )}
        </div>
        <div className="mt-4 mb-6 flex justify-center items-center gap-1 text-center">
          <p className="text-sm text-descriptionColor">Didn’t receive code?</p>
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isRegSendOTPLoading}
            className="text-sm font-medium active:scale-95 text-primaryColor! hover:opacity-80 transition-opacity disabled:text-gray-400 cursor-pointer disabled:hover:opacity-100 disabled:cursor-not-allowed"
          >
            {isRegSendOTPLoading ? "Sending..." : "Resend"}
          </button>
        </div>

        <ButtonReuseable
          type="button"
          onClick={handleClick}
          sendingMsg="Verifying..."
          title="Verify"
          disabled={isLoading || otp.some((digit) => digit === "")}
          loading={isLoading}
          className="mt-6 w-full"
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-descriptionColor">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
