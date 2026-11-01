# MindUnite web frontend

MindUnite is a Next.js App Router application for the public site, authentication and onboarding flows, the member experience, and the admin dashboard.

## Getting started

Use Node.js with Yarn. `package.json` declares Yarn as the package manager and `yarn.lock` is the dependency lockfile.

```bash
yarn install --immutable
yarn dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

## Common commands

| Command | Purpose |
| --- | --- |
| `yarn dev` | Run the development server with Turbopack |
| `yarn build` | Create a production build |
| `yarn start` | Serve the production build |
| `yarn lint` | Run the configured Next.js lint command |

## Project map

| Path | Responsibility |
| --- | --- |
| `app/` | App Router routes, layouts, route groups, and global styles |
| `app/(Front-End)/` | Public site and member facing experience |
| `app/(auth)/`, `app/(onboarding)/` | Authentication and onboarding flows |
| `app/(admin-dashboard)/` | Admin dashboard routes and layouts |
| `components/ui/` | Low-level UI primitives |
| `components/reusable/` | Shared application components |
| `feature/` | Redux store and feature slices/API definitions |
| `hooks/` | Reusable React hooks |
| `service/`, `lib/`, `helper/` | API services and shared utilities |
| `types/`, `config/` | Shared types and application configuration |
| `public/` | Static assets served directly |

## Conventions

- Keep route-specific components and helpers near their route. Use `app/<route>/_components` or `app/<route>/_lib` for code that should not be shared elsewhere.
- Put reusable UI primitives in `components/ui/`; put product-level shared components in `components/reusable/`.
- Keep state and API logic with its feature under `feature/slice/<feature>/`.
- Use the `@/` alias for imports rooted at the repository root.
- Keep global CSS for resets, design tokens, and styles that truly apply across the application. Prefer Tailwind classes or component-scoped styles for local presentation.
- Add explicit types at shared component and service boundaries; avoid spreading `any` into reusable code.

## Configuration

Copy the appropriate values from `example.env.local` into a local environment file before using backend-dependent flows. Do not commit secrets or environment-specific credentials.

## Data caching

- Requests made through `lib/fetch-wrapper.ts` are uncached by default because the helper attaches the current user’s access token. Use `cache: "force-cache"` or a positive `next.revalidate` only for data that is safe to retain for that lifetime.
- The subscription plan catalog opts into a one-hour Next.js fetch cache. Its URL includes the selected billing cycle and plan type.
- RTK Query keeps API results in the Redux store for the active browser session. Mutations should invalidate the tags for the data they change; login and logout clear the API cache.
- Conversation messages use a longer in-memory retention window for quick navigation. Send, delete, read, and reaction updates invalidate that conversation’s cached messages.
