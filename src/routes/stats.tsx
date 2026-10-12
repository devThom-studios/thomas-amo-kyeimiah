import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import { SiteLayout } from "@/components/site-layout";
import { getSiteStats, type SiteStats } from "@/lib/analytics.functions";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Private site statistics" },
      { name: "description", content: "Private visitor statistics for KyeimiahLab." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StatsPage,
});

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function StatsPage() {
  const fetchStats = useServerFn(getSiteStats);
  const [passcode, setPasscode] = useState("");
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load(passcodeValue: string, month?: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await fetchStats({ data: { passcode: passcodeValue, month } });
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      throw err;
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    try {
      await load(passcode);
    } catch {
      /* error already surfaced */
    }
  }

  function changeMonth(month: string) {
    if (!stats) return;
    load(passcode, month).catch(() => {});
  }

  return (
    <SiteLayout>
      <section className="container-prose py-16 md:py-24">
        <p className="eyebrow">Private</p>
        <h1 className="mt-3 font-serif text-3xl md:text-4xl text-navy-deep tracking-tight">
          Site statistics
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
          Visitor statistics for this website. This page is not linked anywhere
          and is hidden from search engines.
        </p>

        {!stats && (
          <form
            onSubmit={handleSubmit}
            className="mt-10 max-w-md rounded-lg border border-border bg-card p-6"
            noValidate
          >
            <label htmlFor="stats-passcode" className="block text-sm font-medium text-foreground">
              Passcode
            </label>
            <input
              id="stats-passcode"
              type="password"
              autoComplete="off"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
              placeholder="Enter your private passcode"
              required
            />
            {error && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? "Checking…" : "Unlock statistics"}
            </button>
          </form>
        )}

        {stats && (
          <StatsReport
            stats={stats}
            busy={busy}
            onMonthChange={changeMonth}
          />
        )}
      </section>
    </SiteLayout>
  );
}

function StatsReport({
  stats,
  busy,
  onMonthChange,
}: {
  stats: SiteStats;
  busy: boolean;
  onMonthChange: (month: string) => void;
}) {
  const monthIndex = stats.months.findIndex((m) => m.month === stats.month);
  const prevMonth = monthIndex >= 0 && monthIndex < stats.months.length - 1
    ? stats.months[monthIndex + 1].month
    : null;
  const nextMonth = monthIndex > 0 ? stats.months[monthIndex - 1].month : null;

  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count ?? 0));
  const maxPath = Math.max(1, ...stats.by_path.map((d) => d.count));
  const maxMonth = Math.max(1, ...stats.months.map((m) => m.count));

  return (
    <div className="mt-10 space-y-12">
      <div className="grid gap-4 sm:grid-cols-3 max-w-2xl">
        <StatCard label="All-time page views" value={stats.total} />
        <StatCard label={`${formatMonth(stats.month)}`} value={stats.monthTotal} />
        <StatCard label="Last 7 days" value={stats.last7} />
      </div>
      {stats.firstVisit && (
        <p className="text-sm text-muted-foreground">
          First recorded visit: {stats.firstVisit}
        </p>
      )}

      <section>
        <h2 className="font-serif text-xl text-navy-deep">Visits by month</h2>
        <ul className="mt-4 max-w-xl space-y-2" role="img" aria-label="Page views per month">
          {stats.months.map((m) => (
            <li key={m.month}>
              <button
                type="button"
                onClick={() => onMonthChange(m.month)}
                aria-current={m.month === stats.month ? "true" : undefined}
                className={`w-full text-left text-sm rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] ${
                  m.month === stats.month ? "font-medium" : ""
                }`}
              >
                <span className="flex justify-between gap-4">
                  <span className={m.month === stats.month ? "text-foreground" : "text-foreground/80"}>
                    {formatMonth(m.month)}
                  </span>
                  <span className="text-muted-foreground tabular-nums">{m.count}</span>
                </span>
                <span className="mt-1 block h-1.5 rounded-full bg-muted">
                  <span
                    className="block h-1.5 rounded-full bg-primary/70"
                    style={{ width: `${Math.max(Math.round((m.count / maxMonth) * 100), 2)}%` }}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-serif text-xl text-navy-deep">
            Daily views — {formatMonth(stats.month)}
          </h2>
          <div className="flex items-center gap-2" aria-label="Change month">
            <button
              type="button"
              onClick={() => prevMonth && onMonthChange(prevMonth)}
              disabled={!prevMonth || busy}
              className="rounded-md border border-border px-2 py-1 text-sm text-foreground transition-colors hover:bg-muted/60 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
              aria-label="Previous month"
            >
              ←
            </button>
            <label className="sr-only" htmlFor="stats-month-select">
              Select month
            </label>
            <select
              id="stats-month-select"
              value={stats.month}
              onChange={(e) => onMonthChange(e.target.value)}
              disabled={busy}
              className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
            >
              {stats.months.map((m) => (
                <option key={m.month} value={m.month}>
                  {formatMonth(m.month)} ({m.count})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => nextMonth && onMonthChange(nextMonth)}
              disabled={!nextMonth || busy}
              className="rounded-md border border-border px-2 py-1 text-sm text-foreground transition-colors hover:bg-muted/60 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
              aria-label="Next month"
            >
              →
            </button>
          </div>
        </div>
        <div
          className="mt-4 flex items-end gap-1 h-40 max-w-3xl"
          role="img"
          aria-label={`Daily page views for ${formatMonth(stats.month)}`}
        >
          {stats.daily.map((day) => {
            const count = day.count ?? 0;
            const pct = Math.round((count / maxDaily) * 100);
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2 min-w-0">
                <span className="text-[10px] text-muted-foreground">{count > 0 ? count : ""}</span>
                <div
                  className="w-full rounded-t bg-primary/80"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {Number(day.date.slice(8))}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-navy-deep">
          Views per page — {formatMonth(stats.month)}
        </h2>
        {stats.by_path.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No views recorded this month.</p>
        ) : (
          <ul className="mt-4 max-w-xl space-y-2">
            {stats.by_path.map((row) => (
              <li key={row.label} className="text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-foreground">{row.label}</span>
                  <span className="text-muted-foreground tabular-nums">{row.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary/70"
                    style={{ width: `${Math.max(Math.round((row.count / maxPath) * 100), 2)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-10 md:grid-cols-2 max-w-2xl">
        <BreakdownList
          title={`Where visitors came from — ${formatMonth(stats.month)}`}
          rows={stats.by_referrer}
        />
        <BreakdownList title={`Countries — ${formatMonth(stats.month)}`} rows={stats.by_country} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-3xl text-navy-deep tabular-nums">{value}</p>
    </div>
  );
}

function BreakdownList({ title, rows }: { title: string; rows: SiteStats["by_referrer"] }) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h2 className="font-serif text-lg text-navy-deep">{title}</h2>
      <ul className="mt-3 space-y-1.5 text-sm">
        {rows.map((row) => (
          <li key={row.label} className="flex justify-between gap-4">
            <span className="text-foreground">{row.label}</span>
            <span className="text-muted-foreground tabular-nums">{row.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
