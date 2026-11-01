import Cookies from "js-cookie";
import { AppConfig } from "@/config/app.config";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || AppConfig().app.apiUrl;

export interface FetchWrapperOptions extends RequestInit {
  next?: {
    tags?: string[];
    revalidate?: number | false;
  };
}

export const fetchWrapper = async (
  endpoint: string,
  options: FetchWrapperOptions = {},
) => {
  let token: string | undefined;
  if (typeof window === "undefined") {
    // Load request cookies only when a request runs on the server.
    try {
      const nh = await import("next/headers");
      const cookieStore = await nh.cookies();
      token = cookieStore.get("accessToken")?.value;
    } catch (err) {
      token = undefined;
    }
  } else {
    token = Cookies.get("accessToken");
  }

  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (isFormData) {
    // The browser must add the multipart boundary to this header.
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const shouldStringifyBody =
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams) &&
    !(options.body instanceof Blob) &&
    !(options.body instanceof ArrayBuffer);

  const { next, ...restOptions } = options;
  const hasTimeBasedCache =
    next?.revalidate === false ||
    (typeof next?.revalidate === "number" && next.revalidate > 0);

  const config: FetchWrapperOptions = {
    ...restOptions,
    headers,
    // Authenticated requests stay fresh unless a caller opts into a lifetime.
    cache: restOptions.cache ?? (hasTimeBasedCache ? "force-cache" : "no-store"),
    body: shouldStringifyBody ? JSON.stringify(options.body) : options.body,
  };

  if (next) {
    config.next = next;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    console.warn("Token expired or invalid. Handle logout/refresh here.");
  }

  if (!response.ok) {
    const errorData: unknown = await response.json().catch(() => undefined);
    const message =
      typeof errorData === "object" &&
      errorData !== null &&
      "message" in errorData &&
      typeof errorData.message === "string"
        ? errorData.message
        : "Request failed";

    throw new Error(message);
  }

  return response.json();
};
