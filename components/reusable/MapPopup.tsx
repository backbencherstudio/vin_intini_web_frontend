import {
  Building2,
  ExternalLink,
  Globe,
  GraduationCap,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type MapPopupProps = {
  type?: "hospital" | "university" | "residency" | "postbacc";
  name: string;
  psychologyDegrees?: string[];
  counselingDegrees?: string[];
  neuroscienceDegrees?: string[];
  address?: string;
  phone?: string;
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

function MetaRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-primaryColor">
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-xs leading-snug">{children}</div>
    </div>
  );
}

const MapPopup = ({
  type,
  name,
  psychologyDegrees,
  counselingDegrees,
  neuroscienceDegrees,
  address,
  phone,
  website,
  degree,
}: MapPopupProps) => {
  const safeWebsite = normalizeWebsiteUrl(website);
  const trimmedAddress = address?.trim();
  const trimmedPhone = phone?.trim();
  const safeTel = trimmedPhone ? trimmedPhone.replace(/[^+\d]/g, "") : "";
  const hasDegrees = Boolean(
    psychologyDegrees?.length ||
      counselingDegrees?.length ||
      neuroscienceDegrees?.length ||
      degree?.length,
  );
  const hasMeta = Boolean(
    hasDegrees || trimmedAddress || safeWebsite || trimmedPhone,
  );

  return (
    <div className="w-[260px] max-w-[calc(100vw-64px)] sm:w-[290px] space-y-3 p-3.5 sm:p-4 text-gray-800">
      <div
        className={`flex items-start gap-2.5 ${
          hasMeta ? "border-b border-gray-100 pb-2.5" : ""
        }`}
      >
        <Building2
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-primaryColor"
        />
        <h2 className="min-w-0 flex-1 text-[13.5px] font-semibold leading-snug text-blackColor break-words">
          {name}
        </h2>
      </div>

      {hasMeta && (
        <div className="space-y-2">
          {hasDegrees && (
            <MetaRow icon={<GraduationCap className="h-3.5 w-3.5" />}>
              <div className="text-[10px] font-medium text-gray-500">
                {type === "postbacc" ? "Degree/Recognition" : "Degrees"}
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
            </MetaRow>
          )}

          {trimmedAddress && (
            <MetaRow icon={<MapPin className="h-3.5 w-3.5" />}>
              <span className="text-gray-600 break-words">{trimmedAddress}</span>
            </MetaRow>
          )}

          {trimmedPhone && (
            <MetaRow icon={<Phone className="h-3.5 w-3.5" />}>
              {safeTel ? (
                <a
                  href={`tel:${safeTel}`}
                  className="font-medium !text-gray-700 hover:!text-primaryColor hover:underline"
                >
                  {trimmedPhone}
                </a>
              ) : (
                <span className="text-gray-700">{trimmedPhone}</span>
              )}
            </MetaRow>
          )}

          {safeWebsite && (
            <MetaRow icon={<Globe className="h-3.5 w-3.5" />}>
              <Link
                href={safeWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium !text-primaryColor hover:underline"
              >
                <span>Website</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </Link>
            </MetaRow>
          )}
        </div>
      )}
    </div>
  );
};

export default MapPopup;
