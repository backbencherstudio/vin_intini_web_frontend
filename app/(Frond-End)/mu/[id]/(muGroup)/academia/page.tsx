"use client"

import { UsaMapIcon } from "@/public/svgIcons/UsaMap"
import { useMemo, useState } from "react";
import { usaMapData } from "@/public/staticData";

export default function page() {
    const [mapData, setMapData] = useState(usaMapData);

    return (
        <div
            className="space-y-4 md:space-y-6 xl:space-y-10 py-10 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 sm:py-12 md:py-16 lg:py-20 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl"
            style={{
                background: "linear-gradient(179deg, rgba(253, 253, 253, 0.10) -63.29%, rgba(1, 120, 242, 0.10) 98.84%)"
            }}
        >
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-semibold leading-[130%] text-headerColor text-center">Select a state</p>
            <UsaMapIcon className="w-full" data={mapData} redirect={"redirect"} />
        </div>
    );
}