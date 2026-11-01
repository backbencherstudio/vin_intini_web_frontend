"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface CustomSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ label, options, value, onChange, placeholder = "Select an option", error, helperText, required, disabled, className = "", containerClassName = "", id, name, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || name || generatedId;
    return <div className={`w-full ${containerClassName}`}>
      {label && <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-[#4A4C56]">{label}{required && <span className="ml-0.5">*</span>}</label>}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          disabled={disabled}
          aria-label={!label ? (props["aria-label"] ?? placeholder) : props["aria-label"]}
          value={value === undefined ? "" : String(value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : undefined}
          onChange={(event) => {
            const option = options.find((item) => String(item.value) === event.target.value);
            onChange?.(option ? option.value : event.target.value);
          }}
          className={twMerge("h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-900 outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500", error && "border-red-500 focus:border-red-500 focus:ring-red-500/15", className)}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
      {error ? <p id={`${selectId}-error`} role="alert" className="mt-1.5 text-xs text-red-600">{error}</p> : helperText ? <p className="mt-1.5 text-xs text-gray-500">{helperText}</p> : null}
    </div>;
  },
);

CustomSelect.displayName = "CustomSelect";
export default CustomSelect;
