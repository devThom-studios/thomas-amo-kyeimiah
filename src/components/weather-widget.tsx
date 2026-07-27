import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { WeatherAmbient } from "@/components/weather-ambient";

type GeoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

type Location = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

type Forecast = {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    precipitation: number;
    wind_speed_10m: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

const MONTREAL: Location = {
  name: "Montreal",
  admin1: "Quebec",
  country: "Canada",
  latitude: 45.5017,
  longitude: -73.5673,
  timezone: "America/Toronto",
};

// WMO Weather interpretation codes
// https://open-meteo.com/en/docs
const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ slight hail",
  99: "Thunderstorm w/ heavy hail",
};

function describe(code: number) {
  return WMO[code] ?? "—";
}

// Map WMO weather codes to Lucide icons + a tasteful accent color token.
type Family = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

function family(code: number): Family {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

function iconFor(code: number, isDay = true): LucideIcon {
  switch (family(code)) {
    case "clear":
      return isDay ? Sun : Moon;
    case "partly":
      return isDay ? CloudSun : CloudMoon;
    case "cloudy":
      return Cloudy;
    case "fog":
      return CloudFog;
    case "drizzle":
      return CloudDrizzle;
    case "rain":
      return CloudRain;
    case "snow":
      return CloudSnow;
    case "storm":
      return CloudLightning;
    default:
      return Cloud;
  }
}

// Semantic accent per condition family, tuned to the site's blue palette.
const ACCENT: Record<Family, { fg: string; bg: string; ring: string }> = {
  clear:   { fg: "text-amber-600",   bg: "bg-amber-100/70",  ring: "ring-amber-200" },
  partly:  { fg: "text-sky-600",     bg: "bg-sky-100/70",    ring: "ring-sky-200" },
  cloudy:  { fg: "text-slate-600",   bg: "bg-slate-100",     ring: "ring-slate-200" },
  fog:     { fg: "text-slate-500",   bg: "bg-slate-100",     ring: "ring-slate-200" },
  drizzle: { fg: "text-sky-700",     bg: "bg-sky-100",       ring: "ring-sky-200" },
  rain:    { fg: "text-blue-700",    bg: "bg-blue-100",      ring: "ring-blue-200" },
  snow:    { fg: "text-cyan-600",    bg: "bg-cyan-100/70",   ring: "ring-cyan-200" },
  storm:   { fg: "text-violet-700",  bg: "bg-violet-100/70", ring: "ring-violet-200" },
};

// Parse an Open-Meteo local wall-clock time string ("YYYY-MM-DDTHH:mm" or
// "YYYY-MM-DD") without applying the browser's timezone. Returns a Date built
// via Date.UTC so downstream Intl formatting with timeZone: "UTC" yields the
// same wall-clock values the API already localised.
function parseWallClock(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!m) return null;
  const [, y, mo, d, h = "0", mi = "0"] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi));
}

