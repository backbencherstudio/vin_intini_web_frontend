"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import Loading from "@/components/reusable/Loader";
import {
  useRecoveryEmailOtpVerifyMutation,
  useRecoveryEmailUpdateMutation,
} from "@/feature/slice/admin/securitySettings";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormData {
  email: string;
  password: string;
}

interface Props {
  onSuccess: () => void;
}

export default function RecoveryEmail({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [RecoveryEmailUpdate, { isLoading }] = useRecoveryEmailUpdateMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await RecoveryEmailUpdate(data).unwrap();

      toast.success("OTP sent successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="px-3">
      <p className="mb-5 text-sm text-[#4A4C56]">
        Enter your recovery email and password.
      </p>

      <div className="space-y-4">
        <CustomInput
          label="Recovery Email"
          placeholder="Enter your email"
          type="email"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        <CustomInput
          label="Password"
          placeholder="****************"
          type="password"
          {...register("password", {
            required: "Password is required",
          })}
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6 w-full">
        {isLoading ? (
          <Loading />
        ) : (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="cursor-pointer w-full rounded-sm bg-primaryColor px-4 py-2 text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
