"use client";

import React, { useId } from "react";

export interface CustomRadioButtonOption {
  label: string;
  value: string;
}

export interface CustomRadioButtonProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomRadioButtonOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

const CustomRadioButton = React.forwardRef<HTMLFieldSetElement, CustomRadioButtonProps>(
  ({ label, name, value, onChange, options, required, disabled = false, className = "", containerClassName = "" }, ref) => {
    const generatedName = useId();
    const groupName = name || generatedName;

    return <fieldset ref={ref} disabled={disabled} className={`w-full ${containerClassName}`}>
      {label && <legend className="mb-2 text-sm font-medium text-[#4A4C56]">{label}{required && <span className="ml-0.5">*</span>}</legend>}
      <div role="radiogroup" aria-label={label} className={`flex flex-wrap items-center gap-4 ${className}`}>
        {options.map((option, index) => {
          const id = `${groupName}-${index}`;
          return <label key={option.value} htmlFor={id} className={`inline-flex items-center gap-2 text-sm text-gray-700 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
            <input id={id} type="radio" name={groupName} value={option.value} checked={value === option.value} required={required} disabled={disabled} onChange={() => onChange(option.value)} className="h-4 w-4 accent-primaryColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor/30" />
            <span>{option.label}</span>
          </label>;
        })}
      </div>
    </fieldset>;
  },
);

CustomRadioButton.displayName = "CustomRadioButton";
export default CustomRadioButton;
