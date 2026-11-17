/**
 * Security and validation helpers for Admin Job Post Management.
 */

export function sanitizeJobHtml(html?: string | null): string {
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

  return cleaned;
}

export function getSafeExternalUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^(javascript|vbscript|data):/i.test(trimmed)) {
    return null;
  }

  try {
    const withProto = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProto);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function isValidWebUrl(url?: string | null): boolean {
  if (!url || !url.trim()) return true; // Optional field
  const trimmed = url.trim();
  if (/^(javascript|vbscript|data):/i.test(trimmed)) return false;
  try {
    const withProto = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProto);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
