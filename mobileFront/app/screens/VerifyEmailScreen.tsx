import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/Authstack";
import { useVerifyEmailMutation } from "../lib/APIs/RTKQuery/authApi";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

const VerifyEmailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleVerify = async () => {
    setErrorMessage("");
    try {
      const result = await verifyEmail({ email, code });
      if ("data" in result && result.data?.success) {
        alert("Email verified successfully! You can now log in.");
        navigation.replace("SignIn");
      } else {
        setErrorMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="text-2xl font-bold text-center mb-6">
        Verify your email
      </Text>

      <Text className="text-gray-500 text-center mb-4">
        We sent a verification code to {email}
      </Text>

      <TextInput
        className="h-12 bg-gray-100 rounded-xl px-4 mb-3 text-center"
        placeholder="Enter verification code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />

      {errorMessage ? (
        <Text className="text-red-500 text-center mb-2">{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        className="bg-blue-500 rounded-full py-3 items-center mt-3"
        onPress={handleVerify}
        disabled={isLoading}
      >
        <Text className="text-white font-bold">
          {isLoading ? "Verifying..." : "Verify"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("SignIn")}>
        <Text className="text-gray-500 text-center mt-6">Back to login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default VerifyEmailScreen;
