"use client";

import { useMemo, useState } from "react";
import { AdminModal, FieldRow, StatusPill } from "@/app/components/admin/AdminUi";

type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  cleanings: number;
  city: string;
  status: "ok" | "risk";
};

const CLIENTS: ClientRow[] = [
  {
    id: "cl1",
    name: "Ирина С.",
    phone: "+375 29 700-11-22",
    email: "irina@example.com",
    cleanings: 10,
    city: "Минск",
    status: "ok",
  },
  {
    id: "cl2",
    name: "Павел К.",
    phone: "+375 33 120-45-67",
    email: "pavel@example.com",
    cleanings: 3,
    city: "Минск",
    status: "ok",
  },
  {
    id: "cl3",
    name: "Ольга В.",
    phone: "+375 25 333-44-55",
    email: "olga@example.com",
    cleanings: 1,
    city: "Гродно",
    status: "risk",
  },
];

export default function AdminClientsPage() {
  const [warnId, setWarnId] = useState<string | null>(null);
  const [warnText, setWarnText] = useState("");
  const [sent, setSent] = useState(false);

  const target = useMemo(
    () => CLIENTS.find((c) => c.id === warnId) ?? null,
    [warnId],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="hidden font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900 md:block">
          Анкеты клиентов
        </h2>
        <p className="text-sm text-slate-500 md:mt-1">
          Карточки клиентов платформы и история уборок.
        </p>
      </div>

      <ul className="space-y-3 md:hidden">
        {CLIENTS.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-900">{row.name}</p>
              <StatusPill tone={row.status === "ok" ? "ok" : "warn"}>
                {row.status === "ok" ? "Норма" : "Риск"}
              </StatusPill>
            </div>
            <div className="mt-1 space-y-0">
              <FieldRow label="Телефон">{row.phone}</FieldRow>
              <FieldRow label="Email">{row.email}</FieldRow>
              <FieldRow label="Город">{row.city}</FieldRow>
              <FieldRow label="Уборок">{row.cleanings}</FieldRow>
            </div>
            <button
              type="button"
              onClick={() => {
                setWarnId(row.id);
                setWarnText("");
                setSent(false);
              }}
              className="mt-3 min-h-10 w-full rounded-xl bg-amber-500 text-xs font-bold text-white"
            >
              Отправить предупреждение
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">Клиент</th>
              <th className="px-4 py-3 font-semibold">Контакты</th>
              <th className="px-4 py-3 font-semibold">Город</th>
              <th className="px-4 py-3 font-semibold">Уборок</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {row.name}
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-700">{row.phone}</p>
                  <p className="text-xs text-slate-500">{row.email}</p>
                </td>
                <td className="px-4 py-3">{row.city}</td>
                <td className="px-4 py-3 tabular-nums">{row.cleanings}</td>
                <td className="px-4 py-3">
                  <StatusPill tone={row.status === "ok" ? "ok" : "warn"}>
                    {row.status === "ok" ? "Норма" : "Риск"}
                  </StatusPill>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setWarnId(row.id);
                      setWarnText("");
                      setSent(false);
                    }}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Предупреждение
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {target ? (
        <AdminModal
          title={`Предупреждение · ${target.name}`}
          onClose={() => setWarnId(null)}
        >
          {sent ? (
            <div className="space-y-4 py-4 text-center">
              <p className="font-semibold text-emerald-700">Отправлено клиенту</p>
              <button
                type="button"
                onClick={() => setWarnId(null)}
                className="min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form
              className="flex h-full flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (warnText.trim()) setSent(true);
              }}
            >
              <textarea
                required
                rows={6}
                value={warnText}
                onChange={(e) => setWarnText(e.target.value)}
                placeholder="Текст предупреждения…"
                className="min-h-[8rem] w-full flex-1 resize-none rounded-xl bg-slate-50 px-3 py-3 text-sm outline-none ring-1 ring-slate-200 focus:bg-white"
              />
              <button
                type="submit"
                className="min-h-11 w-full rounded-xl bg-amber-500 text-sm font-bold text-white"
              >
                Отправить
              </button>
            </form>
          )}
        </AdminModal>
      ) : null}
    </div>
  );
}
