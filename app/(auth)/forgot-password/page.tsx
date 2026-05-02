"use client";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { useForgotPasswordMutation } from "@/feature/slice/auth/authSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function page() {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();
  const [forgotPassword, { isLoading, isError }] = useForgotPasswordMutation();

  const router = useRouter();
  const onSubmit = async (data: any) => {
    try {
      const response = await forgotPassword(data.email).unwrap();
      toast.success(
        response.message || "Password reset instructions sent to your email.",
      );
      localStorage.setItem("resetEmail", data.email);
      router.push("/forgot-password/otp-verification");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className=" ">
      <div className="w-full  ">
        <div className=" items-center text-center">
          <h3 className=" text-lg md:text-xl lg:text-2xl font-semibold text-headerColor">
            Reset your password
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div>
            <ReusableInput
              label="Email"
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              error={errors.email ? "Please enter a valid email address." : ""}
              className=" rounded-lg "
              {...register("email", { required: true })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 disabled:bg-gray-400 active:scale-95 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-lg bg-primaryColor text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {isLoading ? "Sending..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}
