import React, { useId } from "react";

export interface CustomCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  helperText?: string;
  containerClassName?: string;
}

const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>(
  ({ label, helperText, className = "", containerClassName = "", id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || props.name || generatedId;
    return <div className={containerClassName}>
      <label htmlFor={checkboxId} className={`inline-flex items-center gap-2 text-sm text-gray-700 ${props.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
        <input ref={ref} id={checkboxId} type="checkbox" className={`h-4 w-4 rounded border-gray-300 accent-primaryColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor/30 ${className}`} {...props} />
        <span>{label}</span>
      </label>
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>;
  },
);

CustomCheckbox.displayName = "CustomCheckbox";
export default CustomCheckbox;
