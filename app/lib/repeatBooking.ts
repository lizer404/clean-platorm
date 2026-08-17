export type CleaningTypeId = "maintenance" | "general" | "afterRepair";

export type ExtraId =
  | "fridge"
  | "oven"
  | "microwave"
  | "ironing"
  | "dishes"
  | "balcony"
  | "windows"
  | "keys";

export type RepeatBookingDraft = {
  cleaningType: CleaningTypeId;
  rooms: number;
  baths: number;
  area: number;
  extras: ExtraId[];
  cleanerId: string;
  cleanerName: string;
  cleanerInitials: string;
  cleanerAccent: string;
};

const STORAGE_KEY = "cleanplatform.repeatBooking";

export function saveRepeatBooking(draft: RepeatBookingDraft) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function consumeRepeatBooking(): RepeatBookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as RepeatBookingDraft;
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
