import React, { useEffect, useState } from "react";
import { View, TextInput, Pressable, Keyboard } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";

type SearchComponentProps = {
  value?: string;
  onChangeText?: (text: string) => void;

  placeholder?: string;
  autoFocus?: boolean;
  showCancel?: boolean;
  className?: string;
};

export const SearchComponent: React.FC<SearchComponentProps> = ({
  value,
  onChangeText,

  placeholder = "Search",
  showCancel = false,
}) => {
  const [query, setQuery] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined && value !== query) setQuery(value);
  }, [value]);

  const handleChange = (text: string) => {
    if (value === undefined) setQuery(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (value === undefined) setQuery("");
    onChangeText?.("");
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
  };
  const themeColors = useThemeColors();

  return (
    <View className={`flex-row items-center `}>
      <View className="flex-1 flex-row items-center rounded-2xl px-3 py-2"
        style={{ backgroundColor: themeColors.card }}>
        <FontAwesome name="search" size={24} color={themeColors.placeholder} />
        <TextInput
          className="flex-1 px-1 text-base"
          placeholder={placeholder}
          placeholderTextColor={themeColors.placeholder}
          value={query}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ color: themeColors.text }}
        />
        {query.length > 0 && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            className="ml-2 rounded-full px-2 py-1"
          >
            <MaterialIcons name="cancel" size={24} color={themeColors.placeholder} />
          </Pressable>
        )}
      </View>

      {showCancel && (
        <Pressable
          onPress={() => {
            handleClear();
            Keyboard.dismiss();
          }}
          className="ml-3 px-2 py-1"
        >
          <ThemedText type="primary" className="text-base">
            Cancel
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
};
