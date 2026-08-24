"use client";

import { useMemo } from "react";
import { FieldRow } from "@/app/components/admin/AdminUi";

type FinanceTxn = {
  id: string;
  orderCode: string;
  date: string;
  /** Client receipt total, BYN */
  receipt: number;
  /** Acquiring rate as percent, e.g. 2.5 */
  acquiringPct: number;
};

const CLEANER_SHARE = 0.8;

const TRANSACTIONS: FinanceTxn[] = [
  {
    id: "t1",
    orderCode: "#1042",
    date: "24.08.2026",
    receipt: 100,
    acquiringPct: 2.5,
  },
  {
    id: "t2",
    orderCode: "#1038",
    date: "22.08.2026",
    receipt: 156,
    acquiringPct: 1.8,
  },
  {
    id: "t3",
    orderCode: "#1035",
    date: "21.08.2026",
    receipt: 89,
    acquiringPct: 2.2,
  },
  {
    id: "t4",
    orderCode: "#1029",
    date: "20.08.2026",
    receipt: 72,
    acquiringPct: 3.0,
  },
  {
    id: "t5",
    orderCode: "#1024",
    date: "18.08.2026",
    receipt: 210,
    acquiringPct: 1.9,
  },
  {
    id: "t6",
    orderCode: "#1018",
    date: "15.08.2026",
    receipt: 120,
    acquiringPct: 2.7,
  },
];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function formatByn(value: number) {
  return new Intl.NumberFormat("ru-BY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function splitTxn(txn: FinanceTxn) {
  const cleaner = round2(txn.receipt * CLEANER_SHARE);
  const acquiring = round2(txn.receipt * (txn.acquiringPct / 100));
  const platform = round2(txn.receipt - cleaner - acquiring);
  return { cleaner, acquiring, platform };
}

export default function AdminFinancePage() {
  const rows = useMemo(
    () =>
      TRANSACTIONS.map((txn) => ({
        ...txn,
        ...splitTxn(txn),
      })),
    [],
  );

  const metrics = useMemo(() => {
    const turnover = round2(rows.reduce((sum, row) => sum + row.receipt, 0));
    const cleanerPayouts = round2(rows.reduce((sum, row) => sum + row.cleaner, 0));
    const bankFees = round2(rows.reduce((sum, row) => sum + row.acquiring, 0));
    const netProfit = round2(turnover - cleanerPayouts - bankFees);
    return { turnover, cleanerPayouts, bankFees, netProfit };
  }, [rows]);

  const cards = [
    {
      key: "turnover",
      label: "Оборот (Total)",
      hint: "Сумма всех оплат от клиентов",
      value: metrics.turnover,
      tone: "slate" as const,
    },
    {
      key: "payouts",
      label: "Выплаты клинерам (80%)",
      hint: "Фиксированная доля исполнителей",
      value: metrics.cleanerPayouts,
      tone: "blue" as const,
    },
    {
      key: "fees",
      label: "Расходы на эквайринг (Bank Fees)",
      hint: "Плавающий % платежного шлюза",
      value: metrics.bankFees,
      tone: "amber" as const,
    },
    {
      key: "profit",
      label: "Чистая прибыль (Net Profit)",
      hint: "Оборот − Выплаты − Эквайринг",
      value: metrics.netProfit,
      tone: "emerald" as const,
    },
  ];

  const toneClass = {
    slate: "from-slate-800 to-slate-900 text-white",
    blue: "from-[#1e3a8a] to-[#152a66] text-white",
    amber: "from-amber-50 to-orange-50 text-amber-950 ring-1 ring-amber-100",
    emerald: "from-emerald-50 to-teal-50 text-emerald-950 ring-1 ring-emerald-100",
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div>
        <h2 className="hidden font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900 md:block">
          Финансы и Статистика
        </h2>
        <p className="text-sm text-slate-500 md:mt-1">
          Учёт оборота, выплат, плавающего эквайринга и чистой прибыли платформы.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.key}
            className={`rounded-2xl bg-gradient-to-br p-4 shadow-sm sm:p-5 ${toneClass[card.tone]}`}
          >
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-[11px] ${
                card.tone === "slate" || card.tone === "blue"
                  ? "text-white/70"
                  : "text-current/60"
              }`}
            >
              {card.label}
            </p>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-2xl font-semibold tabular-nums tracking-tight sm:text-[1.65rem]">
              {formatByn(card.value)}{" "}
              <span className="text-base font-semibold opacity-80">BYN</span>
            </p>
            <p
              className={`mt-1.5 text-[11px] leading-snug sm:text-xs ${
                card.tone === "slate" || card.tone === "blue"
                  ? "text-white/65"
                  : "text-current/55"
              }`}
            >
              {card.hint}
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="font-[family-name:var(--font-unbounded)] text-base font-semibold text-slate-900">
          История операций
        </h3>

        {/* Mobile cards */}
        <ul className="space-y-3 md:hidden">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{row.orderCode}</p>
                  <p className="text-xs text-slate-500">{row.date}</p>
                </div>
                <p className="text-sm font-bold tabular-nums text-slate-900">
                  {formatByn(row.receipt)} BYN
                </p>
              </div>
              <div className="mt-1 space-y-0">
                <FieldRow label="Доля клинера (80%)">
                  <span className="tabular-nums">
                    {formatByn(row.cleaner)} BYN
                  </span>
                </FieldRow>
                <FieldRow label="Эквайринг">
                  <span className="tabular-nums">
                    {formatByn(row.acquiring)} BYN ({row.acquiringPct}%)
                  </span>
                </FieldRow>
                <FieldRow label="Доход платформы">
                  <span className="font-semibold tabular-nums text-emerald-700">
                    {formatByn(row.platform)} BYN
                  </span>
                </FieldRow>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Заказ / дата</th>
                <th className="px-4 py-3 font-semibold">Сумма чека</th>
                <th className="px-4 py-3 font-semibold">Доля клинера</th>
                <th className="px-4 py-3 font-semibold">Эквайринг</th>
                <th className="px-4 py-3 font-semibold">Доход платформы</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{row.orderCode}</p>
                    <p className="text-xs text-slate-500">{row.date}</p>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-800">
                    {formatByn(row.receipt)} BYN
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-700">
                    {formatByn(row.cleaner)} BYN
                    <span className="ml-1 text-[11px] text-slate-400">80%</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-amber-800">
                    {formatByn(row.acquiring)} BYN ({row.acquiringPct}%)
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-emerald-700">
                    {formatByn(row.platform)} BYN
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 text-sm font-semibold text-slate-800">
                <td className="px-4 py-3">Итого</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatByn(metrics.turnover)} BYN
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {formatByn(metrics.cleanerPayouts)} BYN
                </td>
                <td className="px-4 py-3 tabular-nums text-amber-800">
                  {formatByn(metrics.bankFees)} BYN
                </td>
                <td className="px-4 py-3 tabular-nums text-emerald-700">
                  {formatByn(metrics.netProfit)} BYN
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
