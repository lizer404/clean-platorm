"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadTickets, type SupportTicket } from "../../lib/tickets";

function statusLabel(status: SupportTicket["status"]) {
  if (status === "new") return "Новое";
  if (status === "in_progress") return "В работе";
  return "Закрыто";
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    setTickets(loadTickets());
    const onStorage = () => setTickets(loadTickets());
    window.addEventListener("storage", onStorage);
    const id = window.setInterval(() => setTickets(loadTickets()), 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-full bg-[#eef1f6]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Кабинет администратора · заглушка
            </p>
            <h1 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-slate-900 sm:text-xl">
              Обращения пользователей
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
          >
            На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6">
        <p className="text-sm text-slate-500">
          Тикеты приходят из формы «Сообщить об ошибке / Поддержка» у клиентов и
          клинеров (mock · localStorage).
        </p>

        {tickets.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            Обращений пока нет. Отправьте тестовую заявку из меню поддержки.
          </div>
        ) : (
          <ul className="space-y-3">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {ticket.id} ·{" "}
                    {ticket.source === "cleaner" ? "Клинер" : "Клиент"}
                  </p>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-100">
                    {statusLabel(ticket.status)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-800">
                  {ticket.description}
                </p>
                {ticket.fileNames.length > 0 ? (
                  <p className="mt-2 text-xs text-slate-500">
                    Файлы: {ticket.fileNames.join(", ")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">Без вложений</p>
                )}
                <p className="mt-2 text-[11px] text-slate-400">
                  {new Date(ticket.createdAt).toLocaleString("ru-RU")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
