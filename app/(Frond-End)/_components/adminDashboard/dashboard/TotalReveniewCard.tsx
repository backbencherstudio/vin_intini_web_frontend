"use client"
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

const pieData = [
    { name: 'Subscriptions', value: 32455, percentage: '39.98%', color: '#00A3B1' },
    { name: 'Advertisements', value: 13200, percentage: '24.67%', color: '#00C49F' },
    { name: 'Sponsors', value: 7634, percentage: '14.76%', color: '#FFBB28' },
];

export const TotalRevenuePieCard = () => {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm w-full max-w-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800 text-lg">Total Revenue</h3>
                <button className="p-1.5 text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* Donut Chart with Center Text */}
            <div className="h-52 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div className="absolute text-center">
                    <p className="text-xs text-gray-400 font-medium">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-800">$48,789</p>
                </div>
            </div>

            {/* Legend List */}
            <div className="space-y-2 mt-2">
                {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-700 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400">{item.percentage}</span>
                            <span className="font-semibold text-gray-800 min-w-[50px] text-right">
                                ${item.value.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};