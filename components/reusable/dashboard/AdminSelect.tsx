import React, { useId } from "react";
import { ChevronDown } from "lucide-react";

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const AdminSelect = React.forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, error, helperText, required, className = "", containerClassName = "", id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || props.name || generatedId;
    return <div className={`w-full ${containerClassName}`}>
      {label && <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-[#4A4C56]">{label}{required && <span className="ml-0.5">*</span>}</label>}
      <div className="relative">
        <select ref={ref} id={selectId} required={required} aria-label={!label ? (props["aria-label"] ?? "Select an option") : props["aria-label"]} aria-invalid={Boolean(error)} aria-describedby={error ? `${selectId}-error` : undefined} className={`h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-900 outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""} ${className}`} {...props}>{children}</select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
      {error ? <p id={`${selectId}-error`} role="alert" className="mt-1.5 text-xs text-red-600">{error}</p> : helperText ? <p className="mt-1.5 text-xs text-gray-500">{helperText}</p> : null}
    </div>;
  },
);

AdminSelect.displayName = "AdminSelect";
export default AdminSelect;
