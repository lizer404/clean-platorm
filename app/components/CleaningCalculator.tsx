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

const ROOM_OPTIONS: { value: RoomCount; label: string }[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3+" },
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h10v6H7z" />
        <circle cx="17" cy="8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "fridge",
    label: "Мойка внутри холодильника",
    price: 700,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
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
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start lg:gap-10">
      <section className="animate-fade-up space-y-7">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Калькулятор
          </p>
          <h2 className="font-[family-name:var(--font-unbounded)] text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            Соберите свою уборку
          </h2>
          <p className="max-w-xl text-base text-muted">
            Выберите тип, параметры квартиры и дополнительные услуги — итоговая
            стоимость обновится сразу.
          </p>
        </div>

        {/* Cleaning type tabs */}
        <div
          role="tablist"
          aria-label="Тип уборки"
          className="grid gap-3 sm:grid-cols-3"
        >
          {CLEANING_OPTIONS.map((option) => {
            const active = cleaningType === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCleaningType(option.id)}
                className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                  active
                    ? "border-brand bg-brand text-white shadow-[0_12px_28px_rgba(26,140,255,0.28)] scale-[1.02]"
                    : "border-line bg-panel text-foreground hover:border-brand/40 hover:bg-brand-soft/60"
                }`}
              >
                <span className="block font-[family-name:var(--font-unbounded)] text-sm font-semibold sm:text-[15px]">
                  {option.label}
                </span>
                <span
                  className={`mt-1 block text-xs sm:text-sm ${
                    active ? "text-white/80" : "text-muted"
                  }`}
                >
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>

        {/* Room & bathroom params */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
              Квартира
            </h3>
            <div className="flex gap-2">
              {ROOM_OPTIONS.map((option) => {
                const active = rooms === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRooms(option.value)}
                    className={`min-h-12 flex-1 rounded-xl border text-base font-semibold transition-all ${
                      active
                        ? "border-brand bg-brand-soft text-brand-deep shadow-sm"
                        : "border-line bg-panel text-foreground hover:border-brand/35"
                    }`}
                  >
                    {option.label}{" "}
                    <span className="font-medium text-sm opacity-70">
                      {option.value === 1 ? "комн." : "комн."}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
              Санузлы
            </h3>
            <div className="flex gap-2">
              {BATH_OPTIONS.map((option) => {
                const active = baths === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setBaths(option.value)}
                    className={`min-h-12 flex-1 rounded-xl border text-base font-semibold transition-all ${
                      active
                        ? "border-brand bg-brand-soft text-brand-deep shadow-sm"
                        : "border-line bg-panel text-foreground hover:border-brand/35"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Extras */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
            Дополнительные опции
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {EXTRAS.map((extra) => {
              const active = extras.has(extra.id);
              return (
                <button
                  key={extra.id}
                  type="button"
                  onClick={() => toggleExtra(extra.id)}
                  className={`group flex min-h-[112px] flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                    active
                      ? "border-brand bg-brand-soft shadow-[0_8px_20px_rgba(26,140,255,0.14)]"
                      : "border-line bg-panel hover:border-brand/35 hover:bg-white"
                  }`}
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      active
                        ? "bg-brand text-white"
                        : "bg-sky/50 text-brand-deep group-hover:bg-brand-soft"
                    }`}
                  >
                    {extra.icon}
                  </span>
                  <span className="mt-3 space-y-1">
                    <span className="block text-sm font-semibold leading-snug text-foreground">
                      {extra.label}
                    </span>
                    <span className="block text-xs text-muted">
                      +{formatPrice(extra.price)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="animate-fade-up space-y-5 [animation-delay:120ms] lg:sticky lg:top-8">
        <div className="overflow-hidden rounded-[28px] border border-line bg-panel/90 p-4 shadow-[0_18px_40px_rgba(15,39,68,0.06)] backdrop-blur-sm sm:p-5">
          <div className="animate-float rounded-2xl bg-gradient-to-br from-sky/70 via-white to-mint/80 p-3 sm:p-4">
            <RoomIllustration />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Чистый дом — без лишней суеты и сюрпризов в цене
          </p>
        </div>

        <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_20px_48px_rgba(15,39,68,0.08)] sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Итоговая стоимость
          </p>
          <p
            key={total}
            className="price-pop mt-2 font-[family-name:var(--font-unbounded)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            {formatPrice(total)}
          </p>
          {payment === "online" && (
            <p className="mt-2 text-sm text-success">Скидка 5% за оплату онлайн</p>
          )}

          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Способ оплаты
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_OPTIONS.map((option) => {
                const active = payment === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPayment(option.id)}
                    className={`rounded-xl border px-2 py-3 text-center transition-all ${
                      active
                        ? "border-brand bg-brand text-white shadow-sm"
                        : "border-line bg-white text-foreground hover:border-brand/40"
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wide sm:text-xs">
                      {option.label}
                    </span>
                    {option.note ? (
                      <span
                        className={`mt-0.5 block text-[10px] ${
                          active ? "text-white/80" : "text-success"
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
            className="animate-cta mt-6 flex w-full items-center justify-center rounded-2xl bg-brand-deep px-4 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-brand active:scale-[0.99] sm:text-base"
          >
            Заказать клининг
          </button>

          {ordered && (
            <p className="mt-3 text-center text-sm text-success" role="status">
              Заявка принята! Мы свяжемся с вами для подтверждения.
            </p>
          )}
        </div>
      </aside>

      {/* Mobile sticky summary */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/95 p-3 shadow-[0_-8px_30px_rgba(15,39,68,0.08)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Итого
            </p>
            <p className="truncate font-[family-name:var(--font-unbounded)] text-xl font-semibold text-foreground">
              {formatPrice(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOrdered(true)}
            className="rounded-xl bg-brand-deep px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
          >
            Заказать
          </button>
        </div>
      </div>
    </div>
  );
}
