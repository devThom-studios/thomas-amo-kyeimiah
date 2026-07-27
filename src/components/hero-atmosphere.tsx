import { useEffect, useRef } from "react";

/**
 * Slow atmospheric contour / cloud drift over the Home hero image.
 * Pure inline SVG + CSS animation. Adds a *very* gentle pointer parallax
 * on capable pointer-fine, hover-capable devices only.
 *
 * Fully decorative — aria-hidden, pointer-events-none — never obscures text.
 */
export function HeroAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const capable =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !capable) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const state = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      tx = nx;
      ty = ny;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      state.x += (tx - state.x) * 0.08;
      state.y += (ty - state.y) * 0.08;
      el.style.setProperty("--px", `${state.x * 8}px`);
      el.style.setProperty("--py", `${state.y * 6}px`);
      if (Math.abs(tx - state.x) > 0.001 || Math.abs(ty - state.y) > 0.001) {
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        transform: "translate3d(var(--px, 0px), var(--py, 0px), 0)",
        transition: "transform 200ms linear",
      }}
    >
      {/* Contour lines — slow horizontal drift */}
      <svg
        className="atmos-layer-a absolute -inset-x-10 inset-y-0 w-[120%] h-full opacity-[0.22] mix-blend-screen"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contourStroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(190,220,255,0)" />
            <stop offset="50%" stopColor="rgba(200,230,255,0.9)" />
            <stop offset="100%" stopColor="rgba(190,220,255,0)" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#contourStroke)" strokeWidth="1">
          <path d="M-50 120 Q 300 80 600 130 T 1250 110" />
          <path d="M-50 190 Q 300 150 600 205 T 1250 180" />
          <path d="M-50 265 Q 320 220 620 285 T 1250 255" />
          <path d="M-50 345 Q 300 300 620 365 T 1250 335" />
          <path d="M-50 430 Q 320 390 620 450 T 1250 420" />
          <path d="M-50 510 Q 320 470 620 530 T 1250 500" />
        </g>
      </svg>
      {/* Translucent cloud layer — opposite slow drift */}
      <svg
        className="atmos-layer-b absolute -inset-x-16 inset-y-0 w-[130%] h-full opacity-[0.14] mix-blend-screen"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="cloudA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="240" cy="180" rx="260" ry="70" fill="url(#cloudA)" />
        <ellipse cx="720" cy="240" rx="320" ry="80" fill="url(#cloudA)" />
        <ellipse cx="1020" cy="140" rx="220" ry="60" fill="url(#cloudA)" />
        <ellipse cx="480" cy="420" rx="300" ry="70" fill="url(#cloudA)" />
      </svg>
    </div>
  );
}