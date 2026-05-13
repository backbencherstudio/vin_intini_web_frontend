// src/utils/fetchWrapper.ts
import Cookies from "js-cookie";
import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

export const fetchWrapper = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  let token: string | undefined;
  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    token = cookieStore.get("accessToken")?.value;
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

  const config: RequestInit = {
    ...options,
    headers,
  };

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
