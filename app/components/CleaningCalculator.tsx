"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import OrderChat from "./OrderChat";

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
type SortMode = "priceAsc" | "priceDesc" | "rating" | "date";

type CleanerProfile = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  reviews: number;
  multiplier: number;
  availableInDays: number;
  accent: string;
  note: string;
};

type CleanerOffer = CleanerProfile & {
  price: number;
  availableDate: string;
};

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

const CLEANERS: CleanerProfile[] = [
  {
    id: "anna",
    name: "Анна Ковалёва",
    initials: "АК",
    rating: 4.7,
    reviews: 128,
    multiplier: 0.92,
    availableInDays: 4,
    accent: "#5B8DEF",
    note: "Выгодный тариф",
  },
  {
    id: "dmitry",
    name: "Дмитрий Орлов",
    initials: "ДО",
    rating: 4.9,
    reviews: 214,
    multiplier: 1.05,
    availableInDays: 1,
    accent: "#22A88F",
    note: "Свободен завтра",
  },
  {
    id: "elena",
    name: "Елена Мороз",
    initials: "ЕМ",
    rating: 5.0,
    reviews: 96,
    multiplier: 1.18,
    availableInDays: 2,
    accent: "#7C5CFC",
    note: "Топ рейтинг",
  },
  {
    id: "igor",
    name: "Игорь Савченко",
    initials: "ИС",
    rating: 4.8,
    reviews: 167,
    multiplier: 0.98,
    availableInDays: 3,
    accent: "#0EA5E9",
    note: "Быстрый выезд",
  },
  {
    id: "maria",
    name: "Мария Лебедева",
    initials: "МЛ",
    rating: 4.95,
    reviews: 301,
    multiplier: 1.12,
    availableInDays: 2,
    accent: "#EC4899",
    note: "Премиум-сервис",
  },
  {
    id: "pavel",
    name: "Павел Крук",
    initials: "ПК",
    rating: 4.6,
    reviews: 88,
    multiplier: 0.9,
    availableInDays: 5,
    accent: "#F59E0B",
    note: "Бюджетный вариант",
  },
  {
    id: "olga",
    name: "Ольга Новик",
    initials: "ОН",
    rating: 4.85,
    reviews: 142,
    multiplier: 1.08,
    availableInDays: 1,
    accent: "#14B8A6",
    note: "Сегодня вечером",
  },
  {
    id: "kirill",
    name: "Кирилл Жук",
    initials: "КЖ",
    rating: 4.75,
    reviews: 119,
    multiplier: 1.0,
    availableInDays: 3,
    accent: "#6366F1",
    note: "Опыт 7 лет",
  },
  {
    id: "svetlana",
    name: "Светлана Рысь",
    initials: "СР",
    rating: 4.92,
    reviews: 205,
    multiplier: 1.15,
    availableInDays: 4,
    accent: "#DB2777",
    note: "Глубокая уборка",
  },
  {
    id: "artem",
    name: "Артём Волк",
    initials: "АВ",
    rating: 4.55,
    reviews: 74,
    multiplier: 0.95,
    availableInDays: 6,
    accent: "#64748B",
    note: "Гибкий график",
  },
  {
    id: "nastya",
    name: "Настя Бондарь",
    initials: "НБ",
    rating: 4.88,
    reviews: 156,
    multiplier: 1.03,
    availableInDays: 2,
    accent: "#06B6D4",
    note: "Аккуратная команда",
  },
  {
    id: "roman",
    name: "Роман Гладкий",
    initials: "РГ",
    rating: 4.7,
    reviews: 101,
    multiplier: 1.1,
    availableInDays: 3,
    accent: "#8B5CF6",
    note: "После ремонта",
  },
];

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "priceAsc", label: "По цене (сначала дешевле)" },
  { id: "priceDesc", label: "По цене (сначала дороже)" },
  { id: "rating", label: "По рейтингу" },
  { id: "date", label: "По дате" },
];

/** Team size raises the job cost (parallel work, higher crew fee). */
function teamFactor(cleanerCount: number) {
  return 1 + (Math.max(1, cleanerCount) - 1) * 0.72;
}

const MAX_ROOMS = 16;
const MAX_BATHS = 5;
const MAX_CLEANERS = 10;

