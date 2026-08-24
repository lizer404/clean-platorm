export type SupportTicket = {
  id: string;
  description: string;
  fileNames: string[];
  source: "client" | "cleaner";
  createdAt: string;
  status: "new" | "in_progress" | "closed";
};

const STORAGE_KEY = "cleanplatform.supportTickets";

export function loadTickets(): SupportTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SupportTicket[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTicket(
  input: Omit<SupportTicket, "id" | "createdAt" | "status">,
): SupportTicket {
  const ticket: SupportTicket = {
    ...input,
    id: `tkt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  const next = [ticket, ...loadTickets()].slice(0, 50);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return ticket;
}
