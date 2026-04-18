"use client";

import { OpenEyeIcon } from "@/public/svgIcons/Icons";

import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { useRegistrationMutation } from "@/feature/slice/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiEyeOff } from "react-icons/fi";
import SocialShare from "./SociaShare";
interface RegFromData {
  email: string;
  password: string;
}
function RegistrationForm() {
  const { register, handleSubmit, watch } = useForm<RegFromData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [registration, { isLoading }] = useRegistrationMutation();
  const [showPassword, setShowPassword] = useState(false);
  const route = useRouter();
  const onSubmit = async (data: RegFromData) => {
    try {
      const response = await registration(data).unwrap();
      if (response.error) {
        const status =
          "status" in response.error ? response.error.status : undefined;
        if (status === 401) {
          toast.error("Invalid email or password");
        }
      }

      toast.success("Registration successful!");
      localStorage.setItem("regEmail", data.email);
      route.push("/sign-up/verify-email");
    } catch (error) {
      console.log("Registration error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <div className=" space-y-4 md:space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div>
            <ReusableInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className=" rounded-lg "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-descriptionColor mb-2"
            >
              Password{" "}
              <span className="font-normal"> (6 or more characters)</span>
            </label>
            <div className="relative">
              <ReusableInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className=" rounded-lg "
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-[#4A4C56] hover:text-primaryColor transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <OpenEyeIcon />}
              </button>
            </div>
          </div>

          <div className="text-center mx-auto text-sm max-w-[366px] text-descriptionColor pt-1">
            By clicking <span className="font-medium">Join Now</span>, you agree
            to the <span className="font-medium">MindUnite</span>{" "}
            <Link href={"#"} className="text-primaryColor">
              User Agreement
            </Link>
            ,
            <Link href={"#"} className="text-primaryColor">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href={"#"} className="text-primaryColor">
              and Cookie Policy.
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 cursor-pointer disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg bg-buttonColor text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Connecting..." : "Sign in"}
          </button>
        </form>
        <div className=" relative h-px w-full bg-borderColor">
          <p className="text-center absolute left-1/2 top-1/2 text-base text-descriptionColor -translate-x-1/2 -translate-y-1/2 bg-white px-4">
            or
          </p>
        </div>
        <div className="">
          <SocialShare />
        </div>
        <div>
          <p className="text-center text-sm md:text-base text-grayColor1">
            Don’t have an account?{" "}
            <Link href="/login" className="text-primaryColor hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
