import { clearToken, getToken, setToken } from "@/lib/token";
import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://vini.softvenceomegaforce.cloud/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getToken();

    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    return headers;
  },
});

let isRedirectingToLogin = false;

const AUTH_EXEMPT_ENDPOINTS = ["/login", "/admin/login", "/register", "/sign-up", "/refresh", "/logout"];

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const requestUrl = typeof args === "string" ? args : args.url;
    const isExempt = AUTH_EXEMPT_ENDPOINTS.some((path) =>
      requestUrl?.includes(path),
    );

    if (!isExempt) {
      const currentToken = await getToken();

      // Attempt one silent token refresh if a token exists
      if (currentToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/refresh`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentToken}`,
              Accept: "application/json",
            },
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData?.token || refreshData?.data?.token;
            if (newToken) {
              await setToken(newToken);
              result = await rawBaseQuery(args, api, extraOptions);
              if (!result.error || result.error.status !== 401) {
                return result;
              }
            }
          }
        } catch {
          // Refresh failed, proceed to logout redirect
        }
      }

      // Clear stale token and redirect to login
      await clearToken();

      if (typeof window !== "undefined" && !isRedirectingToLogin) {
        const pathname = window.location.pathname;
        const isLoginPage =
          pathname === "/login" || pathname === "/admin/login";

        if (!isLoginPage) {
          isRedirectingToLogin = true;
          const loginUrl = pathname.startsWith("/dashboard")
            ? "/admin/login"
            : "/login";
          window.location.replace(loginUrl);
        }
      }
    }
  }

  return result;
};

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Post",
    "Notifications",
    "conversationList",
    "getConversationList",
    "message",
    "loginActivities",
    "activeSessions",
    "overview",
    "connect",
    "psychology",
    "follow",
    "group",
    "neuroscience",
    "Comment",
    "Like",
    "experience",
    "study",
    "university",
    "state",
    "residencies",
    "facilities",
    "postBaccalaureatePrograms",
    "postBaccalaureateCategories",
    "Employment",
    "subscription",
    "plan",
    "category",
    "publication",
    "Company",
    "UserJob",
    "Job",
    "Analytic",
    "Advertisement",
    "publications",
    "partner",
    "boosting",
    "integrationSettings",
    "adminPage",
    "industryConversationList",
    "industryMessage",
    "adminDashboard",
    "adminProducts",
    "adminJobs",
    "adminJobApplicants",
    "JobPreference",
    "city",
    "contactMessages",
    "institutionReports",
  ],
});

export default baseApiSlice;
