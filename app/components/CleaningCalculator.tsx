"use client";

import { useMemo, useState, type ReactNode } from "react";
import RoomIllustration from "./RoomIllustration";

type CleaningType = "maintenance" | "general" | "afterRepair";
type RoomCount = 1 | 2 | 3;
type BathCount = 1 | 2 | 3;
type PaymentMethod = "online" | "cash" | "card";
type ExtraId =
  | "ironing"
  | "dishes"
  | "balcony"
  | "windows"
  | "oven"
  | "fridge"
  | "keys";

const CLEANING_OPTIONS: {
  id: CleaningType;
  label: string;
  hint: string;
  base: number;
}[] = [
  {
    id: "maintenance",
    label: "Поддерживающая",
    hint: "Регулярная чистота",
    base: 3500,
  },
  {
    id: "general",
    label: "Генеральная",
    hint: "Глубокая уборка",
    base: 5500,
  },
  {
    id: "afterRepair",
    label: "После ремонта",
    hint: "От пыли и следов",
    base: 8500,
  },
];

const ROOM_OPTIONS: { value: RoomCount; label: string; caption: string }[] = [
  { value: 1, label: "1", caption: "комн." },
  { value: 2, label: "2", caption: "комн." },
  { value: 3, label: "3+", caption: "комн." },
];

const BATH_OPTIONS: { value: BathCount; label: string }[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3+" },
];

const ROOM_ADDON: Record<RoomCount, number> = {
  1: 0,
  2: 1500,
  3: 3000,
};

const BATH_ADDON: Record<BathCount, number> = {
  1: 0,
  2: 800,
  3: 1600,
};

const iconClass = "h-7 w-7";

