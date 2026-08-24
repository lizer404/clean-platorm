"use client";

import { useMemo, useState } from "react";
import { AdminModal, FieldRow, StatusPill } from "@/app/components/admin/AdminUi";

type CleanerRow = {
  id: string;
  name: string;
  city: string;
  phone: string;
  rating: number;
  orders: number;
  status: "active" | "paused" | "blocked";
};

const CLEANERS: CleanerRow[] = [
  {
    id: "c1",
    name: "Дмитрий Орлов",
    city: "Минск",
    phone: "+375 29 111-22-33",
    rating: 4.9,
    orders: 67,
    status: "active",
  },
  {
    id: "c2",
    name: "Елена Мороз",
    city: "Брест",
    phone: "+375 33 555-66-77",
    rating: 4.8,
    orders: 41,
    status: "active",
  },
  {
    id: "c3",
    name: "Анна Ковалёва",
    city: "Гомель",
    phone: "+375 25 888-99-00",
    rating: 4.6,
    orders: 28,
    status: "paused",
  },
];

export default function AdminCleanersPage() {
  const [warnId, setWarnId] = useState<string | null>(null);
  const [warnText, setWarnText] = useState("");
  const [sent, setSent] = useState(false);

  const target = useMemo(
    () => CLEANERS.find((c) => c.id === warnId) ?? null,
    [warnId],
  );

  function openWarn(id: string) {
    setWarnId(id);
    setWarnText("");
    setSent(false);
  }

  function sendWarn() {
    if (!warnText.trim()) return;
    setSent(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="hidden font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900 md:block">
          База клинеров
        </h2>
        <p className="text-sm text-slate-500 md:mt-1">
          Активные специалисты платформы. Можно отправить предупреждение.
        </p>
      </div>

      <ul className="space-y-3 md:hidden">
        {CLEANERS.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-900">{row.name}</p>
              <StatusPill
                tone={
                  row.status === "active"
                    ? "ok"
                    : row.status === "paused"
                      ? "warn"
                      : "bad"
                }
              >
                {row.status === "active"
                  ? "Активен"
                  : row.status === "paused"
                    ? "Пауза"
                    : "Блок"}
              </StatusPill>
            </div>
            <div className="mt-1 space-y-0">
              <FieldRow label="Город">{row.city}</FieldRow>
              <FieldRow label="Телефон">{row.phone}</FieldRow>
              <FieldRow label="Рейтинг">{row.rating.toFixed(1)}</FieldRow>
              <FieldRow label="Заказов">{row.orders}</FieldRow>
            </div>
            <button
              type="button"
              onClick={() => openWarn(row.id)}
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
              <th className="px-4 py-3 font-semibold">Клинер</th>
              <th className="px-4 py-3 font-semibold">Город</th>
              <th className="px-4 py-3 font-semibold">Рейтинг</th>
              <th className="px-4 py-3 font-semibold">Заказы</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {CLEANERS.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.phone}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{row.city}</td>
                <td className="px-4 py-3 tabular-nums">{row.rating.toFixed(1)}</td>
                <td className="px-4 py-3 tabular-nums">{row.orders}</td>
                <td className="px-4 py-3">
                  <StatusPill
                    tone={
                      row.status === "active"
                        ? "ok"
                        : row.status === "paused"
                          ? "warn"
                          : "bad"
                    }
                  >
                    {row.status === "active"
                      ? "Активен"
                      : row.status === "paused"
                        ? "Пауза"
                        : "Блок"}
                  </StatusPill>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openWarn(row.id)}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
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
              <p className="font-semibold text-emerald-700">
                Предупреждение отправлено
              </p>
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
                sendWarn();
              }}
            >
              <p className="text-sm text-slate-500">
                Сообщение увидит специалист в кабинете (mock).
              </p>
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
