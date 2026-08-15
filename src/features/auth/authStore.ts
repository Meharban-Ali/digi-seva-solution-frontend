import { create } from "zustand";
import { AdminUserDto } from "@/types/auth.types";

const TOKEN_KEY = "digiseva_admin_token";
const USER_KEY = "digiseva_admin_user";

interface AuthState {
  token: string | null;
  user: AdminUserDto | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AdminUserDto) => void;
  updateUser: (user: AdminUserDto) => void;
  logout: () => void;
}

const initialToken = localStorage.getItem(TOKEN_KEY);
const initialUserJson = localStorage.getItem(USER_KEY);
let initialUser: AdminUserDto | null = null;

if (initialUserJson) {
  try {
    initialUser = JSON.parse(initialUserJson);
  } catch {
    localStorage.removeItem(USER_KEY);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: initialUser,
  isAuthenticated: !!initialToken && !!initialUser,

  setAuth: (token: string, user: AdminUserDto) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  updateUser: (user: AdminUserDto) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
