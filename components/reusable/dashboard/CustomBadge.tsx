// components/Badge.tsx

type BadgeProps = {
    children: React.ReactNode;
    color?: "gray" | "yellow" | "orange" | "blue" | "cyan" | "green" | "red" | "purple";
    className?: string;
};

const colorStyles = {
    gray: "bg-[#E5E5E5] text-[#4A4C56] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#A5A5AB] py-1.5",
    yellow: "bg-[#FFFAE7] text-[#4A4C56] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#FBDE6E] py-1.5",
    orange: "bg-[#FFEFE6] text-[#FF5A00] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#FFBE8A] py-1.5",
    blue: "bg-[#E6F1FF] text-[#006EFF] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#006EFF] py-1.5",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
    green: "bg-[#E9FAF7] text-[#04A1B7] bg-[#04A1B7] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#04A1B7] py-1.5",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
};

export default function CustomBadge({
    children,
    color = "gray",
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorStyles[color]} ${className}`}
        >
            {children}
        </span>
    );
}