type ButtonProps = {
  title?: string;
  className?: string;
  onClick?: () => void;
  icon?: any;
  disabled?: boolean;
  rightIcon?: any;
  loading?: boolean;
  sendingMsg?: string;
  type?: "button" | "submit" | "reset";
};

export default function ButtonReuseable({
  title,
  className,
  onClick,
  disabled,
  icon,
  rightIcon,
  loading,
  sendingMsg,
  type,
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-label={title}
      className={`md:py-3  text-nowrap disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed md:px-4 text-sm md:text-base justify-center flex items-center gap-2 py-2.5 px-3 rounded-md md:rounded-lg cursor-pointer bg-buttonColor text-white h-full hover:shadow-md hover:tracking-widest transition-all duration-200 ${className}`}
      onClick={onClick}
      type={type}
    >
      <div className=" flex  h-full items-center text-white gap-1.5">
        {icon} {loading ? sendingMsg : title} {rightIcon}
      </div>
    </button>
  );
}
