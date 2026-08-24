"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

type PresenceStatus = "active" | "dnd";
type RateMode = "hourly" | "mixed";
type AfterRepairUnit = "hour" | "sqm";

type RadarOrder = {
  id: string;
  when: string;
  service: string;
  clientTotal: number;
  distance: string;
};

type Review = {
  id: string;
  orderId: string;
  rating: number;
  text: string;
  date: string;
};

type PayoutItem = {
  id: string;
  orderId: string;
  amount: number;
  note: string;
  date: string;
};

type TodayJob = {
  id: string;
  time: string;
  address: string;
  x: number;
  y: number;
};

type Badge = {
  id: string;
  title: string;
  condition: string;
  icon: string;
  earned: boolean;
  progress?: string;
};

type ExtraService = {
  id: string;
  label: string;
  price: string;
  enabled: boolean;
  custom?: boolean;
};

const COMMISSION = 0.2;

const CITIES = ["Минск", "Брест", "Гомель", "Гродно", "Витебск", "Могилёв"] as const;

const BADGES: Badge[] = [
  {
    id: "b1",
    title: "Первый шаг",
    condition: "Выполнено 10 заказов",
    icon: "🏅",
    earned: true,
    progress: "10/10",
  },
  {
    id: "b2",
    title: "Безупречный старт",
    condition: "Получено 5 отзывов на 5⭐",
    icon: "⭐",
    earned: true,
    progress: "5/5",
  },
  {
    id: "b3",
    title: "Мастер чистоты",
    condition: "Выполнено 50 уборок",
    icon: "🏆",
    earned: true,
    progress: "50/50",
  },
  {
    id: "b4",
    title: "Любимчик клиентов",
    condition: "10 повторных вызовов от одних и тех же клиентов",
    icon: "🥇",
    earned: true,
    progress: "10/10",
  },
  {
    id: "b5",
    title: "Герой ремонта",
    condition: "Успешно выполнено 5 уборок после ремонта",
    icon: "🥈",
    earned: false,
    progress: "3/5",
  },
  {
    id: "b6",
    title: "Укротитель пыли",
    condition: "Выполнено 10 генеральных уборок",
    icon: "🥉",
    earned: true,
    progress: "10/10",
  },
  {
    id: "b7",
    title: "Маг окон",
    condition: "Выполнено 20 заказов с доп. услугой мытья окон",
    icon: "✨",
    earned: false,
    progress: "14/20",
  },
  {
    id: "b8",
    title: "Повелитель времени",
    condition: "20 заказов подряд без опозданий",
    icon: "🎖️",
    earned: false,
    progress: "12/20",
  },
  {
    id: "b9",
    title: "Всегда готов",
    condition: "Индекс активности 100% за месяц",
    icon: "🏅",
    earned: false,
    progress: "95%",
  },
  {
    id: "b10",
    title: "Легенда сервиса",
    condition: "Выполнено 100 заказов на платформе",
    icon: "🏆",
    earned: false,
    progress: "67/100",
  },
];

const DEFAULT_ROOM_TIMES = [
  { rooms: 1, maint: "1.5", general: "3.5" },
  { rooms: 2, maint: "2", general: "4.5" },
  { rooms: 3, maint: "3", general: "6" },
  { rooms: 4, maint: "4", general: "8" },
  { rooms: 5, maint: "5", general: "10.5" },
];

const DEFAULT_EXTRAS: ExtraService[] = [
  { id: "windows", label: "Мытье окон", price: "20", enabled: true },
  { id: "fridge", label: "Холодильник", price: "15", enabled: true },
  { id: "oven", label: "Духовка", price: "12", enabled: true },
  { id: "microwave", label: "Микроволновка", price: "8", enabled: false },
  { id: "balcony", label: "Балкон", price: "18", enabled: false },
  { id: "ironing", label: "Глажка белья", price: "25", enabled: false },
];

const REVIEWS: Review[] = [
  {
    id: "r1",
    orderId: "#1042",
    rating: 5,
    text: "Очень аккуратно, окна блестели. Приехал вовремя.",
    date: "12 авг",
  },
  {
    id: "r2",
    orderId: "#1038",
    rating: 5,
    text: "Вежливый специалист, убрал после ремонта без претензий.",
    date: "8 авг",
  },
  {
    id: "r3",
    orderId: "#1029",
    rating: 4,
    text: "Хорошо, но чуть задержался на старте. Итог отличный.",
    date: "2 авг",
  },
];

const PAYOUTS: PayoutItem[] = [
  {
    id: "p1",
    orderId: "#1042",
    amount: 80,
    note: "Чистая прибыль с вычетом комиссии 20%",
    date: "12.08.2026",
  },
  {
    id: "p2",
    orderId: "#1038",
    amount: 124,
    note: "Чистая прибыль с вычетом комиссии 20%",
    date: "08.08.2026",
  },
  {
    id: "p3",
    orderId: "#1029",
    amount: 56,
    note: "Чистая прибыль с вычетом комиссии 20%",
    date: "02.08.2026",
  },
];

const TODAY_JOBS: TodayJob[] = [
  {
    id: "j1",
    time: "10:00",
    address: "Минск, ул. Седых 60, п2, кв 17",
    x: 28,
    y: 38,
  },
  {
    id: "j2",
    time: "17:30",
    address: "Минск, ул. Ольшевского 22, 4 этаж, офис 33",
    x: 62,
    y: 58,
  },
];

