"use client";

import { useEffect, useState } from "react";
import {
  loadBlacklistRequests,
  saveBlacklistRequests,
  type BlacklistRequest,
} from "@/app/lib/adminData";

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
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900">
          Черный список
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Запросы клинеров на блокировку клиентов. После подтверждения заказы от
          пользователя не выдаются.
        </p>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {item.cleanerName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Заказ / клиент:{" "}
                  <span className="font-semibold text-slate-700">
                    {item.orderOrClient}
                  </span>
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  item.status === "approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : item.status === "rejected"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-rose-50 text-rose-700"
                }`}
              >
                {item.status === "approved"
                  ? "Блокировка подтверждена"
                  : item.status === "rejected"
                    ? "Отклонено"
                    : "Ожидает решения"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {item.reason}
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              {new Date(item.createdAt).toLocaleString("ru-RU")}
            </p>
            {item.status === "pending" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => decide(item.id, "approved")}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Подтвердить блокировку
                </button>
                <button
                  type="button"
                  onClick={() => decide(item.id, "rejected")}
                  className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300"
                >
                  Отклонить
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
