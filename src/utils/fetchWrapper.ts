// src/utils/fetchWrapper.ts
import Cookies from "js-cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

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
    // dynamic import so this module can be used from Pages router too
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

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const shouldStringifyBody =
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams) &&
    !(options.body instanceof Blob) &&
    !(options.body instanceof ArrayBuffer);

  const { next, ...restOptions } = options;

  const config: RequestInit & { next?: any } = {
    ...restOptions,
    headers,
    cache: restOptions.cache ?? "no-store",
    body: shouldStringifyBody ? JSON.stringify(options.body) : options.body,
  };

  // এখানে next option (tags/revalidate) pass করা হয়
  if (next) {
    config.next = next;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      console.warn("Token expired or invalid. Handle logout/refresh here.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
