import { useEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from "react";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delayMs?: number;
  id?: string;
};

/**
 * Fades and lifts children in when they enter the viewport.
 * Content is fully rendered on the server / when JS is disabled — the
 * initial hidden state is applied via the `.reveal` utility only after
 * we detect IntersectionObserver support, so no-JS users see everything.
 */
export function Reveal({ as, children, className = "", delayMs = 0, id }: Props) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-visible", "true");
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.setAttribute("data-visible", "true");
      return;
    }
    el.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).setAttribute("data-visible", "true");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties | undefined =
    delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined;

  return (
    <Tag ref={ref as never} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}