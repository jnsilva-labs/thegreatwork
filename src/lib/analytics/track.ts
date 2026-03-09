"use client";

type EventProps = Record<string, string | number | boolean | null | undefined>;

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  __apAnalyticsQueue?: Array<Record<string, unknown>>;
};

export const trackEvent = (eventName: string, props: EventProps = {}): void => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    event: eventName,
    ...props
  };

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push(payload);

  analyticsWindow.__apAnalyticsQueue = analyticsWindow.__apAnalyticsQueue ?? [];
  analyticsWindow.__apAnalyticsQueue.push(payload);

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, props);
  }

  window.dispatchEvent(
    new CustomEvent("awareness-paradox:analytics", {
      detail: payload
    })
  );
};
