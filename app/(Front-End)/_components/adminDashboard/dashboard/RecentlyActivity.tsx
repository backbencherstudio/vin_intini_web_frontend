"use client";

import { DateRangePicker } from "@/components/reusable/dashboard/DateRangePicker";
import { RotateCw, UserPlus, Megaphone, CreditCard, FileText, Mail, Bell, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import type { RecentActivityItem } from "@/feature/slice/admin/dashboard/adminDashboardApi";

interface RecentlyActivityProps {
    activities?: RecentActivityItem[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

const defaultActivities: RecentActivityItem[] = [
    {
        id: "1",
        type: "user_registered",
        title: "User Registered",
        desc: "John Smith joined as Psychologist",
        time: "10:34 PM",
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        type: "ad_submitted",
        title: "Advertisement Submitted",
        desc: "Neuro Assessment Toolkit submitted for approval",
        time: "10:32 PM",
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        type: "subscription_purchased",
        title: "Subscription Purchased",
        desc: "Dr. Emay Oavts purchased Industry Plan",
        time: "10:30 PM",
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        type: "publication_created",
        title: "Publication Published",
        desc: "Anna Lee published Research on Neurofeedback",
        time: "10:28 PM",
        created_at: new Date().toISOString(),
    },
    {
        id: "5",
        type: "contact_submitted",
        title: "Contact Inquiry Received",
        desc: "New inquiry from Alice Walker regarding partnerships",
        time: "10:20 PM",
        created_at: new Date().toISOString(),
    },
];

const getIconForType = (type: string): LucideIcon => {
    switch (type) {
        case "user_registered":
            return UserPlus;
        case "ad_submitted":
            return Megaphone;
        case "subscription_purchased":
            return CreditCard;
        case "publication_created":
            return FileText;
        case "contact_submitted":
            return Mail;
        default:
            return Bell;
    }
};

export default function RecentlyActivity({
    activities = defaultActivities,
    isLoading = false,
    onRefresh = () => { },
}: RecentlyActivityProps) {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    const sourceList = activities && activities.length > 0 ? activities : defaultActivities;

    const filteredActivities = useMemo(() => {
        if (!date?.from) return sourceList;
        const fromTime = new Date(date.from).setHours(0, 0, 0, 0);
        const toTime = date.to
            ? new Date(date.to).setHours(23, 59, 59, 999)
            : new Date(date.from).setHours(23, 59, 59, 999);

        return sourceList.filter((item) => {
            const itemTime = item.timestamp
                ? item.timestamp * 1000
                : new Date(item.created_at).getTime();
            return itemTime >= fromTime && itemTime <= toTime;
        });
    }, [sourceList, date]);

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-gray-100 gap-2">
                    <h3 className="text-[17px] font-semibold text-gray-900">
                        Recent Activities
                    </h3>

                    <div className="flex items-center gap-2">
                        {/* Date Range Picker */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white">
                            <DateRangePicker
                                date={date}
                                setDate={setDate}
                                placeholder="Select date range"
                                className="w-auto h-auto px-0 py-0 border-none bg-transparent text-sm font-normal text-gray-600"
                            />
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            title="Refresh Activities"
                        >
                            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primaryColor" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* Activity List */}
                <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
                    {filteredActivities.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            No activities found for this period.
                        </div>
                    ) : (
                        filteredActivities.map((item, index) => {
                            const Icon = getIconForType(item.type);

                            return (
                                <div
                                    key={item.id ?? index}
                                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/70 transition-colors"
                                >
                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-white" strokeWidth={2.2} />
                                    </div>

                                    {/* Title + Description */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Time */}
                                    <div className="flex-shrink-0 text-xs text-gray-400 font-medium whitespace-nowrap">
                                        {item.time}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
