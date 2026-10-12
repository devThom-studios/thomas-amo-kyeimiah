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

function StatsPage() {
  const fetchStats = useServerFn(getSiteStats);
  const [passcode, setPasscode] = useState("");
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await fetchStats({ data: { passcode } });
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
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

        {stats && <StatsReport stats={stats} />}
      </section>
    </SiteLayout>
  );
}

function StatsReport({ stats }: { stats: SiteStats }) {
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count ?? 0));
  const maxPath = Math.max(1, ...stats.by_path.map((d) => d.count));

  return (
    <div className="mt-10 space-y-12">
      <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
        <StatCard label="Total page views" value={stats.total} />
        <StatCard label="Last 7 days" value={stats.last7} />
      </div>

      <section>
        <h2 className="font-serif text-xl text-navy-deep">Last 7 days</h2>
        <div className="mt-4 flex items-end gap-3 h-40 max-w-xl" role="img" aria-label="Daily page views for the last seven days">
          {stats.daily.map((day) => {
            const count = day.count ?? 0;
            const pct = Math.round((count / maxDaily) * 100);
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{count}</span>
                <div
                  className="w-full rounded-t bg-primary/80"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-navy-deep">Views per page</h2>
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
      </section>

      <div className="grid gap-10 md:grid-cols-2 max-w-2xl">
        <BreakdownList title="Where visitors came from" rows={stats.by_referrer} />
        <BreakdownList title="Countries" rows={stats.by_country} />
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
