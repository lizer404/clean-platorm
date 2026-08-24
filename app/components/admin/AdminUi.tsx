"use client";

import { useEffect, type ReactNode } from "react";

/** Centered on desktop, full-screen on <768px — critical for keyboard-safe chats. */
export function AdminModal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex md:items-center md:justify-center md:bg-slate-900/45 md:p-4 md:backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 hidden md:block"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex h-full w-full flex-col bg-white md:h-auto md:max-h-[88vh] md:rounded-3xl md:shadow-2xl ${
          wide ? "md:max-w-2xl" : "md:max-w-lg"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-5 md:py-4">
          <h3 className="min-w-0 truncate font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900 md:text-lg">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-bold leading-none text-slate-700 md:h-9 md:w-9 md:text-lg"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function FieldRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="text-sm font-medium text-slate-800 sm:text-right">
        {children}
      </div>
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "bad" | "neutral";
  children: ReactNode;
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700"
        : tone === "bad"
          ? "bg-rose-50 text-rose-700"
          : "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${cls}`}>
      {children}
    </span>
  );
}
