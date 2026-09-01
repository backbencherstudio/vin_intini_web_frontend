"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  useGenerateTwoFactorRecoveryCodeEmailMutation,
  useTwoFactorRecoveryCodeVerifyEmailMutation,
} from "@/feature/slice/admin/securitySettings";
import { setToken } from "@/lib/token";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function page() {
  const otpLength = 4;
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const searchParams = useSearchParams();
  const [verifyMail, setVerifyMail] = useState<string>(
    searchParams.get("email") || "",
  );
  const [resendCountdown, setResendCountdown] = useState(0);
  const [twoFactorRecoveryCodeVerifyEmail, { isLoading, isError, isSuccess }] =
    useTwoFactorRecoveryCodeVerifyEmailMutation();
  const router = useRouter();
  const [
    generateTwoFactorRecoveryCodeEmail,
    {
      isLoading: isGenerateTwoFactorRecoveryCodeEmailLoading,
      isError: isGenerateTwoFactorRecoveryCodeEmailError,
    },
  ] = useGenerateTwoFactorRecoveryCodeEmailMutation();

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const intervalId = window.setInterval(() => {
      setResendCountdown((currentCountdown) => {
        if (currentCountdown <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return currentCountdown - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendCountdown]);

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
      await generateTwoFactorRecoveryCodeEmail({ email: verifyMail }).unwrap();
      setResendCountdown(180);
      toast.success("OTP resent successfully.");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleClick = async () => {
    try {
      const enteredOtp = otp.join("");
      const response = await twoFactorRecoveryCodeVerifyEmail({
        email: verifyMail,
        otp: enteredOtp,
      }).unwrap();

      toast.success(response?.message || "OTP verified successfully.");

      await setToken(response?.token || response.data.token);
      router.push(`/mu/home`);
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
            Confirm your recovery email
          </h1>
          <p className="mt-2 text-sm text-descriptionColor ">
            Type OTP code we’ve sent to your recovery email
          </p>
          <p className=" font-semibold text-descriptionColor">
            ‘{verifyMail}’
          </p>{" "}
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
            disabled={
              isGenerateTwoFactorRecoveryCodeEmailLoading || resendCountdown > 0
            }
            className=" text-sm font-medium   text-primaryColor hover:opacity-80 transition-opacity disabled:text-gray-400 cursor-pointer disabled:hover:opacity-100 disabled:cursor-not-allowed"
          >
            {isGenerateTwoFactorRecoveryCodeEmailLoading
              ? "Sending..."
              : resendCountdown > 0
                ? `Resend in ${formatCountdown(resendCountdown)}`
                : "Resend"}
          </button>
        </div>

        <ButtonReuseable
          type="button"
          onClick={handleClick}
          sendingMsg="Verifying..."
          title="Submit"
          disabled={isLoading || otp.some((digit) => digit === "")}
          loading={isLoading}
          className="mt-6 w-full "
        />
      </div>
    </div>
  );
}