const EXTRAS: {
  id: ExtraId;
  label: string;
  price: number;
  icon: ReactNode;
}[] = [
  {
    id: "ironing",
    label: "Глажка одежды",
    price: 800,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 18h14a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6H8L4 13v5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9V6a2 2 0 0 1 2-2h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "dishes",
    label: "Помыть посуду",
    price: 400,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 10h16v2a8 8 0 0 1-16 0v-2Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 10V7m8 3V8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "balcony",
    label: "Уборка балкона",
    price: 600,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 20V10l8-6 8 6v10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "windows",
    label: "Помыть окна",
    price: 1200,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M12 4v16M4 12h16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "oven",
    label: "СВЧ / Духовка",
    price: 500,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h10v6H7z" />
        <circle cx="17" cy="8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "fridge",
    label: "Мойка холодильника",
    price: 700,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M6 11h12M9 7v2M9 14v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "keys",
    label: "Доставка ключей",
    price: 350,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="8" cy="14" r="3.5" />
        <path d="M11 12.5 20 4m-4 0h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; note: string }[] = [
  { id: "online", label: "Онлайн", note: "−5%" },
  { id: "cash", label: "Наличными", note: "" },
  { id: "card", label: "Картой", note: "" },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
}

export default function CleaningCalculator() {
  const [cleaningType, setCleaningType] = useState<CleaningType>("maintenance");
  const [rooms, setRooms] = useState<RoomCount>(1);
  const [baths, setBaths] = useState<BathCount>(1);
  const [extras, setExtras] = useState<Set<ExtraId>>(new Set());
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [ordered, setOrdered] = useState(false);

  const total = useMemo(() => {
    const base = CLEANING_OPTIONS.find((item) => item.id === cleaningType)?.base ?? 0;
    const extrasSum = EXTRAS.filter((item) => extras.has(item.id)).reduce(
      (sum, item) => sum + item.price,
      0,
    );
    const subtotal = base + ROOM_ADDON[rooms] + BATH_ADDON[baths] + extrasSum;
    return payment === "online" ? subtotal * 0.95 : subtotal;
  }, [baths, cleaningType, extras, payment, rooms]);

  function toggleExtra(id: ExtraId) {
    setOrdered(false);
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectCleaningType(id: CleaningType) {
    setOrdered(false);
    setCleaningType(id);
  }

  function selectRooms(value: RoomCount) {
    setOrdered(false);
    setRooms(value);
  }

  function selectBaths(value: BathCount) {
    setOrdered(false);
    setBaths(value);
  }

  function selectPayment(id: PaymentMethod) {
    setOrdered(false);
    setPayment(id);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-start lg:gap-7">
      <section className="animate-fade-up space-y-5">
        {/* Cleaning type — stacked on mobile, segmented on sm+ */}
        <div className="rounded-3xl bg-panel p-3 shadow-md shadow-sky/30 sm:p-4">
          <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Тип уборки
          </p>

          {/* Mobile: stacked cards */}
          <div role="tablist" aria-label="Тип уборки" className="grid gap-2.5 sm:hidden">
            {CLEANING_OPTIONS.map((option) => {
              const active = cleaningType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectCleaningType(option.id)}
                  className={`rounded-2xl px-5 py-4 text-left transition-all duration-300 ease-out ${
                    active
                      ? "bg-brand text-white shadow-md shadow-brand/35"
                      : "bg-slate-100 text-foreground active:scale-[0.99]"
                  }`}
                >
                  <span className="block text-[15px] font-semibold leading-tight">
                    {option.label}
                  </span>
                  <span
                    className={`mt-1 block text-sm ${
                      active ? "text-white/80" : "text-muted"
                    }`}
                  >
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop/tablet: segmented control */}
          <div
            role="tablist"
            aria-label="Тип уборки"
            className="hidden rounded-2xl bg-slate-100 p-1.5 sm:grid sm:grid-cols-3 sm:gap-1.5"
          >
            {CLEANING_OPTIONS.map((option) => {
              const active = cleaningType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectCleaningType(option.id)}
                  className={`rounded-xl px-4 py-4 text-center transition-all duration-300 ease-out ${
                    active
                      ? "bg-brand text-white shadow-md shadow-brand/30"
                      : "text-foreground hover:bg-white/70"
                  }`}
                >
                  <span className="block text-sm font-semibold leading-tight lg:text-[15px]">
                    {option.label}
                  </span>
                  <span
                    className={`mt-1 block text-xs lg:text-sm ${
                      active ? "text-white/80" : "text-muted"
                    }`}
                  >
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rooms & bathrooms — large tiles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-panel p-4 shadow-md shadow-sky/30 sm:p-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Квартира
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {ROOM_OPTIONS.map((option) => {
                const active = rooms === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectRooms(option.value)}
                    className={`flex aspect-square flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out ${
                      active
                        ? "bg-brand text-white shadow-md shadow-brand/35 scale-[1.02]"
                        : "bg-slate-100 text-foreground hover:bg-slate-200/80 active:scale-[0.98]"
                    }`}
                  >
                    <span className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-none sm:text-3xl">
                      {option.label}
                    </span>
                    <span
                      className={`mt-1.5 text-[11px] font-medium sm:text-xs ${
                        active ? "text-white/75" : "text-muted"
                      }`}
                    >
                      {option.caption}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-panel p-4 shadow-md shadow-sky/30 sm:p-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Санузлы
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {BATH_OPTIONS.map((option) => {
                const active = baths === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectBaths(option.value)}
                    className={`flex aspect-square items-center justify-center rounded-2xl transition-all duration-300 ease-out ${
                      active
                        ? "bg-brand text-white shadow-md shadow-brand/35 scale-[1.02]"
                        : "bg-slate-100 text-foreground hover:bg-slate-200/80 active:scale-[0.98]"
                    }`}
                  >
                    <span className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-none sm:text-3xl">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Extras — always 2 cols on mobile */}
        <div className="rounded-3xl bg-panel p-4 shadow-md shadow-sky/30 sm:p-5">
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Дополнительные опции
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {EXTRAS.map((extra) => {
              const active = extras.has(extra.id);
              return (
                <button
                  key={extra.id}
                  type="button"
                  onClick={() => toggleExtra(extra.id)}
                  className={`group flex min-h-[128px] flex-col items-start justify-between rounded-2xl p-4 text-left transition-all duration-300 ease-out ${
                    active
                      ? "bg-brand text-white shadow-md shadow-brand/30 scale-[1.01]"
                      : "bg-slate-100 text-foreground hover:bg-slate-200/70 active:scale-[0.99]"
                  }`}
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white text-brand-deep shadow-sm"
                    }`}
                  >
                    {extra.icon}
                  </span>
                  <span className="mt-3 space-y-1">
                    <span className="block text-[13px] font-semibold leading-snug sm:text-sm">
                      {extra.label}
                    </span>
                    <span
                      className={`block text-xs font-medium transition-colors duration-300 ${
                        active ? "text-white/85" : "text-muted"
                      }`}
                    >
                      +{formatPrice(extra.price)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="animate-fade-up space-y-4 [animation-delay:100ms] lg:sticky lg:top-6">
        <div className="overflow-hidden rounded-3xl bg-panel p-4 shadow-md shadow-sky/30 sm:p-5">
          <div className="animate-float rounded-2xl bg-gradient-to-br from-sky/60 via-white to-mint/70 p-2 sm:p-3">
            <RoomIllustration />
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            Чистый дом — без сюрпризов в цене
          </p>
        </div>

        <div className="rounded-3xl bg-panel p-5 shadow-md shadow-sky/35 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Итоговая стоимость
          </p>
          <p
            key={total}
            className="price-pop mt-2 font-[family-name:var(--font-unbounded)] text-[2.35rem] font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            {formatPrice(total)}
          </p>
          {payment === "online" && (
            <p className="mt-2 text-sm font-medium text-success">
              Скидка 5% за оплату онлайн
            </p>
          )}

          <div className="mt-5 space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Способ оплаты
            </p>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
              {PAYMENT_OPTIONS.map((option) => {
                const active = payment === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectPayment(option.id)}
                    className={`rounded-xl px-2 py-3.5 text-center transition-all duration-300 ${
                      active
                        ? "bg-brand text-white shadow-md shadow-brand/30"
                        : "text-foreground hover:bg-white/80"
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wide sm:text-xs">
                      {option.label}
                    </span>
                    {option.note ? (
                      <span
                        className={`mt-0.5 block text-[10px] font-semibold ${
                          active ? "text-white/85" : "text-success"
                        }`}
                      >
                        {option.note}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOrdered(true)}
            className="animate-cta mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-brand-deep px-4 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-brand active:scale-[0.99] sm:text-base"
          >
            Заказать клининг
          </button>

          {ordered && (
            <p className="mt-3 text-center text-sm font-medium text-success" role="status">
              Заявка принята! Мы свяжемся с вами для подтверждения.
            </p>
          )}
        </div>
      </aside>

      {/* Mobile sticky summary */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-panel/95 px-4 py-3.5 shadow-[0_-10px_30px_rgba(15,39,68,0.1)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Итого
            </p>
            <p
              key={total}
              className="price-pop truncate font-[family-name:var(--font-unbounded)] text-xl font-semibold text-foreground"
            >
              {formatPrice(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOrdered(true)}
            className="rounded-2xl bg-brand-deep px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-brand/30"
          >
            Заказать
          </button>
        </div>
      </div>
    </div>
  );
}
