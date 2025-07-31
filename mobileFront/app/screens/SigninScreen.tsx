// app/screens/SignInScreen.tsx
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
// import { useDispatch } from "react-redux";
import { useSigninMutation } from "../lib/APIs/RTKQuery/authApi";
import { useDispatch } from "react-redux";
import { addUserToReducer } from "../store/slices/userSlice";
import { setCredentials } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/user";
import { useGetUserByTokenMutation } from "../lib/APIs/RTKQuery/UserAuth";
import Config from "react-native-config";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //   const dispatch = useDispatch();
  const [signin, { isLoading, error }] = useSigninMutation();
  const [getUserByToken] = useGetUserByTokenMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {

        const tokenFromStorage = await AsyncStorage.getItem("token");
        console.log("Token from storage:", tokenFromStorage);
        if (tokenFromStorage) {
          const result = await getUserByToken({ token: tokenFromStorage });
          console.log("getUserByToken result:", result);
          if ("data" in result) {
            console.log("Success:", result.data);
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
  }, [getUserByToken, dispatch]); // Add dependencies
  const handleSignin = async () => {
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
          // navigation.replace("Home");
        }
      } else {
        console.log("RTK error:", result.error);
      }
    } catch (error) {
      console.error("sign failed:", error);
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

      <TouchableOpacity
        className="bg-blue-500 rounded-full py-3 items-center mt-3"
        onPress={handleSignin}
      >
        <Text className="text-white font-bold">Log in</Text>
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
