import muImage from "@/public/browserLogo.svg";
import Image from "next/image";
interface LoadingProps {
  className?: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loading({
  className,
  text = "Loading...",
  size = "md",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-2 h-2 gap-1.5",
    md: "w-3 h-3 gap-2",
    lg: "w-4 h-4 gap-3",
  };

  const dotSize = sizeClasses[size];
  const [width, height, gap] = dotSize.split(" ");

  return (
    <div
      className={`w-full h-full grid items-center justify-center ${className}`}
    >
      <div className="grid items-center gap-4 rounded-2xl  px-6 py-5">
        <div className="flex items-center justify-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-sky-100 via-indigo-50 to-violet-100 animate-pulse nimation-duration-[1.2s]" />
            <div className="absolute inset-0 rounded-full border border-sky-200 animate-ping nimation-duration-[1.2s]" />
            <div className="absolute inset-2 rounded-full border border-indigo-200 animate-ping nimation-duration-[1.2s] [animation-delay:-0.4s]" />
            <div className="absolute inset-4 rounded-full border border-violet-200 animate-ping nimation-duration-[1.2s] [animation-delay:-0.8s]" />
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-300 bg-white/70" />
              <div className="absolute inset-2 rounded-full border border-emerald-200" />
              <Image src={muImage} alt="Loading logo" fill />
            </div>
          </div>
        </div>
        {text && (
          <p className="text-sm text-slate-800 font-medium tracking-wide animate-pulse nimation-duration-[1.2s]">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
