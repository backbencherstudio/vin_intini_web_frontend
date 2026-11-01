import CustomSwitch from "@/components/reusable/dashboard/CustomSwitch";

interface StatusToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
  ariaLabel: string;
}

export default function StatusToggle({
  checked,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  disabled,
  ariaLabel,
}: StatusToggleProps) {
  return (
    <div className="inline-flex items-center gap-2 whitespace-nowrap">
      <CustomSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      <span
        className={`text-xs font-medium ${
          checked ? "text-primaryColor" : "text-grayColor1"
        }`}
      >
        {checked ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}
