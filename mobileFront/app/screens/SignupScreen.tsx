//
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/Authstack";
import { useSignupMutation } from "../lib/APIs/RTKQuery/authApi";
import { useDispatch } from "react-redux";
import { addUserToReducer } from "../store/slices/userSlice";
import { setCredentials } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../core/types/user";
import { parseAuthError } from "../core/utils/errorHandler";
import { validateSignupForm, getFieldError } from "../core/utils/validation";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [backendError, setBackendError] = useState("");
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();

  // Clear errors when user types
  const clearErrors = () => {
    setErrorMessage("");
    setFieldErrors({});
    setBackendError("");
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    clearErrors();
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    clearErrors();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    clearErrors();
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    clearErrors();
  };

  const handleSignup = async () => {
    // Clear previous errors
    clearErrors();

    // Validate form
    const validation = validateSignupForm({
      username,
      email,
      password,
      confirmPassword
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      // Show first error as general error message
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError);
      return;
    }

    try {
      const result = await signup({ username, password, email });
      if ("data" in result) {
        console.log("Signup Success:", result.data);
        if (result.data) {
          const { token, createdUser } = result.data?.data as {
            token: string;
            createdUser: User;
          };
          dispatch(setCredentials(token));
          await AsyncStorage.setItem("token", token);
          dispatch(addUserToReducer(createdUser));
          navigation.replace("Home");
        }
      } else if ("error" in result) {
        console.log("Signup RTK error:", result.error);
        // Use the centralized error handler
        const errorMessage = parseAuthError(result.error);
        setErrorMessage(errorMessage);
        setBackendError(errorMessage);
        
        // Map backend errors to specific fields
        const newFieldErrors: Record<string, string> = {};
        
        // Check for username errors
        const usernameError = getFieldError("username", errorMessage, {});
        if (usernameError) {
          newFieldErrors.username = usernameError;
        }
        
        // Check for email errors
        const emailError = getFieldError("email", errorMessage, {});
        if (emailError) {
          newFieldErrors.email = emailError;
        }
        
        // Check for password errors
        const passwordError = getFieldError("password", errorMessage, {});
        if (passwordError) {
          newFieldErrors.password = passwordError;
        }
        
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        }
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const getInputStyle = (fieldName: string) => {
    const baseStyle = "h-12 bg-gray-100 rounded-xl px-4 mb-3";
    if (fieldErrors[fieldName]) {
      return `${baseStyle} border-2 border-red-300`;
    }
    return baseStyle;
  };

  const getFieldErrorMessage = (fieldName: string) => {
    // First check validation errors
    if (fieldErrors[fieldName]) {
      return fieldErrors[fieldName];
    }
    
    // Then check if backend error is related to this field
    if (backendError) {
      return getFieldError(fieldName, backendError, {});
    }
    
    return "";
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="text-3xl font-bold text-center mb-8">TrackIt 📍</Text>

      <TextInput
        className={getInputStyle("username")}
        placeholder="Username"
        value={username}
        onChangeText={handleUsernameChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {getFieldErrorMessage("username") && (
        <Text className="text-red-500 text-xs mb-2 px-2">{getFieldErrorMessage("username")}</Text>
      )}

      <TextInput
        className={getInputStyle("email")}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {getFieldErrorMessage("email") && (
        <Text className="text-red-500 text-xs mb-2 px-2">{getFieldErrorMessage("email")}</Text>
      )}

      <TextInput
        className={getInputStyle("password")}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {getFieldErrorMessage("password") && (
        <Text className="text-red-500 text-xs mb-2 px-2">{getFieldErrorMessage("password")}</Text>
      )}

      <TextInput
        className={getInputStyle("confirmPassword")}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {getFieldErrorMessage("confirmPassword") && (
        <Text className="text-red-500 text-xs mb-2 px-2">{getFieldErrorMessage("confirmPassword")}</Text>
      )}

      {/* General Error Message Display */}
      {errorMessage ? (
        <View className="mb-3 px-2 py-2 bg-red-50 rounded-lg border border-red-200">
          <Text className="text-red-600 text-sm text-center font-medium">{errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        className={`rounded-full py-3 items-center mt-3 ${
          isLoading ? "bg-gray-400" : "bg-blue-500"
        }`}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text className="text-white font-bold">
          {isLoading ? "Creating account..." : "Sign up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text className="text-gray-500 text-center mt-6">
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
