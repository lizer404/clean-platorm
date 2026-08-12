"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type CleaningType = "maintenance" | "general" | "afterRepair";
type ExtraId =
  | "fridge"
  | "oven"
  | "microwave"
  | "ironing"
  | "dishes"
  | "balcony"
  | "windows"
  | "keys";

const CLEANING_OPTIONS: { id: CleaningType; label: string; base: number }[] = [
  { id: "maintenance", label: "Поддерживающая", base: 45 },
  { id: "general", label: "Генеральная", base: 75 },
  { id: "afterRepair", label: "После ремонта", base: 110 },
];

const EXTRAS: { id: ExtraId; label: string; price: number; icon: ReactNode }[] = [
  {
    id: "fridge",
    label: "Холодильник",
    price: 15,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M6 11h12M9 7v2M9 14v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "oven",
    label: "Духовка",
    price: 12,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h10v6H7z" />
      </svg>
    ),
  },
  {
    id: "microwave",
    label: "Микроволновка",
    price: 8,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h8v4H6zM18 10v.01M18 14v.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "ironing",
    label: "Глажка одежды",
    price: 18,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 18h14a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6H8L4 13v5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9V6a2 2 0 0 1 2-2h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "dishes",
    label: "Помыть посуду",
    price: 10,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 10h16v2a8 8 0 0 1-16 0v-2Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 10V7m8 3V8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "balcony",
    label: "Уборка балкона",
    price: 14,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 20V10l8-6 8 6v10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "windows",
    label: "Помыть окна",
    price: 20,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M12 4v16M4 12h16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "keys",
    label: "Доставка ключей",
    price: 7,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="14" r="3.5" />
        <path d="M11 12.5 20 4m-4 0h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const AREA_MIN = 20;
const AREA_MAX = 200;
const AREA_BASE = 40;

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function ChevronDown({ open }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ open }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-muted transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepperButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl font-medium text-foreground shadow-sm transition active:scale-95 disabled:opacity-35"
    >
      {label === "minus" ? "−" : "+"}
    </button>
  );
}

