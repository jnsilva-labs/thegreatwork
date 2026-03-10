"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!POSTHOG_KEY || initializedRef.current) {
      return;
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true
    });

    initializedRef.current = true;
  }, []);

  useEffect(() => {
    if (!POSTHOG_KEY || !initializedRef.current) {
      return;
    }

    const query = typeof window !== "undefined" ? window.location.search : "";
    const currentUrl = query ? `${pathname}?${query}` : pathname;

    posthog.capture("$pageview", {
      $current_url: currentUrl
    });
  }, [pathname]);

  return children;
}
