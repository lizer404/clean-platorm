"use client";

import { useEffect, useState } from "react";
import {
  loadApplications,
  saveApplications,
  type SpecialistApplication,
} from "@/app/lib/adminData";
import { FieldRow, StatusPill } from "@/app/components/admin/AdminUi";

function decisionTone(decision: SpecialistApplication["decision"]) {
  if (decision === "approved") return "ok" as const;
  if (decision === "rejected") return "bad" as const;
  return "warn" as const;
}

function decisionLabel(decision: SpecialistApplication["decision"]) {
  if (decision === "approved") return "Одобрено";
  if (decision === "rejected") return "Отклонено";
  return "На проверке";
}

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
        <h2 className="hidden font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900 md:block">
          Заявки специалистов
        </h2>
        <p className="text-sm text-slate-500 md:mt-1">
          Проверка документов и статуса ИП/НПД перед допуском к заказам.
        </p>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold leading-snug text-slate-900">
                  {item.fullName}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.city} · {item.phone}
                </p>
              </div>
              <StatusPill tone={decisionTone(item.decision)}>
                {decisionLabel(item.decision)}
              </StatusPill>
            </div>
            <div className="mt-2 space-y-0">
              <FieldRow label="Статус">{item.statusType}</FieldRow>
              <FieldRow label="УНП">
                <span className="font-mono text-xs">{item.unp}</span>
              </FieldRow>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.documentPhoto}
              alt={`Документ ${item.fullName}`}
              className="mt-2 h-28 w-full rounded-xl object-cover ring-1 ring-slate-200"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={item.decision === "approved"}
                onClick={() => decide(item.id, "approved")}
                className="min-h-10 rounded-xl bg-emerald-600 text-xs font-bold text-white disabled:opacity-40"
              >
                Одобрить
              </button>
              <button
                type="button"
                disabled={item.decision === "rejected"}
                onClick={() => decide(item.id, "rejected")}
                className="min-h-10 rounded-xl bg-rose-600 text-xs font-bold text-white disabled:opacity-40"
              >
                Отклонить
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
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
                  <StatusPill tone={decisionTone(item.decision)}>
                    {decisionLabel(item.decision)}
                  </StatusPill>
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
