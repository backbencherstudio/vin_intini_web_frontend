"use client";

import { useState } from "react";
import {
  Smartphone,
  KeyRound,
  Mail,
  MoreHorizontal,
  CheckCircle2,
  Copy,
} from "lucide-react";

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
    <section className="rounded-md border  p-4 h-full">
      <h2 className="text-headerColor text-[20px] font-semibold leading-[130%] tracking-[0.1px]
">
        Authentication Method
      </h2>

      <div className="mt-5 space-y-5">
        {/* Authenticator App */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
            <Smartphone
              size={15}
              className="text-[#555]"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-[#333]">
              Authenticator App
            </p>

            <p className="mt-1 text-[9px] text-[#999]">
              Use an authenticator app to generate codes.
            </p>
          </div>

          <span className="rounded-full border border-[#4AC7B5] px-2 py-1 text-[8px] text-[#04A1B7]">
            Primary
          </span>

          <button type="button">
            <MoreHorizontal
              size={16}
              className="text-[#888]"
            />
          </button>
        </div>

        {/* Backup Codes */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
            <KeyRound
              size={15}
              className="text-[#555]"
            />
          </div>

          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[#333]">
              Backup Codes
            </p>

            <p className="mt-1 text-[9px] text-[#999]">
              8 of 10 codes unused
            </p>
          </div>

          <button
            type="button"
            onClick={copyBackupCode}
            className="text-[#888] hover:text-[#04A1B7]"
          >
            {copied ? (
              <CheckCircle2 size={15} />
            ) : (
              <Copy size={15} />
            )}
          </button>
        </div>

        {/* Recovery Email */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
            <Mail
              size={15}
              className="text-[#555]"
            />
          </div>

          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[#333]">
              Recovery Email
            </p>

            <p className="mt-1 text-[9px] text-[#999]">
              user@example.com
            </p>
          </div>

          <span className="text-[9px] text-[#04A1B7]">
            Verified
          </span>
        </div>
      </div>
    </section>
  );
}