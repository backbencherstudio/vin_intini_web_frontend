"use client"

import { useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";

export default function page() {

    const [selectedDegree, setSelectedDegree] = useState<string>("all")

    return (
        <div className="pl-6">
            <AcademiHeader
                title="University Hospitals & State Institutions"
            />
        </div>
    )
}