"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  {
    href: "/secure-owner-panel/dashboard",
    label: "Заявки специалистов",
    icon: "👥",
  },
  {
    href: "/secure-owner-panel/dashboard/cleaners",
    label: "База клинеров",
    icon: "🧹",
  },
  {
    href: "/secure-owner-panel/dashboard/clients",
    label: "Анкеты клиентов",
    icon: "👤",
  },
  {
    href: "/secure-owner-panel/dashboard/orders",
    label: "Заказы",
    icon: "📦",
  },
  {
    href: "/secure-owner-panel/dashboard/finance",
    label: "Финансы и Статистика",
    icon: "💰",
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

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
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
            onClick={onNavigate}
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
  );
}

function SidebarBrand() {
  return (
    <div className="border-b border-white/10 px-4 py-4 md:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
        CleanPlatform
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-unbounded)] text-base font-semibold">
        Owner Panel
      </h1>
      <p className="mt-1 text-[11px] text-emerald-300/90">role: ADMIN</p>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/secure-owner-panel");
    router.refresh();
  }

  const currentLabel =
    NAV.find((item) =>
      item.href === "/secure-owner-panel/dashboard"
        ? pathname === item.href
        : pathname.startsWith(item.href),
    )?.label ?? "Панель";

  return (
    <div className="flex min-h-full bg-[#e8edf5]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-white md:flex">
        <SidebarBrand />
        <NavLinks pathname={pathname} />
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

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[180] md:hidden ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Закрыть меню"
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col bg-slate-900 text-white shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                CleanPlatform
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-unbounded)] text-base font-semibold">
                Owner Panel
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl font-bold"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
          <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white/90"
            >
              Выйти
            </button>
          </div>
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800"
            aria-label="Открыть меню"
          >
            <HamburgerIcon />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Owner Panel
            </p>
            <p className="truncate text-sm font-bold text-slate-900">{currentLabel}</p>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-3 pb-8 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
