import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Switch, Alert, ScrollView, Modal, Pressable } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleTheme } from "../store/slices/themeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetStore } from "../store";
import { setUsername, setBio } from "../store/slices/userSlice";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemedText } from "../components/ThemedText";

export function SettingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const currentTheme = useSelector((state: RootState) => state.theme.current);
  const themeColors = useThemeColors();

  const currentUser = useSelector((state: RootState) => state.user as any);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [bioLocal, setBioLocal] = useState<string>(currentUser?.bio ?? "");
  const [usernameLocal, setUsernameLocal] = useState<string>(
    currentUser?.username ?? ""
  );

  const handleToggleTheme = (_value: boolean) => {
    dispatch(toggleTheme());
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("token");
      dispatch(resetStore());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const savePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Missing fields", "Please fill both password fields.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setShowPasswordModal(false);
    Alert.alert("Success", "Password updated (mock).");
  };

  const saveBio = () => {
    dispatch(setBio(bioLocal));
    setShowBioModal(false);
    Alert.alert("Success", "Bio updated.");
  };

  const saveUsername = () => {
    if (!usernameLocal.trim()) {
      Alert.alert("Missing username", "Please enter a valid username.");
      return;
    }
    dispatch(setUsername(usernameLocal));
    setShowUsernameModal(false);
    Alert.alert("Success", "Username updated.");
  };

  const Row = ({
    icon,
    label,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center mb-5">
      <View
        className={`w-10 h-10 rounded-lg justify-center items-center mr-4`}
        style={{ backgroundColor: themeColors.card }}
      >
        {icon}
      </View>
      <ThemedText className="text-base">{label}</ThemedText>
    </TouchableOpacity>
  );

  const ModalWrapper = ({
    visible,
    onClose,
    children,
  }: {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/40 items-center justify-center px-6"
      >
        <Pressable onPress={() => {}} className={`w-full rounded-2xl p-5`}
          style={{ backgroundColor: themeColors.card }} >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View className="flex-1"
      style={{ backgroundColor: themeColors.background }}>
      <ScrollView className="px-4 pt-14" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <ThemedText className="text-lg font-bold">Settings</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <Row
          icon={<Ionicons name="lock-closed-outline" size={22} color={themeColors.text} />}
          label="Edit Password"
          onPress={() => setShowPasswordModal(true)}
        />

        <Row
          icon={<Feather name="edit-3" size={22} color={themeColors.text} />}
          label="Edit Bio"
          onPress={() => setShowBioModal(true)}
        />

        <Row
          icon={<MaterialIcons name="person-outline" size={22} color={themeColors.text} />}
          label="Edit Username"
          onPress={() => setShowUsernameModal(true)}
        />

        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-lg justify-center items-center mr-4`}
              style={{ backgroundColor: themeColors.card }}
            >
              <Feather name="moon" size={22} color={themeColors.text} />
            </View>
            <ThemedText className="text-base">Dark Mode</ThemedText>
          </View>
          <Switch value={currentTheme === 'dark'} onValueChange={handleToggleTheme}
            trackColor={{ false: themeColors.placeholder, true: themeColors.primary }}
            thumbColor={currentTheme === 'dark' ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor={themeColors.placeholder}
          />
        </View>

        <TouchableOpacity onPress={logoutHandler} className="flex-row items-center mb-10">
          <View
            className={`w-10 h-10 rounded-lg justify-center items-center mr-4`}
            style={{ backgroundColor: themeColors.card }}
          >
            <MaterialIcons name="logout" size={22} color={themeColors.text} />
          </View>
          <ThemedText className="text-base">Log out</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      <ModalWrapper visible={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <ThemedText className="text-lg font-bold mb-4">Edit Password</ThemedText>
        <View className={`rounded-2xl p-3 border mb-3`}
          style={{ borderColor: themeColors.border }}>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            placeholderTextColor={themeColors.placeholder}
            secureTextEntry
            className="w-full rounded-xl px-3 py-3 mb-3"
            style={{ backgroundColor: themeColors.secondary, color: themeColors.text }}
          />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor={themeColors.placeholder}
            secureTextEntry
            className="w-full rounded-xl px-3 py-3"
            style={{ backgroundColor: themeColors.secondary, color: themeColors.text }}
          />
        </View>
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            onPress={() => setShowPasswordModal(false)}
            className="px-4 py-2 rounded-2xl"
            style={{ backgroundColor: themeColors.secondary }}
          >
            <ThemedText>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={savePassword} className="px-4 py-2 rounded-2xl"
            style={{ backgroundColor: themeColors.primary }}>
            <ThemedText>Save</ThemedText>
          </TouchableOpacity>
        </View>
      </ModalWrapper>

      <ModalWrapper visible={showBioModal} onClose={() => setShowBioModal(false)}>
        <ThemedText className="text-lg font-bold mb-4">Edit Bio</ThemedText>
        <View className={`rounded-2xl p-3 border mb-3`}
          style={{ borderColor: themeColors.border }}>
          <TextInput
            value={bioLocal}
            onChangeText={setBioLocal}
            placeholder="Write your new bio..."
            placeholderTextColor={themeColors.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="w-full rounded-xl px-3 py-3"
            style={{ backgroundColor: themeColors.secondary, color: themeColors.text }}
          />
        </View>
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            onPress={() => setShowBioModal(false)}
            className="px-4 py-2 rounded-2xl"
            style={{ backgroundColor: themeColors.secondary }}
          >
            <ThemedText>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveBio} className="px-4 py-2 rounded-2xl"
            style={{ backgroundColor: themeColors.primary }}>
            <ThemedText>Save</ThemedText>
          </TouchableOpacity>
        </View>
      </ModalWrapper>

      <ModalWrapper visible={showUsernameModal} onClose={() => setShowUsernameModal(false)}>
        <ThemedText className="text-lg font-bold mb-4">Edit Username</ThemedText>
        <View className={`rounded-2xl p-3 border mb-3`}
          style={{ borderColor: themeColors.border }}>
          <TextInput
            value={usernameLocal}
            onChangeText={setUsernameLocal}
            placeholder="New username"
            placeholderTextColor={themeColors.placeholder}
            autoCapitalize="none"
            className="w-full rounded-xl px-3 py-3"
            style={{ backgroundColor: themeColors.secondary, color: themeColors.text }}
          />
        </View>
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            onPress={() => setShowUsernameModal(false)}
            className="px-4 py-2 rounded-2xl"
            style={{ backgroundColor: themeColors.secondary }}
          >
            <ThemedText>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveUsername} className="px-4 py-2 rounded-2xl"
            style={{ backgroundColor: themeColors.primary }}>
            <ThemedText>Save</ThemedText>
          </TouchableOpacity>
        </View>
      </ModalWrapper>
    </View>
  );
}