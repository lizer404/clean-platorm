"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import GameHub from "./GameHub";
import OrderChat from "./OrderChat";
import {
  saveRepeatBooking,
  type CleaningTypeId,
  type ExtraId,
} from "../lib/repeatBooking";

type OrderStatus = "active" | "completed";

type ClientOrder = {
  id: string;
  typeLabel: string;
  cleaningType: CleaningTypeId;
  startLabel: string;
  price: string;
  address: string;
  status: OrderStatus;
  statusLabel: string;
  rooms: number;
  baths: number;
  area: number;
  extras: ExtraId[];
  cleaner: {
    id: string;
    name: string;
    initials: string;
    accent: string;
  };
  /** When status became completed — used for 2h review window */
  completedAt: number | null;
};

const REVIEW_WINDOW_MS = 2 * 60 * 60 * 1000;

function buildOrders(now: number): ClientOrder[] {
  return [
    {
      id: "ord-active",
      typeLabel: "Поддерживающая уборка",
      cleaningType: "maintenance",
      startLabel: "18 августа, 14:00",
      price: "89 BYN",
      address: "г. Минск, ул. Независимости, 12",
      status: "active",
      statusLabel: "Клинер в пути",
      rooms: 2,
      baths: 1,
      area: 55,
      extras: ["windows"],
      cleaner: {
        id: "dmitry",
        name: "Дмитрий Орлов",
        initials: "ДО",
        accent: "#22A88F",
      },
      completedAt: null,
    },
    {
      id: "ord-1",
      typeLabel: "Генеральная уборка",
      cleaningType: "general",
      startLabel: "2 августа, 10:00",
      price: "156 BYN",
      address: "г. Минск, пр. Победителей, 5",
      status: "completed",
      statusLabel: "Завершена",
      rooms: 3,
      baths: 2,
      area: 78,
      extras: ["fridge", "oven", "windows"],
      cleaner: {
        id: "elena",
        name: "Елена Мороз",
        initials: "ЕМ",
        accent: "#7C5CFC",
      },
      // Still within 2h review window (mock)
      completedAt: now - 45 * 60 * 1000,
    },
    {
      id: "ord-2",
      typeLabel: "Поддерживающая уборка",
      cleaningType: "maintenance",
      startLabel: "19 июля, 16:00",
      price: "72 BYN",
      address: "г. Минск, ул. Независимости, 12",
      status: "completed",
      statusLabel: "Завершена",
      rooms: 1,
      baths: 1,
      area: 42,
      extras: [],
      cleaner: {
        id: "anna",
        name: "Анна Ковалёва",
        initials: "АК",
        accent: "#5B8DEF",
      },
      // Outside 2h window
      completedAt: now - 5 * 60 * 60 * 1000,
    },
  ];
}

/**
 * Review window: exactly 2 hours after the order becomes "Завершен".
 * Example: if completedAt is 12:00, the button stays until 14:00 inclusive.
 * After 14:00 (now > completedAt + 2h) the button is fully hidden.
 */
function canLeaveReview(order: ClientOrder, now: number) {
  if (order.status !== "completed" || !order.completedAt) return false;
  const deadline = order.completedAt + REVIEW_WINDOW_MS;
  return now <= deadline;
}

