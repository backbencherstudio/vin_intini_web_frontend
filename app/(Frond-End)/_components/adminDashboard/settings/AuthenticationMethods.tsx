"use client";

import { useState } from "react";
import {
  Smartphone,
  KeyRound,
  Mail,
  MoreHorizontal,
  CheckCircle2,
  Copy,
  type LucideIcon,
  Monitor,
} from "lucide-react";

interface AuthenticationMethod {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: "primary" | "verified";
  action?: "menu" | "copy";
}

const authenticationMethods: AuthenticationMethod[] = [
  {
    title: "Authenticator App",
    description: "Use an authenticator app to generate codes.",
    icon: Monitor,
    badge: "Primary",
    badgeType: "primary",
    action: "menu",
  },
  {
    title: "Backup Codes",
    description: "8 of 10 codes unused",
  icon: Monitor,
    action: "copy",
  },
  {
    title: "Recovery Email",
    description: "user@example.com",
   icon: Monitor,
   
    badgeType: "verified",
  },
];

export default function AuthenticationMethods() {
  const [copied, setCopied] = useState(false);

  const copyBackupCode = () => {
    navigator.clipboard?.writeText("8HDK-72KL");

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <section className="h-full rounded-md border p-4">
      <h2 className="text-headerColor text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
        Authentication Method
      </h2>

      <div className="mt-5 space-y-5">
        {authenticationMethods.map((method) => {
          const Icon = method.icon;

          return (
            <div
              key={method.title}
              className="flex items-center gap-3"
            >
              {/* Icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                <Icon
                  size={24}
                  className="text-#000]"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]
">
                  {method.title}
                </p>

                <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]
">
                  {method.description}
                </p>
              </div>

              {/* Badge */}
              {method.badge && (
                <span
                  className={
                    method.badgeType === "primary"
                      ? "rounded-full border border-[#287F6E] px-2 py-1 text-[#287F6E] text-center text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                      : "text-[9px] text-[#287F6E]"
                  }
                >
                  {method.badge}
                </span>
              )}

              {/* Action */}
             
                <button type="button">
                  <MoreHorizontal
                    size={16}
                    className="text-[#000]"
                  />
                </button>
           

              {/* {method.action === "copy" && (
                <button
                  type="button"
                  onClick={copyBackupCode}
                  className="text-[#888] transition-colors hover:text-[#04A1B7]"
                >
                  {copied ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              )} */}
            </div>
          );
        })}
      </div>
    </section>
  );
}