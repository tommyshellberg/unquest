import { getUserDetails } from "../user";
import apiClient from "../api";
import { logout } from "../auth";

jest.mock("../api");
jest.mock("../auth");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user details successfully", async () => {
    const mockUserData = {
      id: "123",
      name: "Test User",
      email: "test@test.com",
      role: "user",
    };

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });

    const result = await getUserDetails();

    expect(result).toEqual(mockUserData);
    expect(apiClient.get).toHaveBeenCalledWith("/users/me");
  });

  it("should handle token refresh failure and logout", async () => {
    const error = new Error("Token refresh failed");
    (apiClient.get as jest.Mock).mockRejectedValueOnce(error);

    await expect(getUserDetails()).rejects.toThrow("Token refresh failed");
    expect(logout).toHaveBeenCalled();
  });

  it("should handle other errors without logging out", async () => {
    const error = new Error("Network error");
    (apiClient.get as jest.Mock).mockRejectedValueOnce(error);

    await expect(getUserDetails()).rejects.toThrow("Network error");
    expect(logout).not.toHaveBeenCalled();
  });
});
