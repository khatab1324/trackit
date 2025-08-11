import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";

type Props = {
  onPress: () => void;
  loading?: boolean;       
  disabled?: boolean;
  className?: string;        
  size?: number;           
  innerSize?: number;        
};

export default function ShutterButton({
  onPress,
  loading = false,
  disabled = false,
  className,
  size = 80,
  innerSize = 64,
}: Props) {
  const border = 4;
  return (
    <View
      className={`${className ?? ""} items-center`}
      style={{}}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled || loading}
        className="items-center justify-center rounded-full border-white bg-white/25"
        style={{
          width: size,
          height: size,
          borderWidth: border,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View
            className="rounded-full bg-white"
            style={{ width: innerSize, height: innerSize }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
