import axios from "axios";
import Constants from "expo-constants";
import * as tokenService from "./token";

// Set up API configuration for auth requests
const API_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://192.168.178.67:3001/v1";

// Create a separate axios instance for auth requests to avoid circular dependencies
export const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Keys for secure storage
const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  user: User;
  tokens: tokenService.AuthTokens;
}

/**
 * Register a new user
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await authClient.post("/auth/register", {
      name,
      email,
      password,
    });

    // Store tokens securely
    await tokenService.storeTokens(response.data.tokens);

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await tokenService.getAccessToken();
  return !!token;
};

/**
 * Clear all authentication data
 */
export const logout = async (): Promise<void> => {
  try {
    await tokenService.removeTokens();
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken =
  async (): Promise<tokenService.AuthTokens | null> => {
    try {
      const refreshToken = await tokenService.getRefreshToken();
      if (!refreshToken) {
        console.log("No refresh token available");
        return null;
      }

      const response = await authClient.post("/auth/refresh-tokens", {
        refreshToken,
      });

      const newTokens: tokenService.AuthTokens = response.data;
      await tokenService.storeTokens(newTokens);
      return newTokens;
    } catch (error) {
      console.error("Error refreshing token:", error);
      // If refresh fails, clear tokens
      await tokenService.removeTokens();
      return null;
    }
  };

/**
 * Login user with email and password
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await authClient.post("/auth/login", {
      email,
      password,
    });

    const { tokens } = response.data;

    // Store tokens
    await tokenService.storeTokens(tokens);

    return tokens;
  } catch (error) {
    console.error("Login error in auth.ts:", error);
    throw error;
  }
};

/**
 * Remove all tokens (alias for backward compatibility)
 */
export const removeTokens = tokenService.removeTokens;

// Re-export token types for backward compatibility
export type { AuthTokens } from "./token";
