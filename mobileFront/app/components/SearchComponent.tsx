import React, { useEffect, useState } from "react";
import { View, TextInput, Pressable, Text, Keyboard } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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

  return (
    <View className={`flex-row items-center `}>
      <View className="flex-1 flex-row items-center rounded-2xl bg-gray-100 dark:bg-gray-800 px-3 py-2">
        <Text className="mr-2 text-lg text-gray-500 dark:text-gray-400">
          <FontAwesome name="search" size={24} color="black" />
        </Text>
        <TextInput
          className="flex-1 px-1 text-base text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            className="ml-2 rounded-full px-2 py-1"
          >
            <Text className="text-base text-gray-500 dark:text-gray-400">
              <MaterialIcons name="cancel" size={24} color="black" />
            </Text>
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
          <Text className="text-base text-blue-600 dark:text-blue-400">
            Cancel
          </Text>
        </Pressable>
      )}
    </View>
  );
};
