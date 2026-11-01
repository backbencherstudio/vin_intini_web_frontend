import React, { useId } from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    required?: boolean;
    helperText?: string;
    containerClassName?: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
    (
        {
            label,
            error,
            required,
            helperText,
            className = "",
            containerClassName = "",
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || props.name || generatedId;

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1.5 block text-sm font-medium text-[#4A4C56]"
                    >
                        {label}
                        {required && <span className=" ml-0.5">*</span>}
                    </label>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={`h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""} ${className}`}
                    {...props}
                />

                {error && <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-red-500">{error}</p>}
                {!error && helperText && (
                    <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
