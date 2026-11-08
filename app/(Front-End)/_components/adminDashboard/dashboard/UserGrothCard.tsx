"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RotateCw, ArrowUp, ArrowDown } from 'lucide-react';
import type { UserGrowthData } from '@/feature/slice/admin/dashboard/adminDashboardApi';

interface UserGrowthCardProps {
    data?: UserGrowthData;
    isLoading?: boolean;
    onRefresh?: () => void;
}

const defaultData: UserGrowthData = {
    totalUsers: 112420,
    growthRate: 2.9,
    direction: 'up',
    chartData: [
        { month: 'Jan', users: 8200 },
        { month: 'Feb', users: 9100 },
        { month: 'Mar', users: 6800 },
        { month: 'Apr', users: 11500 },
        { month: 'May', users: 8800 },
        { month: 'Jun', users: 10400 },
    ]
};

export default function UserGrowthCard({
    data = defaultData,
    isLoading = false,
    onRefresh = () => { }
}: UserGrowthCardProps) {
    const chartData = data?.chartData && data.chartData.length > 0 ? data.chartData : defaultData.chartData;
    const totalUsers = data?.totalUsers ?? defaultData.totalUsers;
    const growthRate = data?.growthRate ?? defaultData.growthRate;
    const isDown = data?.direction === 'down';

    const maxVal = Math.max(...chartData.map((d) => Number(d.users) || 0), 10);

    const formatYTick = (val: number) => {
        if (maxVal >= 1000) {
            const inK = val / 1000;
            return `${Number.isInteger(inK) ? inK : inK.toFixed(1)}K`;
        }
        return `${Math.round(val)}`;
    };

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-[#0D0D12] text-[18px] font-semibold leading-[150%]">User Growth</h3>
                        <p className="text-[#6C6C6D] text-[14px] font-normal leading-[150%] tracking-[0.08px] mt-0.5">Total users</p>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-50"
                        title="Refresh User Growth"
                    >
                        <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primaryColor' : ''}`} />
                    </button>
                </div>

                {/* Metric & Growth Badge */}
                <div className="flex items-baseline justify-between mb-4">
                    <h4 className="text-[#0D0D12] text-[24px] font-semibold leading-[130%] tracking-[0.12px]">
                        {totalUsers.toLocaleString()} users
                    </h4>
                    <div className={`flex items-center text-[14px] font-semibold leading-[150%] tracking-[0.28px] ${isDown ? 'text-rose-500' : 'text-primaryColor'}`}>
                        {isDown ? (
                            <ArrowDown className="w-3.5 h-3.5 mr-1" />
                        ) : (
                            <ArrowUp className="w-3.5 h-3.5 mr-1" />
                        )}
                        {growthRate}%
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-72 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00A8B5" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#00A8B5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#F3F4F6" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={formatYTick}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white px-3 py-1.5 shadow-lg rounded-xl border border-gray-100 text-sm font-semibold text-gray-900">
                                            <span className="text-xs text-gray-400 block font-normal">{label}</span>
                                            <span>{Number(payload[0].value).toLocaleString()} users</span>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#00A8B5"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#userGrowthGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
