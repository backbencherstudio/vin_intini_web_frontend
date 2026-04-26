import { Label } from "@/components/ui/label";

type ReusableTextareaProps = {
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ReusableTextarea = ({
  label,
  placeholder,
  className,
  error,
  ...props
}: ReusableTextareaProps) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="text-base text-descriptionColor font-semibold">
          {label}
        </Label>
      )}

      <textarea
        placeholder={placeholder}
        className={`min-h-20 focus:ring-2! focus:ring-primaryColor/20! ${className || ""}`}
        {...props}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default ReusableTextarea;
