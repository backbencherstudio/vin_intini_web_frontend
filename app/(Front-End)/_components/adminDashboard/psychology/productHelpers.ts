import type { AdminProductStatus } from "@/feature/slice/admin/products";

export const PRODUCT_STATUS_BADGE_MAP: Record<
  AdminProductStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  active: {
    label: "Active",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
    dotClass: "bg-rose-500",
  },
  draft: {
    label: "Draft",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "border-red-300 bg-red-50 text-red-700",
    dotClass: "bg-red-600",
  },
};

export function stripHtmlToText(input?: string | null): string {
  if (!input) return "";

  return input
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeProductHtml(html?: string | null): string {
  if (!html) return "";

  const cleaned = html
    .replace(/<(script|style|iframe|object|embed|svg|form|meta|link)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|svg|form|meta|link)\b[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /(href|src)\s*=\s*(?:"\s*(?:javascript|vbscript|data:text\/html)[^"]*"|'\s*(?:javascript|vbscript|data:text\/html)[^']*')/gi,
      '$1="#"',
    )
    .trim();

  // Wrap plain text paragraphs cleanly if the input has no block HTML tags.
  if (cleaned && !/<[a-z][\s\S]*>/i.test(cleaned)) {
    return cleaned
      .split(/\n{2,}/)
      .map((para) => `<p>${para.replace(/\n/g, "<br />")}</p>`)
      .join("");
  }

  return cleaned;
}

export function getSafeExternalUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function extractApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error || typeof error !== "object") return fallback;

  const maybeErr = error as {
    data?: {
      message?: string;
      errors?: Record<string, string[] | string>;
    };
    error?: string;
    message?: string;
  };

  if (maybeErr.data?.errors) {
    const firstKey = Object.keys(maybeErr.data.errors)[0];
    const firstValue = firstKey ? maybeErr.data.errors[firstKey] : undefined;
    if (Array.isArray(firstValue) && firstValue[0]) {
      return firstValue[0];
    }
    if (typeof firstValue === "string" && firstValue) {
      return firstValue;
    }
  }

  return maybeErr.data?.message || maybeErr.message || maybeErr.error || fallback;
}

