import * as SecureStore from "expo-secure-store";
import apiClient from "./api";

// Keys for secure storage
const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";

// Types
export interface AuthTokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
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
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });

    console.log("response", response);

    // Store tokens securely
    await storeTokens(response.data.tokens);

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Store authentication tokens securely
 */
export const storeTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access.token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh.token);
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, tokens.access.expires);
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw error;
  }
};

/**
 * Get the stored access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

/**
 * Get the stored refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return !!token;
};

/**
 * Clear all authentication data
 */
export const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

/**
 * Check if the access token is expired
 */
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const expiryString = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
    if (!expiryString) return true;

    const expiryDate = new Date(expiryString);
    // Add a small buffer (e.g., 10 seconds) to account for network latency
    const now = new Date(Date.now() + 10000);

    return now >= expiryDate;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true; // Assume expired on error
  }
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (): Promise<AuthTokens | null> => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.log("No refresh token available");
      // @todo: does this mean they need to login again?
      return null;
    }

    // Create a new axios instance without interceptors to avoid infinite loop
    const response = await apiClient.post("/auth/refresh-tokens", {
      refreshToken,
    });

    const newTokens: AuthTokens = response.data;
    await storeTokens(newTokens);
    return newTokens;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // If refresh fails, clear tokens and force re-authentication
    await logout();
    return null;
  }
};
