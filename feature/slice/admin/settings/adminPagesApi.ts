import baseApiSlice from "../../baseApi";

export type AdminPageSlug = "about-us" | "privacy-policy" | "terms-and-conditions";
export interface AdminPageContent {
  title: string;
  content: string | null;
  core_values?: { vision?: string; mission?: string; strategy?: string };
  founder?: {
    name?: string;
    designation?: string;
    bio?: string;
    signature?: string;
    photo_url?: string;
    image_url?: string;
    photo?: string;
  };
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
    updateAdminPage: builder.mutation<
      { success: boolean; data?: AdminPageContent; message?: string },
      {
        slug: AdminPageSlug;
        body: Partial<AdminPageContent> & Pick<AdminPageContent, "title" | "content">;
        founderPhoto?: File;
        uploads?: { fieldName: string; file: File }[];
      }
    >({
      query: ({ slug, body, founderPhoto, uploads = [] }) => {
        if (!founderPhoto && uploads.length === 0) {
          return { url: `/admin/pages/${slug}`, method: "PUT", body };
        }

        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          if (Array.isArray(value)) {
            value.forEach((row, index) => {
              if (typeof row !== "object" || row === null) {
                formData.append(`${key}[${index}]`, String(row));
                return;
              }
              Object.entries(row).forEach(([field, fieldValue]) => {
                if (fieldValue === undefined || fieldValue === null) return;
                formData.append(
                  `${key}[${index}][${field}]`,
                  typeof fieldValue === "object"
                    ? JSON.stringify(fieldValue)
                    : String(fieldValue),
                );
              });
            });
            return;
          }
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        });
        if (founderPhoto) formData.append("founder_photo", founderPhoto);
        uploads.forEach(({ fieldName, file }) => formData.append(fieldName, file));
        formData.append("_method", "PUT");
        return { url: `/admin/pages/${slug}`, method: "POST", body: formData };
      },
      invalidatesTags: (_result, _error, { slug }) => [{ type: "adminPage", id: slug }],
    }),
  }),
});

export const { useGetAdminPageQuery, useUpdateAdminPageMutation } = adminPagesApi;
