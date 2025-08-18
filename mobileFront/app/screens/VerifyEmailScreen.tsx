import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/Authstack";
import { useVerifyEmailMutation } from "../lib/APIs/RTKQuery/authApi";
import { ThemedText } from "../components/ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

const VerifyEmailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const themeColors = useThemeColors();

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
      className="flex-1 justify-center px-6"
      style={{ backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedText className="text-2xl font-bold text-center mb-6">
        Verify your email
      </ThemedText>

      <ThemedText type="placeholder" className="text-center mb-4">
        We sent a verification code to {email}
      </ThemedText>

      <TextInput
        className="h-12 rounded-xl px-4 mb-3 text-center"
        style={{ backgroundColor: themeColors.card, color: themeColors.text }}
        placeholder="Enter verification code"
        placeholderTextColor={themeColors.placeholder}
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />

      {errorMessage ? (
        <ThemedText type="error" className="text-center mb-2">{errorMessage}</ThemedText>
      ) : null}

      <TouchableOpacity
        className="bg-primary rounded-full py-3 items-center mt-3"
        onPress={handleVerify}
        disabled={isLoading}
      >
        <ThemedText type="text" className="font-bold">
          {isLoading ? "Verifying..." : "Verify"}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("SignIn")}>
        <ThemedText type="placeholder" className="text-center mt-6">Back to login</ThemedText>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default VerifyEmailScreen;
