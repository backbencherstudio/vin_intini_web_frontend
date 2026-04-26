"use client";

import { buildSourceBreadcrumbs } from "@/lib/source-breadcrumb";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BrainIcon, UndergradCapIcon, HospitalIcon, JobSearchIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";

const navigationItems = [
    {
        label: "Undergrad & Grad Programs",
        href: "/mu/2/academia/Texas/grad-undergrad-programs",
        Icon: UndergradCapIcon,
        redirectKey: "undergradgradprograms"
    },
    {
        label: "Medical Residencies",
        href: "/mu/2/academia/Texas/medical-residencies",
        Icon: BrainIcon,
        redirectKey: "medicalresidencies"
    },
    {
        label: "Hospitals",
        href: "/mu/2/academia/Texas/hospitals",
        Icon: HospitalIcon,
        redirectKey: "hospitals"
    },
    {
        label: "Employment Opportunities",
        href: "/mu/2/academia/Texas/employemnts",
        Icon: JobSearchIcon,
        redirectKey: "employmentopportunities"
    }
]


export default function Sidebar() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "";
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [currentState, setCurrentState] = useState<string>("");

    useEffect(() => {
        const state = redirectUrl.split("_").find(part => part.startsWith("stateacademia"));

        const parts = redirectUrl.split("_");

        const idx = parts.findIndex(part => {
            const key = part.split(":")[0];
            return navigationItems.some(item => item.redirectKey === key);
        });

        console.log("Parsed redirect URL:", { redirectUrl, state, idx, parts });

        setCurrentIndex(idx !== -1 ? idx : parts.length);
        if (state) {
            setCurrentState(buildSourceBreadcrumbs(state)[0].label || "");
        }
    }, [redirectUrl]);

    return (
        <div className={`${isOpen ? "w-full translate-x-0" : "w-fit -translate-x-[330px] lg:translate-x-0"} h-full grid absolute z-99 bg-[#0003] lg:bg-transparent backdrop-blur-xs lg:relative`}>
            <div className={`bg-[#F8FAFB] w-[280px] sm:w-[310px] border-r border-[#D2D2D5] lg:rounded-l-2xl`}>
                <h2 className="p-4 sm:p-6 text-headerColor 
                 text-xl sm:text-2xl md:text-3xl lg:text-[32px] 
                 font-semibold leading-snug sm:leading-[130%] border-b border-[#D2D2D5]">
                    {currentState || "Unknown State"}
                </h2>
                <div className="grid grid-col-1 p-6 space-y-0.5">
                    {navigationItems.map(({ label, href, Icon, redirectKey }) => (
                        <Link href={`${href}?redirect=${redirectUrl ? redirectUrl?.split("_")?.slice(0, currentIndex).join("_") + "_" : ''}${redirectKey}:2:${currentState}`} key={href} className={`flex items-center p-1.5 sm:p-2 hover:bg-[#E2E8F0] gap-1.5 rounded-md sm:gap-2 ${redirectUrl?.includes(redirectKey) ? "bg-[#E2E8F0]" : ""}`}>
                            <Icon className="w-6 h-6" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}