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
    <div className="flex items-center justify-between border-b border-[#F1F1F1] p-4 last:border-0">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#04A1B7]" />

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
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-[#D9F4F7]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#04A1B7] text-white">
              <ShieldCheck size={25} />
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
        <div className="space-y-3 border rounded-sm">
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