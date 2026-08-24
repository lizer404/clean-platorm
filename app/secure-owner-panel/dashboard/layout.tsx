"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";

const NAV = [
  {
    href: "/secure-owner-panel/dashboard",
    label: "Заявки специалистов",
    icon: "👥",
  },
  {
    href: "/secure-owner-panel/dashboard/tickets",
    label: "Обращения и Поддержка",
    icon: "🎫",
  },
  {
    href: "/secure-owner-panel/dashboard/blacklist",
    label: "Черный список",
    icon: "🚫",
  },
  {
    href: "/secure-owner-panel/dashboard/settings",
    label: "Системные настройки",
    icon: "⚙️",
  },
] as const;

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/secure-owner-panel");
    router.refresh();
  }

  return (
    <div className="flex min-h-full bg-[#e8edf5]">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-white">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
            CleanPlatform
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-unbounded)] text-base font-semibold">
            Owner Panel
          </h1>
          <p className="mt-1 text-[11px] text-emerald-300/90">role: ADMIN</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/secure-owner-panel/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/15"
          >
            Выйти
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-x-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
