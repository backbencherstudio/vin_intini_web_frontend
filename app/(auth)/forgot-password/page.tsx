"use client";
import { useForgotPasswordMutation } from "@/feature/slice/auth/authSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function page() {
  const { handleSubmit, register } = useForm();
  const [forgotPassword, { isLoading, isError, isSuccess }] =
    useForgotPasswordMutation();

  console.log(isSuccess, "success");

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
    <div className="">
      <div className="w-full  ">
        <div className=" items-center text-center">
          <h3 className="mt-4 text-lg md:text-xl lg:text-2xl font-semibold text-headerColor">
            Reset your password
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-descriptionColor mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              className="w-full h-11 rounded-lg border border-borderColor bg-inputBg px-3 text-sm text-descriptionColor placeholder:text-placeholderColor focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
              {...register("email", { required: true })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-lg bg-primaryColor text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {isLoading ? "Sending..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}
