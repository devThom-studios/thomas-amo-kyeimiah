import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  // Fetch forecast whenever location changes
  useEffect(() => {
    const id = ++forecastReqId.current;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(location.latitude));
    url.searchParams.set("longitude", String(location.longitude));
    url.searchParams.set(
      "current",
      "temperature_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m"
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

    fetch(url.toString(), { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Weather service unavailable");
        return r.json();
      })
      .then((data: Forecast) => {
        if (id !== forecastReqId.current) return;
        setForecast(data);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (id !== forecastReqId.current) return;
        if ((e as { name?: string })?.name === "AbortError") return;
        setError("Could not load the forecast. Please try again.");
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [location]);

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

  const updatedLabel = useMemo(() => {
    if (!forecast) return "";
    try {
      const d = new Date(forecast.current.time);
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
        timeZone: forecast.timezone,
      }).format(d);
    } catch {
      return forecast.current.time;
    }
  }, [forecast]);

  return (
    <div
      ref={rootRef}
      className="border border-border rounded-md bg-card p-6 md:p-8"
      aria-labelledby="weather-widget-title"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
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
              Updated {updatedLabel} · {forecast.timezone}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={geoBusy}
          className="text-sm rounded-md border border-border px-3 py-2 hover:border-navy-deep transition-colors disabled:opacity-60"
        >
          {geoBusy ? "Locating…" : "Use my location"}
        </button>
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
        {loading && (
          <p className="text-sm text-muted-foreground">Loading forecast…</p>
        )}
        {!loading && error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && forecast && (
          <div className="grid gap-6 md:grid-cols-[auto_1fr] items-start">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-serif text-navy-deep">
                  {Math.round(forecast.current.temperature_2m)}°
                </span>
                <span className="text-sm text-muted-foreground">C</span>
              </div>
              <p className="mt-1 text-sm text-foreground/85">
                {describe(forecast.current.weather_code)}
              </p>
              <p className="text-xs text-muted-foreground">
                Feels like {Math.round(forecast.current.apparent_temperature)}°C
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">
                  Wind
                </dt>
                <dd>{Math.round(forecast.current.wind_speed_10m)} km/h</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">
                  Precipitation
                </dt>
                <dd>{forecast.current.precipitation} mm</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* 5-day */}
      {!loading && !error && forecast && (
        <div className="mt-8">
          <p className="eyebrow">Next 5 days</p>
          <ol className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {forecast.daily.time.map((day, i) => {
              const d = new Date(day);
              const label = new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                timeZone: forecast.timezone,
              }).format(d);
              return (
                <li
                  key={day}
                  className="border border-border rounded-md p-3 bg-background/60"
                >
                  <p className="text-xs font-medium text-navy-deep">{label}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-snug">
                    {describe(forecast.daily.weather_code[i])}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="text-navy-deep font-medium">
                      {Math.round(forecast.daily.temperature_2m_max[i])}°
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {Math.round(forecast.daily.temperature_2m_min[i])}°
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {forecast.daily.precipitation_probability_max[i] ?? 0}% precip
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