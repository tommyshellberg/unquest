import apiClient from "./api";
import { logout } from "./auth";

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other user fields as needed
}

export const getUserDetails = async (): Promise<UserDetails> => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);

    // If the error is authentication-related and token refresh failed,
    // we should log the user out
    if (error instanceof Error && error.message === "Token refresh failed") {
      await logout();
      // You might want to navigate to the login screen here
      // or emit an event that the app can listen to
    }

    throw error;
  }
};
