import ButtonReuseable from "@/components/reusable/CustomButton";
import Link from "next/link";
import { useState } from "react";
import ApplyTypeModal from "./ApplyTypeModal";
export interface ApplyActionType {
  company_name: string;
  jobTitle: string;
  jobId: string | number;
  company_id: string | number;
}

interface JobApplyAactionProps {
  jobData: ApplyActionType;
}

function JobApplyAaction({ jobData }: JobApplyAactionProps) {
  const [isApplying, setIsApplying] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
        <ButtonReuseable
          title="Apply Now"
          onClick={() => setIsApplying(true)}
          className="px-5 font-semibold! py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor  text-sm!"
        />
        <Link
          className="text-sm font-semibold text-primaryColor"
          href={`/mu/industry-profile/${jobData?.company_id}`}
        >
          View Company
        </Link>
      </div>
      {isApplying && (
        <ApplyTypeModal open={isApplying} jobData={jobData} setOpen={setIsApplying} />
      )}
    </div>
  );
}

export default JobApplyAaction;
