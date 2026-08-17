"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

const ACTIVE_ORDER = {
  date: "18 августа 2026",
  time: "14:00–17:00",
  type: "Поддерживающая уборка",
  price: "89 BYN",
  address: "г. Минск, ул. Независимости, 12",
  status: "Клинер в пути" as const,
};

const PAST_ORDERS = [
  {
    id: "ord-1",
    date: "2 августа 2026",
    time: "10:00–13:00",
    type: "Генеральная уборка",
    price: "156 BYN",
    status: "Завершена",
  },
  {
    id: "ord-2",
    date: "19 июля 2026",
    time: "16:00–18:00",
    type: "Поддерживающая уборка",
    price: "72 BYN",
    status: "Завершена",
  },
] as const;

export default function ClientDashboard() {
  const router = useRouter();
  const { isLoggedIn, authReady, userPhone, openAccountModal } = useAuth();

  useEffect(() => {
    if (!authReady || isLoggedIn) return;
    const timer = window.setTimeout(() => {
      openAccountModal();
      router.replace("/");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authReady, isLoggedIn, openAccountModal, router]);

  if (!authReady) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center text-sm text-muted">
        Загружаем кабинет…
      </div>
    );
  }

  if (!isLoggedIn || !userPhone) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center text-sm text-muted">
        Открываем вход в аккаунт…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-up px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            Личный кабинет
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-[1.45rem] font-semibold leading-snug tracking-tight text-foreground sm:text-[1.75rem]">
            Здравствуйте, {userPhone}!
          </h1>
        </div>
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand">
          <span className="tabular-nums">5.0</span>
          <span aria-hidden className="text-amber-500">
            ★
          </span>
          <span className="text-xs font-medium text-muted">рейтинг</span>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Активный заказ
        </h2>
        <article className="rounded-3xl bg-panel p-5 shadow-[0_12px_40px_rgba(17,24,39,0.06)] ring-1 ring-line/80 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-foreground">
                {ACTIVE_ORDER.type}
              </p>
              <p className="mt-1 text-sm text-muted">
                {ACTIVE_ORDER.date} · {ACTIVE_ORDER.time}
              </p>
              <p className="mt-1 text-sm text-muted">{ACTIVE_ORDER.address}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1.5 text-xs font-semibold text-success">
              <span aria-hidden>🟢</span>
              {ACTIVE_ORDER.status}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3 border-t border-line/80 pt-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                Стоимость
              </p>
              <p className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-foreground">
                {ACTIVE_ORDER.price}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              disabled
              className="min-h-11 cursor-not-allowed rounded-2xl bg-plaque px-4 py-3 text-sm font-semibold text-muted"
            >
              Связаться с клинером
            </button>
            <button
              type="button"
              disabled
              className="min-h-11 cursor-not-allowed rounded-2xl border border-line bg-transparent px-4 py-3 text-sm font-semibold text-muted"
            >
              Скачать чек (PDF)
            </button>
          </div>
        </article>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          История уборок
        </h2>
        <ul className="space-y-3">
          {PAST_ORDERS.map((order) => (
            <li
              key={order.id}
              className="rounded-3xl bg-plaque/70 p-4 ring-1 ring-line/60 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground/80">
                    {order.type}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {order.date} · {order.time}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                    {order.status}
                  </p>
                </div>
                <p className="text-base font-semibold tabular-nums text-foreground/70">
                  {order.price}
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/#calculator"
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-soft"
                >
                  Повторить уборку
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link
          href="/"
          className="text-sm font-medium text-muted transition hover:text-foreground"
        >
          ← На главную
        </Link>
      </div>
    </div>
  );
}
