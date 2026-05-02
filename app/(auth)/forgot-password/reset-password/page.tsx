"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { useResetPasswordMutation } from "@/feature/slice/auth/authSlice";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEyeOff } from "react-icons/fi";

export default function page() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();
  const [email, setEmail] = useState("");
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [isShowingConfirmPassword, setIsShowingConfirmPassword] =
    useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const togglePasswordVisibility = () => {
    setIsShowingPassword((prev) => !prev);
  };
  console.log(isLoading, "check");

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const onSubmit = async (data: any) => {
    try {
      const response = await resetPassword({
        email,
        new_password: data.new_password,
        new_password_confirmation: data.confirm_new_password,
      }).unwrap();

      toast.success(response?.message || "Password reset successfully.");
      localStorage.removeItem("resetEmail");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <div className="">
      <div className="">
        <div className="flex flex-col items-center text-center">
          <h1 className="mt-4 text-lg md:text-xl lg:text-2xl font-semibold text-headerColor">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-descriptionColor max-w-75">
            Change your password
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-[#1D1F2C] mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <ReusableInput
                id="new-password"
                {...register("new_password", { required: true })}
                type={isShowingPassword ? "text" : "password"}
                placeholder="••••••••"
                className=" rounded-lg "
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={
                  isShowingPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 active:scale-95 cursor-pointer  -translate-y-1/2 text-[#4A4C56]"
              >
                {isShowingPassword ? <FiEyeOff size={18} /> : <OpenEyeIcon />}
              </button>
            </div>
          </div>
          {errors.new_password && (
            <p className="text-sm text-red-500">
              {errors.new_password.message as string}
            </p>
          )}

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-[#1D1F2C] mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <ReusableInput
                id="confirm-password"
                {...register("confirm_new_password", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === watch("new_password") || "Passwords do not match",
                })}
                type={isShowingConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className=" rounded-lg "
              />
              <button
                type="button"
                onClick={() => setIsShowingConfirmPassword((prev) => !prev)}
                aria-label={
                  isShowingConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 active:scale-95 cursor-pointer -translate-y-1/2 text-[#4A4C56]"
              >
                {isShowingConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <OpenEyeIcon />
                )}
              </button>
            </div>
          </div>
          {errors.confirm_new_password && (
            <p className="text-sm text-red-500">
              {errors.confirm_new_password.message as string}
            </p>
          )}
          <ButtonReuseable
            type="submit"
            loading={isLoading}
            title="Reset Password"
            sendingMsg="Confirming..."
            className="w-full"
          />
        </form>
      </div>
    </div>
  );
}
