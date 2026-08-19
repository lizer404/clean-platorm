"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const AUTH_STORAGE_KEY = "cleanplatform.auth";

type StoredAuth = {
  phone: string;
  name?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  authReady: boolean;
  userPhone: string | null;
  userName: string | null;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  accountModalOpen: boolean;
  openAccountModal: (onSuccess?: () => void) => void;
  closeAccountModal: () => void;
  cleanerModalOpen: boolean;
  openCleanerModal: () => void;
  closeCleanerModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed?.phone || typeof parsed.phone !== "string") return null;
    return {
      phone: parsed.phone,
      name:
        typeof parsed.name === "string" && parsed.name.trim()
          ? parsed.name.trim()
          : undefined,
    };
  } catch {
    return null;
  }
}

function writeStoredAuth(phone: string | null, name?: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (!phone) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    const payload: StoredAuth = { phone };
    if (name && name.trim()) payload.name = name.trim();
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode errors in prototype
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [cleanerModalOpen, setCleanerModalOpen] = useState(false);
  const onLoginSuccessRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setIsAuthenticated(true);
      setUserPhone(stored.phone);
      setUserName(stored.name ?? null);
    }
    setHydrated(true);
  }, []);

  const login = useCallback((phone: string, name?: string) => {
    const normalizedPhone = phone.trim();
    const normalizedName = name?.trim() || null;
    setIsAuthenticated(true);
    setUserPhone(normalizedPhone);
    setUserName(normalizedName);
    writeStoredAuth(normalizedPhone, normalizedName);
    setAccountModalOpen(false);
    setCleanerModalOpen(false);
    const next = onLoginSuccessRef.current;
    onLoginSuccessRef.current = null;
    next?.();
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserPhone(null);
    setUserName(null);
    writeStoredAuth(null);
  }, []);

  const openAccountModal = useCallback((onSuccess?: () => void) => {
    onLoginSuccessRef.current = onSuccess ?? null;
    setAccountModalOpen(true);
  }, []);

  const closeAccountModal = useCallback(() => {
    onLoginSuccessRef.current = null;
    setAccountModalOpen(false);
  }, []);

  const openCleanerModal = useCallback(() => setCleanerModalOpen(true), []);
  const closeCleanerModal = useCallback(() => setCleanerModalOpen(false), []);

  const value = useMemo(
    () => ({
      isAuthenticated: hydrated ? isAuthenticated : false,
      isLoggedIn: hydrated ? isAuthenticated : false,
      authReady: hydrated,
      userPhone: hydrated ? userPhone : null,
      userName: hydrated ? userName : null,
      login,
      logout,
      accountModalOpen,
      openAccountModal,
      closeAccountModal,
      cleanerModalOpen,
      openCleanerModal,
      closeCleanerModal,
    }),
    [
      accountModalOpen,
      cleanerModalOpen,
      closeAccountModal,
      closeCleanerModal,
      hydrated,
      isAuthenticated,
      login,
      logout,
      openAccountModal,
      openCleanerModal,
      userName,
      userPhone,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
