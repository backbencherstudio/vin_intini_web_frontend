import { clearToken, getToken, setToken } from "@/lib/token";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api",
  credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getToken();

    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const endpointUrl = typeof args === "string" ? args : args.url;
  const isAuthExempt =
    endpointUrl.includes("/login") ||
    endpointUrl.includes("/register") ||
    endpointUrl.includes("/refresh");

  if (result.error && result.error.status === 401 && !isAuthExempt) {
    try {
      const refreshResult = await rawBaseQuery(
        {
          url: "/refresh",
          method: "POST",
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as {
          token?: string;
          data?: { token?: string };
        };
        const newToken = data.token || data.data?.token;

        if (newToken) {
          await setToken(newToken);
          // Retry the original query with the refreshed token
          result = await rawBaseQuery(args, api, extraOptions);
        }
      } else {
        await clearToken();
      }
    } catch {
      await clearToken();
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
  ],
});

export default baseApiSlice;
