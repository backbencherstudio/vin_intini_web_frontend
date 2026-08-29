"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface StepBackupCodesProps {
  codes: string[];
  onDone: () => void;
  onClose: () => void;
}

export default function StepBackupCodes({
  codes,
  onDone,
  onClose,
}: StepBackupCodesProps) {
  const [copied, setCopied] = useState(false);

 const handleDownload = () => {
  if (!codes?.length) return;

  const blob = new Blob([codes.join("\n")], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "recovery-codes.txt";
  a.click();

  URL.revokeObjectURL(url);

  toast.success("Codes downloaded!");

  onDone();
};

  return (
    <div className="space-y-4 px-3">
      <p className="text-sm text-[#777980]">
        Store these backup codes in a safe place. You can use them if you lose
        access to your authenticator app.
      </p>

      <div className="grid grid-cols-2 gap-2 rounded-md border bg-gray-50 p-4">
        {codes && codes.length > 0 ? (
          codes.map((code) => (
            <div
              key={code}
              className="text-center font-mono text-sm font-medium"
            >
              {code}
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-sm text-gray-500 py-2">
            No recovery codes available.
          </p>
        )}
      </div>

    <button
  type="button"
  onClick={handleDownload}
   disabled={!codes?.length}
  className="text-sm font-medium text-white mt-3 bg-primaryColor px-2 py-1 rounded-sm w-full"
>
  Download this backup codes
</button>

      {/* <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white"
        >
          Done
        </button>
      </div> */}
    </div>
  );
}