"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useGetAdvertisemetDetailsQuery,
  useGetAdvertisemetEditeQuery,
} from "@/feature/slice/jobs/advertisementSlice";
import dayjs from "dayjs";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdvertismentViewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  adId?: string | number | null;
  is_owner?: boolean;
}

export default function AdvertismentViewModal({
  open,
  setOpen,
  adId,
  is_owner,
}: AdvertismentViewModalProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [adId, open]);

  const detailsQuery = useGetAdvertisemetDetailsQuery(adId ?? "", {
    skip: Boolean(is_owner || !adId || !open),
  });
  const editQuery = useGetAdvertisemetEditeQuery(adId ?? "", {
    skip: Boolean(!is_owner || !adId || !open),
  });
  const { data: response, isLoading } = is_owner ? editQuery : detailsQuery;

  const ad = response?.data || response;

  const imageSrc = ad?.image_url;


  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-2xl overflow-hidden p-0 max-h-[92vh]"
      ariaLabel="View Product Advertisement"
      ariaDescription="Detailed view of product advertisement"
    >
      <div className="flex max-h-[90vh] flex-col overflow-hidden">
        {/* Header Title */}
        <div className="sticky top-0 z-10 shrink-0 border-b flex justify-between items-center border-borderColor/60 bg-white px-5 py-4 md:px-7">
          <h2 className="text-lg md:text-xl font-bold text-headerColor">
            View Product
          </h2>
          <ButtonReuseable
            type="button"
            onClick={() => setOpen(false)}
            icon={<X size={20} />}
            className="w-10 h-10 p-0! rounded-full bg-transparent! text-descriptionColor! shadow-none! hover:bg-bgColor transition-colors "
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-7 custom-scrollbar">
          <div className="space-y-6">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <span className="inline-block w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-descriptionColor">
                  Loading advertisement details...
                </p>
              </div>
            ) : ad ? (
              <>
                {/* Top Product Summary Card */}
                <div className="grid gap-4 sm:grid-cols-[250px_minmax(0,1fr)]">
                  {/* Product Image */}
                  <div className="relative aspect-square sm:aspect-auto sm:min-h-[260px] md:min-h-[280px] w-full overflow-hidden rounded-xl border border-borderColor/60 bg-white p-3 flex items-center justify-center shadow-2xs">
                    {imageSrc ? (
                      <div className="relative h-full w-full min-h-[220px]">
                        <Image
                          src={imageSrc}
                          alt={ad.product_name || "Product"}
                          fill
                          className="object-contain p-1.5 transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 260px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-descriptionColor">
                        {(ad.product_name || "P").charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex min-w-0 flex-col justify-between gap-5 rounded-xl border border-borderColor bg-bgLightColor p-4 md:p-5">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="min-w-0 wrap-break-word text-base md:text-lg font-bold leading-snug text-headerColor">
                          {ad.product_name || "Product Name"}
                        </h3>
                        <span className="inline-flex shrink-0 items-center rounded-full border border-lightGreenColor2/30 bg-lightGreenColor2/10 px-3 py-1 text-xs font-semibold capitalize text-lightGreenColor2">
                          {ad.status || "Active"}
                        </span>
                      </div>

                      {/* Attributes */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                        {[
                          ["Network Type", ad.network_type],
                          ["Industry Type", ad.industry_type],
                          ["Section", ad.section_name || ad.section?.name],
                          ["Category", ad.category_name || ad.category?.name],
                        ].map(([label, value]) => (
                          <div key={label} className="min-w-0">
                            <p className="text-xs text-grayColor1 font-medium">{label}</p>
                            <p className="mt-0.5 truncate text-xs md:text-sm font-semibold capitalize text-headerColor">
                              {value || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-grayColor1 pt-1">
                        Published:{" "}
                        <span className="font-medium text-descriptionColor">
                          {dayjs(ad.created_at).format(
                            "DD MMM YYYY, hh:mm A",
                          ) || "N/A"}
                        </span>
                      </p>
                    </div>

                    {/* View, Like, Published On */}
                    <div className="flex flex-wrap items-center gap-4 border-t border-borderColor/60 pt-3 text-xs md:text-sm text-descriptionColor">
                      <div className="flex items-center gap-1.5">
                        <span className="text-grayColor1">Total Views:</span>
                        <span className="font-semibold text-headerColor">
                          {(ad.views_count ?? 0).toLocaleString()}
                        </span>
                      </div>
                      {is_owner && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-grayColor1">
                            Unique Views:
                          </span>
                          <span className="font-semibold text-headerColor">
                            {(ad.unique_views_count ?? 0).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <span className="text-grayColor1">Likes:</span>
                        <span className="font-semibold text-headerColor">
                          {(ad.likes_count ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2 rounded-xl border border-borderColor bg-bgLightColor p-4 md:p-5">
                  <h4 className="text-sm md:text-base font-semibold text-headerColor">
                    About this product
                  </h4>
                  {ad.description ? (
                    <>
                      <div
                        className={`text-xs md:text-sm text-descriptionColor prose prose-sm max-w-none leading-relaxed ${isDescriptionExpanded ? "" : "line-clamp-4 overflow-hidden"}`}
                        dangerouslySetInnerHTML={{ __html: ad.description }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setIsDescriptionExpanded((expanded) => !expanded)
                        }
                        className="mt-1 cursor-pointer text-xs md:text-sm font-semibold text-primaryColor hover:underline"
                      >
                        {isDescriptionExpanded ? "Show less" : "Show more"}
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-grayColor1 italic">No description provided.</p>
                  )}
                </div>

                {/* Product URL */}
                <div className="space-y-1 rounded-xl border border-borderColor bg-bgLightColor p-4 md:p-5">
                  <h4 className="text-sm md:text-base font-semibold text-headerColor">
                    Product Link
                  </h4>
                  {ad.product_url ? (
                    <a
                      href={
                        ad.product_url.startsWith("http")
                          ? ad.product_url
                          : `https://${ad.product_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primaryColor hover:underline text-xs md:text-sm font-medium break-all block mt-1"
                    >
                      {ad.product_url}
                    </a>
                  ) : (
                    <p className="text-xs md:text-sm text-grayColor1 mt-1">N/A</p>
                  )}
                </div>

                {/* Product Tags */}
                {ad?.tags?.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-sm md:text-base font-semibold text-headerColor">
                      Product Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ad?.tags.map((tag: string, index: number) => (
                        <span
                          key={`${tag}-${index}`}
                          className="inline-block px-3 py-1 rounded-full border border-borderColor bg-white text-xs md:text-sm text-descriptionColor font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Person of Contact */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-sm md:text-base font-semibold text-headerColor">
                    Point of Contact
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-xs md:text-sm md:grid-cols-3 md:gap-4">
                    <div className="min-w-0 rounded-xl border border-borderColor bg-bgLightColor p-3.5">
                      <p className="text-xs font-medium text-grayColor1">
                        Name
                      </p>
                      <p className="mt-1 truncate font-semibold text-headerColor">
                        {ad.poc_name ||
                          ad.contact_name ||
                          ad.creator?.name ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-borderColor bg-bgLightColor p-3.5">
                      <p className="text-xs font-medium text-grayColor1">
                        Email
                      </p>
                      <p className="mt-1 truncate font-semibold text-headerColor">
                        {ad.poc_email || ad.contact_email || "N/A"}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-borderColor bg-bgLightColor p-3.5">
                      <p className="text-xs font-medium text-grayColor1">
                        Phone Number
                      </p>
                      <p className="mt-1 truncate font-semibold text-headerColor">
                        {ad.poc_phone || ad.contact_phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-sm text-gray-500">
                No details found for this advertisement.
              </div>
            )}
          </div>
        </div>
      </div>
    </RootDialog>
  );
}
