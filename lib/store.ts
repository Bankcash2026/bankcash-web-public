'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
}

// JWT persisted to localStorage. Cleared on logout / wallet disconnect.
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (t) => set({ token: t }),
      logout: () => set({ token: null }),
    }),
    { name: 'bankcash-auth' },
  ),
);
