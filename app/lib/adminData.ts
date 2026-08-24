export type SpecialistApplication = {
  id: string;
  fullName: string;
  statusType: "ИП" | "НПД";
  unp: string;
  documentPhoto: string;
  city: string;
  phone: string;
  submittedAt: string;
  decision: "pending" | "approved" | "rejected";
};

export type BlacklistRequest = {
  id: string;
  cleanerName: string;
  orderOrClient: string;
  reason: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

export const MOCK_APPLICATIONS: SpecialistApplication[] = [
  {
    id: "app-1",
    fullName: "Орлов Дмитрий Сергеевич",
    statusType: "ИП",
    unp: "193045678",
    documentPhoto: "/admin-docs/passport-orlov.svg",
    city: "Минск",
    phone: "+375 29 111-22-33",
    submittedAt: "2026-08-20T10:15:00.000Z",
    decision: "pending",
  },
  {
    id: "app-2",
    fullName: "Мороз Елена Ивановна",
    statusType: "НПД",
    unp: "—",
    documentPhoto: "/admin-docs/id-moroz.svg",
    city: "Брест",
    phone: "+375 33 555-66-77",
    submittedAt: "2026-08-21T14:40:00.000Z",
    decision: "pending",
  },
  {
    id: "app-3",
    fullName: "Ковалёва Анна Петровна",
    statusType: "ИП",
    unp: "291112233",
    documentPhoto: "/admin-docs/passport-kovaleva.svg",
    city: "Гомель",
    phone: "+375 25 888-99-00",
    submittedAt: "2026-08-22T09:05:00.000Z",
    decision: "pending",
  },
];

export const MOCK_BLACKLIST: BlacklistRequest[] = [
  {
    id: "bl-1",
    cleanerName: "Дмитрий Орлов",
    orderOrClient: "#1042",
    reason: "Клиент угрожал и отказывался оплачивать доп. услуги после согласования.",
    createdAt: "2026-08-22T16:20:00.000Z",
    status: "pending",
  },
  {
    id: "bl-2",
    cleanerName: "Елена Мороз",
    orderOrClient: "+375 29 700-11-22",
    reason: "Повторные ложные претензии и попытка снять негативный отзыв шантажом.",
    createdAt: "2026-08-23T11:10:00.000Z",
    status: "pending",
  },
];

const APP_KEY = "cleanplatform.admin.applications";
const BL_KEY = "cleanplatform.admin.blacklist";

export function loadApplications(): SpecialistApplication[] {
  if (typeof window === "undefined") return MOCK_APPLICATIONS;
  try {
    const raw = window.localStorage.getItem(APP_KEY);
    if (!raw) {
      window.localStorage.setItem(APP_KEY, JSON.stringify(MOCK_APPLICATIONS));
      return MOCK_APPLICATIONS;
    }
    return JSON.parse(raw) as SpecialistApplication[];
  } catch {
    return MOCK_APPLICATIONS;
  }
}

export function saveApplications(items: SpecialistApplication[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APP_KEY, JSON.stringify(items));
}

export function loadBlacklistRequests(): BlacklistRequest[] {
  if (typeof window === "undefined") return MOCK_BLACKLIST;
  try {
    const raw = window.localStorage.getItem(BL_KEY);
    if (!raw) {
      window.localStorage.setItem(BL_KEY, JSON.stringify(MOCK_BLACKLIST));
      return MOCK_BLACKLIST;
    }
    const stored = JSON.parse(raw) as BlacklistRequest[];
    // Merge cleaner-submitted requests from shared key
    const fromCleaners = loadCleanerBlacklistSubmissions();
    const ids = new Set(stored.map((i) => i.id));
    const merged = [...fromCleaners.filter((i) => !ids.has(i.id)), ...stored];
    return merged;
  } catch {
    return MOCK_BLACKLIST;
  }
}

export function saveBlacklistRequests(items: BlacklistRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BL_KEY, JSON.stringify(items));
}

const CLEANER_BL_KEY = "cleanplatform.blacklistRequests";

export function loadCleanerBlacklistSubmissions(): BlacklistRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLEANER_BL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BlacklistRequest[];
  } catch {
    return [];
  }
}

export function saveCleanerBlacklistSubmission(
  input: Omit<BlacklistRequest, "id" | "createdAt" | "status">,
) {
  if (typeof window === "undefined") return;
  const next: BlacklistRequest = {
    ...input,
    id: `bl-c-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  const prev = loadCleanerBlacklistSubmissions();
  window.localStorage.setItem(
    CLEANER_BL_KEY,
    JSON.stringify([next, ...prev].slice(0, 40)),
  );
  return next;
}