const AREA_MIN = 20;
const AREA_MAX = 200;
const AREA_BASE = 40;

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatAvailableDate(daysFromNow: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
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

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-400 text-amber-400">
      <path d="M10 1.5 12.7 7l6 .5-4.6 4 1.4 5.8L10 14.8 4.5 17.3l1.4-5.8L1.3 7.5l6-.5L10 1.5Z" />
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

function sortCleaners(list: CleanerOffer[], mode: SortMode) {
  const sorted = [...list];
  switch (mode) {
    case "priceAsc":
      return sorted.sort((a, b) => a.price - b.price || b.rating - a.rating);
    case "priceDesc":
      return sorted.sort((a, b) => b.price - a.price || b.rating - a.rating);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || a.price - b.price);
    case "date":
      return sorted.sort(
        (a, b) => a.availableInDays - b.availableInDays || a.price - b.price,
      );
    default:
      return sorted;
  }
}

export default function CleaningCalculator() {
  const [cleaningType, setCleaningType] = useState<CleaningType>("maintenance");
  const [rooms, setRooms] = useState(1);
  const [baths, setBaths] = useState(1);
  const [area, setArea] = useState(AREA_BASE);
  const [areaInput, setAreaInput] = useState(String(AREA_BASE));
  const [cleanerCount, setCleanerCount] = useState(1);
  const [extras, setExtras] = useState<Set<ExtraId>>(new Set());
  const [typeOpen, setTypeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("priceAsc");
  const [showCleaners, setShowCleaners] = useState(false);
  const [selectedCleanerIds, setSelectedCleanerIds] = useState<string[]>([]);
  const [orderAddress, setOrderAddress] = useState("");
  const [showAddressStep, setShowAddressStep] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  const { isAuthenticated, userPhone, openAccountModal } = useAuth();

  const typeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const cleanersRef = useRef<HTMLDivElement>(null);

  const selectedType = CLEANING_OPTIONS.find((item) => item.id === cleaningType)!;
  const selectedSort = SORT_OPTIONS.find((item) => item.id === sortMode)!;
  const selectedExtras = EXTRAS.filter((item) => extras.has(item.id));

  const baseJob = useMemo(() => {
    const base = selectedType.base;
    const roomFee = (rooms - 1) * 12;
    const bathFee = (baths - 1) * 8;
    const areaFee = Math.max(0, area - AREA_BASE) * 0.9;
    const extrasSum = EXTRAS.filter((item) => extras.has(item.id)).reduce(
      (sum, item) => sum + item.price,
      0,
    );
    return (base + roomFee + bathFee + areaFee + extrasSum) * teamFactor(cleanerCount);
  }, [area, baths, cleanerCount, extras, rooms, selectedType.base]);

  const cleanerOffers = useMemo(() => {
    const offers: CleanerOffer[] = CLEANERS.map((cleaner) => ({
      ...cleaner,
      price: Math.round(baseJob * cleaner.multiplier),
      availableDate: formatAvailableDate(cleaner.availableInDays),
    }));
    return sortCleaners(offers, sortMode);
  }, [baseJob, sortMode]);

  const minCleanerPrice = useMemo(
    () => Math.min(...cleanerOffers.map((cleaner) => cleaner.price)),
    [cleanerOffers],
  );

  const maxCleanerPrice = useMemo(
    () => Math.max(...cleanerOffers.map((cleaner) => cleaner.price)),
    [cleanerOffers],
  );

  const areaProgress = ((area - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100;

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!typeRef.current?.contains(target)) setTypeOpen(false);
      if (!sortRef.current?.contains(target)) setSortOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function resetSelection() {
    setSelectedCleanerIds([]);
    setOrderAddress("");
    setShowAddressStep(false);
    setChatOpen(false);
    setOrderId("");
  }

  function revealCleaners() {
    resetSelection();
    setShowCleaners(true);
    window.requestAnimationFrame(() => {
      cleanersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function clampArea(value: number) {
    return Math.min(AREA_MAX, Math.max(AREA_MIN, value));
  }

  function updateArea(value: number) {
    const next = clampArea(Math.round(value));
    setArea(next);
    setAreaInput(String(next));
    resetSelection();
  }

  function onAreaInputChange(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    setAreaInput(digits);
    if (!digits) return;
    const parsed = Number(digits);
    if (!Number.isNaN(parsed)) {
      setArea(clampArea(parsed));
      resetSelection();
    }
  }

  function onAreaInputBlur() {
    updateArea(Number(areaInput) || AREA_BASE);
  }

  function toggleExtra(id: ExtraId) {
    resetSelection();
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function findCleaners() {
    if (!isAuthenticated) {
      openAccountModal(() => revealCleaners());
      return;
    }
    revealCleaners();
  }

  function toggleCleanerSelection(id: string) {
    setShowAddressStep(false);
    setChatOpen(false);
    setSelectedCleanerIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= cleanerCount) return prev;
      return [...prev, id];
    });
  }

  const selectionComplete = selectedCleanerIds.length === cleanerCount;

  function continueToAddress() {
    if (!selectionComplete) return;
    setShowAddressStep(true);
  }

  function confirmOrder(event: FormEvent) {
    event.preventDefault();
    if (!orderAddress.trim() || !selectionComplete) return;
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(id);
    setChatOpen(true);
    window.requestAnimationFrame(() => {
      document.getElementById("order-chat")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const selectedCleaners = useMemo(
    () => cleanerOffers.filter((cleaner) => selectedCleanerIds.includes(cleaner.id)),
    [cleanerOffers, selectedCleanerIds],
  );

  const extrasSummary =
    selectedExtras.length === 0
      ? "Ничего не выбрано"
      : selectedExtras.map((item) => item.label).join(", ");

  return (
    <div className="w-full space-y-3">
      {/* Calculator card */}
      <div className="rounded-3xl bg-panel p-4 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-5">
        <div className="space-y-3">
          {/* Cleaning type */}
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
                        resetSelection();
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-[15px] font-medium transition ${
                        active
                          ? "bg-brand-soft text-brand"
                          : "text-foreground hover:bg-plaque"
                      }`}
                    >
                      {option.label}
                      {active ? <span className="text-brand">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rooms & bathrooms */}
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
                    resetSelection();
                  }}
                />
                <span className="min-w-8 text-center text-2xl font-semibold tabular-nums text-foreground">
                  {rooms}
                </span>
                <StepperButton
                  label="plus"
                  disabled={rooms >= MAX_ROOMS}
                  onClick={() => {
                    setRooms((value) => Math.min(MAX_ROOMS, value + 1));
                    resetSelection();
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
                    resetSelection();
                  }}
                />
                <span className="min-w-8 text-center text-2xl font-semibold tabular-nums text-foreground">
                  {baths}
                </span>
                <StepperButton
                  label="plus"
                  disabled={baths >= MAX_BATHS}
                  onClick={() => {
                    setBaths((value) => Math.min(MAX_BATHS, value + 1));
                    resetSelection();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Area */}
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

          {/* Cleaner count */}
          <div className="rounded-2xl bg-plaque px-3 py-3.5">
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Количество клинеров
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 px-1">
              <StepperButton
                label="minus"
                disabled={cleanerCount <= 1}
                onClick={() => {
                  setCleanerCount((value) => Math.max(1, value - 1));
                  setSelectedCleanerIds((prev) => prev.slice(0, Math.max(1, cleanerCount - 1)));
                  setShowAddressStep(false);
                  setChatOpen(false);
                }}
              />
              <div className="min-w-0 text-center">
                <span className="block text-2xl font-semibold tabular-nums text-foreground">
                  {cleanerCount}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-muted">
                  {cleanerCount === 1
                    ? "клинер"
                    : cleanerCount >= 2 && cleanerCount <= 4
                      ? "клинера"
                      : "клинеров"}
                </span>
              </div>
              <StepperButton
                label="plus"
                disabled={cleanerCount >= MAX_CLEANERS}
                onClick={() => {
                  setCleanerCount((value) => Math.min(MAX_CLEANERS, value + 1));
                  setShowAddressStep(false);
                  setChatOpen(false);
                }}
              />
            </div>
          </div>

          {/* Extra services */}
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
                            active ? "bg-mint text-white" : "bg-plaque text-muted"
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

        </div>
      </div>

      {/* Live price range from cleaners — under card, above find button */}
      <div className="rounded-2xl bg-panel px-4 py-3.5 shadow-[0_10px_28px_rgba(17,24,39,0.06)]">
        <p className="text-[13px] leading-snug text-muted">
          Стоимость у клинеров:{" "}
          <span
            key={`${minCleanerPrice}-${maxCleanerPrice}`}
            className="price-pop font-semibold text-foreground"
          >
            от {formatPrice(minCleanerPrice)} до {formatPrice(maxCleanerPrice)} BYN
          </span>
        </p>
      </div>

      {/* Sort plaque */}
      <div ref={sortRef} className="relative">
        <button
          type="button"
          onClick={() => setSortOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl bg-panel px-4 py-3.5 text-left shadow-[0_10px_28px_rgba(17,24,39,0.06)] transition active:scale-[0.995]"
        >
          <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Сортировать по
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {selectedSort.label}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plaque">
              <ChevronDown open={sortOpen} />
            </span>
          </span>
        </button>

        {sortOpen && (
          <div className="animate-sheet absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_rgba(17,24,39,0.14)] ring-1 ring-black/5">
            {SORT_OPTIONS.map((option) => {
              const active = option.id === sortMode;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSortMode(option.id);
                    setSortOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-brand-soft text-brand"
                      : "text-foreground hover:bg-plaque"
                  }`}
                >
                  {option.label}
                  {active ? <span className="text-brand">✓</span> : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Find cleaners CTA */}
      <button
        type="button"
        onClick={findCleaners}
        className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em] text-white shadow-[0_12px_28px_rgba(30,58,138,0.28)] transition hover:bg-brand-deep active:scale-[0.99]"
      >
        Найти клинера
        <span aria-hidden="true">→</span>
      </button>
      {!isAuthenticated && (
        <p className="px-1 text-center text-xs text-muted">
          Для поиска исполнителей потребуется вход в личный кабинет по телефону.
        </p>
      )}

      {/* Cleaner cards */}
      {showCleaners && !chatOpen && (
        <div ref={cleanersRef} className="animate-sheet space-y-3 pt-1">
          <div className="flex items-center justify-between gap-3 px-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Найдено: {cleanerOffers.length}
            </p>
            <p className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
              Выбрано {selectedCleanerIds.length} из {cleanerCount}
            </p>
          </div>

          {cleanerOffers.map((cleaner, index) => {
            const selected = selectedCleanerIds.includes(cleaner.id);
            const selectionLocked =
              !selected && selectedCleanerIds.length >= cleanerCount;
            return (
              <article
                key={`${cleaner.id}-${sortMode}-${cleaner.price}`}
                className={`animate-sheet rounded-3xl bg-panel p-4 shadow-[0_14px_36px_rgba(17,24,39,0.07)] transition ${
                  selected ? "ring-2 ring-mint" : ""
                } ${selectionLocked ? "opacity-60" : ""}`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                    style={{ backgroundColor: cleaner.accent }}
                  >
                    {cleaner.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-semibold text-foreground">
                          {cleaner.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                          <StarIcon />
                          <span className="font-semibold text-foreground">
                            {cleaner.rating.toFixed(1)}
                          </span>
                          <span>· {cleaner.reviews} отзывов</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-none text-foreground">
                          {formatPrice(cleaner.price)}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-muted">BYN</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-plaque px-2.5 py-1 text-[11px] font-medium text-muted">
                        с {cleaner.availableDate}
                      </span>
                      <span className="rounded-full bg-mint-soft px-2.5 py-1 text-[11px] font-semibold text-success">
                        {cleaner.note}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={selectionLocked}
                      onClick={() => toggleCleanerSelection(cleaner.id)}
                      className={`mt-3.5 flex w-full items-center justify-center rounded-2xl px-3 py-3 text-sm font-bold transition disabled:cursor-not-allowed ${
                        selected
                          ? "bg-mint text-white"
                          : "bg-plaque text-foreground hover:bg-brand-soft hover:text-brand"
                      }`}
                    >
                      {selected ? "Выбрано" : "Выбрать"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          <button
            type="button"
            disabled={!selectionComplete}
            onClick={continueToAddress}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Продолжить · выбрано {selectedCleanerIds.length} из {cleanerCount}
          </button>

          {showAddressStep && selectionComplete && (
            <form
              onSubmit={confirmOrder}
              className="animate-sheet rounded-3xl bg-panel p-4 shadow-[0_14px_36px_rgba(17,24,39,0.07)] sm:p-5"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                Оформление заказа
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Выбрано {cleanerCount}{" "}
                {cleanerCount === 1
                  ? "исполнитель"
                  : cleanerCount >= 2 && cleanerCount <= 4
                    ? "исполнителя"
                    : "исполнителей"}
                — укажите адрес уборки
              </p>
              <label className="mt-4 block space-y-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  Ввод адреса
                </span>
                <input
                  type="text"
                  required
                  value={orderAddress}
                  onChange={(event) => setOrderAddress(event.target.value)}
                  placeholder="Город, улица, дом, квартира"
                  className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
                />
              </label>
              <button
                type="submit"
                className="mt-3.5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep"
              >
                Открыть чат заказа
              </button>
            </form>
          )}
        </div>
      )}

      {chatOpen && (
        <div id="order-chat" className="pt-1">
          <OrderChat
            orderId={orderId}
            address={orderAddress}
            cleaners={selectedCleaners}
            userPhone={userPhone}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
