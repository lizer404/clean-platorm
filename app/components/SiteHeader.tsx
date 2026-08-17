"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthProvider";

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

        if ((event.key === "ArrowLeft" || event.key === "Home") && start <= min) {
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
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
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

function ConsentCheckbox({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  id: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
        />
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-[5px] border-2 transition ${
            checked
              ? "border-success bg-success/15"
              : "border-slate-300 bg-white"
          }`}
        >
          {checked ? (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path
                d="M3.5 8.2 6.4 11l6.1-6.5"
                stroke="#16a34a"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </span>
      <span className="text-sm leading-snug text-muted">
        Я согласен с политикой конфиденциальности
      </span>
    </label>
  );
}

function SmsCodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={4}
      value={value}
      onChange={(event) =>
        onChange(event.target.value.replace(/\D/g, "").slice(0, 4))
      }
      placeholder="••••"
      className="w-full rounded-2xl bg-plaque px-4 py-4 text-center font-[family-name:var(--font-unbounded)] text-2xl font-semibold tracking-[0.35em] text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
      aria-label="SMS-код"
    />
  );
}

function ResendTimer({
  loading,
  onResend,
}: {
  loading: boolean;
  onResend: () => void;
}) {
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      const left = Math.max(0, 59 - Math.floor((Date.now() - startedAt) / 1000));
      setSeconds(left);
      if (left === 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  if (seconds > 0) {
    return (
      <p className="text-center text-sm text-muted">
        Отправить код повторно через {seconds} сек
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-muted">
      <button
        type="button"
        disabled={loading}
        onClick={onResend}
        className="font-semibold text-brand hover:underline disabled:opacity-50"
      >
        Отправить код повторно
      </button>
    </p>
  );
}

async function sendSmsCode(phone: string) {
  const response = await fetch("/api/auth/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Не удалось отправить код");
  }
}

async function verifySmsCode(phone: string, code: string) {
  const response = await fetch("/api/auth/verify-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  const data = (await response.json()) as {
    ok?: boolean;
    authorized?: boolean;
    error?: string;
  };
  if (!response.ok || !data.ok || !data.authorized) {
    throw new Error(data.error || "Неверный код");
  }
}

function AccountModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (phone: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timerKey, setTimerKey] = useState(0);

  async function requestCode() {
    setLoading(true);
    setError("");
    try {
      await sendSmsCode(phone.trim());
      setStep(2);
      setCode("");
      setTimerKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  async function onPhoneSubmit(event: FormEvent) {
    event.preventDefault();
    if (!agreed || extractLocalDigits(phone).length < 9 || loading) return;
    await requestCode();
  }

  async function onCodeSubmit(event: FormEvent) {
    event.preventDefault();
    if (code.length !== 4 || loading) return;
    setLoading(true);
    setError("");
    try {
      await verifySmsCode(phone.trim(), code);
      onSuccess(phone.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка проверки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell
      title={step === 1 ? "Личный кабинет" : "Ввод СМС-кода"}
      subtitle={
        step === 1
          ? "Войдите по номеру телефона — пришлём код подтверждения."
          : `Код отправлен на ${phone.trim()}. Для теста введите 1234.`
      }
      onClose={onClose}
    >
      {step === 1 ? (
        <form onSubmit={onPhoneSubmit} className="animate-sheet space-y-4">
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Телефон
            </span>
            <BelarusPhoneInput value={phone} onChange={setPhone} />
          </label>

          <ConsentCheckbox
            id="account-privacy-consent"
            checked={agreed}
            onChange={setAgreed}
          />

          {error ? (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={!agreed || loading}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? "Отправляем…" : "Получить код"}
          </button>
        </form>
      ) : (
        <form onSubmit={onCodeSubmit} className="animate-sheet space-y-4">
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Код из СМС
            </span>
            <SmsCodeInput value={code} onChange={setCode} />
          </label>

          <ResendTimer
            key={timerKey}
            loading={loading}
            onResend={requestCode}
          />

          {error ? (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={code.length !== 4 || loading}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? "Проверяем…" : "Войти"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setCode("");
              setError("");
            }}
            className="w-full text-center text-sm font-medium text-muted hover:text-foreground"
          >
            Изменить номер
          </button>
        </form>
      )}
    </ModalShell>
  );
}

function CleanerApplyModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (phone: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [experience, setExperience] = useState("");
  const [unp, setUnp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timerKey, setTimerKey] = useState(0);

  async function requestCode() {
    setLoading(true);
    setError("");
    try {
      await sendSmsCode(phone.trim());
      setStep(2);
      setCode("");
      setTimerKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  async function onDetailsSubmit(event: FormEvent) {
    event.preventDefault();
    if (!agreed || extractLocalDigits(phone).length < 9 || loading) return;
    await requestCode();
  }

  async function onCodeSubmit(event: FormEvent) {
    event.preventDefault();
    if (code.length !== 4 || loading) return;
    setLoading(true);
    setError("");
    try {
      await verifySmsCode(phone.trim(), code);
      onSuccess(phone.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка проверки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell
      title={step === 1 ? "Стать клинером" : "Ввод СМС-кода"}
      subtitle={
        step === 1
          ? "Оставьте заявку — подтвердим телефон и свяжемся с вами."
          : `Код отправлен на ${phone.trim()}. Для теста введите 1234.`
      }
      onClose={onClose}
    >
      {step === 1 ? (
        <form onSubmit={onDetailsSubmit} className="animate-sheet space-y-3.5">
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Имя
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Как к вам обращаться"
              className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Телефон
            </span>
            <BelarusPhoneInput value={phone} onChange={setPhone} />
          </label>
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Опыт работы
            </span>
            <textarea
              required
              rows={5}
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              placeholder="Сколько лет в клининге, какие объекты, какая химия, какие расходники, каков планируемый график работы?"
              className="w-full resize-none rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium leading-relaxed text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
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
              onChange={(event) =>
                setUnp(event.target.value.replace(/[^\d]/g, "").slice(0, 9))
              }
              placeholder="9 цифр"
              className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
            />
          </label>

          <ConsentCheckbox
            id="cleaner-privacy-consent"
            checked={agreed}
            onChange={setAgreed}
          />

          {error ? (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={!agreed || loading}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? "Отправляем…" : "Получить код"}
          </button>
        </form>
      ) : (
        <form onSubmit={onCodeSubmit} className="animate-sheet space-y-4">
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Код из СМС
            </span>
            <SmsCodeInput value={code} onChange={setCode} />
          </label>

          <ResendTimer
            key={timerKey}
            loading={loading}
            onResend={requestCode}
          />

          {error ? (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={code.length !== 4 || loading}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? "Проверяем…" : "Подтвердить и отправить заявку"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setCode("");
              setError("");
            }}
            className="w-full text-center text-sm font-medium text-muted hover:text-foreground"
          >
            Назад к заявке
          </button>
        </form>
      )}
    </ModalShell>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    isAuthenticated,
    userPhone,
    login,
    accountModalOpen,
    openAccountModal,
    closeAccountModal,
    cleanerModalOpen,
    openCleanerModal,
    closeCleanerModal,
  } = useAuth();

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
      <header className="sticky top-0 z-[100] border-b border-line/70 bg-white/90 shadow-[0_8px_24px_rgba(17,24,39,0.05)] backdrop-blur-md">
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
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => openAccountModal()}
                className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-2 text-sm font-semibold text-brand transition hover:bg-line"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
                  <ProfileIcon />
                </span>
                <span className="hidden max-w-[160px] truncate sm:inline">
                  Мой профиль
                </span>
                <span className="hidden text-xs font-medium text-muted md:inline">
                  {userPhone}
                </span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAccountModal()}
                  className="inline-flex items-center gap-2 rounded-full bg-plaque px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-line"
                >
                  <ProfileIcon />
                  <span className="hidden sm:inline">Личный кабинет</span>
                </button>
                <button
                  type="button"
                  onClick={openCleanerModal}
                  className="hidden rounded-full bg-brand px-3.5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-deep sm:inline-flex"
                >
                  Стать клинером
                </button>
              </>
            )}
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
        <div className="fixed inset-0 z-[105] lg:hidden">
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
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openAccountModal();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-soft px-4 py-3.5 text-sm font-bold text-brand"
                >
                  <ProfileIcon />
                  Мой профиль
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openAccountModal();
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
                      openCleanerModal();
                    }}
                    className="flex w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold text-white"
                  >
                    Стать клинером
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {accountModalOpen && (
        <AccountModal onClose={closeAccountModal} onSuccess={login} />
      )}
      {cleanerModalOpen && (
        <CleanerApplyModal onClose={closeCleanerModal} onSuccess={login} />
      )}
    </>
  );
}
