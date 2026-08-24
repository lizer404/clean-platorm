"use client";

import { useEffect, useId, useState } from "react";

const LOYALTY_SEEN_KEY = "cleanplatform.loyalty10.seen";
const TELEGRAM_MANAGER = "@cleanplatform_manager";

type LoyaltyModalProps = {
  completedCount: number;
  userEmail?: string | null;
  onClose: () => void;
};

export function shouldShowLoyaltyModal(completedCount: number) {
  if (typeof window === "undefined") return false;
  if (completedCount < 10) return false;
  return window.localStorage.getItem(LOYALTY_SEEN_KEY) !== "1";
}

export function markLoyaltySeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOYALTY_SEEN_KEY, "1");
}

/** Mock email stub for tracker instructions. */
export function mockSendLoyaltyEmail(to: string, body: string) {
  if (typeof window === "undefined") return;
  const log = {
    to,
    subject: "CleanPlatform — создание личного трекера",
    body,
    at: new Date().toISOString(),
  };
  window.localStorage.setItem(
    "cleanplatform.loyaltyEmail.mock",
    JSON.stringify(log),
  );
  console.info("[mock email]", log);
}

export default function LoyaltyModal({
  completedCount,
  userEmail,
  onClose,
}: LoyaltyModalProps) {
  const titleId = useId();
  const [step, setStep] = useState<"choose" | "tracker" | "gift">("choose");

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        markLoyaltySeen();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function close() {
    markLoyaltySeen();
    onClose();
  }

  function chooseGift() {
    setStep("gift");
  }

  function chooseTracker() {
    const email = userEmail || "client@cleanplatform.by";
    const body = `Отлично! Для создания трекера напишите нашему менеджеру в Telegram ${TELEGRAM_MANAGER} и укажите ваши пожелания.`;
    mockSendLoyaltyEmail(email, body);
    setStep("tracker");
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f766e] px-5 py-6 text-white sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            Программа лояльности · {completedCount} уборок
          </p>
          <h2
            id={titleId}
            className="mt-2 font-[family-name:var(--font-unbounded)] text-xl font-semibold leading-snug sm:text-2xl"
          >
            Поздравляем с 10-й уборкой!
          </h2>
          <p className="mt-2 text-sm text-white/85">
            Вы с нами уже давно — выберите подарок или персональный трекер
            порядка.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {step === "choose" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={chooseGift}
                className="rounded-2xl bg-amber-50 p-4 text-left ring-1 ring-amber-200 transition hover:bg-amber-100"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  Вариант А
                </p>
                <p className="mt-2 font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
                  Получить подарок
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Стандартный бонус лояльности — скидка или подарочная услуга.
                </p>
              </button>
              <button
                type="button"
                onClick={chooseTracker}
                className="rounded-2xl bg-emerald-50 p-4 text-left ring-1 ring-emerald-200 transition hover:bg-emerald-100"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Вариант Б
                </p>
                <p className="mt-2 font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
                  Создание личного трекера/планера
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Мы разработаем под вас индивидуальный планер для поддержания
                  порядка.
                </p>
              </button>
            </div>
          ) : null}

          {step === "gift" ? (
            <div className="space-y-4 text-center">
              <p className="text-base font-semibold text-slate-900">
                Подарок активирован
              </p>
              <p className="text-sm text-slate-600">
                Скидка 15% на следующую генеральную уборку уже в вашем кабинете.
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1e3a8a] px-5 text-sm font-bold text-white"
              >
                Отлично
              </button>
            </div>
          ) : null}

          {step === "tracker" ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-700">
                Отлично! Для создания трекера напишите нашему менеджеру в
                Telegram{" "}
                <a
                  href={`https://t.me/${TELEGRAM_MANAGER.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#1e3a8a] underline-offset-2 hover:underline"
                >
                  {TELEGRAM_MANAGER}
                </a>{" "}
                и укажите ваши пожелания.
              </p>
              <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500 ring-1 ring-slate-200">
                Дубликат инструкции отправлен на email{" "}
                <span className="font-medium text-slate-700">
                  {userEmail || "client@cleanplatform.by"}
                </span>{" "}
                (mock-отправка).
              </p>
              <button
                type="button"
                onClick={close}
                className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1e3a8a] text-sm font-bold text-white"
              >
                Понятно
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
