import { useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";

type Props = {
  src: string | null;
  alt: string;
  onClose: () => void;
};

export function FigureLightbox({ src, alt, onClose }: Props) {
  const open = src !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open || !src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-auto"
      onClick={onClose}
    >
      <div className="sticky top-0 z-10 flex items-center justify-end gap-2 p-3 sm:p-4">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 h-10 text-white text-sm hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ExternalLink size={16} aria-hidden="true" />
          Open original size
        </a>
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close figure"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <figure
        className="min-h-[calc(100dvh-4.5rem)] flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto w-auto object-contain rounded-sm shadow-2xl bg-white"
          style={{ maxHeight: "calc(100dvh - 6rem)" }}
        />
      </figure>
    </div>
  );
}