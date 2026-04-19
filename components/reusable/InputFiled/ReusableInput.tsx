import { Label } from "@/components/ui/label";

type ReusableInputProps = {
  id: string;
  label?: string;
  error?: string;
  containerClassName?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const ReusableInput = ({
  label,
  id,
  error,
  containerClassName,
  required,
  className,
  type = "text", // default type
  ...props
}: ReusableInputProps) => {
  return (
    <div className={`space-y-1.5 ${containerClassName || ""}`}>
      {label && (
        <Label
          htmlFor={id}
          className="text-sm text-descriptionColor font-medium"
        >
          {label} {required && <span className="text-redColor">*</span>}
        </Label>
      )}

      <input
        type={type}
        className={`h-12! md:h-13! w-full px-3 border border-borderColor  placeholder:text-placeholderColor focus:outline-none focus:ring-2 focus:ring-primaryColor/20! ${className || ""}`}
        {...props}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default ReusableInput;
