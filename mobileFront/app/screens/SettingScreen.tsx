import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/sheardDataSlice";
import { RootState } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetStore } from "../store";
import { setUsername, setBio } from "../store/slices/userSlice";

export function SettingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isDarkMode = useSelector(
    (state: RootState) => state.sheardDataThrowApp.darkMode
  );
  const currentUser = useSelector((state: RootState) => state.user as any);

  const iconColor = isDarkMode ? "white" : "black";
  const bgColor = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const subTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const iconBoxColor = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const inputBg = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBg = isDarkMode ? "bg-gray-900" : "bg-white";

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
        className={`w-10 h-10 ${iconBoxColor} rounded-lg justify-center items-center mr-4`}
      >
        {icon}
      </View>
      <Text className={`text-base ${textColor}`}>{label}</Text>
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
        <Pressable onPress={() => {}} className={`w-full rounded-2xl p-5 ${cardBg}`} >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View className={`flex-1 ${bgColor}`}>
      <ScrollView className="px-4 pt-14" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>
          <Text className={`text-lg font-bold ${textColor}`}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <Row
          icon={<Ionicons name="lock-closed-outline" size={22} color={iconColor} />}
          label="Edit Password"
          onPress={() => setShowPasswordModal(true)}
        />

        <Row
          icon={<Feather name="edit-3" size={22} color={iconColor} />}
          label="Edit Bio"
          onPress={() => setShowBioModal(true)}
        />

        <Row
          icon={<MaterialIcons name="person-outline" size={22} color={iconColor} />}
          label="Edit Username"
          onPress={() => setShowUsernameModal(true)}
        />

        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 ${iconBoxColor} rounded-lg justify-center items-center mr-4`}
            >
              <Feather name="moon" size={22} color={isDarkMode ? "#B87333" : "#333"} />
            </View>
            <Text className={`text-base ${textColor}`}>Dark Mode</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={handleToggleTheme} />
        </View>

        <TouchableOpacity onPress={logoutHandler} className="flex-row items-center mb-10">
          <View
            className={`w-10 h-10 ${iconBoxColor} rounded-lg justify-center items-center mr-4`}
          >
            <MaterialIcons name="logout" size={22} color={iconColor} />
          </View>
          <Text className={`text-base ${textColor}`}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalWrapper visible={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <Text className={`text-lg font-bold mb-4 ${textColor}`}>Edit Password</Text>
        <View className={`rounded-2xl p-3 border mb-3 ${borderColor}`}>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            secureTextEntry
            className={`w-full ${inputBg} ${textColor} rounded-xl px-3 py-3 mb-3`}
          />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            secureTextEntry
            className={`w-full ${inputBg} ${textColor} rounded-xl px-3 py-3`}
          />
        </View>
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            onPress={() => setShowPasswordModal(false)}
            className="px-4 py-2 rounded-2xl bg-gray-500"
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={savePassword} className="px-4 py-2 rounded-2xl bg-blue-500">
            <Text className="text-white font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </ModalWrapper>

      <ModalWrapper visible={showBioModal} onClose={() => setShowBioModal(false)}>
        <Text className={`text-lg font-bold mb-4 ${textColor}`}>Edit Bio</Text>
        <View className={`rounded-2xl p-3 border mb-3 ${borderColor}`}>
          <TextInput
            value={bioLocal}
            onChangeText={setBioLocal}
            placeholder="Write your new bio..."
            placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className={`w-full ${inputBg} ${textColor} rounded-xl px-3 py-3`}
          />
        </View>
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            onPress={() => setShowBioModal(false)}
            className="px-4 py-2 rounded-2xl bg-gray-500"
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveBio} className="px-4 py-2 rounded-2xl bg-blue-500">
            <Text className="text-white font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </ModalWrapper>

      <ModalWrapper visible={showUsernameModal} onClose={() => setShowUsernameModal(false)}>
        <Text className={`text-lg font-bold mb-4 ${textColor}`}>Edit Username</Text>
        <View className={`rounded-2xl p-3 border mb-3 ${borderColor}`}>
          <TextInput
            value={usernameLocal}
            onChangeText={setUsernameLocal}
            placeholder="New username"
            placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            autoCapitalize="none"
            className={`w-full ${inputBg} ${textColor} rounded-xl px-3 py-3`}
          />
        </View>
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            onPress={() => setShowUsernameModal(false)}
            className="px-4 py-2 rounded-2xl bg-gray-500"
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveUsername} className="px-4 py-2 rounded-2xl bg-blue-500">
            <Text className="text-white font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </ModalWrapper>
    </View>
  );
}