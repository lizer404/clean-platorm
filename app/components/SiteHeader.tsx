"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import SupportTicketModal from "./SupportTicketModal";

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

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
  autoFocus,
}: {
  value: string;
  onChange: (next: string) => void;
  id?: string;
  autoFocus?: boolean;
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

  useEffect(() => {
    if (!autoFocus) return;
    const input = inputRef.current;
    if (!input) return;
    const timers = [0, 50, 150].map((ms) =>
      window.setTimeout(() => {
        input.focus({ preventScroll: true });
        placeCaretAfterPrefix();
      }, ms),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="tel"
      inputMode="tel"
      required
      autoFocus={autoFocus}
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
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
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
        className={`animate-sheet relative z-10 w-full rounded-3xl bg-panel p-5 shadow-[0_24px_60px_rgba(17,24,39,0.2)] sm:p-6 ${
          wide ? "max-w-lg" : "max-w-md"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            ) : null}
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

type AuthMethod = "telegram" | "sms";

function OtpCodeInput({
  value,
  onChange,
  onComplete,
  disabled,
  hasError,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);
  const digits = Array.from({ length: 4 }, (_, i) => value[i] ?? "");

  function focusIndex(index: number) {
    const el = inputsRef.current[Math.max(0, Math.min(3, index))];
    if (!el || el.disabled) return;
    el.focus({ preventScroll: true });
    el.select();
  }

  useLayoutEffect(() => {
    if (disabled) return;
    focusIndex(0);
    const timers = [40, 120, 280].map((ms) =>
      window.setTimeout(() => focusIndex(0), ms),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [disabled]);

  useLayoutEffect(() => {
    if (disabled || value.length > 0) return;
    focusIndex(0);
  }, [disabled, value, hasError]);

  function applyDigits(nextRaw: string, startIndex = 0) {
    const incoming = nextRaw.replace(/\D/g, "");
    if (!incoming) return;

    const next = digits.slice();
    let cursor = startIndex;
    for (const ch of incoming) {
      if (cursor > 3) break;
      next[cursor] = ch;
      cursor += 1;
    }
    const joined = next.join("").slice(0, 4);
    onChange(joined);

    if (joined.length === 4) {
      focusIndex(3);
      onComplete(joined);
      return;
    }
    focusIndex(Math.min(cursor, 3));
  }

  return (
    <div
      className={`flex justify-center gap-2.5 sm:gap-3 ${hasError ? "animate-otp-shake" : ""}`}
      role="group"
      aria-label="Код подтверждения"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-label={`Цифра ${index + 1}`}
          onChange={(event) => {
            const raw = event.target.value.replace(/\D/g, "");
            if (!raw) {
              const next = digits.slice();
              next[index] = "";
              onChange(next.join(""));
              return;
            }
            applyDigits(raw, index);
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              event.preventDefault();
              if (digits[index]) {
                const next = digits.slice();
                next[index] = "";
                onChange(next.join(""));
                return;
              }
              if (index > 0) {
                const next = digits.slice();
                next[index - 1] = "";
                onChange(next.join(""));
                focusIndex(index - 1);
              }
              return;
            }

            if (event.key === "ArrowLeft" && index > 0) {
              event.preventDefault();
              focusIndex(index - 1);
            }
            if (event.key === "ArrowRight" && index < 3) {
              event.preventDefault();
              focusIndex(index + 1);
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            applyDigits(event.clipboardData.getData("text"), index);
          }}
          onFocus={(event) => event.target.select()}
          className={`h-14 w-12 rounded-2xl bg-plaque text-center font-[family-name:var(--font-unbounded)] text-2xl font-semibold text-foreground outline-none ring-2 transition sm:w-14 ${
            hasError
              ? "bg-red-50 ring-red-400 focus:ring-red-500"
              : "ring-line/80 focus:bg-white focus:ring-mint"
          } disabled:opacity-60`}
        />
      ))}
    </div>
  );
}

function AuthSendActions({
  canSend,
  loading,
  onSend,
}: {
  canSend: boolean;
  loading: boolean;
  onSend: (method: AuthMethod) => void;
}) {
  return (
    <div className="space-y-2.5">
      <button
        type="button"
        disabled={!canSend}
        onClick={() => onSend("telegram")}
        className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#229ED9] px-4 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(34,158,217,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {loading ? "Отправляем…" : "Получить код в Telegram"}
      </button>
      <button
        type="button"
        disabled={!canSend}
        onClick={() => onSend("sms")}
        className="mx-auto block text-center text-sm font-medium text-muted underline-offset-2 transition hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
      >
        {loading ? "Отправляем…" : "Получить код по СМС"}
      </button>
    </div>
  );
}

function ResendTimer({
  loading,
  onResend,
}: {
  loading: boolean;
  onResend: () => void;
}) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      const left = Math.max(0, 60 - Math.floor((Date.now() - startedAt) / 1000));
      setSeconds(left);
      if (left === 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  if (seconds > 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-2xl bg-plaque px-4 py-3 text-sm font-semibold text-muted"
      >
        Отправить повторно через {seconds} сек
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onResend}
      className="w-full rounded-2xl bg-brand-soft px-4 py-3 text-sm font-bold text-brand transition hover:bg-line disabled:opacity-50"
    >
      Отправить код еще раз
    </button>
  );
}

async function sendAuthCode(phone: string, method: AuthMethod) {
  const response = await fetch("/api/auth/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, method }),
  });
  const data = (await response.json()) as {
    success?: boolean;
    error?: string;
  };
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Не удалось отправить код");
  }
}

async function verifyAuthCode(phone: string, code: string) {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  const data = (await response.json()) as {
    success?: boolean;
    authorized?: boolean;
    token?: string;
    error?: string;
  };
  if (!response.ok || !data.success || !data.authorized) {
    throw new Error(data.error || "Неверный код");
  }
  return data;
}

function AccountModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (phone: string, name?: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState("");
  const [method, setMethod] = useState<AuthMethod>("sms");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const verifyingRef = useRef(false);

  async function requestCode(nextMethod: AuthMethod) {
    if (!agreed || extractLocalDigits(phone).length < 9 || loading) return;
    setLoading(true);
    setError("");
    setCodeError(false);
    try {
      await sendAuthCode(phone.trim(), nextMethod);
      setMethod(nextMethod);
      setStep(2);
      setCode("");
      setTimerKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(nextCode: string) {
    if (nextCode.length !== 4 || verifyingRef.current) return;
    verifyingRef.current = true;
    setVerifying(true);
    setError("");
    setCodeError(false);
    try {
      await verifyAuthCode(phone.trim(), nextCode);
      // Name is optional — empty string is fine for successful login
      onSuccess(phone.trim(), name.trim() || undefined);
    } catch (err) {
      setCodeError(true);
      setError(err instanceof Error ? err.message : "Неверный код");
      setCode("");
    } finally {
      verifyingRef.current = false;
      setVerifying(false);
    }
  }

  const canSend =
    agreed && extractLocalDigits(phone).length >= 9 && !loading;

  return (
    <ModalShell
      title={step === 1 ? "Личный кабинет" : "Ввод кода"}
      subtitle={
        step === 1
          ? "Войдите по номеру телефона — пришлём код в Telegram или SMS."
          : `Код отправлен на ${phone.trim()} через ${
              method === "telegram" ? "Telegram" : "SMS"
            }. Для теста введите 1234.`
      }
      onClose={onClose}
    >
      {step === 1 ? (
        <div className="animate-sheet space-y-4">
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Телефон
            </span>
            <BelarusPhoneInput
              value={phone}
              onChange={setPhone}
              autoFocus
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Ваше имя{" "}
              <span className="normal-case tracking-normal text-muted/80">
                (необязательно)
              </span>
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Как к вам обращаться"
              autoComplete="given-name"
              className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
            />
          </label>

          <ConsentCheckbox
            id="account-privacy-consent"
            checked={agreed}
            onChange={setAgreed}
          />

          {error ? (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <AuthSendActions
            canSend={canSend}
            loading={loading}
            onSend={requestCode}
          />
        </div>
      ) : (
        <div className="animate-sheet space-y-4">
          <div className="space-y-2">
            <span className="block text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Код подтверждения
            </span>
            <OtpCodeInput
              key={`account-otp-${timerKey}`}
              value={code}
              onChange={(next) => {
                setCode(next);
                if (codeError) setCodeError(false);
                if (error) setError("");
              }}
              onComplete={verifyCode}
              disabled={verifying}
              hasError={codeError}
            />
          </div>

          {error ? (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          ) : verifying ? (
            <p className="text-center text-sm font-medium text-muted">
              Проверяем код…
            </p>
          ) : null}

          <ResendTimer
            key={timerKey}
            loading={loading}
            onResend={() => requestCode(method)}
          />

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setCode("");
              setError("");
              setCodeError(false);
            }}
            className="w-full text-center text-sm font-medium text-muted hover:text-foreground"
          >
            Изменить номер
          </button>
        </div>
      )}
    </ModalShell>
  );
}

type CleanerStatus = "ip" | "npd";

function CleanerApplyModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [status, setStatus] = useState<CleanerStatus | "">("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [unp, setUnp] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!statusRef.current?.contains(event.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const statusLabel =
    status === "ip"
      ? "Индивидуальный предприниматель (ИП)"
      : status === "npd"
        ? "Плательщик НПД (Самозанятый)"
        : "Выберите статус";

  const canSubmit =
    fullName.trim().length > 1 &&
    extractLocalDigits(phone).length >= 9 &&
    (status === "ip" || status === "npd") &&
    unp.length === 9 &&
    file !== null &&
    !loading;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (
      fullName.trim().length <= 1 ||
      extractLocalDigits(phone).length < 9 ||
      (status !== "ip" && status !== "npd") ||
      unp.length !== 9 ||
      !file
    ) {
      setError("Заполните все обязательные поля и прикрепите документ");
      return;
    }
    if (loading) return;

    setLoading(true);
    setError("");

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      status,
      unp,
      fileName: file.name,
      fileSize: file.size,
    };

    window.setTimeout(() => {
      console.log("Cleaner application:", payload);
      setLoading(false);
      setSubmitted(true);
    }, 400);
  }

  if (submitted) {
    return (
      <ModalShell
        title="Заявка принята"
        subtitle="Спасибо, что хотите работать с CleanPlatform."
        onClose={onClose}
        wide
      >
        <div className="animate-sheet space-y-5">
          <div className="rounded-2xl bg-mint-soft/70 px-4 py-4 text-sm leading-relaxed text-foreground">
            Ваша заявка принята! Мы проверим ваши данные (обычно это занимает до
            24 часов) и пришлем вам секретную ссылку для входа в рабочий кабинет
            в SMS или Telegram.
          </div>
          <a
            href="/pro/dashboard"
            className="flex min-h-11 w-full items-center justify-center rounded-2xl border border-line bg-plaque px-4 text-sm font-semibold text-foreground transition hover:bg-line"
          >
            Открыть демо кабинета специалиста
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep"
          >
            Закрыть
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      title="Присоединяйтесь к нашей команде"
      subtitle="Заполните анкету кандидата — мы проверим данные и свяжемся с вами."
      onClose={onClose}
      wide
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="animate-sheet max-h-[70vh] space-y-3.5 overflow-y-auto pr-0.5"
      >
        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            ФИО <span className="text-brand">*</span>
          </span>
          <input
            type="text"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Иванов Иван Иванович"
            autoComplete="name"
            className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Номер телефона <span className="text-brand">*</span>
          </span>
          <BelarusPhoneInput value={phone} onChange={setPhone} autoFocus />
        </label>

        <div ref={statusRef} className="relative space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Ваш статус <span className="text-brand">*</span>
          </span>
          <button
            type="button"
            onClick={() => setStatusOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-2xl bg-plaque px-4 py-3.5 text-left transition active:scale-[0.995]"
          >
            <span
              className={`text-[15px] font-medium ${
                status ? "text-foreground" : "text-muted"
              }`}
            >
              {statusLabel}
            </span>
            <span className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
              <ChevronDownIcon />
            </span>
          </button>
          {statusOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_rgba(17,24,39,0.14)] ring-1 ring-black/5">
              {(
                [
                  {
                    id: "ip" as const,
                    label: "Индивидуальный предприниматель (ИП)",
                  },
                  {
                    id: "npd" as const,
                    label: "Плательщик НПД (Самозанятый)",
                  },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setStatus(option.id);
                    setStatusOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition ${
                    status === option.id
                      ? "bg-brand-soft text-brand"
                      : "text-foreground hover:bg-plaque"
                  }`}
                >
                  {option.label}
                  {status === option.id ? <span>✓</span> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            УНП <span className="text-brand">*</span>
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
            maxLength={9}
            className="w-full rounded-2xl bg-plaque px-4 py-3.5 text-[15px] font-medium tabular-nums text-foreground outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-mint/50"
          />
          <span className="block text-xs text-muted">
            Ровно 9 цифр · сейчас {unp.length}/9
          </span>
        </label>

        <div className="space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Документ <span className="text-brand">*</span>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              setFile(next);
              if (error) setError("");
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
              file
                ? "border-mint bg-mint-soft/40"
                : "border-line bg-plaque/60 hover:border-brand/40 hover:bg-plaque"
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path
                  d="M21.4 12.6 12.8 21a5 5 0 0 1-7.1-7.1l9.2-9.2a3.5 3.5 0 0 1 5 5l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="max-w-[28ch] text-sm font-medium leading-snug text-foreground">
              {file
                ? file.name
                : "Загрузите фото свидетельства ИП или скриншот из приложения Налог на проф. доход"}
            </span>
            <span className="text-xs text-muted">
              {file ? "Нажмите, чтобы заменить файл" : "JPG, PNG или PDF"}
            </span>
          </button>
        </div>

        {error ? (
          <p className="text-center text-sm font-medium text-red-500">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {loading ? "Отправляем…" : "Отправить заявку на модерацию"}
        </button>

        <p className="px-1 text-center text-[11px] leading-relaxed text-muted">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных в
          соответствии с политикой конфиденциальности CleanPlatform.
        </p>
      </form>
    </ModalShell>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const {
    isLoggedIn,
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

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function openProfile() {
    setMenuOpen(false);
    if (pathname === "/profile") return;
    router.push("/profile");
  }

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-line/70 bg-white/90 shadow-[0_8px_24px_rgba(17,24,39,0.05)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <a href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white shadow-sm">
              C
            </span>
            <span className="truncate font-[family-name:var(--font-unbounded)] text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
              CleanPlatform
            </span>
          </a>

          {pathname !== "/" ? (
            <a
              href="/"
              className="hidden rounded-full px-2.5 py-2 text-sm font-medium text-muted transition hover:bg-plaque hover:text-foreground sm:inline-flex"
            >
              На главную
            </a>
          ) : null}

          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={pathname === "/" ? link.href : `/${link.href}`}
                onClick={(event) => {
                  event.preventDefault();
                  openSection(link.href);
                }}
                className="rounded-full px-2.5 py-2 text-sm font-medium text-muted transition hover:bg-plaque hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setSupportOpen(true)}
              className="rounded-full px-2.5 py-2 text-sm font-medium text-muted transition hover:bg-plaque hover:text-foreground"
            >
              Сообщить об ошибке / Поддержка
            </button>
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={openProfile}
                aria-label="Личный кабинет"
                className="inline-flex max-w-[220px] items-center gap-2 rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-deep"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <ProfileIcon />
                </span>
                <span className="truncate tabular-nums tracking-tight">
                  {userPhone ?? "Личный кабинет"}
                </span>
                <ChevronDownIcon />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAccountModal()}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-deep"
                >
                  <ProfileIcon />
                  <span className="hidden sm:inline">Войти в аккаунт</span>
                  <span className="sm:hidden">Войти</span>
                </button>
                <button
                  type="button"
                  onClick={openCleanerModal}
                  className="hidden rounded-full border border-line bg-transparent px-3 py-2 text-sm font-medium text-muted transition hover:border-slate-300 hover:bg-plaque hover:text-foreground sm:inline-flex"
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
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/");
                }}
                className="rounded-2xl px-4 py-3.5 text-left text-[15px] font-semibold text-foreground transition hover:bg-plaque"
              >
                На главную
              </button>
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
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSupportOpen(true);
                }}
                className="rounded-2xl px-4 py-3.5 text-left text-[15px] font-semibold text-foreground transition hover:bg-plaque"
              >
                Сообщить об ошибке / Поддержка
              </button>
            </nav>

            <div className="mt-auto space-y-2.5 pt-6">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={openProfile}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold text-white"
                >
                  <ProfileIcon />
                  <span className="truncate tabular-nums">{userPhone ?? "Личный кабинет"}</span>
                  <ChevronDownIcon />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openAccountModal();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3.5 text-sm font-bold text-white"
                  >
                    <ProfileIcon />
                    Войти в аккаунт
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openCleanerModal();
                    }}
                    className="flex w-full items-center justify-center rounded-2xl border border-line bg-transparent px-4 py-3.5 text-sm font-medium text-muted transition hover:bg-plaque hover:text-foreground"
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
        <AccountModal
          onClose={closeAccountModal}
          onSuccess={(phone, name) => {
            login(phone, name);
            router.push("/profile");
          }}
        />
      )}
      {cleanerModalOpen && (
        <CleanerApplyModal onClose={closeCleanerModal} />
      )}
      {supportOpen ? (
        <SupportTicketModal
          source="client"
          onClose={() => setSupportOpen(false)}
        />
      ) : null}
    </>
  );
}
