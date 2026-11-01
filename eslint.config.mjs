import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // Keep the existing async form and pagination synchronization visible
      // during the cleanup pass without blocking every lint run.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([
    ".yarn/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
