"use client";

import { useMemo, useState } from "react";
import {
  getClientSlotsForCleaner,
  TRAVEL_BUFFER_HOURS,
  type ClientSlot,
} from "../lib/schedule";

type Slot = {
  id: string;
  label: string;
};

type CleanerCalendarProps = {
  cleanerName: string;
  cleanerInitials: string;
  cleanerAccent: string;
  slots: Slot[];
  onClose: () => void;
  onSelectSlot: (slot: Slot) => void;
};

export default function CleanerCalendar({
  cleanerName,
  cleanerInitials,
  cleanerAccent,
  slots,
  onClose,
  onSelectSlot,
}: CleanerCalendarProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => slots.find((slot) => slot.id === selectedId) ?? null,
    [selectedId, slots],
  );

  return (
    <div className="animate-sheet rounded-3xl bg-panel p-5 shadow-[0_16px_40px_rgba(17,24,39,0.08)] ring-1 ring-line/80 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white"
            style={{ backgroundColor: cleanerAccent }}
          >
            {cleanerInitials}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Календарь клинера
            </p>
            <h3 className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-foreground">
              {cleanerName}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-plaque px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-foreground"
        >
          Закрыть
        </button>
      </div>

      <p className="mt-3 text-sm text-muted">
        Выберите свободный слот. Учтён буфер на дорогу {TRAVEL_BUFFER_HOURS} ч —
        старт уборки не раньше, чем через час после начала окна клинера.
      </p>

      {slots.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-plaque px-4 py-6 text-center text-sm text-muted">
          Нет доступных слотов с учётом буфера на дорогу.
        </p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {slots.map((slot) => {
            const active = selectedId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedId(slot.id)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "bg-plaque text-foreground hover:bg-line"
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onSelectSlot(selected)}
        className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-mint px-4 py-3.5 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {selected ? `Забронировать · ${selected.label}` : "Выберите слот"}
      </button>
    </div>
  );
}

/** Builds client bookable slots from cleaner schedule (− travel buffer). */
export function buildMockSlots(cleanerId: string): ClientSlot[] {
  return getClientSlotsForCleaner(cleanerId);
}
