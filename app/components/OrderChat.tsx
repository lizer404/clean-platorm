"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatMessage = {
  id: string;
  author: "system" | "client" | "cleaner" | "admin";
  name: string;
  text: string;
  time: string;
};

type OrderChatProps = {
  orderId: string;
  address: string;
  cleaners: { id: string; name: string; initials: string; accent: string }[];
  userPhone: string | null;
  onClose: () => void;
};

function nowTime() {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export default function OrderChat({
  orderId,
  address,
  cleaners,
  userPhone,
  onClose,
}: OrderChatProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "sys-1",
      author: "system",
      name: "Система",
      text: `Защищённый чат заказа ${orderId} создан. Переписка автоматически фиксируется для проверки администратором.`,
      time: nowTime(),
    },
    {
      id: "admin-1",
      author: "admin",
      name: "Администратор",
      text: "Чат под контролем. Уточните детали заезда и доступы — исполнителям уже отправлено уведомление.",
      time: nowTime(),
    },
    {
      id: "cleaner-1",
      author: "cleaner",
      name: cleaners[0]?.name ?? "Клинер",
      text: `Здравствуйте! Адрес принял: ${address}. Напишу, когда выедем.`,
      time: nowTime(),
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `client-${Date.now()}`,
        author: "client",
        name: "Вы",
        text,
        time: nowTime(),
      },
    ]);
    setDraft("");
  }

  return (
    <div className="animate-sheet overflow-hidden rounded-3xl bg-panel shadow-[0_18px_50px_rgba(17,24,39,0.1)]">
      <div className="border-b border-line bg-brand px-4 py-4 text-white sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Защищённый чат заказа
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-unbounded)] text-lg font-semibold">
              {orderId}
            </h3>
            <p className="mt-1 text-xs text-white/80">
              {userPhone ? `Клиент: ${userPhone}` : "Клиент авторизован"} · {address}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
          >
            Закрыть
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {cleaners.map((cleaner) => (
            <span
              key={cleaner.id}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ backgroundColor: cleaner.accent }}
              >
                {cleaner.initials}
              </span>
              {cleaner.name}
            </span>
          ))}
        </div>
      </div>

      <div className="border-b border-amber-200/70 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800 sm:px-5">
        Чат автоматически зафиксирован для проверки администратором. Сообщения нельзя удалить.
      </div>

      <div ref={listRef} className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.map((message) => {
          const mine = message.author === "client";
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  message.author === "system"
                    ? "bg-plaque text-muted"
                    : message.author === "admin"
                      ? "bg-brand-soft text-brand"
                      : mine
                        ? "bg-brand text-white"
                        : "bg-plaque text-foreground"
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.08em] opacity-70">
                  <span>{message.name}</span>
                  <span>{message.time}</span>
                </div>
                <p className="leading-relaxed">{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="border-t border-line p-3 sm:p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Напишите сообщение исполнителям…"
            className="min-w-0 flex-1 rounded-2xl bg-plaque px-4 py-3 text-sm font-medium text-foreground outline-none ring-1 ring-transparent focus:bg-white focus:ring-mint/50"
          />
          <button
            type="submit"
            className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-deep"
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}
