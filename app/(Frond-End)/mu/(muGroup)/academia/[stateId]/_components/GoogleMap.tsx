"use client"

import { useEffect } from "react";

type GoogleMapProps = {
    state: string;
    zoom?: number;
    query?: string; // optional custom search term, default "universities"
};

export default function GoogleMap({ state, zoom = 6, query = "universities" }: GoogleMapProps) {
    // Build search: e.g. "universities in California, USA"
    const searchTerm = `${query} in ${state}, USA`;
    const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(searchTerm)}&z=${zoom}&output=embed`;

    useEffect(() => {
        console.log("GoogleMap iframeSrc updated:", iframeSrc);
    }, [iframeSrc])

    return (
        <div className="w-full h-full">
            <iframe
                src={iframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${query} in ${state}`}
            />
        </div>
    );
}