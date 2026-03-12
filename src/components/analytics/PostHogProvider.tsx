"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { PostHog } from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const initializedRef = useRef(false);
  const posthogRef = useRef<PostHog | null>(null);

  useEffect(() => {
    if (!POSTHOG_KEY || initializedRef.current) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      void initPostHog();
    }, 1200);

    const initPostHog = async () => {
      const { default: posthog } = await import("posthog-js");

      if (cancelled) {
        return;
      }

      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: false,
        capture_pageview: false,
        disable_session_recording: true,
      });

      posthogRef.current = posthog;
      initializedRef.current = true;
    };

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!POSTHOG_KEY || !initializedRef.current || !posthogRef.current) {
      return;
    }

    const query = typeof window !== "undefined" ? window.location.search : "";
    const currentUrl = query ? `${pathname}?${query}` : pathname;

    posthogRef.current.capture("$pageview", {
      $current_url: currentUrl
    });
  }, [pathname]);

  return children;
}
