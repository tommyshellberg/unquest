import * as SecureStore from "expo-secure-store";

// Keys for secure storage
export const ACCESS_TOKEN_KEY = "auth_access_token";
export const REFRESH_TOKEN_KEY = "auth_refresh_token";
export const TOKEN_EXPIRY_KEY = "auth_token_expiry";

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
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
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
 * Remove all tokens from secure storage
 */
export const removeTokens = async (): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
    return true;
  } catch (error) {
    console.error("Error removing tokens:", error);
    return false;
  }
};
