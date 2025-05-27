import { StateCreator } from "zustand";
import { StoreState } from "../types";

export interface User {
  id: string;
  name: string;
  email: string;
  // Other user properties from Appwrite
}

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set
) => ({
  user: null,
  isAuthenticated: false,
  authLoading: false,
  login: async () => {
    set({ authLoading: true });
    try {
      // Logic to initiate Appwrite OAuth flow would go here
      // This is a placeholder for actual implementation
      set({
        isAuthenticated: true,
        user: { id: "user-id", name: "User Name", email: "user@example.com" },
        authLoading: false,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({ authLoading: false });
    }
  },
  logout: async () => {
    set({ authLoading: true });
    try {
      // Logic to log out using Appwrite would go here
      // This is a placeholder for actual implementation
      set({ isAuthenticated: false, user: null, authLoading: false });
    } catch (error) {
      console.error("Logout error:", error);
      set({ authLoading: false });
    }
  },
});
