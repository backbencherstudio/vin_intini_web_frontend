"use client";

import { useAcademiaContext } from "../../_components/AcademiaContext";
import { useEffect, useState } from "react";
import GoogleMapLoading from "./GoogleMapLoading";
import USAMapWithPointers from "./USAMapWithPointers";
import { usaStateKeyToNameMap } from "@/public/staticData";
import GoogleMap from "./GoogleMap";
import { useGetAcademiaByStateQuery } from "@/feature/slice/academia/academiaSlice";
import { Activity } from "react";

type PropType = {
    id: string;
}

const GOOGLE_MAP_ZOOM_LEVEL = {
    "NY": 10,
    "DE": 8,
    "MS": 7
};

export default function StateDetails({ id }: PropType) {
    const { setStateCode } = useAcademiaContext();
    const [isLoading, setIsLoading] = useState(true);
    const { data, isLoading: isAcademiaLoading } = useGetAcademiaByStateQuery(id);

    useEffect(() => {
        if (id) {
            setStateCode(id);
            setIsLoading(true);
        }
    }, [id, setStateCode]);

    if (isAcademiaLoading) {
        return (
            <div className="">
                <GoogleMapLoading />
            </div>
        )
    }


    return (
        <div className="w-full h-full xl:pl-6 grid relative">
            {/* <USAMapWithPointers
                areaName={usaStateKeyToNameMap[id] || id}
                zoomLevel={GOOGLE_MAP_ZOOM_LEVEL[id] || 6}
                onFinishZoom={()=>setIsLoading(false)}
                data={data?.data || []}
            /> */}
            <GoogleMap />
        </div>
    );
}