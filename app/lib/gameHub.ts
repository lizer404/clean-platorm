export type CleaningFrequency =
  | "weekly"
  | "biweekly"
  | "monthly"
  | "unknown";

export type GameHubState = {
  onboarded: boolean;
  frequency: CleaningFrequency | null;
  coins: number;
  cleaningsTowardBox: number;
  boxGoal: number;
};

const STORAGE_PREFIX = "cleanplatform.gameHub.";

const DEFAULT_STATE: GameHubState = {
  onboarded: false,
  frequency: null,
  coins: 150,
  cleaningsTowardBox: 4,
  boxGoal: 10,
};

function storageKey(phone: string) {
  return `${STORAGE_PREFIX}${phone.trim()}`;
}

export function readGameHubState(phone: string): GameHubState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(storageKey(phone));
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<GameHubState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      onboarded: Boolean(parsed.onboarded),
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function writeGameHubState(phone: string, state: GameHubState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(phone), JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

export function isFirstTimeGame(phone: string) {
  return !readGameHubState(phone).onboarded;
}
