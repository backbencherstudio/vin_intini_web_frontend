"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip } from 'recharts';
import { RotateCw } from 'lucide-react';
import type { RevenueBreakdownData } from '@/feature/slice/admin/dashboard/adminDashboardApi';

const COLORS = ['#00A8B5', '#FF9F0A'];

const ITEM_COLORS: Record<string, string> = {
    Subscriptions: '#00A8B5',
    Advertisements: '#FF9F0A',
};

const ALLOWED_REVENUE_SOURCES = new Set(['Subscriptions', 'Advertisements']);

interface TotalRevenuePieCardProps {
    data?: RevenueBreakdownData;
    isLoading?: boolean;
    onRefresh?: () => void;
}

const defaultData: RevenueBreakdownData = {
    total: 45655,
    items: [
        { name: 'Subscriptions', percentage: 71.09, amount: 32455, value: 32455 },
        { name: 'Advertisements', percentage: 28.91, amount: 13200, value: 13200 },
    ]
};

export default function TotalRevenuePieCard({
    data = defaultData,
    isLoading = false,
    onRefresh = () => { }
}: TotalRevenuePieCardProps) {
    const rawItems = data?.items && data.items.length > 0 ? data.items : defaultData.items;
    const filteredItems = rawItems.filter((item) => ALLOWED_REVENUE_SOURCES.has(item.name));
    const items = filteredItems.length > 0 ? filteredItems : defaultData.items;

    const totalValue = items.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    const totalAmount = totalValue;
    const hasData = totalValue > 0;
    const activePieItems = items.filter((item) => (Number(item.value) || 0) > 0);
    const hasMultipleActiveSlices = activePieItems.length > 1;

    const chartData = hasData
        ? activePieItems
        : [{ name: 'No Revenue Recorded', value: 1, percentage: 0, amount: 0 }];

    const getItemColor = (name: string, index: number) =>
        ITEM_COLORS[name] ?? COLORS[index % COLORS.length];

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#0D0D12] text-[18px] font-semibold leading-[150%]">Total Revenue</h3>
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-50"
                    title="Refresh Revenue Breakdown"
                >
                    <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primaryColor' : ''}`} />
                </button>
            </div>

            {/* Donut Chart with Center Text */}
            <div className="relative h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={hasMultipleActiveSlices ? 2 : 0}
                            minAngle={hasMultipleActiveSlices ? 4 : 0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${entry.name}-${index}`}
                                    fill={hasData ? getItemColor(entry.name, index) : '#E5E7EB'}
                                />
                            ))}

                            {/* Center Labels */}
                            <Label
                                value="Total Revenue"
                                position="center"
                                dy={-12}
                                style={{
                                    fontSize: "12px",
                                    fill: "#9CA3AF",
                                    fontWeight: 500,
                                }}
                            />
                            <Label
                                value={`$${Math.round(totalAmount).toLocaleString()}`}
                                position="center"
                                dy={12}
                                style={{
                                    fontSize: "24px",
                                    fill: "#0D0D12",
                                    fontWeight: 600,
                                }}
                            />
                        </Pie>
                        {hasData && (
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const p = payload[0].payload;
                                        return (
                                            <div className="bg-white px-3 py-1.5 shadow-lg rounded-xl border border-gray-100 text-xs font-semibold text-gray-900">
                                                <p className="font-medium text-gray-600">{p.name}</p>
                                                <p className="text-primaryColor font-bold">${Number(p.amount ?? p.value).toLocaleString()} ({p.percentage}%)</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        )}
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend / Breakdown List */}
            <div className="mt-4 space-y-3">
                {items.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                            <span
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: getItemColor(item.name, index) }}
                            />
                            <span className="text-[#121212] text-xs font-semibold leading-[132%] tracking-[0.06px] truncate max-w-[120px]">
                                {item.name}
                            </span>
                        </div>
                        <div className="flex space-x-4 text-gray-600">
                            <span className="w-14 text-right text-[#121212] text-xs font-semibold leading-[132%] tracking-[0.06px]">
                                {item.percentage}%
                            </span>
                            <span className="w-20 text-right text-[#121212] text-xs font-semibold leading-[132%] tracking-[0.06px]">
                                ${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
