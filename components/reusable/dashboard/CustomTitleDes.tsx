"use client";

import React from "react";
import clsx from "clsx";

interface CustomTitleDescriptionProps {
    title: string;
    description?: string;
    className?: string;
}

export default function CustomTitleDescription({
    title,
    description,
    className,
}: CustomTitleDescriptionProps) {
    return (
        <div className={clsx("flex flex-col gap-2", className)}>
            <h2 className="font-['Segoe_UI'] text-[24px] font-semibold leading-[130%] tracking-[0.12px] text-[#1D1F2C]">
                {title}
            </h2>

            {description && (
                <p className="font-['Segoe_UI'] text-[16px] font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
                    {description}
                </p>
            )}
        </div>
    );
}