"use client";

import { useTwoFactorEmailCodeVerifyMutation } from "@/feature/slice/admin/securitySettings";
import { useAdminLoginMutation } from "@/feature/slice/auth/authSlice";
import baseApiSlice from "@/feature/slice/baseApi";
import { store } from "@/feature/store";
import { setToken } from "@/lib/token";
import logo from "@/public/logo.png";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 2FA state
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [twoFactorEmail, setTwoFactorEmail] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isUsingBackupCode, setIsUsingBackupCode] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [adminLogin, { isLoading: isLoginLoading }] = useAdminLoginMutation();
  const [verifyTwoFactor, { isLoading: is2FALoading }] =
    useTwoFactorEmailCodeVerifyMutation();

  // Step 1: Submit Admin Email & Password
  const onSubmitCredentials = async (data: AdminLoginFormData) => {
    try {
      const response = await adminLogin(data).unwrap();

      // Check if 2FA challenge is required
      if (response?.two_factor_enabled || response?.status === "2fa_required") {
        setTwoFactorEmail(data.email);
        setChallengeToken(response?.challenge_token || "");
        setIs2FARequired(true);
        setTwoFactorCode("");
        setTwoFactorError("");
        toast("Two-factor authentication required.", {
          icon: "🔐",
        });
        return;
      }

      const token = response?.token || response?.data?.token;
      if (!token) {
        toast.error("Authentication succeeded but token was missing.");
        return;
      }

      await setToken(token);
      store.dispatch(baseApiSlice.util.resetApiState());
      toast.success("Welcome back, Administrator!");
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(
        errorObj?.data?.message ||
          "Invalid email or password. Please verify your administrative credentials."
      );
    }
  };

  // Step 2: Submit 2FA Code (TOTP or Backup Code)
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setTwoFactorError("Please enter your verification code.");
      return;
    }

    try {
      setTwoFactorError("");
      const payload: Record<string, string> = {
        email: twoFactorEmail,
        code: twoFactorCode.trim(),
      };
      if (challengeToken) {
        payload.challenge_token = challengeToken;
      }

      const response = await verifyTwoFactor(payload).unwrap();
      const token = response?.token || response?.data?.token;
      if (!token) {
        toast.error("2FA succeeded but session token was missing.");
        return;
      }

      await setToken(token);
      store.dispatch(baseApiSlice.util.resetApiState());
      toast.success("Two-Factor Authentication verified. Welcome, Administrator!");
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setTwoFactorError(
        errorObj?.data?.message ||
          "Invalid verification code. Please check your authenticator and try again."
      );
    }
  };

  const handleResetToLogin = () => {
    setIs2FARequired(false);
    setTwoFactorCode("");
    setTwoFactorError("");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 selection:bg-primaryColor selection:text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(4,161,183,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Authentication Card Container */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/60 transition-all">
          {/* Logo at the top of the card */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-block transition hover:opacity-90">
              <Image
                src={logo}
                alt="MindUnite Logo"
                width={240}
                height={34}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {!is2FARequired ? (
            /* ========================================================== */
            /* STATE 1: Standard Admin Credentials (Email + Password)     */
            /* ========================================================== */
            <div>
              {/* Header */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Sign in to Control Center
                </h1>
                <p className="mt-1.5 text-xs text-slate-500">
                  Authorized administrative credentials required.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmitCredentials)}
                className="space-y-4"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Admin Email
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@mindunite.com"
                      {...register("email", {
                        required: "Admin email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                      className="block w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-rose-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password?from=admin"
                      className="text-xs font-semibold text-primaryColor hover:underline transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="block w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-primaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs font-medium text-rose-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me / Session Policy */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-primaryColor focus:ring-primaryColor/30 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-600">
                      Keep session active on this device
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="mt-2 inline-flex w-full h-11.5 items-center justify-center gap-2 rounded-xl bg-primaryColor px-4 text-sm font-semibold text-white shadow-md shadow-primaryColor/25 transition hover:bg-primaryColor/90 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryColor disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {isLoginLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Administrative Identity…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ========================================================== */
            /* STATE 2: In-Page Seamless Two-Factor Authentication (2FA) */
            /* ========================================================== */
            <div>
              {/* 2FA Header */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Two-Factor Challenge</span>
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  Security Code Verification
                </h1>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Account: <strong className="text-slate-800">{twoFactorEmail}</strong>
                  <br />
                  {isUsingBackupCode
                    ? "Enter one of your 10-character emergency backup recovery codes."
                    : "Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.)."}
                </p>
              </div>

              {/* 2FA Form */}
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div>
                  <label
                    htmlFor="2fa-code-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    {isUsingBackupCode
                      ? "10-Character Backup Code"
                      : "6-Digit Security Code"}
                  </label>
                  <div className="mt-1.5">
                    <input
                      id="2fa-code-input"
                      type="text"
                      autoFocus
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder={isUsingBackupCode ? "xxxxxxxxxx" : "000000"}
                      maxLength={isUsingBackupCode ? 12 : 6}
                      className="block w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-center font-mono text-xl tracking-[0.3em] font-semibold text-slate-900 placeholder-slate-300 focus:border-primaryColor focus:bg-white focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition"
                    />
                  </div>
                  {twoFactorError && (
                    <p className="mt-1.5 text-xs font-medium text-rose-500">
                      {twoFactorError}
                    </p>
                  )}
                </div>

                {/* Mode Toggle: Backup Code vs Authenticator */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUsingBackupCode(!isUsingBackupCode);
                      setTwoFactorCode("");
                      setTwoFactorError("");
                    }}
                    className="font-semibold text-primaryColor hover:underline cursor-pointer"
                  >
                    {isUsingBackupCode
                      ? "← Use Authenticator App"
                      : "Use Emergency Backup Code →"}
                  </button>
                  <Link
                    href={`/recovery-email?email=${encodeURIComponent(twoFactorEmail)}&redirect=/dashboard`}
                    className="text-slate-500 hover:text-slate-800 transition"
                  >
                    Recovery email
                  </Link>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={is2FALoading || !twoFactorCode.trim()}
                  className="mt-2 inline-flex w-full h-11.5 items-center justify-center gap-2 rounded-xl bg-primaryColor px-4 text-sm font-semibold text-white shadow-md shadow-primaryColor/25 transition hover:bg-primaryColor/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {is2FALoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Security Code…</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Enter Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Cancel & Back to Credentials */}
                <button
                  type="button"
                  onClick={handleResetToLogin}
                  className="inline-flex w-full h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Password Sign In</span>
                </button>
              </form>
            </div>
          )}

          {/* Enterprise Security Notice */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-slate-500">
              <strong className="font-semibold text-slate-700">Security Notice:</strong>{" "}
              Administrative sessions are monitored under strict compliance. Device fingerprints and IP telemetry are logged to protect system integrity.
            </p>
          </div>
        </div>

        {/* User Portal Link */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            ← Looking for standard member sign in? Return to User Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
