"use client";

import {
  useAdvertisementsClickMutation,
  useAdvertisementsImpressionMutation,
} from "@/feature/slice/post/postSlice";
import { PublicationDataType } from "@/lib/type";
import dayjs from "dayjs";
import { ChevronRight, Dot, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface PublicationCardProps {
  publication: PublicationDataType;
}

export const PublicationCard = ({ publication }: PublicationCardProps) => {
  const pathName = usePathname();

  const isBoosted = Boolean(
    publication?.is_boosted ||
      publication?.is_sponsored ||
      publication?.boost_status === "active",
  );
  const isNewRelease = Boolean(
    publication?.is_new_release || publication?.badge === "New Release",
  );
  const adCampaignId = publication?.ad_campaign_id;

  const [sendImpression] = useAdvertisementsImpressionMutation();
  const [sendClick] = useAdvertisementsClickMutation();
  const cardRef = useRef<HTMLDivElement>(null);
  const impressionSentRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // IAB Viewable Impression Tracking (50% visibility for 1 continuous second)
  useEffect(() => {
    const element = cardRef.current;
    if (!element || impressionSentRef.current || !isBoosted || !adCampaignId) {
      return;
    }

    const clearVisibilityTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const isAtLeastHalfVisible = () => {
      const rect = element.getBoundingClientRect();
      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
      );
      const elementArea = rect.width * rect.height;

      return (
        document.visibilityState === "visible" &&
        elementArea > 0 &&
        (visibleWidth * visibleHeight) / elementArea >= 0.5
      );
    };

    const recordImpression = () => {
      if (impressionSentRef.current || !isAtLeastHalfVisible()) return;
      impressionSentRef.current = true;
      sendImpression({
        campaign_ids: [adCampaignId],
        placement: "publication_feed",
      })
        .unwrap()
        .catch((error) => {
          impressionSentRef.current = false;
          console.error(
            "Failed to record publication advertisement impression:",
            error,
          );
        });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry?.isIntersecting &&
          entry.intersectionRatio >= 0.5 &&
          !timerRef.current
        ) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            recordImpression();
          }, 1000);
        } else if (!entry?.isIntersecting || entry.intersectionRatio < 0.5) {
          clearVisibilityTimer();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    // Initial check in case the card is already in view upon loading
    if (isAtLeastHalfVisible() && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        recordImpression();
      }, 1000);
    }

    const handleScroll = () => {
      if (
        isAtLeastHalfVisible() &&
        !timerRef.current &&
        !impressionSentRef.current
      ) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          recordImpression();
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      clearVisibilityTimer();
    };
  }, [adCampaignId, isBoosted, sendImpression]);

  const handleLinkClick = () => {
    if (isBoosted && adCampaignId) {
      sendClick({
        id: adCampaignId,
        placement: "publication_feed",
      })
        .unwrap()
        .catch((err) => {
          console.error(
            "Failed to record publication advertisement click:",
            err,
          );
        });
    }
  };

  return (
    <div
      ref={cardRef}
      className="group flex w-full flex-col items-start gap-2.5 self-stretch border-b border-borderColor py-4 md:px-3 transition-colors hover:bg-sectionColor/60"
    >
      {/* Journal and Tag Row */}
      <div className="flex w-full items-start sm:items-center justify-between gap-3">
        <Link
          href={`${pathName}/${publication.id}`}
          onClick={handleLinkClick}
          className="text-base font-semibold leading-snug tracking-[0.08px] text-primaryColor hover:underline"
        >
          {publication.title}
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          {(publication.is_boosted || publication.is_sponsored) ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <Sparkles className="h-3 w-3 text-amber-600" />
              Sponsored
            </span>
          ) : isNewRelease ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-400 text-white px-2.5 py-0.5 text-xs font-bold shadow-xs">
              <Sparkles className="h-3 w-3 text-white" />
              New Release
            </span>
          ) : null}
          {publication.publication_type && (
            <span className="shrink-0 flex items-center capitalize rounded-full border border-borderColor/60 bg-white px-3 py-0.5 text-xs font-medium text-descriptionColor">
              {publication.publication_type}
            </span>
          )}
        </div>
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
          onClick={handleLinkClick}
          className="flex items-center gap-1 text-sm text-primaryColor hover:underline font-medium transition-transform group-hover:translate-x-0.5"
        >
          <span>Learn more</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
