import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  title?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
  disabled?: boolean;
  rightIcon?: ReactNode;
  loading?: boolean;
  sendingMsg?: ReactNode;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
};

export default function ReusableButton({
  title,
  className,
  onClick,
  disabled,
  icon,
  rightIcon,
  loading,
  sendingMsg,
  ariaLabel,
  type,
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
      aria-busy={loading || undefined}
      className={cn(
        "flex h-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-buttonColor px-3 py-2.5 text-sm text-white text-nowrap transition-all duration-200 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-500 md:rounded-lg md:px-4 md:py-3 md:text-base",
        className,
      )}
      onClick={onClick}
      type={type}
    >
      {icon} {loading ? sendingMsg : title} {rightIcon}
    </button>
  );
}
