"use client"
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, TooltipProps } from 'recharts';
import { ArrowUpRight, Calendar, RefreshCw } from 'lucide-react';

const revenueData = [
    { date: 'Jun 04', thisPeriod: 8500, lastPeriod: 3500 },
    { date: 'Jun 08', thisPeriod: 9000, lastPeriod: 3100 },
    { date: 'Jun 12', thisPeriod: 6200, lastPeriod: 4100 },
    { date: 'Jun 16', thisPeriod: 10000, lastPeriod: 3600 },
    { date: 'Jun 20', thisPeriod: 7200, lastPeriod: 4600 },
    { date: 'Jun 24', thisPeriod: 7500, lastPeriod: 4300 },
    { date: 'Jun 28', thisPeriod: 8900, lastPeriod: 4900 },
    { date: 'Jul 02', thisPeriod: 9200, lastPeriod: 2400 },
    { date: 'Jul 04', thisPeriod: 9400, lastPeriod: 2700 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs w-44">
                <p className="font-semibold text-gray-700 mb-2">{label}</p>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400">June 08, 2026</span>
                    <span className="font-bold text-amber-500">${payload[0].value}K</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">July 08, 2026</span>
                    <span className="font-bold text-teal-500">${payload[1]?.value}K</span>
                </div>
            </div>
        );
    }
    return null;
};

export const RevenueReportCard = () => {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm w-full max-w-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Revenue Report</h3>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100">
                        <Calendar size={14} /> Jun 25 - Jul 04, 2026
                    </button>
                    <button className="p-1.5 text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">$60,379.00</span>
                    <span className="flex items-center text-xs font-semibold text-teal-500 bg-teal-50 px-1.5 py-0.5 rounded">
                        <ArrowUpRight size={12} className="mr-0.5" /> 4.3%
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> This period
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span> Last period
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v) => `$${v / 1000}K`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="thisPeriod" stroke="#F59E0B" strokeWidth={3} fill="none" />
                        <Area type="monotone" dataKey="lastPeriod" stroke="#14B8A6" strokeWidth={3} fill="none" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};