"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  userPhone: string | null;
  login: (phone: string) => void;
  logout: () => void;
  accountModalOpen: boolean;
  openAccountModal: (onSuccess?: () => void) => void;
  closeAccountModal: () => void;
  cleanerModalOpen: boolean;
  openCleanerModal: () => void;
  closeCleanerModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [cleanerModalOpen, setCleanerModalOpen] = useState(false);
  const onLoginSuccessRef = useRef<(() => void) | null>(null);

  const login = useCallback((phone: string) => {
    setIsAuthenticated(true);
    setUserPhone(phone);
    setAccountModalOpen(false);
    const next = onLoginSuccessRef.current;
    onLoginSuccessRef.current = null;
    next?.();
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserPhone(null);
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
      isAuthenticated,
      isLoggedIn: isAuthenticated,
      userPhone,
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
      isAuthenticated,
      login,
      logout,
      openAccountModal,
      openCleanerModal,
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
