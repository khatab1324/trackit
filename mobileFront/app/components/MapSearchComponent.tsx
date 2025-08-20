import React, { useState } from "react";
import { View, TextInput, Pressable, Text, Keyboard, Alert, ActivityIndicator } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from 'expo-location';

type MapSearchComponentProps = {
  onLocationSelect: (latitude: number, longitude: number, address: string) => void;
  placeholder?: string;
};

export const MapSearchComponent: React.FC<MapSearchComponentProps> = ({
  onLocationSelect,
  placeholder = "Search for a location...",
}) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    Keyboard.dismiss();

    try {
      const results = await Location.geocodeAsync(query);
      
      if (results.length > 0) {
        const location = results[0];
        
        const addressResults = await Location.reverseGeocodeAsync({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        let address = query; 
        if (addressResults.length > 0) {
          const addressInfo = addressResults[0];
          const addressParts = [
            addressInfo.street,
            addressInfo.city,
            addressInfo.region,
            addressInfo.country,
          ].filter(Boolean);
          address = addressParts.join(", ");
        }

        onLocationSelect(location.latitude, location.longitude, address);
        setQuery(""); 
      } else {
        Alert.alert("Location Not Found", "Could not find the location you searched for. Please try a different search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Search Error", "An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  const handleSubmit = () => {
    handleSearch();
  };

  return (
    <View className="flex-row items-center">
      <View className="flex-1 flex-row items-center rounded-2xl bg-white px-3 py-2 shadow-sm">
        <Text className="mr-2 text-lg text-gray-500">
          <FontAwesome name="search" size={20} color="#6B7280" />
        </Text>
        <TextInput
          className="flex-1 px-1 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSearching}
        />
        {query.length > 0 && !isSearching && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            className="ml-2 rounded-full px-2 py-1"
          >
            <Text className="text-base text-gray-500">
              <MaterialIcons name="cancel" size={20} color="#6B7280" />
            </Text>
          </Pressable>
        )}
        {isSearching && (
          <View className="ml-2">
            <ActivityIndicator size="small" color="#6B7280" />
          </View>
        )}
      </View>
      
      <Pressable
        onPress={handleSearch}
        disabled={isSearching || !query.trim()}
        className={`ml-3 px-5 py-5 rounded-xl ${
          isSearching || !query.trim() 
            ? 'bg-gray-300' 
            : 'bg-blue-500'
        }`}
      >
        <Text className={`text-sm font-medium ${
          isSearching || !query.trim() 
            ? 'text-gray-500' 
            : 'text-white'
        }`}>
          {isSearching ? 'Searching...' : 'Search'}
        </Text>
      </Pressable>
    </View>
  );
}; 