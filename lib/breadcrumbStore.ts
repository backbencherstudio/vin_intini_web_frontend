"use client";

import { useEffect, useSyncExternalStore } from "react";

interface CustomBreadcrumbState {
  pathname?: string;
  title: string;
}

let storeState: CustomBreadcrumbState | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore
    }
  });
}

/**
 * Set a dynamic custom title for the current route in breadcrumbs.
 * Pass null to clear.
 */
export function setBreadcrumbCustomTitle(
  title: string | null,
  pathname?: string
) {
  if (title === null) {
    if (storeState !== null) {
      storeState = null;
      notify();
    }
    return;
  }

  const trimmed = title.trim();
  if (!trimmed) return;

  if (
    storeState?.title !== trimmed ||
    storeState?.pathname !== pathname
  ) {
    storeState = { title: trimmed, pathname };
    notify();
  }
}

/**
 * Hook to set custom breadcrumb title in page/client components.
 * Automatically cleans up on unmount or when title changes.
 */
export function useSetBreadcrumbTitle(
  title: string | undefined | null,
  pathname?: string
) {
  useEffect(() => {
    if (title) {
      setBreadcrumbCustomTitle(title, pathname);
    }
    return () => {
      setBreadcrumbCustomTitle(null);
    };
  }, [title, pathname]);
}

/**
 * Hook consumed by Breadcrumb component to read the current custom title.
 */
export function useBreadcrumbCustomTitle(currentPathname: string): string | null {
  const state = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    () => storeState,
    () => null
  );

  if (!state) return null;
  // If specific pathname was registered, only apply if path matches
  if (state.pathname && state.pathname !== currentPathname) {
    return null;
  }
  return state.title;
}
