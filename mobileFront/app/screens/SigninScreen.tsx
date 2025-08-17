import React, { useEffect, useState } from "react";
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
import { useSigninMutation } from "../lib/APIs/RTKQuery/authApi";
import { useDispatch } from "react-redux";
import { addUserToReducer } from "../store/slices/userSlice";
import { setCredentials } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../core/types/user";
import { useGetUserByTokenMutation } from "../lib/APIs/RTKQuery/UserAuth";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [signin, { isLoading }] = useSigninMutation();
  const [getUserByToken] = useGetUserByTokenMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const tokenFromStorage = await AsyncStorage.getItem("token");
        if (tokenFromStorage) {
          const result = await getUserByToken({ token: tokenFromStorage });
          if ("data" in result && result.data?.user) {
            dispatch(addUserToReducer(result.data.user));
            dispatch(setCredentials(tokenFromStorage));
          } else if ("error" in result) {
            await AsyncStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    })();
  }, [getUserByToken, dispatch]);

  const handleSignin = async () => {
    setErrorMessage("");

    try {
      const result = await signin({ username, password });
      if ("data" in result) {
        if (result.data) {
          const { token, user } = result.data?.data as {
            token: string;
            user: User;
          };
          dispatch(setCredentials(token));
          await AsyncStorage.setItem("token", token);
          dispatch(addUserToReducer(user));
          navigation.replace("Home");
        }
      } else if ("error" in result) {
        setErrorMessage("Can not find the account.");
        console.log("RTK error:", result.error);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="text-3xl font-bold text-center mb-8">TrackIt 📍</Text>

      <TextInput
        className="h-12 bg-gray-100 rounded-xl px-4 mb-3"
        placeholder="Username or email"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        className="h-12 bg-gray-100 rounded-xl px-4 mb-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMessage ? (
        <Text className="text-red-500 text-center mb-2">{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        className="bg-blue-500 rounded-full py-3 items-center mt-3"
        onPress={handleSignin}
        disabled={isLoading}
      >
        <Text className="text-white font-bold">
          {isLoading ? "Logging in..." : "Log in"}
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