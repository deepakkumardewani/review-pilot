import React, { createContext, useContext, ReactNode } from "react";
import { Models } from "appwrite";
import { useAppwrite } from "../hooks/useAppwrite";

// Define the context type
interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  oauthLogin: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Context provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAppwrite();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
