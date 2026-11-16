import { format, isBefore, startOfDay } from "date-fns";

export type EffectiveJobStatus =
  | "published"
  | "scheduled"
  | "expired"
  | "draft"
  | "archive"
  | "rejected"
  | "paused"
  | "closed";

/**
 * Computes the real-time effective lifecycle status of a job posting based on:
 * - base status from DB
 * - announcement_start_date (future = scheduled)
 * - announcement_end_date (past = expired)
 */
export function getEffectiveJobStatus(
  status?: string | null,
  startDateStr?: string | null,
  endDateStr?: string | null
): EffectiveJobStatus {
  const norm = (status || "draft").toLowerCase().trim();

  // If status is explicitly scheduled/upcoming, keep scheduled
  if (norm === "scheduled" || norm === "upcoming") {
    return "scheduled";
  }

  // If status is not published/active, its explicit administrative status holds (draft, rejected, archive, paused, closed)
  if (norm !== "published" && norm !== "active") {
    if (norm === "archive" || norm === "archived") return "archive";
    if (norm === "expired") return "expired";
    if (norm === "rejected") return "rejected";
    if (norm === "paused") return "paused";
    if (norm === "closed") return "closed";
    if (norm === "draft") return "draft";
    return "draft";
  }

  const today = startOfDay(new Date());

  // 1. Check if Start Date is in the future -> Scheduled
  if (startDateStr) {
    try {
      const rawStart = String(startDateStr).split("T")[0];
      const [y, m, d] = rawStart.split("-").map(Number);
      if (y && m && d) {
        const startDate = startOfDay(new Date(y, m - 1, d));
        if (isBefore(today, startDate)) {
          return "scheduled";
        }
      }
    } catch {
      // fallback
    }
  }

  // 2. Check if End Date is in the past -> Expired
  if (endDateStr) {
    try {
      const rawEnd = String(endDateStr).split("T")[0];
      const [y, m, d] = rawEnd.split("-").map(Number);
      if (y && m && d) {
        const endDate = startOfDay(new Date(y, m - 1, d));
        if (isBefore(endDate, today)) {
          return "expired";
        }
      }
    } catch {
      // fallback
    }
  }

  // 3. Otherwise, live Active / Published
  return "published";
}

/**
 * Formats a human-readable timeline helper text for a job post.
 */
export function formatJobTimeline(
  startDateStr?: string | null,
  endDateStr?: string | null
): {
  type: "open" | "scheduled" | "active" | "expired";
  text: string;
} {
  const today = startOfDay(new Date());

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (startDateStr) {
    const raw = String(startDateStr).split("T")[0];
    const [y, m, d] = raw.split("-").map(Number);
    if (y && m && d) startDate = startOfDay(new Date(y, m - 1, d));
  }

  if (endDateStr) {
    const raw = String(endDateStr).split("T")[0];
    const [y, m, d] = raw.split("-").map(Number);
    if (y && m && d) endDate = startOfDay(new Date(y, m - 1, d));
  }

  // Future start date
  if (startDate && isBefore(today, startDate)) {
    return {
      type: "scheduled",
      text: `Goes live on ${format(startDate, "MMM dd, yyyy")}`,
    };
  }

  // Past end date
  if (endDate && isBefore(endDate, today)) {
    return {
      type: "expired",
      text: `Expired on ${format(endDate, "MMM dd, yyyy")}`,
    };
  }

  // Active with closing deadline
  if (endDate) {
    return {
      type: "active",
      text: `Closes on ${format(endDate, "MMM dd, yyyy")}`,
    };
  }

  // Open until filled
  return {
    type: "open",
    text: "Open until filled (No deadline)",
  };
}

/**
 * Formats raw database badge/tag values into clean human-readable text.
 * e.g., 'full_time' -> 'Full-time', 'on_site' -> 'On-site'
 */
export function formatBadge(badge?: string | null): string {
  if (!badge) return "";
  const cleaned = badge.replace(/_/g, " ").trim();
  const lower = cleaned.toLowerCase();

  const map: Record<string, string> = {
    "full time": "Full-time",
    "part time": "Part-time",
    "short term": "Short-term",
    "on site": "On-site",
    "onsite": "On-site",
    "remote": "Remote",
    "hybrid": "Hybrid",
    "contract": "Contract",
    "internship": "Internship",
    "psychology": "Psychology",
    "neuroscience": "Neuroscience",
  };

  if (map[lower]) {
    return map[lower];
  }

  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Strips the 'APP-' prefix from application IDs to display clean #123456 format.
 * e.g., 'APP-737716' -> '#737716', '#APP-737716' -> '#737716', '737716' -> '#737716'
 */
export function formatApplicationId(id?: string | number | null): string {
  if (!id) return "";
  const cleaned = String(id).replace(/^#?APP-?/i, "").replace(/^#/, "").trim();
  return cleaned ? `#${cleaned}` : "";
}