function formatWallClockTime(iso: string): string {
  const d = parseWallClock(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(d);
}

function formatWallClockWeekday(iso: string): string {
  const d = parseWallClock(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(d);
}

function formatLocation(l: Location | GeoResult) {
  return [l.name, "admin1" in l ? l.admin1 : undefined, l.country]
    .filter(Boolean)
    .join(", ");
}

export function WeatherWidget() {
  const [location, setLocation] = useState<Location>(MONTREAL);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessAt, setLastSuccessAt] = useState<Date | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [openResults, setOpenResults] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [geoBusy, setGeoBusy] = useState(false);

  const forecastReqId = useRef(0);
  const searchReqId = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const forecastCtrl = useRef<AbortController | null>(null);

  const fetchForecast = useCallback(
    (loc: Location) => {
      const id = ++forecastReqId.current;
      forecastCtrl.current?.abort();
      const ctrl = new AbortController();
      forecastCtrl.current = ctrl;
      setLoading(true);
      setError(null);

      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(loc.latitude));
      url.searchParams.set("longitude", String(loc.longitude));
      url.searchParams.set(
        "current",
        "temperature_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m,is_day"
      );
      url.searchParams.set(
        "daily",
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
      );
      url.searchParams.set("temperature_unit", "celsius");
      url.searchParams.set("wind_speed_unit", "kmh");
      url.searchParams.set("precipitation_unit", "mm");
      url.searchParams.set("timezone", "auto");
      url.searchParams.set("forecast_days", "5");
      // Cache-buster so revalidation never returns a stale intermediary copy.
      url.searchParams.set("_", String(Date.now()));

      fetch(url.toString(), { signal: ctrl.signal, cache: "no-store" })
        .then((r) => {
          if (!r.ok) throw new Error("Weather service unavailable");
          return r.json();
        })
        .then((data: Forecast) => {
          if (id !== forecastReqId.current) return;
          setForecast(data);
          setLastSuccessAt(new Date());
          setLoading(false);
        })
        .catch((e: unknown) => {
          if (id !== forecastReqId.current) return;
          if ((e as { name?: string })?.name === "AbortError") return;
          setError("Could not load the forecast. Please try again.");
          setLoading(false);
        });
    },
    []
  );

  // Fetch on location change.
  useEffect(() => {
    fetchForecast(location);
    return () => forecastCtrl.current?.abort();
  }, [location, fetchForecast]);

  // Auto-refresh every 12 minutes; refresh on tab re-visibility if stale (>10 min).
  useEffect(() => {
    const INTERVAL = 12 * 60 * 1000;
    const STALE = 10 * 60 * 1000;
    const timer = window.setInterval(() => fetchForecast(location), INTERVAL);
    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      const age = lastSuccessAt ? Date.now() - lastSuccessAt.getTime() : Infinity;
      if (age > STALE) fetchForecast(location);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [location, lastSuccessAt, fetchForecast]);

  // Debounced city search
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      setSearchError(null);
      setSearching(false);
      return;
    }
    const id = ++searchReqId.current;
    const ctrl = new AbortController();
    setSearching(true);
    setSearchError(null);

    const timer = window.setTimeout(() => {
      const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
      url.searchParams.set("name", q);
      url.searchParams.set("count", "8");
      url.searchParams.set("language", "en");
      url.searchParams.set("format", "json");

      fetch(url.toString(), { signal: ctrl.signal })
        .then((r) => {
          if (!r.ok) throw new Error("Search failed");
          return r.json();
        })
        .then((data: { results?: GeoResult[] }) => {
          if (id !== searchReqId.current) return;
          setResults(data.results ?? []);
          setActiveIdx(-1);
          setSearching(false);
        })
        .catch((e: unknown) => {
          if (id !== searchReqId.current) return;
          if ((e as { name?: string })?.name === "AbortError") return;
          setSearchError("Search unavailable. Please try again.");
          setSearching(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  // Close results on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpenResults(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = useCallback((g: GeoResult) => {
    setLocation({
      name: g.name,
      admin1: g.admin1,
      country: g.country,
      latitude: g.latitude,
      longitude: g.longitude,
      timezone: g.timezone,
    });
    setQuery("");
    setResults(null);
    setOpenResults(false);
    setActiveIdx(-1);
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      setOpenResults(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0) {
        e.preventDefault();
        pick(results[activeIdx]);
      }
    } else if (e.key === "Escape") {
      setOpenResults(false);
    }
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setGeoBusy(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
          url.searchParams.set("latitude", String(pos.coords.latitude));
          url.searchParams.set("longitude", String(pos.coords.longitude));
          url.searchParams.set("language", "en");
          const r = await fetch(url.toString());
          const data: { results?: GeoResult[] } = r.ok ? await r.json() : { results: [] };
          const g = data.results?.[0];
          setLocation({
            name: g?.name ?? "My location",
            admin1: g?.admin1,
            country: g?.country,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timezone: g?.timezone,
          });
        } catch {
          setLocation({
            name: "My location",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        } finally {
          setGeoBusy(false);
        }
      },
      (err) => {
        setGeoBusy(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied."
            : "Could not determine your location."
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  const conditionsLabel = useMemo(
    () => (forecast ? formatWallClockTime(forecast.current.time) : ""),
    [forecast]
  );

  const lastRefreshLabel = useMemo(() => {
    if (!lastSuccessAt) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(lastSuccessAt);
  }, [lastSuccessAt]);

  const currentFamily = forecast ? family(forecast.current.weather_code) : "cloudy";
  const currentIsDay = forecast ? forecast.current.is_day === 1 : true;
  const CurrentIcon = forecast ? iconFor(forecast.current.weather_code, currentIsDay) : Cloud;
  const currentAccent = ACCENT[currentFamily];

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden border border-border rounded-md bg-card p-6 md:p-8"
      aria-labelledby="weather-widget-title"
    >
      <WeatherAmbient family={currentFamily} isDay={currentIsDay} />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Current conditions</p>
          <h3
            id="weather-widget-title"
            className="mt-2 text-2xl md:text-3xl font-serif text-navy-deep"
          >
            {formatLocation(location)}
          </h3>
          {forecast && (
            <p className="mt-1 text-xs text-muted-foreground">
              Current conditions as of {conditionsLabel} · {forecast.timezone}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchForecast(location)}
            disabled={loading}
            aria-label="Refresh current conditions"
            title={lastSuccessAt ? `Last refreshed ${lastRefreshLabel}` : "Refresh"}
            className="text-sm inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 hover:border-navy-deep transition-colors disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
              aria-hidden="true"
            />
            <span className="sr-only sm:not-sr-only">
              {loading ? "Refreshing…" : "Refresh"}
            </span>
          </button>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={geoBusy}
            className="text-sm inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 hover:border-navy-deep transition-colors disabled:opacity-60"
          >
            <MapPin size={14} aria-hidden="true" />
            {geoBusy ? "Locating…" : "Use my location"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-5 relative">
        <label htmlFor="weather-city" className="sr-only">
          Search for a city
        </label>
        <input
          id="weather-city"
          type="search"
          role="combobox"
          aria-expanded={openResults && !!results}
          aria-controls="weather-city-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIdx >= 0 ? `weather-city-opt-${activeIdx}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpenResults(true);
          }}
          onFocus={() => setOpenResults(true)}
          onKeyDown={onKeyDown}
          placeholder="Search any city worldwide…"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {openResults && query.trim().length >= 2 && (
          <div
            id="weather-city-listbox"
            role="listbox"
            className="absolute z-10 mt-1 w-full max-h-72 overflow-auto rounded-md border border-border bg-popover shadow-lg"
          >
            {searching && (
              <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
            )}
            {!searching && searchError && (
              <div className="px-3 py-2 text-sm text-destructive">{searchError}</div>
            )}
            {!searching && !searchError && results && results.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No matches found.
              </div>
            )}
            {!searching && results && results.length > 0 &&
              results.map((r, i) => (
                <button
                  key={r.id}
                  id={`weather-city-opt-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  type="button"
                  onClick={() => pick(r)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${
                    i === activeIdx ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted-foreground">
                    {r.admin1 ? `, ${r.admin1}` : ""}
                    {r.country ? `, ${r.country}` : ""}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Status region */}
      <div className="mt-6" aria-live="polite" aria-busy={loading}>
        {loading && !forecast && (
          <p className="text-sm text-muted-foreground">Loading forecast…</p>
        )}
        {!loading && error && !forecast && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {forecast && (
          <div className="grid gap-6 md:grid-cols-[auto_1fr] items-center">
            <div className="flex items-center gap-5">
              <div
                className={`shrink-0 grid place-items-center h-20 w-20 rounded-xl ring-1 ${currentAccent.bg} ${currentAccent.ring}`}
              >
                <CurrentIcon size={44} className={currentAccent.fg} aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-serif text-navy-deep leading-none">
                    {Math.round(forecast.current.temperature_2m)}°
                  </span>
                  <span className="text-sm text-muted-foreground">C</span>
                </div>
                <p className="mt-2 text-sm text-navy-deep font-medium">
                  {describe(forecast.current.weather_code)}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <MetricCard
                icon={Thermometer}
                label="Feels like"
                value={`${Math.round(forecast.current.apparent_temperature)}°C`}
              />
              <MetricCard
                icon={Wind}
                label="Wind"
                value={`${Math.round(forecast.current.wind_speed_10m)} km/h`}
              />
              <MetricCard
                icon={Droplets}
                label="Precip"
                value={`${forecast.current.precipitation} mm`}
              />
            </dl>
          </div>
        )}
        {error && forecast && (
          <p className="mt-3 text-xs text-destructive" role="alert">{error}</p>
        )}
      </div>

      {/* 5-day */}
      {forecast && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Next 5 days</p>
            {lastSuccessAt && (
              <p className="text-[11px] text-muted-foreground">
                Refreshed {lastRefreshLabel}
              </p>
            )}
          </div>
          <ol className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {forecast.daily.time.map((day, i) => {
              const label = formatWallClockWeekday(day);
              const code = forecast.daily.weather_code[i];
              const DayIcon = iconFor(code, true);
              const accent = ACCENT[family(code)];
              const precip = forecast.daily.precipitation_probability_max[i] ?? 0;
              return (
                <li
                  key={day}
                  className="border border-border rounded-md p-3 bg-card hover:border-navy-deep/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-navy-deep">{label}</p>
                    <div
                      className={`grid place-items-center h-7 w-7 rounded-md ${accent.bg}`}
                    >
                      <DayIcon size={16} className={accent.fg} aria-hidden="true" />
                    </div>
                  </div>
                  <p
                    className="mt-2 text-[11px] text-muted-foreground leading-snug line-clamp-2"
                    title={describe(code)}
                  >
                    {describe(code)}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="text-navy-deep font-semibold">
                      {Math.round(forecast.daily.temperature_2m_max[i])}°
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {" / "}
                      {Math.round(forecast.daily.temperature_2m_min[i])}°
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Droplets size={11} className="text-sky-600" aria-hidden="true" />
                    {precip}%
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <p className="mt-6 text-[11px] text-muted-foreground">
        Weather data by{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover-underline"
        >
          Open-Meteo
        </a>
        .
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon size={12} aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-navy-deep">{value}</p>
    </div>
  );
}