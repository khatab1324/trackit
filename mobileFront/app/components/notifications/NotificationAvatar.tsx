import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Props = {
  avatar?: string;
  userId: string;
};

export const NotificationAvatar = ({ avatar, userId }: Props) => {
  const navigation = useNavigation<any>();

  const goToProfile = () =>
    navigation.navigate("Profile", { userId });

  return (
    <TouchableOpacity onPress={goToProfile} activeOpacity={0.8}>
      {avatar ? (
        <Image 
          source={{ uri: avatar }} 
          style={{ width: 48, height: 48, borderRadius: 24 }} 
        />
      ) : (
        <Ionicons name="person-circle" size={48} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
};
