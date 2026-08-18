"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface JobDetailsProps {
    job: any;
    onClose: () => void;
}

const JobDetails = ({ job, onClose }: JobDetailsProps) => {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="p-6 border border-red-500">
                <Image src="/images/admin/user/user-avatar.jpg" alt="User Avatar" width={100} height={100} />
                <div>
                    <p>
                        Clinical Psychologist
                    </p>
                    <p>
                        [EMAIL_ADDRESS]
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-5 px-6 py-5">
                <div>
                    <p className="text-xs font-medium text-[#777980]">
                        User Name
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#121212]">
                        {job?.name || "N/A"}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium text-[#777980]">
                        Description
                    </p>
                    <p className="mt-1 text-sm font-medium leading-[140%] text-[#121212]">
                        {job?.description || "N/A"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <p className="text-xs font-medium text-[#777980]">
                            Location
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#121212]">
                            {job?.location || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-[#777980]">
                            Status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#6B4DFF]">
                            {job?.status || "N/A"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <p className="text-xs font-medium text-[#777980]">
                            Job Type
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#121212]">
                            {job?.job_type || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-[#777980]">
                            Salary
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#121212]">
                            {job?.salary || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;