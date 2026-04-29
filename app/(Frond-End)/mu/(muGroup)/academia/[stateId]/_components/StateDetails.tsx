"use client";

import Image from "next/image";
import GoogleMap from "./GoogleMap";
import { useAcademiaContext } from "../../_components/AcademiaContext";
import { useEffect, useState } from "react";
import GoogleMapLoading from "./GoogleMapLoading";

type PropType = {
    id: string; // e.g., "Texas"
}

export default function StateDetails({ id }: PropType) {
    const { setStateCode } = useAcademiaContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        setIsLoading(false);
    },[])

    useEffect(()=>{
        if(id) {
            setStateCode(id);
        }
    },[id])


    if(isLoading) {
        return(
            <GoogleMapLoading />
        )
    }

    return (
        <div className="w-full h-full xl:pl-6 grid">
            {/* <Image
                src="/images/googlemap.png"
                alt="Google Map"
                width={800}
                height={600}
                className="w-full h-full rounded-2xl"
            /> */}
            <GoogleMap />
        </div>
    );
}



