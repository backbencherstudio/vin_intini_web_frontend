"use client"
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowUpRight, RefreshCw } from 'lucide-react';

const userGrowthData = [
    { month: 'Jan', users: 8500 },
    { month: 'Feb', users: 10000 },
    { month: 'Mar', users: 6500 },
    { month: 'Apr', users: 11567 },
    { month: 'May', users: 9500 },
    { month: 'Jun', users: 12500 },
];

export const UserGrowthCard = () => {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm w-full max-w-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-gray-800 text-lg">User Growth</h3>
                <button className="p-1.5 text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RefreshCw size={14} />
                </button>
            </div>

            <p className="text-xs text-gray-400 mb-2">Total users</p>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">112,420 users</span>
                <span className="flex items-center text-xs font-semibold text-teal-500">
                    <ArrowUpRight size={14} /> 2.9%
                </span>
            </div>

            {/* Chart */}
            <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.01} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v) => `${v / 1000}K`} />
                        <Tooltip
                            cursor={{ stroke: '#06B6D4', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={({ payload }) => payload?.[0] ? (
                                <div className="bg-white px-3 py-1 rounded-full shadow-md border text-xs font-bold text-gray-700">
                                    {payload[0].value.toLocaleString()}
                                </div>
                            ) : null}
                        />
                        <Area type="monotone" dataKey="users" stroke="#06B6D4" strokeWidth={2.5} fill="url(#userGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};