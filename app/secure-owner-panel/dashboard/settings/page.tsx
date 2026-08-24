"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [commission, setCommission] = useState("20");
  const [acquiring, setAcquiring] = useState("3");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900">
          Системные настройки
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Заглушка управления комиссией платформы и эквайрингом.
        </p>
      </div>

      <section className="max-w-lg space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Комиссия платформы, %
          </span>
          <input
            type="number"
            min={0}
            max={50}
            value={commission}
            onChange={(event) => {
              setCommission(event.target.value);
              setSaved(false);
            }}
            className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none ring-1 ring-slate-200 focus:bg-white"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Эквайринг, %
          </span>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={acquiring}
            onChange={(event) => {
              setAcquiring(event.target.value);
              setSaved(false);
            }}
            className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none ring-1 ring-slate-200 focus:bg-white"
          />
        </label>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
        >
          Сохранить (mock)
        </button>
        {saved ? (
          <p className="text-xs font-semibold text-emerald-700">
            Настройки сохранены локально (заглушка).
          </p>
        ) : null}
      </section>
    </div>
  );
}
