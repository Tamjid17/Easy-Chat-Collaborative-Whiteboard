import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    user: {
        id: string;
        fullName: string;
        email: string;
        profilePicture?: string;
    } | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: { id: string; fullName: string; email: string; profilePicture?: string }) => void;
    clearAuth: () => void;
}

export const useAuthStore = create(persist<AuthState>(
    (set) => ({
        token: null,
        user: null,
        isAuthenticated: false,
        setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
        clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
        name: 'auth-storage',
        storage: createJSONStorage(() => sessionStorage),
    })
)