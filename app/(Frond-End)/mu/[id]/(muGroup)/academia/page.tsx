"use client"

import { UsaMapIcon } from "@/public/svgIcons/UsaMap"
import { useMemo, useState } from "react";
import { regionCounts, regionalList } from "@/public/staticData";

export default function page(){
    const [mapData, setMapData] = useState(regionCounts);

    // const getRegionalData = async () => {
    //     try {
    //         const res = await UserService.getRegionalData();
    //         if(res.data.success){
    //             setMapData(prev => prev.map(item => {
    //                 const updatedItem = res.data.data.find((dataItem: UkMapDataType) => dataItem.country === item.country);
    //                 return updatedItem ? { ...item, total_notices: updatedItem.total_notices } : item;
    //             }));
    //         }
    //     } catch (err) {
    //         console.error("Error fetching regional data:", err);
    //     }
    // }

    // useEffect(()=>{
    //     getRegionalData();
    // },[])

    const mapPathFills = useMemo(() => {
        const activityColors = {
            most: "#708161",
            medium: "#99A88C",
            low: "#C3D4B3",
            inactive: "#A0A0A0",
        };

        const getColorByValue = (value: number) => {
            if (value <= 0) {
                return activityColors.inactive;
            }

            if (value >= 70) {
                return activityColors.most;
            }

            if (value >= 40) {
                return activityColors.medium;
            }

            return activityColors.low;
        };

        const defaultPathValue = 0;

        const pathEntries = Object.fromEntries(
            Array.from({ length: 200 }, (_, index) => {
                const pathName = `uk-state-${String(index + 1).padStart(3, "0")}`;
                const value = defaultPathValue;
                return [pathName, {
                    color: getColorByValue(value),
                    value,
                }];
            })
        );

        const regionEntries = Object.fromEntries(
            regionalList.map((regionKey) => {
                const regionValue = mapData.find((item) => item.country === regionKey)?.total_notices || 0;
                return [regionKey, {
                    color: getColorByValue(regionValue),
                    value: regionValue,
                }];
            })
        );

        return {
            ...pathEntries,
            ...regionEntries,
        };
    }, [mapData]);
    return(
        <div>
            <UsaMapIcon className="w-full" pathFills={mapPathFills} redirect={"redirect"}/>
        </div>
    )
}