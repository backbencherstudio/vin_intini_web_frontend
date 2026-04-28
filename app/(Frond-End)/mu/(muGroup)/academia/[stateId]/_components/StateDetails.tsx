"use client";

import Image from "next/image";
import GoogleMap from "./GoogleMap";
import { useAcademiaContext } from "../../_components/AcademiaContext";
import { useEffect } from "react";

type PropType = {
    id: string; // e.g., "Texas"
}

export default function StateDetails({ id }: PropType) {
    const { setStateCode } = useAcademiaContext();

    useEffect(()=>{
        if(id) {
            setStateCode(id);
        }
    },[id])

    return (
        <div className="p-6">
            <Image
                src="/images/googlemap.png"
                alt="Google Map"
                width={800}
                height={600}
                className="w-full h-full rounded-2xl"
            />
        </div>
    );
}



