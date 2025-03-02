import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  // Mock functions for props
  const onLoginMock = jest.fn(() => Promise.resolve());
  const onCancelMock = jest.fn();
  const onForgotPasswordMock = jest.fn();

  // Helper function to render the component with default props
  const renderLoginForm = (props = {}) => {
    return render(
      <LoginForm
        onLogin={onLoginMock}
        onCancel={onCancelMock}
        onForgotPassword={onForgotPasswordMock}
        {...props}
      />
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clear any pending timers after each test
    jest.clearAllTimers();
  });

  it("renders correctly with all required elements", () => {
    const { getByText, getByPlaceholderText, getByLabelText } =
      renderLoginForm();

    // Check that all elements are rendered
    expect(getByText("Welcome Back")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByLabelText("Login")).toBeTruthy();
    expect(getByLabelText("Cancel login")).toBeTruthy();
    expect(getByText("Forgot Password?")).toBeTruthy();
  });

  it("disables login button when fields are empty", () => {
    const { getByLabelText } = renderLoginForm();
    const loginButton = getByLabelText("Login");
    // Login button should be disabled initially
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
  });

  it("enables login button when valid email and password are entered", async () => {
    const { getByPlaceholderText, getByLabelText } = renderLoginForm();

    // Enter valid email and password
    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "password123"
    );

    // Wait for debounce timeout
    await waitFor(
      () => {
        const loginButton = getByLabelText("Login");
        expect(loginButton.props.accessibilityState.disabled).toBe(false);
      },
      { timeout: 500 }
    );
  });

  it("shows validation error for invalid email format", async () => {
    const { getByPlaceholderText } = renderLoginForm();
    const emailInput = getByPlaceholderText("Enter your email");

    // Enter invalid email
    fireEvent.changeText(emailInput, "invalid-email");

    // Wait for debounce timeout
    await waitFor(
      () => {
        // Check for red border (validation error styling)
        const styles = emailInput.props.style;
        const hasRedBorder = styles.some(
          (style: any) =>
            style && typeof style === "object" && style.borderColor === "red"
        );
        expect(hasRedBorder).toBe(true);
      },
      { timeout: 500 }
    );
  });

  it("calls onLogin with email and password when login button is pressed", async () => {
    const { getByPlaceholderText, getByLabelText } = renderLoginForm();

    // Enter valid credentials
    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "password123"
    );

    // Wait for debounce timeout
    await waitFor(() => {}, { timeout: 500 });

    // Press login button
    fireEvent.press(getByLabelText("Login"));

    // Check if onLogin was called with correct arguments
    expect(onLoginMock).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("shows error message when login fails", async () => {
    // Mock onLogin to reject with an error
    const loginError = new Error("Login failed");
    const failedLoginMock = jest.fn(() => Promise.reject(loginError));

    const { getByPlaceholderText, getByLabelText, findByText } = render(
      <LoginForm
        onLogin={failedLoginMock}
        onCancel={onCancelMock}
        onForgotPassword={onForgotPasswordMock}
      />
    );

    // Enter valid credentials
    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "password123"
    );

    // Wait for debounce timeout
    await waitFor(() => {}, { timeout: 500 });

    // Press login button
    fireEvent.press(getByLabelText("Login"));

    // Check if error message is displayed
    const errorMessage = await findByText("Invalid email or password");
    expect(errorMessage).toBeTruthy();
  });

  it("calls onCancel when cancel button is pressed", () => {
    const { getByLabelText } = renderLoginForm();

    // Press cancel button
    fireEvent.press(getByLabelText("Cancel login"));

    // Check if onCancel was called
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("calls onForgotPassword when forgot password link is pressed", () => {
    const { getByLabelText } = renderLoginForm();

    // Press forgot password link
    fireEvent.press(getByLabelText("Forgot password?"));

    // Check if onForgotPassword was called
    expect(onForgotPasswordMock).toHaveBeenCalledTimes(1);
  });

  it("shows loading indicator when login is in progress", async () => {
    // Create a promise that we can control with proper typing
    let resolveLoginPromise!: () => void; // Using definite assignment assertion
    const loginPromise = new Promise<void>((resolve) => {
      resolveLoginPromise = resolve;
    });

    // Mock onLogin to return our controlled promise with proper typing
    const delayedLoginMock = jest.fn(
      (email: string, password: string): Promise<void> => loginPromise
    );

    const { getByPlaceholderText, getByLabelText, findByTestId } = render(
      <LoginForm
        onLogin={delayedLoginMock}
        onCancel={onCancelMock}
        onForgotPassword={onForgotPasswordMock}
      />
    );

    // Enter valid credentials
    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "password123"
    );

    // Wait for debounce timeout
    await waitFor(() => {}, { timeout: 500 });

    // Press login button
    fireEvent.press(getByLabelText("Login"));

    // Check if ActivityIndicator is displayed
    const loadingIndicator = await findByTestId("login-loading");
    expect(loadingIndicator).toBeTruthy();

    // Resolve the promise to clean up
    resolveLoginPromise();

    // Wait for the promise to resolve
    await loginPromise;
  });
});
