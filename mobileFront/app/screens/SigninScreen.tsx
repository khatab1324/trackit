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
    clearErrors();
    const validation = validateSigninForm({
      username,
      password
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
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
        
        if (result.error && typeof result.error === 'object' && 'status' in result.error) {
          const errorStatus = (result.error as any).status;
          if (errorStatus === 403) {
            setErrorMessage("Please verify your email address before signing in. Check your email for a verification code.");
            return;
          }
        }
        
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
    const baseClasses = "h-14 rounded-2xl px-5 mb-4 text-base font-medium bg-gray-800 text-white border-2 border-gray-700";
    
    if (fieldErrors[fieldName]) {
      return `${baseClasses} border-red-500`;
    }
    
    return baseClasses;
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center px-6 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Logo and Title Section */}
      <View className="items-center mb-12">
        <View className="w-20 h-20 rounded-full items-center justify-center mb-6 bg-gray-800">
          <Text className="text-4xl">📍</Text>
        </View>
        
        <Text className="text-4xl font-bold mb-3 text-white">
          TrackIt
        </Text>
        
        <Text className="text-lg text-center px-8 text-gray-400">
          Sign in to continue your journey
        </Text>
      </View>

      {/* Form Section */}
      <View className="mb-8">
        <TextInput
          className={getInputStyle("username")}
          placeholder="Username or email"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {fieldErrors.username && (
          <Text className="text-red-500 text-sm mb-2 ml-2 font-medium">
            {fieldErrors.username}
          </Text>
        )}

        <TextInput
          className={getInputStyle("password")}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {fieldErrors.password && (
          <Text className="text-red-500 text-sm mb-2 ml-2 font-medium">
            {fieldErrors.password}
          </Text>
        )}

        {/* General Error Message Display */}
        {errorMessage ? (
          <View className="mb-6 px-4 py-3 rounded-xl border bg-red-900/20 border-red-800">
            <Text className="text-sm text-center font-medium text-red-400">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Sign In Button */}
        <TouchableOpacity
          className={`h-14 rounded-2xl items-center justify-center mb-6 ${
            isLoading ? "bg-gray-700" : "bg-blue-600"
          }`}
          onPress={handleSignin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text className={`text-lg font-bold ${
            isLoading ? "text-gray-400" : "text-white"
          }`}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity 
          onPress={() => {}}
          className="items-center mb-8"
          activeOpacity={0.7}
        >
          <Text className="text-base font-medium text-gray-400">
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-gray-700" />
          <Text className="text-sm font-medium mx-4 text-gray-500">
            OR
          </Text>
          <View className="flex-1 h-px bg-gray-700" />
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          className="h-14 rounded-2xl items-center justify-center border-2 border-gray-700 bg-transparent"
          onPress={() => navigation.navigate("SignUp")}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">
            Create new account
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
