"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type ModalKind = "account" | "cleaner" | null;

const NAV_LINKS = [
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#guarantees", label: "Гарантии" },
] as const;

const PHONE_PREFIX = "+375 ";

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19.5c1.8-3.2 4.2-4.8 7-4.8s5.2 1.6 7 4.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function extractLocalDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("375")) digits = digits.slice(3);
  return digits.slice(0, 9);
}

function formatBelarusPhone(value: string) {
  const digits = extractLocalDigits(value);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);

  if (parts.length === 0) return PHONE_PREFIX;
  if (parts.length === 1) return `${PHONE_PREFIX}${parts[0]}`;
  if (parts.length === 2) return `${PHONE_PREFIX}${parts[0]} ${parts[1]}`;
  if (parts.length === 3) return `${PHONE_PREFIX}${parts[0]} ${parts[1]}-${parts[2]}`;
  return `${PHONE_PREFIX}${parts[0]} ${parts[1]}-${parts[2]}-${parts[3]}`;
}

function BelarusPhoneInput({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function placeCaretAfterPrefix() {
    const input = inputRef.current;
    if (!input) return;
    const min = PHONE_PREFIX.length;
    requestAnimationFrame(() => {
      const start = input.selectionStart ?? min;
      const end = input.selectionEnd ?? min;
      if (start < min || end < min) {
        input.setSelectionRange(min, Math.max(end, min));
      }
    });
  }

  return (
    <input
      ref={inputRef}
      id={id}
      type="tel"
      inputMode="tel"
      required
      value={value}
      onChange={(event) => onChange(formatBelarusPhone(event.target.value))}
      onFocus={placeCaretAfterPrefix}
      onClick={placeCaretAfterPrefix}
      onKeyDown={(event) => {
        const input = inputRef.current;
        if (!input) return;
        const min = PHONE_PREFIX.length;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;

        if (
          (event.key === "Backspace" && start <= min && end <= min) ||
          (event.key === "Delete" && start < min)
        ) {
          event.preventDefault();
          placeCaretAfterPrefix();
          return;
        }

        if (
          (event.key === "ArrowLeft" || event.key === "Home") &&
          start <= min
        ) {
          event.preventDefault();
          placeCaretAfterPrefix();
        }
      }}
      placeholder="+375 XX XXX-XX-XX"
      className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
    />
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-sheet relative z-10 w-full max-w-md rounded-3xl bg-panel p-5 shadow-[0_24px_60px_rgba(17,24,39,0.2)] sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plaque text-foreground transition hover:bg-line"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AccountModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (extractLocalDigits(phone).length < 9) return;
    setSent(true);
  }

  return (
    <ModalShell
      title="Личный кабинет"
      subtitle="Войдите по номеру телефона — пришлём код подтверждения."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Телефон
          </span>
          <BelarusPhoneInput
            value={phone}
            onChange={(next) => {
              setPhone(next);
              setSent(false);
            }}
          />
        </label>
        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep"
        >
          Получить код
        </button>
        {sent && (
          <p className="text-center text-sm font-medium text-success" role="status">
            Код отправлен на {phone.trim()}
          </p>
        )}
      </form>
    </ModalShell>
  );
}

function CleanerApplyModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [experience, setExperience] = useState("");
  const [unp, setUnp] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (extractLocalDigits(phone).length < 9) return;
    setSent(true);
  }

  return (
    <ModalShell
      title="Стать клинером"
      subtitle="Оставьте заявку — мы свяжемся и расскажем об условиях."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-3.5">
        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Имя
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSent(false);
            }}
            placeholder="Как к вам обращаться"
            className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Телефон
          </span>
          <BelarusPhoneInput
            value={phone}
            onChange={(next) => {
              setPhone(next);
              setSent(false);
            }}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Опыт работы
          </span>
          <textarea
            required
            rows={3}
            value={experience}
            onChange={(event) => {
              setExperience(event.target.value);
              setSent(false);
            }}
            placeholder="Сколько лет в клининге, какие объекты"
            className="w-full resize-none rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            УНП
          </span>
          <input
            type="text"
            required
            inputMode="numeric"
            value={unp}
            onChange={(event) => {
              setUnp(event.target.value.replace(/[^\d]/g, "").slice(0, 9));
              setSent(false);
            }}
            placeholder="9 цифр"
            className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
          />
        </label>
        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep"
        >
          Отправить заявку
        </button>
        {sent && (
          <p className="text-center text-sm font-medium text-success" role="status">
            Заявка отправлена! Мы свяжемся с вами в ближайшее время.
          </p>
        )}
      </form>
    </ModalShell>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  function openSection(href: string) {
    setMenuOpen(false);
    const id = href.replace("#", "");
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-panel/95 shadow-[0_8px_24px_rgba(17,24,39,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-panel/90">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <a href="#calculator" className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white shadow-sm">
              C
            </span>
            <span className="truncate font-[family-name:var(--font-unbounded)] text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
              CleanPlatform
            </span>
          </a>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-plaque hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModal("account")}
              className="inline-flex items-center gap-2 rounded-full bg-plaque px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-line"
            >
              <ProfileIcon />
              <span className="hidden sm:inline">Личный кабинет</span>
            </button>
            <button
              type="button"
              onClick={() => setModal("cleaner")}
              className="hidden rounded-full bg-brand px-3.5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-deep sm:inline-flex"
            >
              Стать клинером
            </button>
            <button
              type="button"
              aria-label="Открыть меню"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-plaque text-foreground lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="animate-drawer absolute inset-y-0 right-0 flex w-[min(100%,320px)] flex-col bg-panel p-5 shadow-[-12px_0_40px_rgba(17,24,39,0.12)]">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-[family-name:var(--font-unbounded)] text-sm font-semibold">
                Меню
              </p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-plaque"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => openSection(link.href)}
                  className="rounded-2xl px-4 py-3.5 text-left text-[15px] font-semibold text-foreground transition hover:bg-plaque"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-2.5 pt-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setModal("account");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-plaque px-4 py-3.5 text-sm font-bold text-foreground"
              >
                <ProfileIcon />
                Личный кабинет
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setModal("cleaner");
                }}
                className="flex w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold text-white"
              >
                Стать клинером
              </button>
            </div>
          </aside>
        </div>
      )}

      {modal === "account" && <AccountModal onClose={() => setModal(null)} />}
      {modal === "cleaner" && <CleanerApplyModal onClose={() => setModal(null)} />}
    </>
  );
}
