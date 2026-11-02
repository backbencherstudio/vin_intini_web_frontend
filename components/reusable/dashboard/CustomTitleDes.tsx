"use client";

import React from "react";
import clsx from "clsx";

interface CustomTitleDescriptionProps {
    title: string;
    description?: string;
    className?: string;
    action?: React.ReactNode;
    headerClassName?: string;
}

export default function CustomTitleDescription({
    title,
    description,
    className,
    action,
    headerClassName,
}: CustomTitleDescriptionProps) {
    return (

        <header className={clsx("admin-page-header flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center", headerClassName)}>
            <div className={clsx("flex min-w-0 flex-col gap-1", className)}>
                <h2 className="admin-page-title text-[24px] font-semibold leading-[130%] tracking-[0.12px] text-[#1D1F2C]">
                    {title}
                </h2>

                {description && (
                    <p className="text-sm font-normal leading-[150%] tracking-[0.01em] text-gray-500">
                        {description}
                    </p>
                )}


            </div>

            {action && (
                <div className="flex min-w-0 w-full justify-start xl:w-auto xl:justify-end">
                    {action}
                </div>
            )}
        </header>

    );
}
