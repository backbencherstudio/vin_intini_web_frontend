"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import clsx from "clsx";

type CloseButtonConfig =
    | { closeButtonType?: "shadcn"; closeButtonProps?: React.ComponentProps<typeof DialogClose> }
    | { closeButtonType: "custom"; closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> };

type CustomModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg" | "mmd" | "xsm";
    className?: string;
    showCloseButton?: boolean;
} & CloseButtonConfig;

interface FormData {
    companySize: string;
}

const COMPANY_SIZE_OPTIONS = [
    { value: "1-10", label: "1 - 10 employees" },
    { value: "11-50", label: "11 - 50 employees" },
    { value: "51-200", label: "51 - 200 employees" },
    { value: "201+", label: "201+ employees" },
];

export default function CustomModal(props: CustomModalProps) {
    const {
        open,
        onOpenChange,
        children,
        title,
        size = "md",
        className,
        showCloseButton = true,
    } = props;

    const closeButtonType = props.closeButtonType ?? "shadcn";

    const sizeClasses = {
        sm: "sm:max-w-[580px]",
        md: "sm:max-w-[680px]",
        mmd: "sm:max-w-[684px]",
        lg: "sm:max-w-[858px]",
        xsm: "sm:max-w-[500px]"
    };

    const shadcnCloseProps =
        closeButtonType === "shadcn" ? props.closeButtonProps : undefined;
    const { className: shadcnCloseClassName, ...shadcnCloseRest } =
        shadcnCloseProps ?? {};

    const customCloseProps =
        props.closeButtonType === "custom" ? props.closeButtonProps : undefined;
    const { className: customCloseClassName, ...customCloseRest } =
        customCloseProps ?? {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className={clsx(
                    "flex flex-col items-start gap-6 [background:var(--Greyscale-0,#FFF)] px-4 py-5 md:px-8 md:py-8 rounded-2xl",
                    // Allow max-h-[90vh] across ALL screens (including md and up)
                    "max-h-[95vh] overflow-hidden",
                    sizeClasses[size],
                    className
                )}
            >
                {/* Header Section */}
                {title && (
                    <div className="flex justify-between items-center w-full">
                        <h3 className="text-2xl font-medium tracking-[-0.36px]">{title}</h3>
                    </div>
                )}

                {/* Close Button - Placed Top Right */}
                {showCloseButton && (
                    closeButtonType === "shadcn" ? (
                        <DialogClose
                            className={clsx(
                                "absolute top-2 right-2 p-1 border-gray/10 hover:bg-white/10 transition-colors",
                                shadcnCloseClassName
                            )}
                            {...shadcnCloseRest}
                        >
                            <XIcon size={20} />
                        </DialogClose>
                    ) : (
                        <button
                            type="button"
                            className={clsx(
                                "absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors",
                                customCloseClassName
                            )}
                            {...customCloseRest}
                        >
                            <XIcon size={20} />
                        </button>
                    )
                )}
                {/* Content Area */}
                {/* Content Area - Enable scroll dynamically */}
                <div className="w-full min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(8,14,30,0.15)]">
                    {children}
                </div>

            </DialogContent>
        </Dialog>
    );
}