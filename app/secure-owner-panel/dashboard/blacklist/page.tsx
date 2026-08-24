"use client";

import { useEffect, useState } from "react";
import {
  loadBlacklistRequests,
  saveBlacklistRequests,
  type BlacklistRequest,
} from "@/app/lib/adminData";
import { FieldRow, StatusPill } from "@/app/components/admin/AdminUi";

function statusMeta(status: BlacklistRequest["status"]) {
  if (status === "approved")
    return { tone: "ok" as const, label: "Блокировка подтверждена" };
  if (status === "rejected")
    return { tone: "neutral" as const, label: "Отклонено" };
  return { tone: "bad" as const, label: "Ожидает решения" };
}

export default function AdminBlacklistPage() {
  const [items, setItems] = useState<BlacklistRequest[]>([]);

  useEffect(() => {
    setItems(loadBlacklistRequests());
  }, []);

  function decide(id: string, status: "approved" | "rejected") {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, status } : item,
      );
      saveBlacklistRequests(next);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="hidden font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900 md:block">
          Черный список
        </h2>
        <p className="text-sm text-slate-500 md:mt-1">
          Запросы клинеров на блокировку клиентов.
        </p>
      </div>

      <ul className="space-y-3 md:hidden">
        {items.map((item) => {
          const meta = statusMeta(item.status);
          return (
            <li
              key={item.id}
              className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.cleanerName}</p>
                <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
              </div>
              <div className="mt-1 space-y-0">
                <FieldRow label="Заказ / клиент">{item.orderOrClient}</FieldRow>
                <FieldRow label="Причина">
                  <span className="block text-left sm:text-right">
                    {item.reason}
                  </span>
                </FieldRow>
                <FieldRow label="Дата">
                  {new Date(item.createdAt).toLocaleString("ru-RU")}
                </FieldRow>
              </div>
              {item.status === "pending" ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => decide(item.id, "approved")}
                    className="min-h-10 rounded-xl bg-rose-600 text-xs font-bold text-white"
                  >
                    Подтвердить
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(item.id, "rejected")}
                    className="min-h-10 rounded-xl bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Отклонить
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">Клинер</th>
              <th className="px-4 py-3 font-semibold">Заказ / клиент</th>
              <th className="px-4 py-3 font-semibold">Причина</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const meta = statusMeta(item.status);
              return (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {item.cleanerName}
                  </td>
                  <td className="px-4 py-3">{item.orderOrClient}</td>
                  <td className="max-w-sm px-4 py-3 text-slate-700">
                    {item.reason}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                  </td>
                  <td className="px-4 py-3">
                    {item.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => decide(item.id, "approved")}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Подтвердить
                        </button>
                        <button
                          type="button"
                          onClick={() => decide(item.id, "rejected")}
                          className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700"
                        >
                          Отклонить
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
