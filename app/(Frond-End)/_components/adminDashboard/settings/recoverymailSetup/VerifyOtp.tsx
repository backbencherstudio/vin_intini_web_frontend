"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormData {
  otp: string;
}

interface Props {
  onSuccess: () => void;
}

export default function VerifyOtp({ onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>();

  // const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const onSubmit = async (data: FormData) => {
    try {
      // await verifyOtp(data).unwrap();

      toast.success("OTP verified successfully");
      onSuccess(); 
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="px-3">
      <p className="mb-5 text-sm text-[#4A4C56]">
        Enter the OTP sent to your recovery email.
      </p>

      <CustomInput
        label="Verification Code"
        placeholder="Enter OTP"
        type="text"
        {...register("otp", {
          required: "OTP is required",
        })}
      />

      {errors.otp && (
        <p className="mt-1 text-sm text-red-500">
          {errors.otp.message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="mt-5 w-full rounded-lg bg-primaryColor py-2 text-sm font-semibold text-white"
      >
        Verify
      </button>
    </div>
  );
}