"use client";

import { useEffect, useState } from "react";
import { loadTickets, type SupportTicket } from "@/app/lib/tickets";
import { FieldRow, StatusPill } from "@/app/components/admin/AdminUi";

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
        <h2 className="hidden font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900 md:block">
          Обращения и Поддержка
        </h2>
        <p className="text-sm text-slate-500 md:mt-1">
          Баг-репорты и обращения клиентов/клинеров (mock · localStorage).
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">
          Обращений пока нет.
        </div>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {ticket.id}
                  </p>
                  <StatusPill tone="warn">{statusLabel(ticket.status)}</StatusPill>
                </div>
                <div className="mt-1 space-y-0">
                  <FieldRow label="Источник">
                    {ticket.source === "cleaner" ? "Клинер" : "Клиент"}
                  </FieldRow>
                  <FieldRow label="Описание">
                    <span className="block text-left sm:text-right">
                      {ticket.description}
                    </span>
                  </FieldRow>
                  <FieldRow label="Файлы">
                    {ticket.fileNames.length
                      ? ticket.fileNames.join(", ")
                      : "Нет"}
                  </FieldRow>
                  <FieldRow label="Дата">
                    {new Date(ticket.createdAt).toLocaleString("ru-RU")}
                  </FieldRow>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Источник</th>
                  <th className="px-4 py-3 font-semibold">Описание</th>
                  <th className="px-4 py-3 font-semibold">Вложения</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                  <th className="px-4 py-3 font-semibold">Дата</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-100 align-top">
                    <td className="px-4 py-3 font-mono text-xs">{ticket.id}</td>
                    <td className="px-4 py-3">
                      {ticket.source === "cleaner" ? "Клинер" : "Клиент"}
                    </td>
                    <td className="max-w-sm px-4 py-3 text-slate-700">
                      {ticket.description}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {ticket.fileNames.length
                        ? ticket.fileNames.join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone="warn">
                        {statusLabel(ticket.status)}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(ticket.createdAt).toLocaleString("ru-RU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
