import React, { useId } from "react";

export interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const CustomTextArea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ label, error, helperText, required, className = "", containerClassName = "", id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || props.name || generatedId;
    return <div className={`w-full ${containerClassName}`}>
      {label && <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-[#4A4C56]">{label}{required && <span className="ml-0.5">*</span>}</label>}
      <textarea ref={ref} id={textareaId} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${textareaId}-error` : undefined} className={`min-h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""} ${className}`} {...props} />
      {error ? <p id={`${textareaId}-error`} role="alert" className="mt-1.5 text-xs text-red-600">{error}</p> : helperText ? <p className="mt-1.5 text-xs text-gray-500">{helperText}</p> : null}
    </div>;
  },
);

CustomTextArea.displayName = "CustomTextArea";
export default CustomTextArea;
