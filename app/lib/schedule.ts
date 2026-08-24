/** Shared cleaner availability + 1h travel buffer for client booking. */

export const TRAVEL_BUFFER_HOURS = 1;
export const DEMO_CLEANER_ID = "dmitry";

export type FreeInterval = {
  id: string;
  /** YYYY-MM-DD */
  dateIso: string;
  from: string;
  to: string;
};

export type ClientSlot = {
  id: string;
  label: string;
  dateIso: string;
  time: string;
};

const storageKey = (cleanerId: string) =>
  `cleanplatform.cleanerSchedule.${cleanerId}`;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toDateIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${pad(h)}:${pad(m)}`;
}

export function formatDayLabel(dateIso: string) {
  const [y, mo, d] = dateIso.split("-").map(Number);
  const date = new Date(y, mo - 1, d);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatIntervalLabel(interval: FreeInterval) {
  return `${formatDayLabel(interval.dateIso)}, ${interval.from}–${interval.to}`;
}

/** Hourly start times a client may book after travel buffer. */
export function clientStartTimes(
  from: string,
  to: string,
  bufferHours = TRAVEL_BUFFER_HOURS,
): string[] {
  const start = timeToMinutes(from) + bufferHours * 60;
  const end = timeToMinutes(to);
  const times: string[] = [];
  for (let m = start; m < end; m += 60) {
    times.push(minutesToTime(m));
  }
  return times;
}

export function intervalsToClientSlots(
  intervals: FreeInterval[],
  cleanerId: string,
): ClientSlot[] {
  const slots: ClientSlot[] = [];
  for (const interval of intervals) {
    for (const time of clientStartTimes(interval.from, interval.to)) {
      slots.push({
        id: `${cleanerId}-${interval.dateIso}-${time}`,
        dateIso: interval.dateIso,
        time,
        label: `${formatDayLabel(interval.dateIso)}, ${time}`,
      });
    }
  }
  return slots;
}

function defaultDemoIntervals(): FreeInterval[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return [
    {
      id: "demo-today",
      dateIso: toDateIso(today),
      from: "10:00",
      to: "15:00",
    },
    {
      id: "demo-tomorrow",
      dateIso: toDateIso(tomorrow),
      from: "09:00",
      to: "13:00",
    },
  ];
}

export function loadCleanerIntervals(cleanerId: string): FreeInterval[] {
  if (typeof window === "undefined") return defaultDemoIntervals();
  try {
    const raw = window.localStorage.getItem(storageKey(cleanerId));
    if (!raw) {
      const seed = defaultDemoIntervals();
      window.localStorage.setItem(storageKey(cleanerId), JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as FreeInterval[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultDemoIntervals();
    }
    return parsed;
  } catch {
    return defaultDemoIntervals();
  }
}

export function saveCleanerIntervals(
  cleanerId: string,
  intervals: FreeInterval[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(cleanerId), JSON.stringify(intervals));
}

/** Client-facing slots with travel buffer applied. */
export function getClientSlotsForCleaner(cleanerId: string): ClientSlot[] {
  const intervals = loadCleanerIntervals(cleanerId);
  return intervalsToClientSlots(intervals, cleanerId);
}
