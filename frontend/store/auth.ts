// store/auth.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  userId: string;
  email: string;
  role: string;
  name: string;
  address: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
      },
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
