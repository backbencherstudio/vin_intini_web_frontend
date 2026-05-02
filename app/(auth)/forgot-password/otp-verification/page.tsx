"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
} from "@/feature/slice/auth/authSlice";

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

      router.push("/forgot-password/verify-email");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
    // Here you can add the logic to verify the OTP, e.g., make an API call
  };

  return (
    <div className="">
      <div className="">
        <div className="flex flex-col items-center text-center">
          <h1 className="mt-4 md:text-xl text-lg lg:text-2xl font-semibold text-headerColor">
            OTP Verification
          </h1>
          <p className="mt-2 text-sm text-descriptionColor ">
            We’ve sent a OTP to you{" "}
            <span className=" font-semibold text-descriptionColor">
              ‘{verifyMail}’
            </span>{" "}
            email. Please check out and input the correct code
          </p>
        </div>

        <div
          className={`mt-10 flex  ${isError ? "border-redColor " : ""} rounded-md border max-w-48.25 mx-auto border-grayColor1 `}
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
              className={`h-13 ${isError ? "border-redColor text-redColor " : ""} ${index === 0 ? "border-none rounded-l-md" : index === otpLength - 1 ? "rounded-r-md" : "border-l"} w-full  border-l border-grayColor1 text-center text-headerColor text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primaryColor/60 `}
            />
          ))}
        </div>
        <div className="text-center mt-2">
          {isError && (
            <span className="text-sm  text-redColor">
              OTP didn’t matched! Try again
            </span>
          )}
        </div>
        <div className="mt-4 flex justify-center items-center gap-1 text-center">
          <p className="text-sm text-descriptionColor">Didn’t received code?</p>
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isForgotPasswordLoading}
            className=" text-sm font-medium   text-primaryColor hover:opacity-80 transition-opacity disabled:text-gray-400 cursor-pointer disabled:hover:opacity-100 disabled:cursor-not-allowed"
          >
            {isForgotPasswordLoading ? "Sending..." : "Resend"}
          </button>
        </div>

        <ButtonReuseable
          type="button"
          onClick={handleClick}
          sendingMsg="Verifying..."
          title="Verify"
          disabled={isLoading || otp.some((digit) => digit === "")}
          loading={isLoading}
          className="mt-6 w-full "
        />

        <div className="mt-4 flex items-center justify-center">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1 text-sm text-primaryColor hover:opacity-80 transition-opacity font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
