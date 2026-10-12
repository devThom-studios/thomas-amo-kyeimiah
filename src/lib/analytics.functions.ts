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
  /** All-time page views. */
  total: number;
  /** ISO date (UTC) of the earliest recorded view, or null. */
  firstVisit: string | null;
  /** Last-7-days page views. */
  last7: number;
  /** Months that contain data, newest first ("YYYY-MM"). */
  months: Array<{ month: string; count: number }>;
  /** The month this report describes ("YYYY-MM"). */
  month: string;
  /** Page views within the selected month. */
  monthTotal: number;
  /** Daily counts for every day of the selected month. */
  daily: Array<{ date: string; count: number | null }>;
  by_path: Array<{ label: string; count: number }>;
  by_referrer: Array<{ label: string; count: number }>;
  by_country: Array<{ label: string; count: number }>;
};

function isValidMonth(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function topN(counter: Map<string, number>, limit: number) {
  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

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
 * Aggregation happens here (not in SQL) so any month can be selected.
 */
export const getSiteStats = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode?: unknown; month?: unknown }) => {
    if (typeof input?.passcode !== "string" || input.passcode.length === 0) {
      throw new Error("Please enter your passcode.");
    }
    if (input.passcode.length > 200) {
      throw new Error("That passcode is too long.");
    }
    const month = isValidMonth(input?.month) ? input.month : null;
    return { passcode: input.passcode, month };
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
    const { data: rows, error } = await supabaseAdmin
      .from("page_views")
      .select("path, referrer, country, created_at")
      .order("created_at", { ascending: false })
      .limit(200000);
    if (error) {
      console.error("page_views fetch failed:", error.message);
      throw new Error("Could not load statistics. Please try again.");
    }

    type Row = {
      path: string;
      referrer: string | null;
      country: string | null;
      created_at: string;
    };
    const views = (rows ?? []) as Row[];

    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const available = new Map<string, number>();
    for (const v of views) {
      const key = v.created_at.slice(0, 7);
      available.set(key, (available.get(key) ?? 0) + 1);
    }
    const months = [...available.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, count]) => ({ month, count }));

    const month =
      data.month && available.has(data.month) ? data.month : (months[0]?.month ?? currentMonth);
    const monthViews = views.filter((v) => v.created_at.slice(0, 7) === month);

    const byPath = new Map<string, number>();
    const byReferrer = new Map<string, number>();
    const byCountry = new Map<string, number>();
    const daily = new Map<string, number>();
    for (let d = 1; d <= daysInMonth(month); d++) {
      daily.set(`${month}-${String(d).padStart(2, "0")}`, 0);
    }
    for (const v of monthViews) {
      byPath.set(v.path, (byPath.get(v.path) ?? 0) + 1);
      byReferrer.set(v.referrer || "Direct", (byReferrer.get(v.referrer || "Direct") ?? 0) + 1);
      byCountry.set(v.country || "Unknown", (byCountry.get(v.country || "Unknown") ?? 0) + 1);
      const day = v.created_at.slice(0, 10);
      daily.set(day, (daily.get(day) ?? 0) + 1);
    }

    const weekAgoIso = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const last7 = views.filter((v) => v.created_at >= weekAgoIso).length;

    const firstVisit =
      views.length > 0 ? views[views.length - 1].created_at.slice(0, 10) : null;

    return {
      total: views.length,
      firstVisit,
      last7,
      months,
      month,
      monthTotal: monthViews.length,
      daily: [...daily.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count })),
      by_path: topN(byPath, 12),
      by_referrer: topN(byReferrer, 10),
      by_country: topN(byCountry, 10),
    };
  });
