import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthed: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthed: false,
  user: null,
  login: (user) => set({ isAuthed: true, user }),
  logout: () => set({ isAuthed: false, user: null }),
}));
