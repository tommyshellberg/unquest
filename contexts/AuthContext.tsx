import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, loginUser, removeTokens } from "@/services/auth";
import { useRouter } from "expo-router";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = async () => {
    console.log("Checking auth status");
    setIsLoading(true);
    try {
      const authenticated = await isAuthenticated();
      console.log("Authenticated:", authenticated);
      setIsLoggedIn(authenticated);
      return authenticated;
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log("Logging in with email:", email, "and password:", password);
    try {
      await loginUser(email, password);
      console.log("Login successful");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeTokens();
      setIsLoggedIn(false);
      router.replace("/onboarding");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, login, logout, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
