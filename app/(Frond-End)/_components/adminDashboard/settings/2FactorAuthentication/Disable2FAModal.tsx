"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import { useState } from "react";
import { useDesablePasswdMutation } from "@/feature/slice/admin/securitySettings";
import toast from "react-hot-toast";

interface Disable2FAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function Disable2FAModal({
  open,
  onOpenChange,
  onSuccess,
}: Disable2FAModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [DesablePasswd] = useDesablePasswdMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      password,
    };
   try {
  const response = await DesablePasswd(payload).unwrap();

  if (response.status) {
    toast.success(response.message || "Password disabled successfully");
    onSuccess();
    onOpenChange(false);
    setPassword("");
  } else {
    setError(response.message || "Failed to disable password");
  }
} catch (error: any) {
  setError(
    error?.data?.message ||
    error?.message ||
    "Failed to disable password"
  );
} finally {
  setLoading(false);
}
  
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Disable 2FA"
      size="xsm"
    >
      <p className="text-sm text-[#777980] mb-5">
        Enter your password to disable two-factor authentication.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={error}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-red-500 px-4 cursor-pointer py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
}