"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PresenceStatus = "active" | "dnd";

type RadarOrder = {
  id: string;
  when: string;
  service: string;
  clientTotal: number;
  cleanerEarn: number;
  distance: string;
};

const INITIAL_ORDERS: RadarOrder[] = [
  {
    id: "radar-1",
    when: "Завтра, 14:00",
    service: "2 комнаты, 1 санузел + мытье окон",
    clientTotal: 100,
    cleanerEarn: 82,
    distance: "1.2 км",
  },
  {
    id: "radar-2",
    when: "Пт, 10:00",
    service: "3 комнаты, 2 санузла · генеральная",
    clientTotal: 156,
    cleanerEarn: 128,
    distance: "2.4 км",
  },
  {
    id: "radar-3",
    when: "Сб, 16:30",
    service: "1 комната, 1 санузел · поддерживающая",
    clientTotal: 72,
    cleanerEarn: 59,
    distance: "800 м",
  },
];

function formatByn(value: number) {
  return new Intl.NumberFormat("ru-BY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CleanerDashboard() {
  const [presence, setPresence] = useState<PresenceStatus>("active");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [questDone, setQuestDone] = useState(3);
  const [toast, setToast] = useState("");
  const [tipOpen, setTipOpen] = useState(false);

  const questGoal = 5;
  const questProgress = Math.min(100, (questDone / questGoal) * 100);
  const balance = 320;

  const presenceLabel = useMemo(
    () =>
      presence === "active" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
          <span aria-hidden>🟢</span> Активен
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
          <span aria-hidden>🔴</span> Не беспокоить
        </span>
      ),
    [presence],
  );

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

  return (
    <div className="min-h-full bg-[#eef1f6]">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Кабинет специалиста
            </p>
            <h1 className="mt-0.5 truncate font-[family-name:var(--font-unbounded)] text-lg font-semibold text-slate-900">
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
            {presenceLabel}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg space-y-4 px-4 py-4 pb-10">
        {/* Metrics */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Рейтинг
            </p>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold tabular-nums text-slate-900">
              4.9{" "}
              <span className="text-2xl text-amber-500" aria-hidden>
                ★
              </span>
            </p>
          </div>

          <div className="relative rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Индекс активности
              </p>
              <button
                type="button"
                onClick={() => setTipOpen((open) => !open)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500"
                aria-label="Подсказка по индексу активности"
              >
                ?
              </button>
            </div>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-3xl font-semibold tabular-nums text-slate-900">
              95%
            </p>
            {tipOpen ? (
              <p className="absolute left-3 right-3 top-[calc(100%+6px)] z-10 rounded-xl bg-slate-900 px-3 py-2 text-xs leading-snug text-white shadow-lg">
                Держите выше 90%, чтобы получать премиум-заказы
              </p>
            ) : null}
          </div>
        </section>

        {/* Finance + quest */}
        <section className="space-y-3">
          <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  К выплате на счет
                </p>
                <p className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold tabular-nums text-slate-900">
                  {formatByn(balance)} BYN
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("История выплат скоро будет доступна")}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                История выплат
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#152a66] p-4 text-white shadow-[0_12px_28px_rgba(30,58,138,0.28)]">
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
          </div>
        </section>

        {/* Schedule & price */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => showToast("Раздел расписания в разработке")}
            className="rounded-2xl bg-white p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 transition hover:ring-slate-300 active:scale-[0.99]"
          >
            <span className="text-xl" aria-hidden>
              📅
            </span>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
              Мое расписание
            </p>
            <p className="mt-1 text-sm leading-snug text-slate-500">
              Укажите свободные дни и часы
            </p>
          </button>
          <button
            type="button"
            onClick={() => showToast("Раздел прайс-листа в разработке")}
            className="rounded-2xl bg-white p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 transition hover:ring-slate-300 active:scale-[0.99]"
          >
            <span className="text-xl" aria-hidden>
              💰
            </span>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
              Мой прайс-лист
            </p>
            <p className="mt-1 text-sm leading-snug text-slate-500">
              Настройка пакетов и доп. услуг
            </p>
          </button>
        </section>

        {/* Radar */}
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <h2 className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
              Новые заказы рядом с вами
            </h2>
            <span className="text-xs font-semibold tabular-nums text-slate-400">
              {orders.length}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-slate-500 ring-1 ring-slate-200/70">
              Сейчас рядом нет новых заявок. Включите статус «Активен», чтобы
              получать уведомления.
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {order.when}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-slate-600">
                        {order.service}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-400">
                        {order.distance}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3">
                    <p className="text-xs text-slate-400">
                      Чек клиента:{" "}
                      <span className="tabular-nums">
                        {formatByn(order.clientTotal)} BYN
                      </span>
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-unbounded)] text-lg font-semibold tabular-nums text-[#1e3a8a]">
                      Ваш заработок (за вычетом 18%):{" "}
                      {formatByn(order.cleanerEarn)} BYN
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => takeOrder(order.id)}
                      className="min-h-11 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.99]"
                    >
                      Взять заказ
                    </button>
                    <button
                      type="button"
                      onClick={() => skipOrder(order.id)}
                      className="min-h-11 rounded-xl bg-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-rose-100 hover:text-rose-700 active:scale-[0.99]"
                    >
                      Пропустить
                    </button>
                  </div>
                </li>
              ))}
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
