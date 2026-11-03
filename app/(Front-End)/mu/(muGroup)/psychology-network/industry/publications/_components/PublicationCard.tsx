import { PublicationDataType } from "@/lib/type";
import dayjs from "dayjs";
import { ChevronRight, Dot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PublicationCardProps {
  publication: PublicationDataType;
}

export const PublicationCard = ({ publication }: PublicationCardProps) => {
  const pathName = usePathname();

  return (
    <div className="group flex w-full flex-col items-start gap-2.5 self-stretch border-b border-borderColor py-4 md:px-3 transition-colors hover:bg-sectionColor/60">
      {/* Journal and Tag Row */}
      <div className="flex w-full items-start sm:items-center justify-between gap-3">
        <Link
          href={`${pathName}/${publication.id}`}
          className="text-base font-semibold leading-snug tracking-[0.08px] text-primaryColor hover:underline"
        >
          {publication.title}
        </Link>
        {publication.publication_type && (
          <span className="shrink-0 flex items-center capitalize rounded-full border border-borderColor/60 bg-white px-3 py-0.5 text-xs font-medium text-descriptionColor">
            {publication.publication_type}
          </span>
        )}
      </div>

      {/* Title / Description */}
      <p className="self-stretch text-sm font-normal leading-relaxed text-descriptionColor line-clamp-2">
        {publication.short_abstract || publication.abstract}
      </p>

      {/* Authors Row */}
      {publication.authors && publication.authors.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          {publication.authors.map((author, index) => (
            <span
              key={index}
              className="px-3 py-0.5 text-xs text-primaryColor font-medium leading-relaxed rounded-full bg-lightGreenColor/50"
            >
              {author}
            </span>
          ))}
        </div>
      )}

      {/* Date, Meta, and Button Row */}
      <div className="flex w-full items-center justify-between pt-1">
        <div className="flex items-center text-sm text-grayColor1">
          {publication.created_at && (
            <span>{dayjs(publication.created_at).format("DD MMM YYYY")}</span>
          )}
          <Dot className="text-grayColor1 h-4 w-4" />
          {publication.network_type && (
            <span className="capitalize">{publication.network_type}</span>
          )}
        </div>

        <Link
          href={`${pathName}/${publication.id}`}
          className="flex items-center gap-1 text-sm text-primaryColor hover:underline font-medium transition-transform group-hover:translate-x-0.5"
        >
          <span>Learn more</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
