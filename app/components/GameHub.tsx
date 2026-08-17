"use client";

import { useEffect, useId, useState } from "react";
import {
  isFirstTimeGame,
  readGameHubState,
  writeGameHubState,
  type CleaningFrequency,
  type GameHubState,
} from "../lib/gameHub";

const FREQUENCY_OPTIONS: { id: CleaningFrequency; label: string }[] = [
  { id: "weekly", label: "Раз в неделю" },
  { id: "biweekly", label: "Раз в 2 недели" },
  { id: "monthly", label: "Раз в месяц" },
  { id: "unknown", label: "Пока не знаю" },
];

type GameHubProps = {
  userPhone: string;
  onBackToOrders: () => void;
};

function OnboardingModal({
  frequency,
  onSelect,
  onStart,
}: {
  frequency: CleaningFrequency | null;
  onSelect: (value: CleaningFrequency) => void;
  onStart: () => void;
}) {
  const titleId = useId();

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-[#5c4a3a]/25 backdrop-blur-[3px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-sheet relative z-10 w-full max-w-md rounded-[28px] bg-[#fff8f1] p-5 shadow-[0_24px_50px_rgba(92,74,58,0.18)] ring-1 ring-[#f0ddc8] sm:p-6"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4784a]">
          Игровая зона
        </p>
        <h2
          id={titleId}
          className="mt-2 font-[family-name:var(--font-unbounded)] text-xl font-semibold leading-snug text-[#4a3728]"
        >
          Добро пожаловать в ваш виртуальный уголок!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#7a6554]">
          Чтобы ваш виртуальный питомец и реальный дом всегда сияли, подскажите,
          как часто вы планируете пользоваться клинингом? (Мы напомним вам за
          неделю до уборки)
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {FREQUENCY_OPTIONS.map((option) => {
            const active = frequency === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#e8a06d] text-white shadow-[0_8px_18px_rgba(232,160,109,0.35)]"
                    : "bg-white text-[#5c4a3a] ring-1 ring-[#efd9c4] hover:bg-[#fff1e4]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!frequency}
          onClick={onStart}
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#5ec4a8] px-4 py-3.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(94,196,168,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#d5cfc8] disabled:shadow-none"
        >
          Начать игру
        </button>
      </div>
    </div>
  );
}

export default function GameHub({ userPhone, onBackToOrders }: GameHubProps) {
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [frequencyDraft, setFrequencyDraft] = useState<CleaningFrequency | null>(
    null,
  );
  const [game, setGame] = useState<GameHubState | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [clickerOpen, setClickerOpen] = useState(false);
  const [dustClicks, setDustClicks] = useState(0);

  useEffect(() => {
    const firstTime = isFirstTimeGame(userPhone);
    const state = readGameHubState(userPhone);
    setGame(state);
    setShowOnboarding(firstTime);
    setFrequencyDraft(state.frequency);
    setReady(true);
  }, [userPhone]);

  function completeOnboarding() {
    if (!frequencyDraft || !game) return;
    const next: GameHubState = {
      ...game,
      onboarded: true,
      frequency: frequencyDraft,
    };
    writeGameHubState(userPhone, next);
    setGame(next);
    setShowOnboarding(false);
  }

  function addCoins(amount: number) {
    setGame((prev) => {
      if (!prev) return prev;
      const next = { ...prev, coins: prev.coins + amount };
      writeGameHubState(userPhone, next);
      return next;
    });
  }

  if (!ready || !game) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center text-sm text-[#7a6554]">
        Открываем игровой уголок…
      </div>
    );
  }

  const progress = Math.min(100, (game.cleaningsTowardBox / game.boxGoal) * 100);

  return (
    <div className="relative mx-auto w-full max-w-3xl animate-fade-up px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fff6ec] via-[#f3faf6] to-[#eef4ff] p-4 shadow-[0_16px_40px_rgba(92,74,58,0.08)] ring-1 ring-[#f0ddc8]/80 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4784a]">
              Игровой хаб
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-unbounded)] text-xl font-semibold text-[#4a3728] sm:text-2xl">
              Ваш уютный уголок
            </h1>
          </div>
          <button
            type="button"
            onClick={onBackToOrders}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#7a6554] ring-1 ring-[#efd9c4] transition hover:bg-white hover:text-[#4a3728]"
          >
            Вернуться к заказам
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#4a3728] shadow-sm ring-1 ring-[#f0ddc8]">
            <span aria-hidden>🪙</span>
            <span className="tabular-nums">{game.coins}</span>
            <span className="font-medium text-[#7a6554]">монеток</span>
          </div>
          <div className="min-w-[200px] flex-1 rounded-2xl bg-white/80 px-3.5 py-2.5 ring-1 ring-[#e5f0ea]">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#5c7a6c]">
              <span>Сюрприз-Бокс</span>
              <span className="tabular-nums">
                {game.cleaningsTowardBox}/{game.boxGoal} уборок
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e7f2ec]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8fd6b8] to-[#5ec4a8] transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[28px] bg-[#fff9f3] p-5 shadow-[0_14px_36px_rgba(92,74,58,0.07)] ring-1 ring-[#f0ddc8] sm:p-6">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#ffe8d2] via-[#fff4ea] to-[#e9f7f1] px-5 py-10 text-center sm:py-14">
          <div className="pointer-events-none absolute -left-6 top-6 h-24 w-24 rounded-full bg-[#ffd7b8]/50 blur-2xl" />
          <div className="pointer-events-none absolute -right-4 bottom-4 h-28 w-28 rounded-full bg-[#b8ebd8]/45 blur-2xl" />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4784a]">
            Тамагочи
          </p>
          <h2 className="relative mt-2 font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-[#4a3728]">
            Ваша комната / Питомец
          </h2>
          <p className="relative mx-auto mt-2 max-w-sm text-sm text-[#7a6554]">
            Здесь появится уютная комната и питомец. Пока это тёплая заглушка —
            копите монетки и украшайте пространство.
          </p>
          <button
            type="button"
            onClick={() => setShopOpen(true)}
            className="relative mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#e8a06d] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(232,160,109,0.3)] transition hover:brightness-95"
          >
            Магазин
          </button>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4784a]">
          Мини-игры
        </h3>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => {
              setDustClicks(0);
              setClickerOpen(true);
            }}
            className="min-w-[240px] flex-1 rounded-[24px] bg-white p-4 text-left shadow-[0_10px_28px_rgba(92,74,58,0.06)] ring-1 ring-[#e8f3ee] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(92,74,58,0.1)] sm:min-w-[260px]"
          >
            <span className="inline-flex rounded-full bg-[#e9f7f1] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#3d8f78]">
              Играть
            </span>
            <p className="mt-3 font-[family-name:var(--font-unbounded)] text-base font-semibold text-[#4a3728]">
              Пыльный кликер
            </p>
            <p className="mt-1 text-sm text-[#7a6554]">Заработать монеты</p>
          </button>

          <div className="min-w-[240px] flex-1 rounded-[24px] bg-[#f7f3ee] p-4 text-left opacity-80 ring-1 ring-[#eadfd4] sm:min-w-[260px]">
            <span className="inline-flex rounded-full bg-[#efe7de] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9a8776]">
              Скоро
            </span>
            <p className="mt-3 font-[family-name:var(--font-unbounded)] text-base font-semibold text-[#7a6554]">
              Уютный три-в-ряд
            </p>
            <p className="mt-1 text-sm text-[#9a8776]">Скоро</p>
          </div>
        </div>
      </section>

      {showOnboarding ? (
        <OnboardingModal
          frequency={frequencyDraft}
          onSelect={setFrequencyDraft}
          onStart={completeOnboarding}
        />
      ) : null}

      {shopOpen ? (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-[#5c4a3a]/25 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-sm rounded-[28px] bg-[#fff8f1] p-5 shadow-[0_24px_50px_rgba(92,74,58,0.18)] ring-1 ring-[#f0ddc8]">
            <h3 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[#4a3728]">
              Магазин декора
            </h3>
            <p className="mt-2 text-sm text-[#7a6554]">
              Пока витрина в подготовке. У вас {game.coins} 🪙 — копите монетки в
              мини-играх.
            </p>
            <button
              type="button"
              onClick={() => setShopOpen(false)}
              className="mt-5 flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#e8a06d] text-sm font-bold text-white"
            >
              Понятно
            </button>
          </div>
        </div>
      ) : null}

      {clickerOpen ? (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-[#5c4a3a]/25 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-sm rounded-[28px] bg-[#fff8f1] p-5 shadow-[0_24px_50px_rgba(92,74,58,0.18)] ring-1 ring-[#f0ddc8]">
            <h3 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-[#4a3728]">
              Пыльный кликер
            </h3>
            <p className="mt-2 text-sm text-[#7a6554]">
              Нажимайте по пыли — каждые 5 кликов дают +1 монетку.
            </p>
            <button
              type="button"
              onClick={() => {
                const next = dustClicks + 1;
                setDustClicks(next);
                if (next % 5 === 0) addCoins(1);
              }}
              className="mt-5 flex min-h-28 w-full flex-col items-center justify-center rounded-[24px] bg-gradient-to-b from-[#ffe8d2] to-[#e9f7f1] text-center shadow-inner ring-1 ring-[#f0ddc8] transition active:scale-[0.98]"
            >
              <span className="text-3xl" aria-hidden>
                ✨
              </span>
              <span className="mt-2 text-sm font-bold text-[#4a3728]">
                Убрать пыль
              </span>
              <span className="mt-1 text-xs text-[#7a6554]">
                Кликов: {dustClicks}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setClickerOpen(false)}
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[#7a6554] ring-1 ring-[#efd9c4]"
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
