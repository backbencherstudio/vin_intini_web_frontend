"use client";

import { useLoginMutation } from "@/feature/slice/auth/authSlice";
import { setToken } from "@/lib/token";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiEyeOff } from "react-icons/fi";
import SocialShare from "./SociaShare";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

function LoginForm() {
  const { register, handleSubmit, watch } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const route = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      if (response.error) {
        const status =
          "status" in response.error ? response.error.status : undefined;
        if (status === 401) {
          toast.error("Invalid email or password");
        }
      }

      if (response?.data?.success) {
        toast.success("Login successful!");
        await setToken(response.data.token);
        route.push("/dashboard");
      }
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className=" space-y-4 md:space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#1D1F2C] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full h-11 rounded-lg border border-[#DFE1E7] bg-[#F5F6FA] px-3 text-sm text-[#1D1F2C] placeholder:text-[#808191] focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#1D1F2C] mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
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
              className="w-full h-11 rounded-lg border border-[#DFE1E7] bg-[#F5F6FA] px-3 pr-10 text-sm text-[#1D1F2C] placeholder:text-[#808191] focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
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

        <div className="flex items-center justify-end  pt-1">
          <Link
            href="/forgot-password"
            className="text-sm text-primaryColor hover:opacity-80 transition-opacity"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 cursor-pointer disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg bg-primaryColor text-white font-medium hover:opacity-90 transition-opacity"
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
          <Link
            href="/registration"
            className="text-primaryColor hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
