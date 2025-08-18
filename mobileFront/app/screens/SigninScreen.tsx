import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/Authstack";
import { useSigninMutation } from "../lib/APIs/RTKQuery/authApi";
import { useDispatch } from "react-redux";
import { addUserToReducer } from "../store/slices/userSlice";
import { setCredentials } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../core/types/user";
import { useGetUserByTokenMutation } from "../lib/APIs/RTKQuery/UserAuth";
import { parseAuthError } from "../core/utils/errorHandler";
import { validateSigninForm } from "../core/utils/validation";
import Config from "react-native-config";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [signin, { isLoading, error }] = useSigninMutation();
  const [getUserByToken] = useGetUserByTokenMutation();
  const dispatch = useDispatch();

  // Clear errors when user types
  const clearErrors = () => {
    setErrorMessage("");
    setFieldErrors({});
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    clearErrors();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    clearErrors();
  };

  useEffect(() => {
    (async () => {
      try {
        const tokenFromStorage = await AsyncStorage.getItem("token");
        console.log("Token from storage:", tokenFromStorage);
        if (tokenFromStorage) {
          const result = await getUserByToken({ token: tokenFromStorage });
          console.log("getUserByToken result:", result);
          if ("data" in result) {
            console.log("Success:", result.data?.user);
            if (result.data?.user) {
              dispatch(addUserToReducer(result.data.user));
              dispatch(setCredentials(tokenFromStorage));
            }
          } else if ("error" in result) {
            console.log("Error:", result.error);
            await AsyncStorage.removeItem("token");
          }
        } else {
          console.log("No token found in storage");
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    })();
  }, [getUserByToken, dispatch]); 

  const handleSignin = async () => {
    // Clear previous errors
    clearErrors();

    // Validate form
    const validation = validateSigninForm({
      username,
      password
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      // Show first error as general error message
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError);
      return;
    }

    try {
      const result = await signin({ username, password });
      if ("data" in result) {
        console.log("Success:", result.data);
        if (result.data) {
          const { token, user } = result.data?.data as {
            token: string;
            user: User;
          };
          dispatch(setCredentials(token));
          await AsyncStorage.setItem("token", token);
          dispatch(addUserToReducer(user));
        }
      } else if ("error" in result) {
        console.log("RTK error:", result.error);
        // Use the centralized error handler
        const errorMessage = parseAuthError(result.error);
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error("sign failed:", error);
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

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="text-3xl font-bold text-center mb-8">TrackIt 📍</Text>

      <TextInput
        className={getInputStyle("username")}
        placeholder="Username or email"
        value={username}
        onChangeText={handleUsernameChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {fieldErrors.username && (
        <Text className="text-red-500 text-xs mb-2 px-2">{fieldErrors.username}</Text>
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
      {fieldErrors.password && (
        <Text className="text-red-500 text-xs mb-2 px-2">{fieldErrors.password}</Text>
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
        onPress={handleSignin}
        disabled={isLoading}
      >
        <Text className="text-white font-bold">
          {isLoading ? "Signing in..." : "Log in"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}}>
        <Text className="text-gray-500 text-center mt-4">Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-gray-100 rounded-full py-3 items-center mt-6"
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text className="font-semibold text-black">Create new account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
