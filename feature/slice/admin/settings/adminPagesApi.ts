import baseApiSlice from "../../baseApi";

export type AdminPageSlug = "about-us" | "privacy-policy" | "terms-and-conditions";
export interface AdminPageContent {
  title: string;
  content: string | null;
  core_values?: { vision?: string; mission?: string; strategy?: string };
  founder?: { name?: string; designation?: string; bio?: string; signature?: string };
  team?: unknown[];
  videos?: unknown[];
  faqs?: unknown[];
  leading_institutions?: unknown[];
  [key: string]: unknown;
}

export const adminPagesApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminPage: builder.query<{ success: boolean; data: AdminPageContent }, AdminPageSlug>({
      query: (slug) => `/admin/pages/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "adminPage", id: slug }],
    }),
    updateAdminPage: builder.mutation<{ success: boolean; data?: AdminPageContent; message?: string }, { slug: AdminPageSlug; body: Partial<AdminPageContent> & Pick<AdminPageContent, "title" | "content"> }>({
      query: ({ slug, body }) => ({ url: `/admin/pages/${slug}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: "adminPage", id: slug }],
    }),
  }),
});

export const { useGetAdminPageQuery, useUpdateAdminPageMutation } = adminPagesApi;
