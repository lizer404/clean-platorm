"use client";

import { useEffect, useState } from "react";
import {
  loadApplications,
  saveApplications,
  type SpecialistApplication,
} from "@/app/lib/adminData";

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<SpecialistApplication[]>([]);

  useEffect(() => {
    setItems(loadApplications());
  }, []);

  function decide(id: string, decision: "approved" | "rejected") {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, decision } : item,
      );
      saveApplications(next);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900">
          Заявки специалистов
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Проверка документов и статуса ИП/НПД перед допуском к заказам.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-[860px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">ФИО</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold">УНП</th>
              <th className="px-4 py-3 font-semibold">Документ</th>
              <th className="px-4 py-3 font-semibold">Решение</th>
              <th className="px-4 py-3 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 align-top">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{item.fullName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.city} · {item.phone}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {item.statusType}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-700">
                  {item.unp}
                </td>
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.documentPhoto}
                    alt={`Документ ${item.fullName}`}
                    className="h-16 w-28 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      item.decision === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.decision === "rejected"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.decision === "approved"
                      ? "Одобрено"
                      : item.decision === "rejected"
                        ? "Отклонено"
                        : "На проверке"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={item.decision === "approved"}
                      onClick={() => decide(item.id, "approved")}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
                    >
                      Одобрить
                    </button>
                    <button
                      type="button"
                      disabled={item.decision === "rejected"}
                      onClick={() => decide(item.id, "rejected")}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-40"
                    >
                      Отклонить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
