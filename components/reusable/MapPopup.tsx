import { Building2, GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

type MapPopupProps = {
  type?: "hospital" | "university" | "residency" | "postbacc";
  name: string;
  psychologyDegrees?: string[];
  counselingDegrees?: string[];
  neuroscienceDegrees?: string[];
  website?: string;
  degree?: string[];
};

function normalizeWebsiteUrl(raw?: string): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return undefined;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return /^https?:/i.test(trimmed) ? trimmed : undefined;
  }
  return `https://${trimmed}`;
}

const MapPopup = ({
  type,
  name,
  psychologyDegrees,
  counselingDegrees,
  neuroscienceDegrees,
  website,
  degree,
}: MapPopupProps) => {
  const safeWebsite = normalizeWebsiteUrl(website);
  const hasDegrees = Boolean(
    psychologyDegrees?.length ||
      counselingDegrees?.length ||
      neuroscienceDegrees?.length ||
      degree?.length,
  );

  return (
    <div className="w-[260px] max-w-[calc(100vw-64px)] sm:w-[290px] space-y-3 p-3.5 sm:p-4 text-gray-800">
      <div
        className={`flex items-start gap-2.5 ${
          hasDegrees ? "border-b border-gray-100 pb-2.5" : ""
        }`}
      >
        <Building2
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-primaryColor"
        />
        <h2 className="min-w-0 flex-1 text-[13.5px] font-semibold leading-snug text-blackColor break-words">
          {safeWebsite ? (
            <Link
              href={safeWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-words no-underline !text-blackColor hover:!text-primaryColor hover:no-underline transition-colors"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </h2>
      </div>

      {hasDegrees && (
        <div className="flex items-start gap-2.5">
          <span aria-hidden="true" className="mt-0.5 shrink-0 text-primaryColor">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1 text-xs leading-snug">
            <div className="text-[11px] font-medium text-gray-500">
              Offering:
            </div>
            <div className="mt-0.5 space-y-0.5 font-medium text-gray-800">
              {psychologyDegrees && psychologyDegrees.length > 0 && (
                <div>{psychologyDegrees.join(", ")} in Psychology</div>
              )}
              {counselingDegrees && counselingDegrees.length > 0 && (
                <div>{counselingDegrees.join(", ")} in Counseling</div>
              )}
              {neuroscienceDegrees && neuroscienceDegrees.length > 0 && (
                <div>{neuroscienceDegrees.join(", ")} in Neuroscience</div>
              )}
              {degree && degree.length > 0 && (
                <div>
                  {degree.join(", ")}
                  {type !== "residency" && type !== "postbacc"
                    ? ` in ${degree[0]}`
                    : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPopup;
