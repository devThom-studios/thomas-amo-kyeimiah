import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef } from "react";

import { logPageView } from "@/lib/analytics.functions";

// The referrer only reflects the site that brought the visitor here, so it is
// captured once and sent with the first tracked page view only.
const initialReferrer = typeof document !== "undefined" ? document.referrer : "";

/**
 * Invisible client-side tracker: logs one page view per route navigation.
 * Renders nothing and never blocks or breaks the page.
 */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const logView = useServerFn(logPageView);
  const sentReferrer = useRef(false);

  useEffect(() => {
    // Don't log the owner's own stats-page visits.
    if (pathname.startsWith("/stats")) return;
    const referrer = sentReferrer.current ? undefined : initialReferrer || undefined;
    sentReferrer.current = true;
    logView({ data: { path: pathname, referrer } }).catch(() => {});
  }, [pathname, logView]);

  return null;
}
