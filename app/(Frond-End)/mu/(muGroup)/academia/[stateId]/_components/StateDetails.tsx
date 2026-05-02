"use client";

import { useAcademiaContext } from "../../_components/AcademiaContext";
import { useEffect, useState } from "react";
import GoogleMapLoading from "./GoogleMapLoading";
import USAMapWithPointers from "./USAMapWithPointers";
import { usaStateKeyToNameMap } from "@/public/staticData";
import GoogleMap from "./GoogleMap";

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

    useEffect(() => {
        if (id) {
            setStateCode(id);
            // Reset loading state if the ID changes, so the skeleton shows 
            // during the new geocoding process
            setIsLoading(true);
        }
    }, [id, setStateCode]);

    return (
        <div className="w-full h-full xl:pl-6 grid relative">
            {/* 1. Show the skeleton on top while loading */}
            {isLoading && (
                <div className="absolute inset-0 z-10">
                    <GoogleMapLoading />
                </div>
            )}

            {/* 2. The Map is ALWAYS rendered, but hidden until onMapReady fires */}
            <div className={`w-full h-full ${isLoading ? "invisible" : "visible"}`}>
                <USAMapWithPointers 
                    areaName={usaStateKeyToNameMap[id] || id} 
                    zoomLevel={GOOGLE_MAP_ZOOM_LEVEL[id] || 6} 
                    onFinishZoom={() => setIsLoading(false)} 
                />
            </div>
            {/* <GoogleMap /> */}
        </div>
    );
}