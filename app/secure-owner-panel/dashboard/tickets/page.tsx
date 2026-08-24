"use client";

import { useEffect, useState } from "react";
import { loadTickets, type SupportTicket } from "@/app/lib/tickets";

function statusLabel(status: SupportTicket["status"]) {
  if (status === "new") return "Новое";
  if (status === "in_progress") return "В работе";
  return "Закрыто";
}

export default function AdminTicketsTabPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    setTickets(loadTickets());
    const id = window.setInterval(() => setTickets(loadTickets()), 2000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900">
          Обращения и Поддержка
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Баг-репорты и обращения клиентов/клинеров (mock · localStorage).
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">
          Обращений пока нет.
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
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.fileNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                    >
                      📎 {name}
                    </span>
                  ))}
                </div>
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
    </div>
  );
}