export default function CleaningCalculator() {
  const [cleaningType, setCleaningType] = useState<CleaningType>("maintenance");
  const [rooms, setRooms] = useState(1);
  const [baths, setBaths] = useState(1);
  const [area, setArea] = useState(AREA_BASE);
  const [areaInput, setAreaInput] = useState(String(AREA_BASE));
  const [extras, setExtras] = useState<Set<ExtraId>>(new Set());
  const [typeOpen, setTypeOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);

  const selectedType = CLEANING_OPTIONS.find((item) => item.id === cleaningType)!;

  const selectedExtras = EXTRAS.filter((item) => extras.has(item.id));

  const total = useMemo(() => {
    const base = selectedType.base;
    const roomFee = (rooms - 1) * 12;
    const bathFee = (baths - 1) * 8;
    const areaFee = Math.max(0, area - AREA_BASE) * 0.9;
    const extrasSum = EXTRAS.filter((item) => extras.has(item.id)).reduce(
      (sum, item) => sum + item.price,
      0,
    );
    return base + roomFee + bathFee + areaFee + extrasSum;
  }, [area, baths, extras, rooms, selectedType.base]);

  const areaProgress = ((area - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100;

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!typeRef.current?.contains(event.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function clampArea(value: number) {
    return Math.min(AREA_MAX, Math.max(AREA_MIN, value));
  }

  function updateArea(value: number) {
    const next = clampArea(Math.round(value));
    setArea(next);
    setAreaInput(String(next));
    setOrdered(false);
  }

  function onAreaInputChange(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    setAreaInput(digits);
    if (!digits) return;
    const parsed = Number(digits);
    if (!Number.isNaN(parsed)) {
      setArea(clampArea(parsed));
      setOrdered(false);
    }
  }

  function onAreaInputBlur() {
    updateArea(Number(areaInput) || AREA_BASE);
  }

  function toggleExtra(id: ExtraId) {
    setOrdered(false);
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const extrasSummary =
    selectedExtras.length === 0
      ? "Ничего не выбрано"
      : selectedExtras.map((item) => item.label).join(", ");

  return (
    <div className="w-full rounded-3xl bg-panel p-4 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-5">
      <div className="space-y-3">
        {/* 1. Cleaning type dropdown */}
        <div ref={typeRef} className="relative">
          <button
            type="button"
            onClick={() => setTypeOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-2xl bg-plaque px-4 py-3.5 text-left transition active:scale-[0.995]"
          >
            <span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                Тип уборки
              </span>
              <span className="mt-1 block text-lg font-semibold leading-tight text-foreground">
                {selectedType.label}
              </span>
            </span>
            <span className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <ChevronDown open={typeOpen} />
            </span>
          </button>

          {typeOpen && (
            <div className="animate-sheet absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_rgba(17,24,39,0.14)] ring-1 ring-black/5">
              {CLEANING_OPTIONS.map((option) => {
                const active = option.id === cleaningType;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setCleaningType(option.id);
                      setTypeOpen(false);
                      setOrdered(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-[15px] font-medium transition ${
                      active
                        ? "bg-brand-soft text-brand"
                        : "text-foreground hover:bg-plaque"
                    }`}
                  >
                    {option.label}
                    {active ? (
                      <span className="text-brand">✓</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Rooms & bathrooms */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-plaque px-3 py-3.5">
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Комнаты
            </p>
            <div className="mt-3 flex items-center justify-between gap-1">
              <StepperButton
                label="minus"
                disabled={rooms <= 1}
                onClick={() => {
                  setRooms((value) => Math.max(1, value - 1));
                  setOrdered(false);
                }}
              />
              <span className="min-w-8 text-center text-2xl font-semibold tabular-nums text-foreground">
                {rooms}
              </span>
              <StepperButton
                label="plus"
                disabled={rooms >= 6}
                onClick={() => {
                  setRooms((value) => Math.min(6, value + 1));
                  setOrdered(false);
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-plaque px-3 py-3.5">
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Санузлы
            </p>
            <div className="mt-3 flex items-center justify-between gap-1">
              <StepperButton
                label="minus"
                disabled={baths <= 1}
                onClick={() => {
                  setBaths((value) => Math.max(1, value - 1));
                  setOrdered(false);
                }}
              />
              <span className="min-w-8 text-center text-2xl font-semibold tabular-nums text-foreground">
                {baths}
              </span>
              <StepperButton
                label="plus"
                disabled={baths >= 4}
                onClick={() => {
                  setBaths((value) => Math.min(4, value + 1));
                  setOrdered(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. Area */}
        <div className="rounded-2xl bg-plaque px-3.5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Площадь
            </span>
            <div className="min-w-0 flex-1 px-1">
              <input
                type="range"
                min={AREA_MIN}
                max={AREA_MAX}
                value={area}
                onChange={(event) => updateArea(Number(event.target.value))}
                className="area-slider"
                style={{ ["--progress" as string]: `${areaProgress}%` }}
                aria-label="Площадь помещения"
              />
            </div>
            <label className="relative shrink-0">
              <input
                type="text"
                inputMode="numeric"
                value={areaInput}
                onChange={(event) => onAreaInputChange(event.target.value)}
                onBlur={onAreaInputBlur}
                className="w-[4.6rem] rounded-xl border-0 bg-white py-2 pl-2.5 pr-8 text-center text-sm font-semibold text-foreground shadow-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-mint/50"
                aria-label="Площадь в квадратных метрах"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted">
                м²
              </span>
            </label>
          </div>
        </div>

        {/* 4. Extra services */}
        <div>
          <button
            type="button"
            onClick={() => setExtrasOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-2xl bg-plaque px-4 py-3.5 text-left transition active:scale-[0.995]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <rect x="3" y="3" width="8" height="8" rx="2" />
                <rect x="13" y="3" width="8" height="8" rx="2" />
                <rect x="3" y="13" width="8" height="8" rx="2" />
                <rect x="13" y="13" width="8" height="8" rx="2" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                Доп. услуги
              </span>
              <span className="mt-0.5 block truncate text-[15px] font-medium text-foreground">
                {extrasSummary}
              </span>
            </span>
            <ChevronRight open={extrasOpen} />
          </button>

          {extrasOpen && (
            <div className="animate-sheet mt-3 rounded-2xl bg-plaque p-3">
              <div className="grid grid-cols-2 gap-2.5">
                {EXTRAS.map((extra) => {
                  const active = extras.has(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra.id)}
                      className={`relative flex min-h-[112px] flex-col items-start justify-between rounded-2xl p-3.5 text-left transition-all duration-200 ${
                        active
                          ? "bg-white shadow-md ring-2 ring-mint"
                          : "bg-white/80 shadow-sm hover:bg-white"
                      }`}
                    >
                      <span className="text-brand">{extra.icon}</span>
                      <span>
                        <span className="block text-[13px] font-semibold leading-snug text-foreground">
                          {extra.label}
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          +{formatPrice(extra.price)} BYN
                        </span>
                      </span>
                      <span
                        className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-lg font-medium transition ${
                          active
                            ? "bg-mint text-white"
                            : "bg-plaque text-muted"
                        }`}
                      >
                        {active ? "✓" : "+"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Total + CTA */}
        <div className="pt-2">
          <p className="text-[12px] font-medium text-muted">Примерная стоимость</p>
          <p
            key={total}
            className="price-pop mt-1 font-[family-name:var(--font-unbounded)] text-[2.35rem] font-semibold leading-none tracking-tight text-foreground"
          >
            {formatPrice(total)}{" "}
            <span className="text-[1.35rem] font-semibold tracking-normal">BYN</span>
          </p>

          <button
            type="button"
            onClick={() => setOrdered(true)}
            className="mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em] text-white shadow-[0_12px_28px_rgba(30,58,138,0.28)] transition hover:bg-brand-deep active:scale-[0.99]"
          >
            Перейти к заказу
            <span aria-hidden="true">→</span>
          </button>

          {ordered && (
            <p className="mt-3 text-center text-sm font-medium text-success" role="status">
              Заявка принята! Мы свяжемся с вами для подтверждения.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
