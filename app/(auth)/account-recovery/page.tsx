"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import { X } from "lucide-react";
import Link from "next/link";

function page() {
  const handleKeepAccount = () => {
    // Logic to keep the account
    console.log("User chose to keep the account.");
  };
  return (
    <div className="space-y-4 ">
      <div className="flex  justify-between items-start">
        <div>
          <h4 className="text-headerColor text-base font-semibold">⚠️ Account Recovery Confirmation</h4>
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
      <h4 className="text-headerColor text-base font-semibold">Do you want to keep your account?</h4>
      <div className="flex items-center gap-4">
        <ButtonReuseable
          title="Keep My Account"
          className="py-2! "
          onClick={handleKeepAccount}
        />
        <ButtonReuseable
          title="Delete Permanently"
          className="py-2! border border-redColor! text-redColor! bg-whiteColor! "
          onClick={handleKeepAccount}
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
