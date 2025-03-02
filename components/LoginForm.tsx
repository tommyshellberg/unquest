import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { ThemedText } from "@/components/ThemedText";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";

export interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onCancel: () => void;
  onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onCancel,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(true);

  // Debounce email validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(emailRegex.test(email));
      } else {
        setEmailValid(true);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleLogin = async () => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setLoginLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      console.error("Login error in LoginForm:", err);
      setError("Invalid email or password");
    } finally {
      console.log("Login finished, setting isLoading to false");
      setLoginLoading(false);
    }
  };

  // Determine if login button should be disabled
  const isLoginDisabled =
    loginLoading || !email || !password || (email.length > 0 && !emailValid);

  return (
    <BlurView intensity={90} tint="systemMaterialDark" style={styles.loginForm}>
      <ThemedText
        type="title"
        style={[styles.loginTitle, Typography.title]}
        accessibilityRole="header"
      >
        Welcome Back
      </ThemedText>

      {error ? (
        <ThemedText type="body" style={[Typography.body, styles.errorText]}>
          {error}
        </ThemedText>
      ) : null}

      <View style={styles.inputContainer}>
        <ThemedText type="bodyBold" style={styles.inputLabel}>
          Email
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            email.length > 0 && !emailValid && { borderColor: "red" },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={Colors.forest}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="Email input"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText type="bodyBold" style={styles.inputLabel}>
          Password
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={Colors.forest}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password input"
        />
      </View>

      <View style={styles.loginButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel login"
        >
          <ThemedText style={styles.cancelButtonText}>Back</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
            isLoginDisabled && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={isLoginDisabled}
          accessibilityRole="button"
          accessibilityLabel="Login"
        >
          {loginLoading ? (
            <ActivityIndicator
              size="small"
              color={Colors.cream}
              testID="login-loading"
            />
          ) : (
            <ThemedText style={styles.loginButtonText}>Login</ThemedText>
          )}
        </Pressable>
      </View>

      <TouchableOpacity
        onPress={onForgotPassword}
        style={styles.forgotPasswordContainer}
        accessibilityRole="button"
        accessibilityLabel="Forgot password?"
      >
        <ThemedText style={styles.forgotPasswordText}>
          Forgot Password?
        </ThemedText>
      </TouchableOpacity>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  loginForm: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  loginTitle: {
    textAlign: "center",
    color: Colors.cream,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  inputLabel: {
    color: Colors.cream,
  },
  input: {
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text.light,
    borderWidth: 1,
    borderColor: Colors.stone,
  },
  loginButtonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.error,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  cancelButtonPressed: {
    backgroundColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  loginButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  loginButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  loginButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  forgotPasswordContainer: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: Colors.cream,
    fontSize: FontSizes.sm,
    textDecorationLine: "underline",
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});

export default LoginForm;
