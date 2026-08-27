"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <CustomInput
        label={label}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-[45px] cursor-pointer text-[#8C8C8C] transition-colors hover:text-[#4A4C56]"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff size={17} />
        ) : (
          <Eye size={17} />
        )}
      </button>
    </div>
  );
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const updatePassword = () => {
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessageType("error");
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setMessageType("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    setMessageType("success");
    setMessage("Password updated successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="rounded-md border border-[#E8E8E8] p-4">
      <h2 className="text-headerColor  text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
        Change Password
      </h2>

      <p className=" mt-1  text-sm font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
        Update your password regularly to keep your account secure.
      </p>

      <div className="mt-4 space-y-3">
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="*************************"
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="*************************"
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="*************************"
        />

        {/* <div className="flex items-center gap-1">
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />

          <span className="ml-2 text-[9px] text-[#04A1B7]">
            Strong
          </span>
        </div> */}

        {message && (
          <p
            className={`text-[11px] ${
              messageType === "success"
                ? "text-[#04A1B7]"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={updatePassword}
          className="h-9 w-full rounded-md border border-primaryColor bg-[#D3F4EF] text-[14px] font-semibold text-primaryColor transition cursor-pointer"
        >
          Update Password
        </button>
      </div>
    </section>
  );
}