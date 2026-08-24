"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Ошибка входа");
        setLoading(false);
        return;
      }
      router.replace("/secure-owner-panel/dashboard");
      router.refresh();
    } catch {
      setError("Сервер недоступен");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[#0f172a] px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Secure Owner Panel
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-xl font-semibold text-slate-900">
          Вход администратора
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Доступ только для уполномоченных операторов платформы.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Логин администратора
            </span>
            <input
              autoComplete="username"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              required
              className="w-full rounded-xl bg-slate-50 px-3 py-3 text-sm outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-slate-900/30"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Секретный пароль
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl bg-slate-50 px-3 py-3 text-sm outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-slate-900/30"
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Проверка…" : "Войти в систему"}
          </button>
        </form>
      </div>
    </div>
  );
}
