type ButtonProps = {
  title?: string;
  className?: string;
  onClick?: () => void;
  icon?: any;
  rightIcon?: any;
  loading?: boolean;
  sendingMsg?: string;
  type?: "button" | "submit" | "reset";
};

export default function ButtonReuseable({
  title,
  className,
  onClick,
  icon,
  rightIcon,
  loading,
  sendingMsg,
  type,
}: ButtonProps) {
  return (
    <button
      disabled={loading}
      aria-label={title}
      className={`md:py-3 disabled:bg-grayColor1! text-nowrap disabled:text-secondaryColor! disabled:cursor-not-allowed md:px-4 text-sm md:text-base justify-center flex items-center gap-2 py-2.5 px-3 rounded-md md:rounded-lg cursor-pointer bg-blackColor text-white h-full hover:scale-105 transition-all  duration-200 ${className}`}
      onClick={onClick}
      type={type}
    >
      <div className=" flex  h-full items-center gap-1.5">
        {icon} {loading ? sendingMsg : title} {rightIcon}
      </div>
    </button>
  );
}
