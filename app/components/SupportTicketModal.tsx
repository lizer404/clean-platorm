"use client";

import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { saveTicket } from "../lib/tickets";

type SupportTicketModalProps = {
  onClose: () => void;
  source?: "client" | "cleaner";
};

export default function SupportTicketModal({
  onClose,
  source = "client",
}: SupportTicketModalProps) {
  const titleId = useId();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const addFiles = useCallback((list: FileList | null) => {
    if (!list?.length) return;
    const next = Array.from(list).filter((file) => {
      const okType =
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type === "application/pdf";
      return okType && file.size <= 25 * 1024 * 1024;
    });
    setFiles((prev) => [...prev, ...next].slice(0, 6));
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!description.trim()) return;
    setSending(true);
    window.setTimeout(() => {
      saveTicket({
        description: description.trim(),
        fileNames: files.map((f) => f.name),
        source,
      });
      setSending(false);
      setSent(true);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="font-[family-name:var(--font-unbounded)] text-lg font-semibold text-slate-900"
            >
              Сообщить об ошибке
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Поддержка CleanPlatform · заявка уйдёт администратору
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {sent ? (
          <div className="space-y-4 py-2 text-center">
            <p className="text-base font-semibold text-emerald-700">
              Заявка отправлена
            </p>
            <p className="text-sm text-slate-500">
              Обращение появилось во вкладке «Обращения пользователей» кабинета
              администратора.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1e3a8a] px-5 text-sm font-bold text-white"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Описание проблемы
              </span>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Опишите, что произошло…"
                className="w-full resize-none rounded-xl bg-slate-50 px-3 py-3 text-sm outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-[#1e3a8a]/40"
              />
            </label>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Медиафайлы
              </p>
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(false);
                  addFiles(event.dataTransfer.files);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
                  dragOver
                    ? "border-[#1e3a8a] bg-[#1e3a8a]/5"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,video/*,.pdf"
                  multiple
                  className="sr-only"
                  onChange={(event) => addFiles(event.target.files)}
                />
                <span className="text-sm font-semibold text-slate-700">
                  Перетащите фото, скрины или видео
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  или нажмите, чтобы выбрать · до 6 файлов
                </span>
              </label>
              {files.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {files.map((file) => (
                    <li
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) => prev.filter((f) => f !== file))
                        }
                        className="shrink-0 font-semibold text-rose-600"
                      >
                        Убрать
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={sending || !description.trim()}
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1e3a8a] text-sm font-bold text-white transition hover:bg-[#152a66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Отправка…" : "Отправить"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
