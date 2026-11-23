"use client";

import RootDialog from "@/components/reusable/RootDialog";
import dayjs from "dayjs";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Eye,
  Globe,
  MousePointer,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface PublicationBoostResponseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  publication: {
    id: string | number;
    title?: string;
    network_type?: string;
    publication_type?: string;
    website_url?: string;
    attachment_url?: string;
    is_boosted?: boolean;
    boost_status?: string;
    boost_days_left?: number | null;
    boost_remaining_text?: string | null;
    boost_expires_at?: string | null;
    impressions_count?: number;
    clicks_count?: number;
    views_count?: number;
    campaign?: {
      id?: number;
      status?: string;
      total_impressions?: number;
      total_clicks?: number;
      amount_paid?: number;
      starts_at?: string | null;
      ends_at?: string | null;
    } | null;
    [key: string]: any;
  } | null;
}

export default function PublicationBoostResponseModal({
  open,
  setOpen,
  publication,
}: PublicationBoostResponseModalProps) {
  if (!publication) return null;

  const impressions =
    publication.impressions_count ??
    publication.campaign?.total_impressions ??
    0;
  const clicks =
    publication.clicks_count ?? publication.campaign?.total_clicks ?? 0;
  const views = publication.views_count ?? 0;
  const ctr =
    impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0.0";

  const networkName = publication.network_type || "Neuroscience";
  const networkSlug = String(networkName).toLowerCase();
  const feedUrl = `/mu/${networkSlug}-network/industry/publications`;

  const endsAtFormatted = publication.boost_expires_at
    ? dayjs(publication.boost_expires_at).format("DD MMM YYYY, hh:mm A")
    : publication.campaign?.ends_at
      ? dayjs(publication.campaign.ends_at).format("DD MMM YYYY, hh:mm A")
      : null;

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-xl md:max-w-2xl rounded-2xl overflow-hidden p-0 max-h-[90vh]"
      ariaLabel="Boost Campaign Response"
      ariaDescription="Live performance and reach metrics for your boosted publication"
    >
      <div className="flex h-full flex-col overflow-hidden bg-white">
        {/* 1. Header */}
        <div className="sticky top-0 z-10 shrink-0 border-b border-borderColor/60 bg-white px-5 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <Zap className="w-5 h-5 fill-purple-600 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-headerColor">
                Boost Campaign Response
              </h2>
              <p className="text-xs text-descriptionColor">
                Live performance and audience reach across MindUnite
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">
          {/* Publication Summary Card */}
          <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-sm sm:text-base text-headerColor line-clamp-2">
                {publication.title || "Research Publication"}
              </h3>
              <span className="inline-flex items-center gap-1 shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white shadow-xs">
                <Zap className="w-3 h-3 fill-white" />
                <span>
                  {publication.boost_remaining_text || "Boost Active"}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-descriptionColor">
              {publication.network_type && (
                <span className="capitalize px-2 py-0.5 rounded bg-white border border-borderColor/60 font-medium text-headerColor">
                  {publication.network_type}
                </span>
              )}
              {publication.publication_type && (
                <span className="capitalize px-2 py-0.5 rounded bg-white border border-borderColor/60 font-medium text-descriptionColor">
                  {publication.publication_type}
                </span>
              )}
              {endsAtFormatted && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Expires: {endsAtFormatted}
                </span>
              )}
            </div>
          </div>

          {/* Response Metrics 4-Box Grid */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <BarChart3 className="w-4 h-4 text-primaryColor" />
              <h4 className="text-xs font-bold tracking-wide uppercase text-descriptionColor">
                Performance & Engagement Metrics
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Impressions */}
              <div className="rounded-xl border border-borderColor/80 bg-white p-3.5 flex flex-col justify-between shadow-2xs hover:border-purple-200 transition-colors">
                <div className="flex items-center justify-between text-purple-600 mb-2">
                  <span className="text-xs font-semibold text-descriptionColor">
                    Impressions
                  </span>
                  <div className="p-1 rounded-lg bg-purple-50">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-headerColor">
                    {Number(impressions).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Feed views delivered
                  </p>
                </div>
              </div>

              {/* Clicks */}
              <div className="rounded-xl border border-borderColor/80 bg-white p-3.5 flex flex-col justify-between shadow-2xs hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between text-blue-600 mb-2">
                  <span className="text-xs font-semibold text-descriptionColor">
                    Clicks
                  </span>
                  <div className="p-1 rounded-lg bg-blue-50">
                    <MousePointer className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-headerColor">
                    {Number(clicks).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Link/article clicks
                  </p>
                </div>
              </div>

              {/* Total Article Views */}
              <div className="rounded-xl border border-borderColor/80 bg-white p-3.5 flex flex-col justify-between shadow-2xs hover:border-emerald-200 transition-colors">
                <div className="flex items-center justify-between text-emerald-600 mb-2">
                  <span className="text-xs font-semibold text-descriptionColor">
                    Article Views
                  </span>
                  <div className="p-1 rounded-lg bg-emerald-50">
                    <Eye className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-headerColor">
                    {Number(views).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Readers viewed article
                  </p>
                </div>
              </div>

              {/* Click-Through Rate (CTR) */}
              <div className="rounded-xl border border-borderColor/80 bg-white p-3.5 flex flex-col justify-between shadow-2xs hover:border-amber-200 transition-colors">
                <div className="flex items-center justify-between text-amber-600 mb-2">
                  <span className="text-xs font-semibold text-descriptionColor">
                    CTR Rate
                  </span>
                  <div className="p-1 rounded-lg bg-amber-50">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-headerColor">
                    {ctr}%
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Engagement ratio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Active Placements */}
          <div className="rounded-xl border border-borderColor bg-gray-50/60 p-4 space-y-2.5">
            <h4 className="text-xs font-bold tracking-wide uppercase text-descriptionColor">
              Active Placement Channels
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-borderColor/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-semibold text-headerColor block">
                    Research Publications Feed
                  </span>
                  <span className="text-descriptionColor text-[11px]">
                    Pinned top tier with Sponsored badge
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-borderColor/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-semibold text-headerColor block">
                    Professional Newsfeed
                  </span>
                  <span className="text-descriptionColor text-[11px]">
                    Injected sponsored banner with PDF preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Footer */}
        <div className="sticky bottom-0 z-10 shrink-0 border-t border-borderColor/60 bg-white px-5 py-3 sm:px-6 flex items-center justify-between gap-3">
          <Link
            href={feedUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primaryColor hover:underline"
          >
            <Globe className="w-4 h-4" />
            <span>View in Live Feed</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-headerColor font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </RootDialog>
  );
}
