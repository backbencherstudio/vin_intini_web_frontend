import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
    <div className={cn("space-y-1.5", containerClassName)}>
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
        className={cn(
          "h-12! md:h-13! w-full px-3 border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition-all",
          error ? "border-red-500! focus:ring-red-500/20!" : "border-borderColor",
          className,
          error && "border-red-500!",
        )}
        {...props}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default ReusableInput;
