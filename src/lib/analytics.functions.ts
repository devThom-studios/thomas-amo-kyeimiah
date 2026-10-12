import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

const MAX_PATH_LENGTH = 300;

function normalizeReferrer(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

export type SiteStats = {
  total: number;
  last7: number;
  daily: Array<{ date: string; count: number | null }>;
  by_path: Array<{ label: string; count: number }>;
  by_referrer: Array<{ label: string; count: number }>;
  by_country: Array<{ label: string; count: number }>;
};

/**
 * Public, fire-and-forget page-view logger. The server derives the visitor's
 * rough country from the edge proxy headers; the browser only supplies the
 * path and its initial referrer. Failures are swallowed so tracking never
 * breaks the visitor's browsing.
 */
export const logPageView = createServerFn({ method: "POST" })
  .inputValidator((input: { path?: unknown; referrer?: unknown }) => {
    const path =
      typeof input?.path === "string" &&
      input.path.startsWith("/") &&
      input.path.length <= MAX_PATH_LENGTH
        ? input.path
        : "/";
    const referrer =
      typeof input?.referrer === "string" ? normalizeReferrer(input.referrer) : null;
    return { path, referrer };
  })
  .handler(async ({ data }) => {
    try {
      const country = getRequestHeader("cf-ipcountry") ?? null;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("page_views").insert({
        path: data.path,
        referrer: data.referrer,
        country,
      });
      if (error) console.error("page_view insert failed:", error.message);
    } catch (err) {
      console.error("page_view logging failed:", err);
    }
    return { ok: true };
  });

/**
 * Private endpoint: verifies the owner's passcode against a server-side
 * secret, then returns aggregated visit statistics. No passcode, no data.
 */
export const getSiteStats = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode?: unknown }) => {
    if (typeof input?.passcode !== "string" || input.passcode.length === 0) {
      throw new Error("Please enter your passcode.");
    }
    if (input.passcode.length > 200) {
      throw new Error("That passcode is too long.");
    }
    return { passcode: input.passcode };
  })
  .handler(async ({ data }): Promise<SiteStats> => {
    const expected = process.env["STATS_PASSCODE"];
    if (!expected) {
      throw new Error("Visitor statistics are not configured yet.");
    }
    if (data.passcode !== expected) {
      throw new Error("That passcode is incorrect. Please try again.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: stats, error } = await supabaseAdmin.rpc("get_site_stats");
    if (error || !stats) {
      console.error("get_site_stats failed:", error?.message);
      throw new Error("Could not load statistics. Please try again.");
    }
    return stats as SiteStats;
  });
