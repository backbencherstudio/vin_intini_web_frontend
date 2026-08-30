"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
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
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>();

  // const [recoveryEmail, { isLoading }] = useRecoveryEmailMutation();

  const onSubmit = async (data: FormData) => {
    try {
      // await recoveryEmail(data).unwrap();

      toast.success("OTP sent successfully");
      onSuccess(); // Go to OTP step
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
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
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
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="mt-5 w-full rounded-lg bg-primaryColor py-2 text-sm font-semibold text-white"
      >
        Continue
      </button>
    </div>
  );
}