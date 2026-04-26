"use client"

import { useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";

export default function page(){
    return(
        <div className="pl-6">
            <AcademiHeader 
                title="Residency Programs"
                onSearch={(query) => console.log("Search query:", query)}
                searchPlaceHolder="Search Degree/ University..."
            />
        </div>
    )
}