"use client"

import { UsaMapIcon } from "@/public/svgIcons/UsaMap"
import { useMemo, useState } from "react";
import { usaMapData } from "@/public/staticData";

export default function page(){
    const [mapData, setMapData] = useState(usaMapData);
    return(
        <div>
            <UsaMapIcon className="w-full" data={mapData} redirect={"redirect"}/>
        </div>
    )
}