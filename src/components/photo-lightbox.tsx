import { useCallback, useEffect, useRef } from "react";
import type { NainPhoto } from "@/data/nain-fieldwork";

type Props = {
  photos: NainPhoto[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export function PhotoLightbox({ photos, index, onClose, onIndexChange }: Props) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);

  const next = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % photos.length);
  }, [index, onIndexChange, photos.length]);

  const prev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + photos.length) % photos.length);
  }, [index, onIndexChange, photos.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev, onClose]);

  if (!open || index === null) return null;
  const photo = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}: ${photo.alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/10 text-white text-xl leading-none hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close"
      >
        ×
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous photo"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next photo"
      >
        ›
      </button>
      <figure
        className="max-h-full max-w-6xl w-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-sm shadow-2xl"
        />
        <figcaption className="text-center text-sm text-white/85 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-white/60 mr-2">
            {index + 1} / {photos.length}
          </span>
          {photo.caption}
        </figcaption>
      </figure>
    </div>
  );
}