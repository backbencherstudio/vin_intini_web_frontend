# API Integration Guidelines & Standards (RTK Query)

This document establishes the official rules, specification format, and architectural patterns for API integration across the frontend codebase, based on the patterns established in `subscriptionApi.ts` and `subscriptionType.ts`.

---

## 1. Specification Input Format & Code Generation Workflow

When providing or receiving API specifications, use the following standardized input format:

```text
endpoints: <HTTP_METHOD> <URL_PATH> (e.g., GET /admin/users, POST /admin/users/create, PATCH /admin/users/:id)
req:       <Request requirements, auth, or header specifications>
params:    <Query params (e.g., page, per_page, search, status) or Route params (e.g., id)>
body:      <Request payload / JSON structure sent in body>
res:       <Backend JSON response structure (data, status, pagination, etc.)>
doc:       <Business rules, notes, field descriptions, optional vs required flags>
```

### Generation Mapping Rules
From the input above, the following files must be generated or updated:

| Specification Input | Maps To Code Element | File |
| :--- | :--- | :--- |
| `res` (Entity shape) | Domain entity interfaces (`User`, `Plan`, `Subscriber`) & Union types (`UserStatus`) | `<feature>Type.ts` |
| `res` (Envelope) | Response wrapper interface (`GetUsersResponse`, `CreateUserResponse`) | `<feature>Type.ts` |
| `params` (Query) | Query parameter interface (`GetUsersParams` with `query?: { ... }`) | `<feature>Type.ts` |
| `params` (Route) + `body` | Mutation argument interface (`UpdateUserArgs` with `{ id, body }`) | `<feature>Type.ts` |
| `body` | Request payload interface (`CreateUserPayload`, `UserPayload`) | `<feature>Type.ts` |
| `endpoints` + `req` | `builder.query` or `builder.mutation` on `baseApiSlice.injectEndpoints` | `<feature>Api.ts` |
| `doc` | TypeScript JSDoc comments, union types, and field nullability/optionality | Both files |
| Domain Tag | `tagTypes` registration (must be added if not already in `baseApi.ts`) | `feature/slice/baseApi.ts` |
| Auto-generated hooks | Export `use<EndpointName>(Query\|Mutation)` at bottom | `<feature>Api.ts` |

---

## 2. Directory & File Organization

Each feature or domain API module must reside under `feature/slice/`:

```text
feature/slice/<section>/<feature-name>/
├── <feature>Type.ts      # Domain interfaces, payloads, request params & response models
├── <feature>Api.ts       # RTK Query slice (injectEndpoints) and exported hooks
└── index.ts              # (Optional) Unified exports for cleaner imports
```

### File Responsibilities
- **`<feature>Type.ts`**: Pure TypeScript. **No runtime logic or API imports**. Houses all domain models, enums/union types, request payloads, query parameters, and response envelopes.
- **`<feature>Api.ts`**: Injects endpoints into `baseApiSlice`. Defines queries, mutations, tag invalidation/provision, and exports auto-generated hooks.

---

## 3. Type Definition Standards (`*Type.ts`)

### A. Naming Conventions
| Type Category | Naming Convention | Example |
| :--- | :--- | :--- |
| **Domain Entity** | Singular PascalCase | `Subscription`, `Plan`, `Subscriber`, `User` |
| **Union / Status** | Singular PascalCase with descriptive suffix | `PlanStatus`, `PlanBillingCycle`, `UserRole` |
| **Query Params** | `Get<Resource>Params` | `GetSubscriptionsParams`, `GetUsersParams` |
| **Create Payload** | `Create<Resource>Payload` or `<Resource>Payload` | `PlanPayload`, `CreateUserPayload` |
| **Update Payload** | `Update<Resource>Payload` | `UpdatePlanPayload` |
| **Mutation Args** | `<Action><Resource>Args` | `UpdatePlanArgs` (`{ id: string \| number; body: PlanPayload }`) |
| **Response Wrapper**| `<Action/Get><Resource>Response` | `GetSubscriptionsResponse`, `CreatePlanResponse` |

### B. Standard Backend Response Envelope
All API responses must match the server's standard envelope structure:

```ts
// 1. Single Entity / Action Response
export interface CreatePlanResponse {
  success: boolean;
  message?: string;
  data: Plan;
}

// 2. Simple Status/Action Response
export interface ActionResponse {
  success: boolean;
  message?: string;
}

// 3. Paginated List Response
export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface GetSubscriptionsResponse {
  success: boolean;
  data: Subscription[];
  pagination: Pagination;
}
```