function downloadReceipt(order: ClientOrder) {
  const lines = [
    "CleanPlatform — чек",
    `Заказ: ${order.id}`,
    `Услуга: ${order.typeLabel}`,
    `Начало: ${order.startLabel}`,
    `Адрес: ${order.address}`,
    `Клинер: ${order.cleaner.name}`,
    `Сумма: ${order.price}`,
    `Статус: ${order.statusLabel}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `cleanplatform-receipt-${order.id}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ClientDashboard() {
  const router = useRouter();
  const { isLoggedIn, authReady, userPhone, openAccountModal, logout } = useAuth();
  const [now, setNow] = useState(() => Date.now());
  const [view, setView] = useState<"orders" | "game">("orders");
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewSent, setReviewSent] = useState<Record<string, boolean>>({});

  const orders = useMemo(() => buildOrders(now), [now]);
  const activeOrder = orders.find((order) => order.status === "active") ?? null;
  const pastOrders = orders.filter((order) => order.status === "completed");
  const chatOrder = orders.find((order) => order.id === chatOrderId) ?? null;
  const reviewOrder = orders.find((order) => order.id === reviewOrderId) ?? null;

  useEffect(() => {
    if (!authReady || isLoggedIn) return;
    const timer = window.setTimeout(() => {
      openAccountModal();
      router.replace("/");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authReady, isLoggedIn, openAccountModal, router]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  function repeatOrder(order: ClientOrder) {
    saveRepeatBooking({
      cleaningType: order.cleaningType,
      rooms: order.rooms,
      baths: order.baths,
      area: order.area,
      extras: order.extras,
      cleanerId: order.cleaner.id,
      cleanerName: order.cleaner.name,
      cleanerInitials: order.cleaner.initials,
      cleanerAccent: order.cleaner.accent,
    });
    router.push("/#calculator");
  }

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

  if (view === "game") {
    return (
      <GameHub
        userPhone={userPhone}
        onBackToOrders={() => setView("orders")}
      />
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
            Здравствуйте!
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setView("game")}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1e4] px-3.5 py-2 text-sm font-semibold text-[#c4784a] ring-1 ring-[#f0ddc8] transition hover:bg-[#ffe8d2]"
          >
            <span aria-hidden>🎮</span>
            Игровая зона
          </button>
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand">
            <span className="tabular-nums">5.0</span>
            <span aria-hidden className="text-amber-500">
              ★
            </span>
            <span className="text-xs font-medium text-muted">рейтинг</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center rounded-full border border-line bg-transparent px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-plaque hover:text-foreground"
          >
            Выйти
          </button>
        </div>
      </div>

      {activeOrder ? (
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Активный заказ
          </h2>
          <article className="rounded-3xl bg-panel p-5 shadow-[0_12px_40px_rgba(17,24,39,0.06)] ring-1 ring-line/80 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-foreground">
                  {activeOrder.typeLabel}
                </p>
                <p className="mt-1 text-sm text-muted">{activeOrder.startLabel}</p>
                <p className="mt-1 text-sm text-muted">{activeOrder.address}</p>
                <p className="mt-2 text-sm font-medium text-foreground/80">
                  Клинер: {activeOrder.cleaner.name}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1.5 text-xs font-semibold text-success">
                <span aria-hidden>🟢</span>
                {activeOrder.statusLabel}
              </span>
            </div>

            <div className="mt-5 border-t border-line/80 pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                Стоимость
              </p>
              <p className="mt-1 font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-foreground">
                {activeOrder.price}
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setChatOrderId(activeOrder.id)}
                className="flex min-h-11 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep sm:w-auto sm:min-w-[220px]"
              >
                Связаться с клинером
              </button>
            </div>
          </article>
        </section>
      ) : null}

      <section className="mt-10 space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          История уборок
        </h2>
        <ul className="space-y-3">
          {pastOrders.map((order) => {
            const showReview =
              canLeaveReview(order, now) && !reviewSent[order.id];
            return (
              <li
                key={order.id}
                className="rounded-3xl bg-plaque/70 p-4 ring-1 ring-line/60 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">
                      {order.typeLabel}
                    </p>
                    <p className="mt-1 text-sm text-muted">{order.startLabel}</p>
                    <p className="mt-1 text-sm text-muted">
                      Клинер: {order.cleaner.name}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {order.statusLabel}
                    </p>
                  </div>
                  <p className="text-base font-semibold tabular-nums text-foreground/70">
                    {order.price}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => repeatOrder(order)}
                    className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-soft"
                  >
                    Повторить уборку
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadReceipt(order)}
                    className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-line bg-transparent px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-panel hover:text-foreground"
                  >
                    Скачать чек (PDF)
                  </button>
                  {showReview ? (
                    <button
                      type="button"
                      onClick={() => {
                        setReviewOrderId(order.id);
                        setReviewText("");
                      }}
                      className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-brand-soft px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-line"
                    >
                      Оставить отзыв
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
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

      {chatOrder ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-foreground/35 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <OrderChat
              orderId={chatOrder.id}
              address={chatOrder.address}
              cleaners={[chatOrder.cleaner]}
              userPhone={userPhone}
              onClose={() => setChatOrderId(null)}
            />
          </div>
        </div>
      ) : null}

      {reviewOrder ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-foreground/35 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-panel p-5 shadow-[0_24px_60px_rgba(17,24,39,0.2)] sm:p-6">
            <h3 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-foreground">
              Отзыв о заказе
            </h3>
            <p className="mt-1 text-sm text-muted">
              {reviewOrder.typeLabel} · {reviewOrder.cleaner.name}
            </p>
            <p className="mt-2 text-xs text-muted">
              Окно отзыва: 2 часа после завершения.
            </p>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              placeholder="Как прошла уборка?"
              className="mt-4 w-full resize-none rounded-2xl bg-plaque px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setReviewOrderId(null)}
                className="min-h-11 flex-1 rounded-2xl bg-plaque px-4 text-sm font-semibold text-muted"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={!reviewText.trim()}
                onClick={() => {
                  setReviewSent((prev) => ({ ...prev, [reviewOrder.id]: true }));
                  setReviewOrderId(null);
                }}
                className="min-h-11 flex-1 rounded-2xl bg-brand px-4 text-sm font-bold text-white disabled:bg-slate-300"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
