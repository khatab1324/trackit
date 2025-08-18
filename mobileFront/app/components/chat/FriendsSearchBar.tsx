import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGetCurrentUserFollowersQuery } from "../../lib/APIs/RTKQuery/InteractionApi";
import { Friend } from "../../core/types/friends";
import { colors } from "../../core/theme/colors";
import clsx from "clsx";

type FriendsSearchBarProps = {
  onSelect?: (friend: Friend) => void;
  placeholder?: string;
  autoFocus?: boolean;
  emptyText?: string;
  loadingText?: string;
};

export const FriendsSearchBar: React.FC<FriendsSearchBarProps> = ({
  onSelect,
  placeholder = "Search friends...",
  autoFocus = false,
  emptyText = "No friends found",
  loadingText = "Loading friends...",
}) => {
  const isDark = useSelector((s: RootState) => s.sheardDataThrowApp.darkMode);
  const colorScheme = isDark ? colors.dark : colors.light;

  const { data: followers, isLoading } = useGetCurrentUserFollowersQuery();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const [debounced, setDebounced] = useState(query);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(query), 250);
  }, [query]);

  const filteredFollowers = useMemo(() => {
    if (!debounced.trim()) return followers || [];
    return (followers || []).filter((f) =>
      f.username?.toLowerCase().includes(debounced.toLowerCase())
    );
  }, [debounced, followers]);

  const renderItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      className="px-4 py-3 mx-2 my-1 rounded-xl bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700"
      onPress={() => {
        onSelect?.(item);
        Keyboard.dismiss();
        setFocused(false);
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mr-3">
          <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            {item.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-gray-800 dark:text-gray-200 text-base font-medium flex-1">
          {item.username || "Unknown"}
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={isDark ? "#94A3B8" : "#64748B"} 
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="w-full">
      <View
        className={clsx(
          "flex-row items-center rounded-2xl px-4 h-14",
          "bg-white dark:bg-neutral-800",
          "border-2 border-gray-200 dark:border-neutral-700",
          "shadow-sm dark:shadow-neutral-900/50",
          focused && "border-blue-500 dark:border-blue-400"
        )}
      >
        <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mr-3">
          <Ionicons 
            name="search" 
            size={18} 
            color={isDark ? "#60A5FA" : "#3B82F6"} 
          />
        </View>
        <TextInput
          className="flex-1 text-base text-gray-800 dark:text-white font-medium"
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#94A3B8" : "#9CA3AF"}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={() => setQuery("")} 
            hitSlop={10}
            className="w-8 h-8 bg-gray-100 dark:bg-neutral-700 rounded-full items-center justify-center"
          >
            <Ionicons 
              name="close" 
              size={18} 
              color={isDark ? "#94A3B8" : "#64748B"} 
            />
          </TouchableOpacity>
        )}
      </View>

      {focused && (
        <View
          className={clsx(
            "mt-3 rounded-2xl border border-gray-200 dark:border-neutral-700",
            "bg-white dark:bg-neutral-800",
            "shadow-lg dark:shadow-neutral-900/50",
            "max-h-80 overflow-hidden"
          )}
        >
          {isLoading ? (
            <View className="py-8 items-center">
              <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-3">
                <ActivityIndicator color={isDark ? "#60A5FA" : "#3B82F6"} />
              </View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {loadingText}
              </Text>
            </View>
          ) : filteredFollowers.length === 0 ? (
            <View className="py-8 items-center px-6">
              <View className="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-full items-center justify-center mb-3">
                <Text className="text-2xl">🔍</Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium text-center">
                {emptyText}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredFollowers}
              keyExtractor={(f) => f.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default FriendsSearchBar;