### C. Query Parameter Typing
Wrap search and filter params in an optional `query` object, allowing optional indexing while maintaining strong typing:

```ts
export interface GetSubscriptionsParams {
  query?: {
    page?: number;
    per_page?: number;
    status?: Subscription["status"];
    search?: string;
    [key: string]: unknown;
  };
}
```

### D. Separation of Entity Model vs Payload
Do **NOT** reuse API response models directly as form/mutation payloads:
- Response models reflect server representation (e.g., strings formatted as currency, timestamps, server-computed flags).
- Payloads represent user-input or required transmission format (e.g., raw numeric values, date strings, arrays of IDs).

---

## 4. RTK Query Slice Standards (`*Api.ts`)

### A. Endpoint Injection Setup
Always inject into `baseApiSlice` with `overrideExisting: true`:

```ts
import baseApiSlice from "../../baseApi";
import {
  GetSubscriptionsResponse,
  GetSubscriptionsParams,
  // ...
} from "./subscriptionType";

const subscriptionSlice = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // endpoints defined here
  }),
});
```

### B. Query Endpoints
1. **With Parameters**: Safe parameter handling (support optional params without crashing on undefined destructuring):
   ```ts
   getMySubscribers: builder.query<
     GetSubscriptionsResponse,
     GetSubscriptionsParams | void
   >({
     query: (params) => ({
       url: "/admin/subscriptions",
       method: "GET",
       params: params ? params.query : undefined,
     }),
     providesTags: ["subscription"],
   }),
   ```
2. **Without Parameters**:
   ```ts
   getPlans: builder.query<GetPlansResponse, void>({
     query: () => ({
       url: "/admin/plans",
       method: "GET",
     }),
     providesTags: ["plan"],
   }),
   ```

### C. Mutation Endpoints
Always use uppercase HTTP verbs (`POST`, `PATCH`, `PUT`, `DELETE`):

```ts
// Mutation with body
createPlan: builder.mutation<CreatePlanResponse, PlanPayload>({
  query: (body) => ({
    url: "/admin/plans/create",
    method: "POST",
    body,
  }),
  invalidatesTags: ["plan"],
}),

// Mutation with URL param and body
updatePlan: builder.mutation<UpdatePlanResponse, UpdatePlanArgs>({
  query: ({ id, body }) => ({
    url: `/admin/plans/${id}`,
    method: "PATCH",
    body,
  }),
  invalidatesTags: ["plan"],
}),

// Mutation with URL param only
cancelSubscription: builder.mutation<
  CancelSubscriptionResponse,
  { id: number | string }
>({
  query: ({ id }) => ({
    url: `/admin/subscriptions/${id}/cancel`,
    method: "POST",
  }),
  invalidatesTags: ["subscription"],
}),
```

---

## 5. Cache Management & Tags

1. **Tag Registration**: Every tag used in `providesTags` or `invalidatesTags` **MUST** be pre-declared in `baseApiSlice.tagTypes` located in `feature/slice/baseApi.ts`.
2. **Case Sensitivity**: Be mindful of exact casing (e.g., `"subscription"`, `"plan"`, `"User"`). Check `baseApi.ts` before adding new endpoints.
3. **Invalidation Rule**:
   - Queries `provide` tags (`providesTags: ["<tag>"]`).
   - Mutations `invalidate` tags (`invalidatesTags: ["<tag>"]`).
   - Group related queries under the appropriate domain tag to trigger automated refetching.

---

## 6. Exporting & Consuming Hooks

### A. Hook Export Pattern
Destructure and export hooks at the end of the file:

```ts
export const {
  useGetMySubscribersQuery,
  useCancelSubscriptionMutation,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
} = subscriptionSlice;
```

### B. Component Consumption Standard

```tsx
// 1. Queries
const { data, isLoading, isError, refetch } = useGetMySubscribersQuery({ query: queryParams });
const subscribers = data?.data ?? [];

// 2. Mutations
const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

const handleSave = async (payload: PlanPayload) => {
  try {
    await updatePlan({ id, body: payload }).unwrap();
    toast.success("Updated successfully");
  } catch (err) {
    console.error("Update failed:", err);
    toast.error("Failed to update");
  }
};
```
Always use `.unwrap()` when handling mutations in UI handlers to catch API-level rejected errors in standard `try...catch` blocks.
