import * as tokenService from "../token";
import { authClient, registerUser, refreshAccessToken } from "../auth";
import { AxiosInstance } from "axios";

// Mock dependencies
jest.mock("expo-secure-store");
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}));
jest.mock("../token", () => ({
  storeTokens: jest.fn(),
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  isTokenExpired: jest.fn(),
  removeTokens: jest.fn(),
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

      // Mock the auth client's post method with proper type casting
      (authClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Mock token service functions
      (tokenService.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await registerUser(
        "Test User",
        "test@test.com",
        "password123"
      );

      expect(authClient.post).toHaveBeenCalledWith("/auth/register", {
        name: "Test User",
        email: "test@test.com",
        password: "password123",
      });
      expect(tokenService.storeTokens).toHaveBeenCalledWith(
        mockResponse.data.tokens
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle registration errors", async () => {
      const error = new Error("Registration failed");
      (authClient.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        registerUser("Test", "test@test.com", "pass123")
      ).rejects.toThrow("Registration failed");
    });
  });

  describe("refreshAccessToken", () => {
    it("should refresh tokens successfully", async () => {
      const mockRefreshToken = "refresh123";
      const mockNewTokens = {
        access: { token: "newAccess123", expires: "2024-03-01" },
        refresh: { token: "newRefresh123", expires: "2024-04-01" },
      };

      // Mock getting the refresh token
      (tokenService.getRefreshToken as jest.Mock).mockResolvedValueOnce(
        mockRefreshToken
      );

      // Mock the auth client's post method
      (authClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockNewTokens,
      });

      const result = await refreshAccessToken();

      expect(authClient.post).toHaveBeenCalledWith("/auth/refresh-tokens", {
        refreshToken: mockRefreshToken,
      });
      expect(tokenService.storeTokens).toHaveBeenCalledWith(mockNewTokens);
      expect(result).toEqual(mockNewTokens);
    });

    it("should return null when no refresh token exists", async () => {
      // Mock getting a null refresh token
      (tokenService.getRefreshToken as jest.Mock).mockResolvedValueOnce(null);

      const result = await refreshAccessToken();
      expect(result).toBeNull();
    });

    it("should handle refresh errors and logout", async () => {
      // Mock getting the refresh token
      (tokenService.getRefreshToken as jest.Mock).mockResolvedValueOnce(
        "refresh123"
      );

      // Mock the auth client's post method to throw an error
      (authClient.post as jest.Mock).mockRejectedValueOnce(
        new Error("Refresh failed")
      );

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      // Verify removeTokens was called
      expect(tokenService.removeTokens).toHaveBeenCalled();
    });
  });
});