const INITIAL_ORDERS: RadarOrder[] = [
  {
    id: "radar-1",
    when: "Завтра, 14:00",
    service: "2 комнаты, 1 санузел + мытье окон",
    clientTotal: 100,
    distance: "1.2 км",
  },
  {
    id: "radar-2",
    when: "Пт, 10:00",
    service: "3 комнаты, 2 санузла · генеральная",
    clientTotal: 156,
    distance: "2.4 км",
  },
  {
    id: "radar-3",
    when: "Сб, 16:30",
    service: "1 комната, 1 санузел · поддерживающая",
    clientTotal: 72,
    distance: "800 м",
  },
];

const TIME_OPTIONS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

function formatByn(value: number) {
  return new Intl.NumberFormat("ru-BY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function netEarn(clientTotal: number) {
  return Math.round(clientTotal * (1 - COMMISSION) * 100) / 100;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 sm:rounded-2xl sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function Alert({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg bg-rose-50 px-2.5 py-2 text-[11px] font-semibold leading-relaxed text-rose-700 ring-1 ring-rose-100 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs">
      {children}
    </p>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 md:hidden ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Collapsed by default on <768px; always expanded from md up. */
function AccordionPanel({
  title,
  subtitle,
  trailing,
  open,
  onToggle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Panel className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 text-left md:pointer-events-none md:cursor-default"
      >
        <div className="min-w-0">
          {subtitle ? (
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[10px]">
              {subtitle}
            </p>
          ) : null}
          <h2
            className={`font-[family-name:var(--font-unbounded)] text-sm font-semibold text-slate-900 sm:text-base ${
              subtitle ? "mt-0.5" : ""
            }`}
          >
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {trailing}
          <Chevron open={open} />
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[1fr] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-3 sm:pt-4">{children}</div>
        </div>
      </div>
    </Panel>
  );
}

function Modal({
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
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-900/40 p-3 backdrop-blur-[2px] sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-6 ${
          wide ? "max-w-xl" : "max-w-md"
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
          <h3 className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 sm:h-9 sm:w-9"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FullScreenModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
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
    <div className="fixed inset-0 z-[130] flex flex-col bg-white lg:hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-3 py-3">
        <h3 className="min-w-0 truncate font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold leading-none text-slate-700"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 pb-8">{children}</div>
    </div>
  );
}

function ScheduleBlock({
  monthLabel,
  calendarMonth,
  setCalendarMonth,
  calendarDays,
  selectedDay,
  setSelectedDay,
  availableTimes,
  slotFrom,
  setSlotFrom,
  slotTo,
  setSlotTo,
  addSlot,
  freeSlots,
}: {
  monthLabel: string;
  calendarMonth: Date;
  setCalendarMonth: (d: Date) => void;
  calendarDays: Array<{ date: Date | null; disabled: boolean }>;
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
  availableTimes: string[];
  slotFrom: string;
  setSlotFrom: (v: string) => void;
  slotTo: string;
  setSlotTo: (v: string) => void;
  addSlot: () => void;
  freeSlots: string[];
}) {
  return (
    <div>
      <p className="font-[family-name:var(--font-unbounded)] text-sm font-semibold text-slate-900 sm:text-base">
        Мое расписание
      </p>
      <div className="mt-2 sm:mt-3">
        <Alert>
          Указывайте время готовности начать уборку (без учета времени на
          дорогу)
        </Alert>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
        <button
          type="button"
          onClick={() =>
            setCalendarMonth(
              new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth() - 1,
                1,
              ),
            )
          }
          className="rounded-lg bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-600 sm:px-2.5 sm:py-1.5"
        >
          ←
        </button>
        <p className="text-xs font-semibold capitalize text-slate-800 sm:text-sm">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() =>
            setCalendarMonth(
              new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth() + 1,
                1,
              ),
            )
          }
          className="rounded-lg bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-600 sm:px-2.5 sm:py-1.5"
        >
          →
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-0.5 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:mt-3 sm:gap-1 sm:text-[10px]">
        {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map((cell, index) => {
          if (!cell.date) {
            return <span key={`empty-${index}`} className="h-8 sm:h-9" />;
          }
          const selected =
            selectedDay &&
            cell.date.toDateString() === selectedDay.toDateString();
          return (
            <button
              key={cell.date.toISOString()}
              type="button"
              disabled={cell.disabled}
              onClick={() => setSelectedDay(cell.date)}
              className={`h-8 rounded-md text-xs font-semibold tabular-nums transition sm:h-9 sm:rounded-lg sm:text-sm ${
                cell.disabled
                  ? "cursor-not-allowed text-slate-300"
                  : selected
                    ? "bg-[#1e3a8a] text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
        <label className="block">
          <span className="text-[11px] font-medium text-slate-500 sm:text-xs">
            С
          </span>
          <select
            value={
              availableTimes.includes(slotFrom)
                ? slotFrom
                : (availableTimes[0] ?? "")
            }
            onChange={(event) => setSlotFrom(event.target.value)}
            disabled={availableTimes.length === 0}
            className="mt-1 w-full rounded-lg bg-slate-50 px-2.5 py-2 text-sm font-semibold outline-none ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:px-3 sm:py-2.5"
          >
            {availableTimes.length === 0 ? (
              <option value="">Нет доступных часов</option>
            ) : (
              availableTimes.map((time) => (
                <option key={`from-${time}`} value={time}>
                  {time}
                </option>
              ))
            )}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-medium text-slate-500 sm:text-xs">
            По
          </span>
          <select
            value={
              availableTimes.includes(slotTo)
                ? slotTo
                : (availableTimes[availableTimes.length - 1] ?? "")
            }
            onChange={(event) => setSlotTo(event.target.value)}
            disabled={availableTimes.length === 0}
            className="mt-1 w-full rounded-lg bg-slate-50 px-2.5 py-2 text-sm font-semibold outline-none ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:px-3 sm:py-2.5"
          >
            {availableTimes.length === 0 ? (
              <option value="">Нет доступных часов</option>
            ) : (
              availableTimes.map((time) => (
                <option key={`to-${time}`} value={time}>
                  {time}
                </option>
              ))
            )}
          </select>
        </label>
      </div>
      <button
        type="button"
        onClick={addSlot}
        className="mt-2.5 w-full rounded-xl bg-[#1e3a8a] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#152a66] sm:mt-3"
      >
        Добавить свободный интервал
      </button>

      <ul className="mt-2.5 space-y-1.5 sm:mt-3">
        {freeSlots.map((slot) => (
          <li
            key={slot}
            className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 sm:px-3 sm:py-2 sm:text-xs"
          >
            {slot}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapBlock() {
  return (
    <div>
      <p className="font-[family-name:var(--font-unbounded)] text-sm font-semibold text-slate-900 sm:text-base">
        Карта заказов
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
        Маршруты на сегодня
      </p>

      <div className="relative mt-3 h-48 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#dbe7f5_0%,#e8eef8_45%,#d4e4d8_100%)] ring-1 ring-slate-200 sm:mt-4 sm:h-56 sm:rounded-2xl">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#94a3b8_1px,transparent_1px),linear-gradient(90deg,#94a3b8_1px,transparent_1px)] [background-size:28px_28px]" />
        <p className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
          Карта · заглушка
        </p>
        {TODAY_JOBS.map((job, index) => (
          <span
            key={job.id}
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-[#1e3a8a] text-[11px] font-bold text-white shadow-md sm:h-8 sm:w-8 sm:text-xs"
            style={{ left: `${job.x}%`, top: `${job.y}%` }}
            title={job.address}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
        {TODAY_JOBS.map((job, index) => (
          <li
            key={job.id}
            className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-2.5 py-2.5 sm:gap-3 sm:px-3 sm:py-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-[11px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-bold tabular-nums text-slate-900">
                {job.time}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-slate-600 sm:text-sm">
                {job.address}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CleanerDashboard() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [city, setCity] = useState<(typeof CITIES)[number]>("Минск");
  const [presence, setPresence] = useState<PresenceStatus>("active");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [questDone, setQuestDone] = useState(3);
  const [toast, setToast] = useState("");
  const [tipOpen, setTipOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [payoutsOpen, setPayoutsOpen] = useState(false);
  const [blacklistOpen, setBlacklistOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [ibanModalOpen, setIbanModalOpen] = useState(false);
  const [blockOrderId, setBlockOrderId] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const [isIbanLinked, setIsIbanLinked] = useState(false);
  const [iban, setIban] = useState("");
  const [ibanDraft, setIbanDraft] = useState("");
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const [rateMode, setRateMode] = useState<RateMode>("mixed");
  const [hourlyRate, setHourlyRate] = useState("25");
  const [priceMaintenance, setPriceMaintenance] = useState("45");
  const [priceGeneral, setPriceGeneral] = useState("75");
  const [priceAfterRepair, setPriceAfterRepair] = useState("110");
  const [afterRepairUnit, setAfterRepairUnit] = useState<AfterRepairUnit>("hour");
  const [extras, setExtras] = useState<ExtraService[]>(DEFAULT_EXTRAS);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [roomTimes, setRoomTimes] = useState(DEFAULT_ROOM_TIMES);

  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);
  const [slotFrom, setSlotFrom] = useState("10:00");
  const [slotTo, setSlotTo] = useState("14:00");
  const [freeSlots, setFreeSlots] = useState<string[]>([
    "Сегодня, 10:00–14:00",
    "Завтра, 09:00–13:00",
  ]);

  const questGoal = 5;
  const questProgress = Math.min(100, (questDone / questGoal) * 100);
  const monthlyEarnings = 320;
  const earnedBadges = BADGES.filter((b) => b.earned).length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (mq.matches) {
        setBadgesOpen(true);
        setPriceOpen(true);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ date: Date | null; disabled: boolean }> = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ date: null, disabled: true });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      cells.push({ date, disabled: date < today });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, disabled: true });
    }
    return cells;
  }, [calendarMonth, today]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ru-RU", {
        month: "long",
        year: "numeric",
      }).format(calendarMonth),
    [calendarMonth],
  );

  const availableTimes = useMemo(() => {
    const isToday =
      selectedDay !== null &&
      selectedDay.toDateString() === today.toDateString();
    if (!isToday) return TIME_OPTIONS;
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    return TIME_OPTIONS.filter((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes > nowMinutes;
    });
  }, [selectedDay, today]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function takeOrder(id: string) {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setQuestDone((value) => Math.min(questGoal, value + 1));
    showToast("Заказ взят в работу");
  }

  function skipOrder(id: string) {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    showToast("Заказ пропущен");
  }

  function addSlot() {
    if (!selectedDay) {
      showToast("Выберите день в календаре");
      return;
    }
    if (availableTimes.length === 0) {
      showToast("На выбранный день нет свободных часов");
      return;
    }
    const from = availableTimes.includes(slotFrom)
      ? slotFrom
      : availableTimes[0];
    const to = availableTimes.includes(slotTo)
      ? slotTo
      : availableTimes[availableTimes.length - 1];
    if (from >= to) {
      showToast("Время «По» должно быть позже «С»");
      return;
    }
    const dayLabel = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
    }).format(selectedDay);
    const next = `${dayLabel}, ${from}–${to}`;
    setFreeSlots((prev) => [next, ...prev].slice(0, 8));
    showToast("Интервал добавлен");
  }

  function submitBlacklist(event: FormEvent) {
    event.preventDefault();
    if (!blockOrderId.trim() || !blockReason.trim()) {
      showToast("Укажите заказ/клиента и причину");
      return;
    }
    setBlacklistOpen(false);
    setBlockOrderId("");
    setBlockReason("");
    showToast("Заявка на блокировку отправлена администратору");
  }

  function toggleExtra(id: string) {
    setExtras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  }

  function updateExtraPrice(id: string, price: string) {
    setExtras((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price } : item)),
    );
  }

  function addCustomService() {
    if (!customName.trim() || !customPrice.trim()) {
      showToast("Укажите название и стоимость услуги");
      return;
    }
    setExtras((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        label: customName.trim(),
        price: customPrice.trim(),
        enabled: true,
        custom: true,
      },
    ]);
    setCustomName("");
    setCustomPrice("");
    setShowCustomForm(false);
    showToast("Услуга добавлена");
  }

  function updateRoomTime(
    rooms: number,
    field: "maint" | "general",
    value: string,
  ) {
    setRoomTimes((prev) =>
      prev.map((row) =>
        row.rooms === rooms ? { ...row, [field]: value } : row,
      ),
    );
  }

  function openIbanModal() {
    setIbanDraft(iban);
    setIbanModalOpen(true);
  }

  function saveIban(event: FormEvent) {
    event.preventDefault();
    const next = ibanDraft.trim().toUpperCase().replace(/\s+/g, "");
    if (next.length < 10) {
      showToast("Введите корректный IBAN");
      return;
    }
    setIban(next);
    setIsIbanLinked(true);
    setIbanModalOpen(false);
    showToast("IBAN сохранён. Выплаты будут приходить автоматически");
  }

  const scheduleProps = {
    monthLabel,
    calendarMonth,
    setCalendarMonth,
    calendarDays,
    selectedDay,
    setSelectedDay,
    availableTimes,
    slotFrom,
    setSlotFrom,
    slotTo,
    setSlotTo,
    addSlot,
    freeSlots,
  };

  return (
    <div className="min-h-full bg-[#eef1f6]">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
              Кабинет специалиста
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className="truncate font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900 sm:text-xl">
                Дмитрий Орлов
              </h1>
              <label className="inline-flex shrink-0 items-center">
                <span className="sr-only">Город работы</span>
                <select
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value as (typeof CITIES)[number])
                  }
                  className="sticky top-0 max-w-[7.5rem] rounded-lg border border-slate-200 bg-slate-50 py-1 pl-2 pr-6 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1e3a8a]/25 sm:max-w-none sm:rounded-xl sm:py-1.5 sm:pl-2.5 sm:pr-7 sm:text-xs"
                >
                  {CITIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setPresence((value) => (value === "active" ? "dnd" : "active"))
            }
            className="shrink-0 transition active:scale-[0.98]"
            aria-label="Переключить статус"
          >
            {presence === "active" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs">
                <span aria-hidden>🟢</span> Активен
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-100 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs">
                <span aria-hidden>🔴</span> Не беспокоить
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-3 px-3 py-3 pb-10 sm:space-y-4 sm:px-6 sm:py-6 sm:pb-12">
        {/* Metrics */}
        <section className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setReviewsOpen(true)}
            className="rounded-xl bg-white p-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 transition hover:ring-slate-300 sm:rounded-2xl sm:p-5"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px] sm:tracking-[0.14em]">
              Рейтинг
            </p>
            <p className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold tabular-nums text-slate-900 sm:mt-2 sm:text-3xl">
              4.9{" "}
              <span className="text-lg text-amber-500 sm:text-2xl" aria-hidden>
                ★
              </span>
            </p>
          </button>

          <div className="relative rounded-xl bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 sm:rounded-2xl sm:p-5">
            <div className="flex items-start justify-between gap-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px] sm:tracking-[0.14em]">
                Индекс
              </p>
              <div className="group relative">
                <button
                  type="button"
                  onClick={() => setTipOpen((open) => !open)}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold italic text-slate-500 sm:h-5 sm:w-5 sm:text-[11px]"
                  aria-label="Информация об индексе активности"
                  aria-expanded={tipOpen}
                >
                  i
                </button>
                <p
                  className={`absolute right-0 top-6 z-20 w-56 rounded-xl bg-slate-900 px-3 py-2.5 text-[11px] leading-snug text-white shadow-lg sm:top-7 sm:w-72 sm:text-xs ${
                    tipOpen ? "block" : "hidden group-hover:block"
                  }`}
                >
                  Индекс активности показывает процент принятых вами заказов.
                  Отклонение мелких заказов снижает индекс. Высокий индекс дает
                  приоритет в выдаче.
                </p>
              </div>
            </div>
            <p className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold tabular-nums text-slate-900 sm:mt-2 sm:text-3xl">
              95%
            </p>
          </div>
        </section>

        {/* Trust badges — accordion on mobile */}
        <AccordionPanel
          subtitle="Значки доверия"
          title="Награды специалиста"
          trailing={
            <span className="text-[11px] font-semibold tabular-nums text-slate-500 sm:text-xs">
              {earnedBadges}/10
            </span>
          }
          open={badgesOpen}
          onToggle={() => {
            if (window.matchMedia("(min-width: 768px)").matches) return;
            setBadgesOpen((value) => !value);
          }}
        >
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {BADGES.map((badge) => (
              <li
                key={badge.id}
                className={`rounded-xl px-2.5 py-2.5 ring-1 sm:px-3 sm:py-3 ${
                  badge.earned
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 ring-amber-200"
                    : "bg-slate-50 ring-slate-200/80 opacity-55 grayscale"
                }`}
                title={badge.condition}
              >
                <span
                  className="block text-center text-2xl sm:text-3xl"
                  aria-hidden
                >
                  {badge.icon}
                </span>
                <p
                  className={`mt-1.5 text-center text-[11px] font-bold leading-tight sm:text-xs ${
                    badge.earned ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {badge.title}
                </p>
                <p className="mt-1 text-center text-[9px] leading-snug text-slate-500 sm:text-[10px]">
                  {badge.condition}
                </p>
                {badge.progress ? (
                  <p
                    className={`mt-1.5 text-center text-[10px] font-semibold tabular-nums sm:text-[11px] ${
                      badge.earned ? "text-amber-700" : "text-slate-400"
                    }`}
                  >
                    {badge.progress}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </AccordionPanel>

        {/* Quest */}
        <Panel className="bg-gradient-to-br from-[#1e3a8a] to-[#152a66] text-white shadow-[0_12px_28px_rgba(30,58,138,0.28)] ring-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:text-[10px]">
            Квест недели
          </p>
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-white sm:mt-2 sm:text-sm">
            Выполните еще 2 заказа до 60 BYN, и комиссия платформы на следующий
            крупный заказ составит 0% (вы оплатите только 3% эквайринга)!
          </p>
          <div className="mt-3 sm:mt-4">
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-white/80 sm:mb-1.5 sm:text-xs">
              <span>Прогресс</span>
              <span className="tabular-nums">
                {questDone}/{questGoal} выполнено
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20 sm:h-2.5">
              <div
                className="h-full rounded-full bg-[#5ecfb6] transition-[width]"
                style={{ width: `${questProgress}%` }}
              />
            </div>
          </div>
        </Panel>

        {/* Earnings / IBAN */}
        <Panel>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[10px]">
            Заработок / месяц
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-unbounded)] text-xl font-semibold tabular-nums text-slate-900 sm:mt-1 sm:text-3xl">
            {formatByn(monthlyEarnings)} BYN
          </p>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {city} · выплаты автоматически после каждого заказа
          </p>

          {isIbanLinked ? (
            <div className="mt-3 space-y-3 sm:mt-4">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden
                />
                Счет привязан
              </p>
              <p className="font-mono text-xs tracking-wide text-slate-600 sm:text-sm">
                {iban.replace(/(.{4})/g, "$1 ").trim()}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openIbanModal}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 sm:text-sm"
                >
                  Редактировать реквизиты
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutsOpen(true)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
                >
                  История выплат
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-3 sm:mt-4">
              <p className="text-sm font-semibold text-slate-800 sm:text-base">
                Сумма к выплате:{" "}
                <span className="tabular-nums">
                  {formatByn(monthlyEarnings)} BYN
                </span>
              </p>
              <button
                type="button"
                onClick={openIbanModal}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(225,29,72,0.28)] transition hover:bg-rose-700 active:scale-[0.99] sm:min-h-14 sm:text-base"
              >
                Привязать IBAN
              </button>
              <button
                type="button"
                onClick={() => setPayoutsOpen(true)}
                className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline sm:text-sm"
              >
                История выплат
              </button>
            </div>
          )}
        </Panel>

        {/* Unified price list — accordion on mobile */}
        <AccordionPanel
          subtitle="Мой прайс"
          title="Мой прайс-лист"
          open={priceOpen}
          onToggle={() => {
            if (window.matchMedia("(min-width: 768px)").matches) return;
            setPriceOpen((value) => !value);
          }}
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
            {/* Rates */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Выставление прайса
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setRateMode("hourly")}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition sm:px-3 sm:py-1.5 sm:text-xs ${
                    rateMode === "hourly"
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Почасовая
                </button>
                <button
                  type="button"
                  onClick={() => setRateMode("mixed")}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition sm:px-3 sm:py-1.5 sm:text-xs ${
                    rateMode === "mixed"
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Смешанная
                </button>
              </div>

              <div className="mt-3 space-y-2 sm:space-y-2.5">
                <label className="block">
                  <span className="text-[11px] font-medium text-slate-500 sm:text-xs">
                    Сумма в час, BYN <span className="text-rose-600">*</span>
                  </span>
                  <input
                    type="number"
                    min={1}
                    required
                    value={hourlyRate}
                    onChange={(event) => setHourlyRate(event.target.value)}
                    className="mt-1 w-full rounded-lg bg-slate-50 px-2.5 py-2 text-sm font-semibold outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40 sm:rounded-xl sm:px-3 sm:py-2.5"
                  />
                </label>

                {rateMode === "mixed" ? (
                  <>
                    <label className="flex items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 text-xs text-slate-600 sm:text-sm">
                        Поддерживающая
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={priceMaintenance}
                        onChange={(event) =>
                          setPriceMaintenance(event.target.value)
                        }
                        className="w-20 rounded-lg bg-slate-50 px-2 py-1.5 text-right text-sm font-semibold outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40 sm:w-24 sm:rounded-xl sm:px-2.5 sm:py-2"
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 text-xs text-slate-600 sm:text-sm">
                        Генеральная
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={priceGeneral}
                        onChange={(event) =>
                          setPriceGeneral(event.target.value)
                        }
                        className="w-20 rounded-lg bg-slate-50 px-2 py-1.5 text-right text-sm font-semibold outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40 sm:w-24 sm:rounded-xl sm:px-2.5 sm:py-2"
                      />
                    </label>

                    <div className="rounded-lg bg-slate-50 px-2.5 py-2.5 ring-1 ring-slate-200/80 sm:rounded-xl sm:px-3 sm:py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                          После ремонта
                        </span>
                        <div className="inline-flex rounded-full bg-white p-0.5 ring-1 ring-slate-200">
                          <button
                            type="button"
                            onClick={() => setAfterRepairUnit("hour")}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition sm:text-[11px] ${
                              afterRepairUnit === "hour"
                                ? "bg-[#1e3a8a] text-white"
                                : "text-slate-500"
                            }`}
                          >
                            За час
                          </button>
                          <button
                            type="button"
                            onClick={() => setAfterRepairUnit("sqm")}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition sm:text-[11px] ${
                              afterRepairUnit === "sqm"
                                ? "bg-[#1e3a8a] text-white"
                                : "text-slate-500"
                            }`}
                          >
                            За м²
                          </button>
                        </div>
                      </div>
                      <label className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500 sm:text-xs">
                          {afterRepairUnit === "hour"
                            ? "Ставка, BYN / час"
                            : "Ставка, BYN / м²"}
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={priceAfterRepair}
                          onChange={(event) =>
                            setPriceAfterRepair(event.target.value)
                          }
                          className="w-20 rounded-lg bg-white px-2 py-1.5 text-right text-sm font-semibold outline-none ring-1 ring-slate-200 focus:ring-[#1e3a8a]/40 sm:w-24 sm:rounded-xl sm:px-2.5 sm:py-2"
                        />
                      </label>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="mt-3">
                <Alert>
                  Внимание: указывайте стоимость с учетом того, что платформа
                  удержит комиссию 20%
                </Alert>
              </div>
            </div>

            {/* Extras */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Доп. услуги
              </p>
              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                Отметьте услуги, которые вы оказываете
              </p>
              <ul className="mt-2.5 space-y-2">
                {extras.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-2 sm:gap-3 sm:px-2.5 sm:py-2.5"
                  >
                    <label className="flex min-w-0 flex-1 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={service.enabled}
                        onChange={() => toggleExtra(service.id)}
                        className="h-4 w-4 accent-[#1e3a8a]"
                      />
                      <span
                        className={`truncate text-xs sm:text-sm ${
                          service.enabled
                            ? "font-medium text-slate-800"
                            : "text-slate-500"
                        }`}
                      >
                        {service.label}
                      </span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      disabled={!service.enabled}
                      value={service.price}
                      onChange={(event) =>
                        updateExtraPrice(service.id, event.target.value)
                      }
                      className="w-16 rounded-lg bg-white px-1.5 py-1 text-right text-xs font-semibold outline-none ring-1 ring-slate-200 disabled:opacity-40 sm:w-20 sm:px-2 sm:text-sm"
                      aria-label={`Стоимость: ${service.label}`}
                    />
                  </li>
                ))}
              </ul>

              {showCustomForm ? (
                <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200 sm:p-3">
                  <input
                    value={customName}
                    onChange={(event) => setCustomName(event.target.value)}
                    placeholder="Название услуги"
                    className="w-full rounded-lg bg-white px-2.5 py-2 text-sm outline-none ring-1 ring-slate-200"
                  />
                  <input
                    type="number"
                    min={1}
                    value={customPrice}
                    onChange={(event) => setCustomPrice(event.target.value)}
                    placeholder="Стоимость, BYN"
                    className="w-full rounded-lg bg-white px-2.5 py-2 text-sm outline-none ring-1 ring-slate-200"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomForm(false);
                        setCustomName("");
                        setCustomPrice("");
                      }}
                      className="rounded-lg bg-slate-200 px-2 py-2 text-xs font-bold text-slate-700"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={addCustomService}
                      className="rounded-lg bg-[#1e3a8a] px-2 py-2 text-xs font-bold text-white"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomForm(true)}
                  className="mt-3 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:text-sm"
                >
                  + Добавить свою услугу
                </button>
              )}
            </div>

            {/* Editable avg times */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Среднее время уборки
              </p>
              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                Укажите своё время в часах для каждого типа объекта
              </p>
              <div className="mt-2.5 overflow-x-auto">
                <table className="w-full min-w-[240px] border-collapse text-left text-[11px] sm:text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400">
                      <th className="py-1.5 pr-2 font-semibold">Объект</th>
                      <th className="py-1.5 pr-2 font-semibold">Поддерж., ч</th>
                      <th className="py-1.5 font-semibold">Ген., ч</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTimes.map((row) => (
                      <tr
                        key={row.rooms}
                        className="border-b border-slate-100 text-slate-700"
                      >
                        <td className="py-2 pr-2 font-semibold">
                          {row.rooms}-комн
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="number"
                            min={0.5}
                            step={0.5}
                            value={row.maint}
                            onChange={(event) =>
                              updateRoomTime(
                                row.rooms,
                                "maint",
                                event.target.value,
                              )
                            }
                            className="w-16 rounded-lg bg-slate-50 px-1.5 py-1 text-right text-xs font-semibold outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40 sm:w-20 sm:text-sm"
                            aria-label={`Поддерживающая, ${row.rooms} комн`}
                          />
                        </td>
                        <td className="py-2">
                          <input
                            type="number"
                            min={0.5}
                            step={0.5}
                            value={row.general}
                            onChange={(event) =>
                              updateRoomTime(
                                row.rooms,
                                "general",
                                event.target.value,
                              )
                            }
                            className="w-16 rounded-lg bg-slate-50 px-1.5 py-1 text-right text-xs font-semibold outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40 sm:w-20 sm:text-sm"
                            aria-label={`Генеральная, ${row.rooms} комн`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </AccordionPanel>

        {/* Mobile previews for schedule/map */}
        <section className="grid grid-cols-2 gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setScheduleOpen(true)}
            className="rounded-xl bg-white p-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a8a]/10 text-[11px] font-bold text-[#1e3a8a]">
              Cal
            </span>
            <p className="mt-2 text-xs font-bold text-slate-900">Расписание</p>
            <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
              {freeSlots.length} свободных интервала
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="rounded-xl bg-white p-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[11px] font-bold text-emerald-700">
              Map
            </span>
            <p className="mt-2 text-xs font-bold text-slate-900">Карта заказов</p>
            <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
              Сегодня: {TODAY_JOBS.length} адреса
            </p>
          </button>
        </section>

        {/* Desktop schedule + map */}
        <section className="hidden grid-cols-1 gap-4 lg:grid lg:grid-cols-2">
          <Panel>
            <ScheduleBlock {...scheduleProps} />
          </Panel>
          <Panel>
            <MapBlock />
          </Panel>
        </section>

        {/* Blacklist */}
        <Panel className="border border-rose-100 bg-rose-50/40">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div>
              <p className="font-[family-name:var(--font-unbounded)] text-sm font-semibold text-slate-900 sm:text-base">
                Черный список клиентов
              </p>
              <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                Заявка рассматривается администратором. После подтверждения вы
                больше не будете получать заказы от этого пользователя.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBlacklistOpen(true)}
              className="shrink-0 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-rose-700 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Запросить блокировку клиента
            </button>
          </div>
        </Panel>

        {/* Radar */}
        <section className="space-y-2.5 sm:space-y-3">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <h2 className="font-[family-name:var(--font-unbounded)] text-sm font-semibold text-slate-900 sm:text-lg">
              Новые заказы рядом с вами
            </h2>
            <span className="text-[11px] font-semibold tabular-nums text-slate-400 sm:text-xs">
              {orders.length}
            </span>
          </div>

          {orders.length === 0 ? (
            <Panel>
              <p className="py-3 text-center text-xs text-slate-500 sm:py-4 sm:text-sm">
                Сейчас рядом нет новых заявок. Включите статус «Активен», чтобы
                получать уведомления.
              </p>
            </Panel>
          ) : (
            <ul className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-2">
              {orders.map((order) => {
                const earn = netEarn(order.clientTotal);
                return (
                  <li key={order.id}>
                    <Panel>
                      <p className="text-xs font-bold text-slate-900 sm:text-sm">
                        {order.when}
                      </p>
                      <p className="mt-0.5 text-xs leading-snug text-slate-600 sm:mt-1 sm:text-sm">
                        {order.service}
                      </p>
                      <p className="mt-1.5 text-[11px] font-medium text-slate-400 sm:mt-2 sm:text-xs">
                        {order.distance} · {city}
                      </p>

                      <div className="mt-3 rounded-xl bg-slate-50 px-2.5 py-2.5 sm:mt-4 sm:px-3 sm:py-3">
                        <p className="text-[11px] text-slate-400 sm:text-xs">
                          Чек клиента:{" "}
                          <span className="tabular-nums">
                            {formatByn(order.clientTotal)} BYN
                          </span>
                        </p>
                        <p className="mt-0.5 font-[family-name:var(--font-unbounded)] text-base font-semibold tabular-nums text-[#1e3a8a] sm:mt-1 sm:text-lg">
                          Ваш заработок (−20%): {formatByn(earn)} BYN
                        </p>
                      </div>

                      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-3">
                        <button
                          type="button"
                          onClick={() => takeOrder(order.id)}
                          className="min-h-10 rounded-xl bg-emerald-600 px-2 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 sm:min-h-11 sm:px-3 sm:py-2.5 sm:text-sm"
                        >
                          Взять заказ
                        </button>
                        <button
                          type="button"
                          onClick={() => skipOrder(order.id)}
                          className="min-h-10 rounded-xl bg-slate-200 px-2 py-2 text-xs font-bold text-slate-700 transition hover:bg-rose-100 hover:text-rose-700 sm:min-h-11 sm:px-3 sm:py-2.5 sm:text-sm"
                        >
                          Пропустить
                        </button>
                      </div>
                    </Panel>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="pt-1 text-center sm:pt-2">
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 transition hover:text-slate-800 sm:text-sm"
          >
            ← На главную CleanPlatform
          </Link>
        </div>
      </main>

      {scheduleOpen ? (
        <FullScreenModal
          title="Мое расписание"
          onClose={() => setScheduleOpen(false)}
        >
          <ScheduleBlock {...scheduleProps} />
        </FullScreenModal>
      ) : null}

      {mapOpen ? (
        <FullScreenModal title="Карта заказов" onClose={() => setMapOpen(false)}>
          <MapBlock />
        </FullScreenModal>
      ) : null}

      {reviewsOpen ? (
        <Modal title="Отзывы клиентов" onClose={() => setReviewsOpen(false)}>
          <ul className="space-y-3">
            {REVIEWS.map((review) => (
              <li
                key={review.id}
                className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">
                    Заказ {review.orderId}
                  </p>
                  <p className="text-sm font-semibold text-amber-500">
                    {review.rating}.0 ★
                  </p>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {review.text}
                </p>
                <p className="mt-2 text-xs text-slate-400">{review.date}</p>
              </li>
            ))}
          </ul>
        </Modal>
      ) : null}

      {payoutsOpen ? (
        <Modal title="История выплат" onClose={() => setPayoutsOpen(false)}>
          <ul className="space-y-3">
            {PAYOUTS.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80"
              >
                <p className="text-sm font-bold text-slate-900">
                  Заказ {item.orderId} — {formatByn(item.amount)} BYN
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                <p className="mt-1 text-xs text-slate-400">{item.date}</p>
              </li>
            ))}
          </ul>
        </Modal>
      ) : null}

      {blacklistOpen ? (
        <Modal
          title="Запросить блокировку клиента"
          onClose={() => setBlacklistOpen(false)}
        >
          <form onSubmit={submitBlacklist} className="space-y-3.5">
            <p className="text-xs leading-relaxed text-slate-500">
              Заявка рассматривается администратором. После подтверждения вы
              больше не будете получать заказы от этого пользователя.
            </p>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Номер заказа / клиента
              </span>
              <input
                value={blockOrderId}
                onChange={(event) => setBlockOrderId(event.target.value)}
                placeholder="#1042 или телефон"
                className="w-full rounded-xl bg-slate-50 px-3 py-3 text-sm outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Причина конфликта
              </span>
              <textarea
                rows={4}
                value={blockReason}
                onChange={(event) => setBlockReason(event.target.value)}
                placeholder="Кратко опишите ситуацию"
                className="w-full resize-none rounded-xl bg-slate-50 px-3 py-3 text-sm outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40"
              />
            </label>
            <button
              type="submit"
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-rose-600 text-sm font-bold text-white hover:bg-rose-700"
            >
              Отправить заявку
            </button>
          </form>
        </Modal>
      ) : null}

      {ibanModalOpen ? (
        <Modal
          title={isIbanLinked ? "Редактировать IBAN" : "Привязать IBAN"}
          onClose={() => setIbanModalOpen(false)}
        >
          <form onSubmit={saveIban} className="space-y-3.5">
            <p className="text-xs leading-relaxed text-slate-500">
              Выплаты начисляются автоматически после каждого заказа. Укажите
              расчётный счёт в формате IBAN.
            </p>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                IBAN
              </span>
              <input
                value={ibanDraft}
                onChange={(event) => setIbanDraft(event.target.value)}
                placeholder="BY00 ALFA 0000 0000 0000 0000 0000"
                autoComplete="off"
                className="w-full rounded-xl bg-slate-50 px-3 py-3 font-mono text-sm uppercase outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40"
              />
            </label>
            <button
              type="submit"
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1e3a8a] text-sm font-bold text-white hover:bg-[#152a66]"
            >
              Сохранить счет
            </button>
          </form>
        </Modal>
      ) : null}

      {toast ? (
        <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
          <p className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
            {toast}
          </p>
        </div>
      ) : null}
    </div>
  );
}
