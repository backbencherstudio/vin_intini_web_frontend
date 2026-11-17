import dayjs from "@/lib/dayjs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToTop() {
  if (typeof window === "undefined") return;

  window.scrollTo({ top: 0, behavior: "auto" });
}

export function normalizeSkillsList(skills?: unknown): string[] {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") return skill;

      if (skill && typeof skill === "object") {
        const typedSkill = skill as Record<string, unknown>;
        const value =
          typedSkill.value ??
          typedSkill.label ??
          typedSkill.name ??
          typedSkill.skill_name ??
          typedSkill.title;

        return typeof value === "string" ? value : "";
      }

      return "";
    })
    .filter(Boolean);
}

export const formatPostDate = (date: string) => {
  const postDate = dayjs(date);
  const now = dayjs();
  const diffDays = now.diff(postDate, "day");
  if (diffDays >= 365) {
    const years = now.diff(postDate, "year");
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }

  if (diffDays >= 30) {
    const months = now.diff(postDate, "month");
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  return postDate.fromNow();
};

export const formatAmount = ({
  type,
  value,
  range,
}: {
  type?: string;
  value: string;
  range?: number;
}) =>
  new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: range || 2,
    maximumFractionDigits: range || 2,
  }).format(Number(value));

export const formatNumber = ({
  type,
  value,
}: {
  type?: string;
  value: string;
}) =>
  new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));

export const formatNumberIntoK = ({
  type,
  value,
}: {
  type?: string;
  value: string | number;
}) => {
  if (value === null || value === undefined || value === "") return "";
  const num =
    typeof value === "string"
      ? Number(value.replace(/[^0-9.-]+/g, ""))
      : Number(value);
  if (isNaN(num)) return String(value);

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000) {
    const formatted = new Intl.NumberFormat(type || "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(num / 1_000_000);
    return `${formatted}m`;
  }

  if (absNum >= 1_000) {
    const formatted = new Intl.NumberFormat(type || "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(num / 1_000);
    return `${formatted}k`;
  }

  return new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(num);
};

 export function truncateText(text: string, maxLength: number): string {
    if (!text) return "";
    return text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..."
      : text;
  }

  
export interface ApplicationStatusConfig {
  label: string;
  className: string;
  dotClassName: string;
  badgeClassName: string;
}

export const getApplicationStatusConfig = (
  statusRaw?: string
): ApplicationStatusConfig => {
  const s = String(statusRaw || "")
    .toLowerCase()
    .trim();

  if (s === "pending") {
    return {
      label: "Pending",
      className: "bg-amber-50 text-amber-800 border-amber-200/80",
      dotClassName: "bg-amber-500",
      badgeClassName: "bg-amber-50 text-amber-800 border-amber-200/80",
    };
  }

  if (s === "reviewing" || s.includes("review")) {
    return {
      label: "In Review",
      className: "bg-blue-50 text-blue-700 border-blue-200/80",
      dotClassName: "bg-blue-500",
      badgeClassName: "bg-blue-50 text-blue-700 border-blue-200/80",
    };
  }

  if (s.includes("shortlist")) {
    return {
      label: "Shortlisted",
      className: "bg-purple-50 text-purple-700 border-purple-200/80",
      dotClassName: "bg-purple-500",
      badgeClassName: "bg-purple-50 text-purple-700 border-purple-200/80",
    };
  }

  if (s.includes("interview")) {
    return {
      label: "Interview",
      className: "bg-teal-50 text-teal-700 border-teal-200/80",
      dotClassName: "bg-teal-500",
      badgeClassName: "bg-teal-50 text-teal-700 border-teal-200/80",
    };
  }

  if (s.includes("assessment")) {
    return {
      label: "Assessment",
      className: "bg-sky-50 text-sky-700 border-sky-200/80",
      dotClassName: "bg-sky-500",
      badgeClassName: "bg-sky-50 text-sky-700 border-sky-200/80",
    };
  }

  if (s.includes("offer")) {
    return {
      label: "Offered",
      className: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      dotClassName: "bg-indigo-500",
      badgeClassName: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    };
  }

  if (s === "hired" || s.includes("accept")) {
    return {
      label: "Hired",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dotClassName: "bg-emerald-600",
      badgeClassName: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    };
  }

  if (s.includes("reject")) {
    return {
      label: "Rejected",
      className: "bg-rose-50 text-rose-700 border-rose-200/80",
      dotClassName: "bg-rose-500",
      badgeClassName: "bg-rose-50 text-rose-700 border-rose-200/80",
    };
  }

  if (s.includes("close")) {
    return {
      label: "Closed",
      className: "bg-gray-100 text-gray-700 border-gray-200",
      dotClassName: "bg-gray-400",
      badgeClassName: "bg-gray-100 text-gray-700 border-gray-200",
    };
  }

  const formatted = s
    ? s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_]/g, " ")
    : "Pending";

  return {
    label: formatted,
    className: "bg-slate-50 text-slate-700 border-slate-200",
    dotClassName: "bg-slate-400",
    badgeClassName: "bg-slate-50 text-slate-700 border-slate-200",
  };
};

/**
 * Escapes unsafe HTML characters while preserving UTF-8 emojis and symbols
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Converts user-typed multi-line plain text into HTML paragraphs
 * Preserves empty lines using <p><br></p>
 */
export function textToHtml(text: string): string {
  if (!text || !text.trim()) return "";
  const lines = text.split("\n");
  return lines
    .map((line) => {
      if (!line.trim()) {
        return "<p><br></p>";
      }
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("");
}

/**
 * Converts HTML post description back to plain text with newlines for editing
 */
export function htmlToPlainText(html: string): string {
  if (!html) return "";
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html;
  }
  return html
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n")
    .replace(/<\/?p>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#39;/gi, "'")
    .trim();
}

/**
 * Formats post content for display in dangerouslySetInnerHTML.
 * If content is plain text, converts newlines to HTML paragraphs.
 */
export function formatContentForDisplay(content?: string): string {
  if (!content) return "";
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }
  return textToHtml(content);
}