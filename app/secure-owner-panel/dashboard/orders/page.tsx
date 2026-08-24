"use client";

import { useMemo, useState } from "react";
import { AdminModal, FieldRow, StatusPill } from "@/app/components/admin/AdminUi";

type OrderRow = {
  id: string;
  code: string;
  client: string;
  cleaner: string;
  address: string;
  when: string;
  total: string;
  status: "active" | "done" | "dispute";
};

type ChatMsg = { id: string; author: string; text: string; at: string };

const ORDERS: OrderRow[] = [
  {
    id: "o1",
    code: "#1042",
    client: "Ирина С.",
    cleaner: "Дмитрий Орлов",
    address: "Минск, ул. Седых 60",
    when: "24 авг, 10:00",
    total: "100 BYN",
    status: "active",
  },
  {
    id: "o2",
    code: "#1038",
    client: "Павел К.",
    cleaner: "Елена Мороз",
    address: "Минск, ул. Ольшевского 22",
    when: "22 авг, 17:30",
    total: "156 BYN",
    status: "done",
  },
  {
    id: "o3",
    code: "#1029",
    client: "Ольга В.",
    cleaner: "Анна Ковалёва",
    address: "Гродно, ул. Советская 12",
    when: "20 авг, 14:00",
    total: "72 BYN",
    status: "dispute",
  },
];

const CHATS: Record<string, ChatMsg[]> = {
  o1: [
    {
      id: "m1",
      author: "Клиент",
      text: "Подскажите, вы уже выехали?",
      at: "09:40",
    },
    {
      id: "m2",
      author: "Клинер",
      text: "Да, буду через 20 минут.",
      at: "09:42",
    },
  ],
  o2: [
    {
      id: "m1",
      author: "Клиент",
      text: "Спасибо, всё отлично!",
      at: "19:10",
    },
  ],
  o3: [
    {
      id: "m1",
      author: "Клиент",
      text: "Недовольны качеством окон.",
      at: "15:00",
    },
    {
      id: "m2",
      author: "Клинер",
      text: "Могу приехать переделать завтра.",
      at: "15:12",
    },
  ],
};

export default function AdminOrdersPage() {
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState<ChatMsg[]>([]);

  const order = useMemo(
    () => ORDERS.find((o) => o.id === chatOrderId) ?? null,
    [chatOrderId],
  );

  const messages = useMemo(() => {
    if (!chatOrderId) return [];
    return [...(CHATS[chatOrderId] ?? []), ...extra];
  }, [chatOrderId, extra]);

  function openChat(id: string) {
    setChatOrderId(id);
    setDraft("");
    setExtra([]);
  }

  function sendAdminNote() {
    if (!draft.trim() || !chatOrderId) return;
    setExtra((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        author: "Админ",
        text: draft.trim(),
        at: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="hidden font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900 md:block">
          Заказы
        </h2>
        <p className="text-sm text-slate-500 md:mt-1">
          Контроль заказов и переписки между клиентом и клинером.
        </p>
      </div>

      <ul className="space-y-3 md:hidden">
        {ORDERS.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-900">{row.code}</p>
              <StatusPill
                tone={
                  row.status === "done"
                    ? "ok"
                    : row.status === "dispute"
                      ? "bad"
                      : "warn"
                }
              >
                {row.status === "done"
                  ? "Завершён"
                  : row.status === "dispute"
                    ? "Спор"
                    : "Активен"}
              </StatusPill>
            </div>
            <div className="mt-1 space-y-0">
              <FieldRow label="Клиент">{row.client}</FieldRow>
              <FieldRow label="Клинер">{row.cleaner}</FieldRow>
              <FieldRow label="Адрес">{row.address}</FieldRow>
              <FieldRow label="Время">{row.when}</FieldRow>
              <FieldRow label="Сумма">{row.total}</FieldRow>
            </div>
            <button
              type="button"
              onClick={() => openChat(row.id)}
              className="mt-3 min-h-10 w-full rounded-xl bg-[#1e3a8a] text-xs font-bold text-white"
            >
              Открыть переписку
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">Заказ</th>
              <th className="px-4 py-3 font-semibold">Клиент / Клинер</th>
              <th className="px-4 py-3 font-semibold">Адрес</th>
              <th className="px-4 py-3 font-semibold">Время</th>
              <th className="px-4 py-3 font-semibold">Сумма</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold">Чат</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {row.code}
                </td>
                <td className="px-4 py-3">
                  <p>{row.client}</p>
                  <p className="text-xs text-slate-500">{row.cleaner}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{row.address}</td>
                <td className="px-4 py-3 tabular-nums">{row.when}</td>
                <td className="px-4 py-3 tabular-nums">{row.total}</td>
                <td className="px-4 py-3">
                  <StatusPill
                    tone={
                      row.status === "done"
                        ? "ok"
                        : row.status === "dispute"
                          ? "bad"
                          : "warn"
                    }
                  >
                    {row.status === "done"
                      ? "Завершён"
                      : row.status === "dispute"
                        ? "Спор"
                        : "Активен"}
                  </StatusPill>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openChat(row.id)}
                    className="rounded-lg bg-[#1e3a8a] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Переписка
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {order ? (
        <AdminModal
          title={`Переписка · ${order.code}`}
          onClose={() => setChatOrderId(null)}
          wide
        >
          <div className="flex h-[min(70vh,32rem)] flex-col md:h-[28rem]">
            <p className="mb-3 shrink-0 text-xs text-slate-500">
              {order.client} ↔ {order.cleaner} · {order.address}
            </p>
            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                    msg.author === "Админ"
                      ? "ml-auto bg-[#1e3a8a] text-white"
                      : msg.author === "Клинер"
                        ? "bg-white text-slate-800 ring-1 ring-slate-200"
                        : "bg-emerald-50 text-slate-800"
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase opacity-70">
                    {msg.author} · {msg.at}
                  </p>
                  <p className="mt-0.5 leading-snug">{msg.text}</p>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 flex shrink-0 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendAdminNote();
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Сообщение от администратора…"
                className="min-h-11 flex-1 rounded-xl bg-white px-3 text-sm outline-none ring-1 ring-slate-200 focus:ring-[#1e3a8a]/40"
              />
              <button
                type="submit"
                className="min-h-11 shrink-0 rounded-xl bg-[#1e3a8a] px-4 text-sm font-bold text-white"
              >
                Отпр.
              </button>
            </form>
          </div>
        </AdminModal>
      ) : null}
    </div>
  );
}
