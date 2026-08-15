"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";

// Sample data matching your screenshot
const facilitiesData = [
    {
        id: 1,
        name: "Bryce Hospital",
        state: "Alabama",
        category: "State Institution",
        latLong: "34.94563, -67.34244",
        website: "#",
    },
    {
        id: 2,
        name: "Mary Starke Harper Geriatric Psychiatry Center",
        state: "Alabama",
        category: "University Hospital",
        latLong: "45.89934, -46.35662",
        website: "#",
    },
    {
        id: 3,
        name: "Crossbridge Behavioral Health Services",
        state: "Alabama",
        category: "University Hospital",
        latLong: "87.89600, -76.35798",
        website: "#",
    },
    {
        id: 4,
        name: "Hill Crest Behavioral Health Services",
        state: "Alabama",
        category: "VA Facility",
        latLong: "12.45678, -23.98765",
        website: "#",
    },
    {
        id: 5,
        name: "Laurel Oaks Behavioral Health Center",
        state: "Alabama",
        category: "VA Facility",
        latLong: "56.43210, -12.34567",
        website: "#",
    },
    {
        id: 6,
        name: "East Pointe Hospitals",
        state: "Alabama",
        category: "State Institution",
        latLong: "78.12345, -89.65432",
        website: "#",
    },
    {
        id: 7,
        name: "Mountain View Hospital",
        state: "Alabama",
        category: "State Institution",
        latLong: "15.67890, -45.12345",
        website: "#",
    },
    {
        id: 8,
        name: "Unity Psychiatric",
        state: "Alabama",
        category: "University Hospital",
        latLong: "29.98765, -67.43210",
        website: "#",
    },
    {
        id: 9,
        name: "University of Alabama Birmingham (UAB) Hospital",
        state: "Alabama",
        category: "VA Facility",
        latLong: "64.32109, -34.56789",
        website: "#",
    },
    {
        id: 10,
        name: "Central Alabama VA Medical Center",
        state: "Alabama",
        category: "State Institution",
        latLong: "80.56789, -22.34567",
        website: "#",
    },
    {
        id: 11,
        name: "Tuscaloosa VA Medical Center",
        state: "Alabama",
        category: "University Hospital",
        latLong: "35.43210, -78.12345",
        website: "#",
    },
    {
        id: 12,
        name: "Alaska Psychiatric Institute",
        state: "Alabama",
        category: "State Institution",
        latLong: "59.87654, -56.78901",
        website: "#",
    },
    {
        id: 13,
        name: "North Star Behavioral Health System",
        state: "Alabama",
        category: "VA Facility",
        latLong: "42.10987, -10.98765",
        website: "#",
    },
    {
        id: 14,
        name: "Colonel Mary Louise Healthcare System",
        state: "Alabama",
        category: "VA Facility",
        latLong: "67.89012, -39.87654",
        website: "#",
    },
    {
        id: 15,
        name: "Valley Behavioral Health System",
        state: "Alabama",
        category: "University Hospital",
        latLong: "23.45678, -81.23456",
        website: "#",
    },
    {
        id: 16,
        name: "Rivendell Behavioral Health",
        state: "Alabama",
        category: "State Institution",
        latLong: "53.21098, -64.32109",
        website: "#",
    },
];

// Category badge colors
const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
        "State Institution": "bg-orange-50 text-orange-600 border border-orange-200",
        "University Hospital": "bg-blue-50 text-blue-600 border border-blue-200",
        "VA Facility": "bg-cyan-50 text-cyan-600 border border-cyan-200",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${styles[category] || "bg-gray-100 text-gray-700"
                }`}
        >
            {category}
        </span>
    );
};

export default function HospitalsFacilitiesPage() {
    const [data] = useState(facilitiesData);

    const columns = [
        {
            label: "No.",
            accessor: "id",
            width: "70px",
            position: "justify-start",
            formatter: (value: number) => (
                <span className="text-sm text-gray-700 font-medium pl-4">{value}</span>
            ),
        },
        {
            label: "Facilities Details",
            accessor: "name",
            width: "320px",
            position: "justify-start",
            formatter: (value: string) => (
                <span className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                    {value}
                </span>
            ),
        },
        {
            label: "State",
            accessor: "state",
            width: "120px",
            position: "justify-start",
            formatter: (value: string) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {value}
                </span>
            ),
        },
        {
            label: "Category",
            accessor: "category",
            width: "180px",
            position: "justify-start",
            formatter: (value: string) => getCategoryBadge(value),
        },
        {
            label: "Map Pin (Lat,Long)",
            accessor: "latLong",
            width: "180px",
            position: "justify-start",
            formatter: (value: string) => (
                <span className="text-sm text-blue-600 font-medium">{value}</span>
            ),
        },
        {
            label: "Website",
            accessor: "website",
            width: "130px",
            position: "justify-start",
            formatter: () => (
                <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Visit Now
                    <FiExternalLink className="w-3.5 h-3.5" />
                </a>
            ),
        },
        {
            label: "Action",
            accessor: "action",
            width: "100px",
            position: "justify-center",
            formatter: (_: any, row: any) => (
                <div className="flex items-center gap-3 justify-center">
                    <button
                        onClick={() => console.log("Edit", row.id)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => console.log("Delete", row.id)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Hospitals & Facilities
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Showing 1-20 of 456 Programs
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Hospitals & Facilities..."
                                className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        {/* Filter */}
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            Filter by type
                        </button>

                        {/* Add New */}
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add New Facilities
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <DynamicTable
                    columns={columns}
                    data={data}
                    header={{
                        bg: "#F9FAFB",
                        padding: "12px 16px",
                        text: "#6B7280",
                        fontWeight: "500",
                        fontSize: "13px",
                        position: "justify-start",
                    }}
                    rowStyle={{
                        hover: true,
                        hoverbg: "hover:bg-gray-50",
                        bg: "bg-white",
                        border: "border-b border-gray-100",
                        spaceing: "",
                    }}
                />

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                    <div className="text-sm text-gray-500">
                        Showing 1 to 10 of 500 results
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Per page</span>
                            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                                &lt;
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-cyan-500 text-white font-medium">
                                3
                            </button>
                            <span className="px-1 text-gray-400">...</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                                5
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}