import { useMemo } from "react";

export type WeatherFamily =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

/**
 * Condition-aware ambient decoration for the weather widget.
 * Purely decorative: aria-hidden, pointer-events-none, non-interactive.
 * Sits behind the widget contents so data is never obscured.
 * Motion is disabled globally via prefers-reduced-motion in styles.css.
 */
export function WeatherAmbient({
  family,
  isDay = true,
  reducedOnMobile = true,
}: {
  family: WeatherFamily;
  isDay?: boolean;
  reducedOnMobile?: boolean;
}) {
  const rainStreaks = useMemo(
    () => Array.from({ length: 18 }, (_, i) => i),
    []
  );
  const snowFlakes = useMemo(
    () => Array.from({ length: 14 }, (_, i) => i),
    []
  );

  const mobileGate = reducedOnMobile ? "hidden sm:block" : "block";

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-md"
    >
      {family === "clear" && isDay && (
        <div
          className="wx-sun-glow absolute -top-16 -right-16 h-56 w-56 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,214,120,0.55) 0%, rgba(255,214,120,0) 70%)",
          }}
        />
      )}
      {family === "clear" && !isDay && (
        <div
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-2xl opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(180,205,255,0.55) 0%, rgba(180,205,255,0) 70%)",
          }}
        />
      )}

      {(family === "cloudy" || family === "partly" || family === "fog") && (
        <>
          <div
            className={`wx-cloud-a absolute top-6 h-16 w-40 rounded-full blur-2xl opacity-40 ${mobileGate}`}
            style={{ background: "rgba(200,215,235,0.9)" }}
          />
          <div
            className={`wx-cloud-b absolute top-20 h-12 w-56 rounded-full blur-2xl opacity-30 ${mobileGate}`}
            style={{ background: "rgba(210,220,235,0.9)" }}
          />
        </>
      )}

      {(family === "rain" || family === "drizzle") && (
        <div className={`absolute inset-0 opacity-40 ${mobileGate}`}>
          {rainStreaks.map((i) => (
            <span
              key={i}
              className="wx-rain absolute top-0 block w-px bg-sky-400/70"
              style={{
                left: `${(i * 5.7) % 100}%`,
                height: family === "drizzle" ? "10px" : "16px",
                animationDelay: `${(i % 7) * 0.15}s`,
                animationDuration: family === "drizzle" ? "1.6s" : "1.1s",
              }}
            />
          ))}
        </div>
      )}

      {family === "snow" && (
        <div className={`absolute inset-0 opacity-70 ${mobileGate}`}>
          {snowFlakes.map((i) => (
            <span
              key={i}
              className="wx-snow absolute top-0 block rounded-full bg-white"
              style={{
                left: `${(i * 7.3) % 100}%`,
                width: "3px",
                height: "3px",
                animationDelay: `${(i % 9) * 0.7}s`,
                animationDuration: `${8 + (i % 5)}s`,
                filter: "blur(0.3px)",
              }}
            />
          ))}
        </div>
      )}

      {family === "storm" && (
        <>
          <div className={`absolute inset-0 opacity-40 ${mobileGate}`}>
            {rainStreaks.map((i) => (
              <span
                key={i}
                className="wx-rain absolute top-0 block w-px bg-slate-300/70"
                style={{
                  left: `${(i * 5.7) % 100}%`,
                  height: "18px",
                  animationDelay: `${(i % 7) * 0.12}s`,
                  animationDuration: "0.9s",
                }}
              />
            ))}
          </div>
          <div
            className="wx-flash absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 45%)",
            }}
          />
        </>
      )}
    </div>
  );
}