"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import { useRecoverYourAccountMutation } from "@/feature/slice/auth/authSlice";
import { clearToken, setToken } from "@/lib/token";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function page() {
  const [recoverYourAccount] = useRecoverYourAccountMutation();
  const route = useRouter();
  const handleKeepAccount = async () => {
    try {
      const response = await recoverYourAccount(undefined).unwrap();
      toast.success("Login successful!");
      await setToken(response?.token || response.data.token);
      route.push(`/mu/home`);
    } catch (error) {
      console.error(error, "error======");
      toast.error(error?.data?.message || "Email or password is incorrect.");
    }
  };

  const handleDeleteAccount = async () => {
    await clearToken();
    route.push(`/login`);
  };
  return (
    <div className="space-y-4 ">
      <div className="flex  justify-between items-start">
        <div>
          <h4 className="text-headerColor text-base font-semibold">
            ⚠️ Account Recovery Confirmation
          </h4>
          <p className="text-sm text-grayColor1 mt-0.5">
            Your account has been scheduled for deletion.
          </p>
        </div>
        <Link href="/login">
          <X className="w-6 h-6" />
        </Link>
      </div>
      <p className="text-sm text-grayColor1">
        You have 30 days to recover your account. If you continue, your account
        will be permanently deleted and cannot be recovered after this period.
      </p>
      <h4 className="text-headerColor text-base font-semibold">
        Do you want to keep your account?
      </h4>
      <div className="flex items-center gap-4">
        <ButtonReuseable
          title="Keep My Account"
          className="py-2! "
          onClick={handleKeepAccount}
        />
        <ButtonReuseable
          title="Delete Permanently"
          className="py-2! border border-redColor! text-redColor! bg-whiteColor! "
          onClick={handleDeleteAccount}
        />
      </div>

      <p className="text-redColor text-sm leading-[140%]">
        Note: If you choose Delete Permanently, all account data may be
        permanently removed and cannot be recovered after the recovery period.
      </p>
    </div>
  );
}

export default page;
