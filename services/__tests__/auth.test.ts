import * as SecureStore from "expo-secure-store";
import {
  registerUser,
  storeTokens,
  getAccessToken,
  isTokenExpired,
  refreshAccessToken,
  logout,
} from "../auth";
import apiClient from "../api";

// Mock SecureStore
jest.mock("expo-secure-store");

// Mock axios client
jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a user and store tokens", async () => {
      const mockResponse = {
        data: {
          user: { id: "123", name: "Test User", email: "test@test.com" },
          tokens: {
            access: { token: "access123", expires: "2024-03-01" },
            refresh: { token: "refresh123", expires: "2024-04-01" },
          },
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await registerUser(
        "Test User",
        "test@test.com",
        "password123"
      );

      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        name: "Test User",
        email: "test@test.com",
        password: "password123",
      });
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle registration errors", async () => {
      const error = new Error("Registration failed");
      (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        registerUser("Test", "test@test.com", "pass123")
      ).rejects.toThrow("Registration failed");
    });
  });

  describe("isTokenExpired", () => {
    it("should return true when no expiry date exists", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const result = await isTokenExpired();
      expect(result).toBe(true);
    });

    it("should return true when token is expired", async () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(pastDate);

      const result = await isTokenExpired();
      expect(result).toBe(true);
    });

    it("should return false when token is not expired", async () => {
      const futureDate = new Date(Date.now() + 1000000).toISOString();
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(futureDate);

      const result = await isTokenExpired();
      expect(result).toBe(false);
    });
  });

  describe("refreshAccessToken", () => {
    it("should refresh tokens successfully", async () => {
      const mockRefreshToken = "refresh123";
      const mockNewTokens = {
        access: { token: "newAccess123", expires: "2024-03-01" },
        refresh: { token: "newRefresh123", expires: "2024-04-01" },
      };

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        mockRefreshToken
      );
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockNewTokens,
      });

      const result = await refreshAccessToken();

      expect(apiClient.post).toHaveBeenCalledWith("/auth/refresh-tokens", {
        refreshToken: mockRefreshToken,
      });
      expect(result).toEqual(mockNewTokens);
    });

    it("should return null when no refresh token exists", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const result = await refreshAccessToken();
      expect(result).toBeNull();
    });

    it("should handle refresh errors and logout", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        "refresh123"
      );
      (apiClient.post as jest.Mock).mockRejectedValueOnce(
        new Error("Refresh failed")
      );

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      // Verify logout was called
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
    });
  });
});
