import { CorrectIcon } from "@/public/svgIcons/AdminIcon";
import { ShieldCheck } from "lucide-react";

interface SecurityOverviewProps {
  twoFactorEnabled: boolean;
}

interface SecurityStatusProps {
  title: string;
  value: string;
}

function SecurityStatus({
  title,
  value,
}: SecurityStatusProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1F1F1] px-4  py-5.5 last:border-0">
      <div className="flex items-center gap-2">
       <CorrectIcon/>

        <span className="overflow-hidden text-headerColor text-ellipsis text-sm font-semibold leading-[140%] tracking-[0.07px]
">
          {title}
        </span>
      </div>

      <span className="overflow-hidden text-ellipsis text-[#4A4C56] text-[14px] font-normal leading-[140%] tracking-[0.07px]
">
        {value}
      </span>
    </div>
  );
}

export default function SecurityOverview({
  twoFactorEnabled,
}: SecurityOverviewProps) {
  return (
    <section className="rounded-md  ">
      <div className=" border-[#EEEEEE] py-6">
        <h2 className="text-headerColor font-['Segoe_UI'] text-xl font-semibold leading-[130%] tracking-[0.1px]">
          Account Security Overview
        </h2>

        <p className="mt-1 text-[#4A4C56] font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px]">
          Review your account security status and take action to keep your
          account safe.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[328px_1fr]">
        {/* Security Score */}
        <div className="flex flex-col items-center justify-center border p-6 rounded-sm">
          <div className="relative flex h-48 w-48 items-center justify-center">
  {/* Progress Circle */}
  <div
    className="absolute inset-0 rounded-full"
    style={{
      background:
        "conic-gradient(#04A1B7 0deg 200deg, #D9F4F7 200deg 360deg)",
    }}
  />

  {/* Inner Background */}
  <div className="absolute inset-[10px] rounded-full bg-[#E6F6F8]" />

  {/* Icon */}
  <div className="relative flex h-28 w-28 items-center justify-center">
    <ShieldCheck
      className="text-primaryColor"
      size={48}
      strokeWidth={2}
    />
  </div>
</div>

          <p className="mt-1 text-[#4A4C56] font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px]
">
            Security Score
          </p>

          <p className="text-primaryColor text-center text-2xl font-semibold leading-[130%] tracking-[0.12px] ">
            Strong
          </p>

          <p className="text-[#4A4C56] text-sm font-normal leading-[140%] tracking-[0.07px]">
            Last checked today, 10:40 AM
          </p>
        </div>

        {/* Security Status */}
        <div className="space-y border rounded-sm">
          <SecurityStatus
            title="Password Strength"
            value="Strong"
          />

          <SecurityStatus
            title="Two-Factor Authentication"
            value={twoFactorEnabled ? "Enabled" : "Disabled"}
          />

          <SecurityStatus
            title="Active Sessions"
            value="2 active devices"
          />

          <SecurityStatus
            title="Account Recovery"
            value="Email verified"
          />

          <SecurityStatus
            title="Login Activity"
            value="No suspicious activity"
          />
        </div>
      </div>
    </section>
  );
}