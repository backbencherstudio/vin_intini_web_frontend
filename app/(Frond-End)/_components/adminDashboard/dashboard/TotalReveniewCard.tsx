"use client"
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RotateCw } from 'lucide-react';

const COLORS = ['#00A8B5', '#00B8D9', '#FF9F0A']; // Teal, Cyan, Orange

export default function TotalRevenuePieCard({ data = defaultData, onRefresh }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full h-full ">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#0D0D12] font-['Segoe_UI'] text-[18px] font-semibold leading-[150%]">Total Revenue</h3>
                <button
                    onClick={onRefresh}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                    <RotateCw className="w-4 h-4" />
                </button>
            </div>

            {/* Donut Chart with Center Text */}
            <div className="relative h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.items}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.items.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-medium text-gray-400">Total Revenue</span>
                    <span className="text-[#0D0D12] font-['Segoe_UI'] text-[24px] font-semibold leading-[130%] tracking-[0.12px]">${data.total.toLocaleString()}</span>
                </div>
            </div>

            {/* Legend / Breakdown List */}
            <div className="mt-4 space-y-3">
                {data.items.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-gray-700">{item.name}</span>
                        </div>
                        <div className="flex space-x-6 text-gray-600">
                            <span className="w-16 text-right">{item.percentage}%</span>
                            <span className="w-20 text-right font-medium text-gray-900">${item.amount.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Default Data for preview/API fallback
// Updated Default Data with 'value' property for Recharts Pie
const defaultData = {
    total: 48789,
    items: [
        { name: 'Subscriptions', percentage: 39.98, amount: 32455, value: 32455 },
        { name: 'Advertisements', percentage: 24.67, amount: 13200, value: 13200 },
        { name: 'Sponsors', percentage: 14.76, amount: 7634, value: 7634 },
    ]
};