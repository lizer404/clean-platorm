"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

type PresenceStatus = "active" | "dnd";
type RateMode = "hourly" | "mixed";

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

const COMMISSION = 0.2;

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
      className={`rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 sm:p-5 ${className}`}
    >
      {children}
    </section>
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
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-[2px] sm:items-center">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6 ${
          wide ? "max-w-xl" : "max-w-md"
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-slate-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
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

export default function CleanerDashboard() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [presence, setPresence] = useState<PresenceStatus>("active");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [questDone, setQuestDone] = useState(3);
  const [toast, setToast] = useState("");
  const [tipOpen, setTipOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [payoutsOpen, setPayoutsOpen] = useState(false);
  const [blacklistOpen, setBlacklistOpen] = useState(false);
  const [blockOrderId, setBlockOrderId] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const [rateMode, setRateMode] = useState<RateMode>("mixed");
  const [hourlyRate, setHourlyRate] = useState("25");
  const [priceMaintenance, setPriceMaintenance] = useState("45");
  const [priceGeneral, setPriceGeneral] = useState("75");
  const [priceAfterRepair, setPriceAfterRepair] = useState("110");
  const [extraWindows, setExtraWindows] = useState("20");
  const [extraFridge, setExtraFridge] = useState("15");
  const [extraOven, setExtraOven] = useState("12");

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
  const balance = 320;

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

  return (
    <div className="min-h-full bg-[#eef1f6]">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Кабинет специалиста
            </p>
            <h1 className="mt-0.5 truncate font-[family-name:var(--font-unbounded)] text-lg font-semibold text-slate-900 sm:text-xl">
              Дмитрий Орлов
            </h1>
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <span aria-hidden>🟢</span> Активен
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
                <span aria-hidden>🔴</span> Не беспокоить
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-4 pb-12 sm:px-6 sm:py-6">
        {/* Metrics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setReviewsOpen(true)}
            className="rounded-2xl bg-white p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 transition hover:ring-slate-300 sm:p-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Рейтинг · нажмите, чтобы открыть отзывы
            </p>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold tabular-nums text-slate-900">
              4.9{" "}
              <span className="text-2xl text-amber-500" aria-hidden>
                ★
              </span>
            </p>
          </button>

          <div className="relative rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Индекс активности
              </p>
              <div className="group relative">
                <button
                  type="button"
                  onClick={() => setTipOpen((open) => !open)}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold italic text-slate-500"
                  aria-label="Информация об индексе активности"
                  aria-expanded={tipOpen}
                >
                  i
                </button>
                <p
                  className={`absolute right-0 top-7 z-20 w-64 rounded-xl bg-slate-900 px-3 py-2.5 text-xs leading-snug text-white shadow-lg sm:w-72 ${
                    tipOpen ? "block" : "hidden group-hover:block"
                  }`}
                >
                  Индекс активности показывает процент принятых вами заказов.
                  Отклонение мелких заказов снижает индекс. Высокий индекс дает
                  приоритет в выдаче.
                </p>
              </div>
            </div>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold tabular-nums text-slate-900">
              95%
            </p>
          </div>
        </section>

        {/* Quest */}
        <Panel className="bg-gradient-to-br from-[#1e3a8a] to-[#152a66] text-white shadow-[0_12px_28px_rgba(30,58,138,0.28)] ring-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
            Квест недели
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-white">
            Выполните еще 2 заказа до 60 BYN, и комиссия платформы на следующий
            крупный заказ составит 0% (вы оплатите только 3% эквайринга)!
          </p>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-white/80">
              <span>Прогресс</span>
              <span className="tabular-nums">
                {questDone}/{questGoal} выполнено
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#5ecfb6] transition-[width]"
                style={{ width: `${questProgress}%` }}
              />
            </div>
          </div>
        </Panel>

        {/* Finance + price 50/50 */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Баланс
            </p>
            <p className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold tabular-nums text-slate-900 sm:text-3xl">
              {formatByn(balance)} BYN
            </p>
            <p className="mt-1 text-sm text-slate-500">К выплате на счет</p>
            <button
              type="button"
              onClick={() => setPayoutsOpen(true)}
              className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              История выплат
            </button>
          </Panel>

          <Panel>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Мой прайс-лист
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRateMode("hourly")}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
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
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  rateMode === "mixed"
                    ? "bg-[#1e3a8a] text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Смешанная
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {rateMode === "hourly" ? (
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">
                    Ставка, BYN / час
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={hourlyRate}
                    onChange={(event) => setHourlyRate(event.target.value)}
                    className="mt-1 w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40"
                  />
                </label>
              ) : (
                <>
                  {(
                    [
                      ["Поддерживающая", priceMaintenance, setPriceMaintenance],
                      ["Генеральная", priceGeneral, setPriceGeneral],
                      ["После ремонта", priceAfterRepair, setPriceAfterRepair],
                      ["Мытье окон", extraWindows, setExtraWindows],
                      ["Холодильник", extraFridge, setExtraFridge],
                      ["Духовка", extraOven, setExtraOven],
                    ] as const
                  ).map(([label, value, setter]) => (
                    <label
                      key={label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="min-w-0 flex-1 text-sm text-slate-600">
                        {label}
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={value}
                        onChange={(event) => setter(event.target.value)}
                        className="w-24 rounded-xl bg-slate-50 px-2.5 py-2 text-right text-sm font-semibold outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40"
                      />
                    </label>
                  ))}
                </>
              )}
            </div>

            <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold leading-relaxed text-rose-700 ring-1 ring-rose-100">
              Внимание: указывайте стоимость с учетом того, что платформа
              удержит комиссию 20%
            </p>
          </Panel>
        </section>

        {/* Schedule + map 50/50 */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel>
            <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
              Мое расписание
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Указывайте время, когда вы готовы НАЧАТЬ уборку на объекте (без
              учета времени на дорогу)
            </p>

            <div className="mt-4 flex items-center justify-between gap-2">
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
                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-semibold text-slate-600"
              >
                ←
              </button>
              <p className="text-sm font-semibold capitalize text-slate-800">
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
                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-semibold text-slate-600"
              >
                →
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {calendarDays.map((cell, index) => {
                if (!cell.date) {
                  return <span key={`empty-${index}`} className="h-9" />;
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
                    className={`h-9 rounded-lg text-sm font-semibold tabular-nums transition ${
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

            <div className="mt-4 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs font-medium text-slate-500">С</span>
                <select
                  value={
                    availableTimes.includes(slotFrom)
                      ? slotFrom
                      : (availableTimes[0] ?? "")
                  }
                  onChange={(event) => setSlotFrom(event.target.value)}
                  disabled={availableTimes.length === 0}
                  className="mt-1 w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                <span className="text-xs font-medium text-slate-500">По</span>
                <select
                  value={
                    availableTimes.includes(slotTo)
                      ? slotTo
                      : (availableTimes[availableTimes.length - 1] ?? "")
                  }
                  onChange={(event) => setSlotTo(event.target.value)}
                  disabled={availableTimes.length === 0}
                  className="mt-1 w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="mt-3 w-full rounded-xl bg-[#1e3a8a] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#152a66]"
            >
              Добавить свободный интервал
            </button>

            <ul className="mt-3 space-y-1.5">
              {freeSlots.map((slot) => (
                <li
                  key={slot}
                  className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                >
                  {slot}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
              Карта заказов
            </p>
            <p className="mt-1 text-xs text-slate-500">Маршруты на сегодня</p>

            <div className="relative mt-4 h-56 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#dbe7f5_0%,#e8eef8_45%,#d4e4d8_100%)] ring-1 ring-slate-200">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#94a3b8_1px,transparent_1px),linear-gradient(90deg,#94a3b8_1px,transparent_1px)] [background-size:28px_28px]" />
              <p className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Карта · заглушка
              </p>
              {TODAY_JOBS.map((job, index) => (
                <span
                  key={job.id}
                  className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-[#1e3a8a] text-xs font-bold text-white shadow-md"
                  style={{ left: `${job.x}%`, top: `${job.y}%` }}
                  title={job.address}
                >
                  {index + 1}
                </span>
              ))}
            </div>

            <ul className="mt-4 space-y-2.5">
              {TODAY_JOBS.map((job, index) => (
                <li
                  key={job.id}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold tabular-nums text-slate-900">
                      {job.time}
                    </p>
                    <p className="mt-0.5 text-sm leading-snug text-slate-600">
                      {job.address}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        {/* Blacklist */}
        <Panel className="border border-rose-100 bg-rose-50/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
                Черный список клиентов
              </p>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
                Заявка рассматривается администратором. После подтверждения вы
                больше не будете получать заказы от этого пользователя.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBlacklistOpen(true)}
              className="shrink-0 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
            >
              Запросить блокировку клиента
            </button>
          </div>
        </Panel>

        {/* Radar */}
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <h2 className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900 sm:text-lg">
              Новые заказы рядом с вами
            </h2>
            <span className="text-xs font-semibold tabular-nums text-slate-400">
              {orders.length}
            </span>
          </div>

          {orders.length === 0 ? (
            <Panel>
              <p className="py-4 text-center text-sm text-slate-500">
                Сейчас рядом нет новых заявок. Включите статус «Активен», чтобы
                получать уведомления.
              </p>
            </Panel>
          ) : (
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {orders.map((order) => {
                const earn = netEarn(order.clientTotal);
                return (
                  <li key={order.id}>
                    <Panel>
                      <p className="text-sm font-bold text-slate-900">
                        {order.when}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-slate-600">
                        {order.service}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-400">
                        {order.distance}
                      </p>

                      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3">
                        <p className="text-xs text-slate-400">
                          Чек клиента:{" "}
                          <span className="tabular-nums">
                            {formatByn(order.clientTotal)} BYN
                          </span>
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-unbounded)] text-lg font-semibold tabular-nums text-[#1e3a8a]">
                          Ваш заработок (за вычетом 20%): {formatByn(earn)} BYN
                        </p>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => takeOrder(order.id)}
                          className="min-h-11 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                          Взять заказ
                        </button>
                        <button
                          type="button"
                          onClick={() => skipOrder(order.id)}
                          className="min-h-11 rounded-xl bg-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-rose-100 hover:text-rose-700"
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

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← На главную CleanPlatform
          </Link>
        </div>
      </main>

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
