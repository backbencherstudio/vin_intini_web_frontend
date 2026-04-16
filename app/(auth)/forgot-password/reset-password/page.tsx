"use client";
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
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-14 min-h-full bg-muted/40 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-[#DFE1E7] bg-white p-5 sm:p-6 md:p-7">
        <div className="flex flex-col items-center text-center">
         
          <h1 className="mt-4 text-3xl font-semibold text-[#1D1F2C]">
            Create New Password
          </h1>
          <p className="mt-2 text-sm text-[#4A4C56] max-w-75">
            Please enter a new password. Your new password must be different
            from previous password.
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
              <input
                id="new-password"
                {...register("new_password", { required: true })}
                type={isShowingPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border border-[#DFE1E7] bg-[#F5F6FA] px-3 pr-10 text-sm text-[#1D1F2C] placeholder:text-[#808191] focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={
                  isShowingPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-[#4A4C56]"
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
              <input
                id="confirm-password"
                {...register("confirm_new_password", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === watch("new_password") || "Passwords do not match",
                })}
                type={isShowingConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border border-[#DFE1E7] bg-[#F5F6FA] px-3 pr-10 text-sm text-[#1D1F2C] placeholder:text-[#808191] focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
              />
              <button
                type="button"
                onClick={() => setIsShowingConfirmPassword((prev) => !prev)}
                aria-label={
                  isShowingConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-[#4A4C56]"
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-lg bg-primaryColor text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {isLoading ? "Confirming..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
