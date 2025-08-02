import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';

type UserType = {
  username?: string;
  bio?: string;
  profileImage?: string;
  memoriesCount?: number;
  friendsCount?: number;
};

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('Memories');
  const user = useSelector((state: RootState) => state.user) as UserType;

  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <View className="flex-1 bg-white px-4 pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold">Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View className="flex-row items-start">
        <Image
          source={{
            uri: user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          }}
          className="w-20 h-20 rounded-full bg-gray-200"
        />
        <View className="ml-4 mt-2">
          <Text className="text-lg font-semibold">{user?.username || 'Username'}</Text>
          <Text className="text-gray-500">{user?.bio || 'Bio goes here...'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mt-6 mb-4">
        <View className="items-center">
          <Text className="text-lg font-bold">{user?.memoriesCount || 0}</Text>
          <Text className="text-gray-500">Memories</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">{user?.friendsCount || 0}</Text>
          <Text className="text-gray-500">Friends</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around border-b border-gray-200 mb-4">
        <TouchableOpacity onPress={() => setActiveTab('Memories')}>
          <Text className={`pb-2 ${activeTab === 'Memories' ? 'border-b-2 border-black font-semibold' : 'text-gray-400'}`}>
            Memories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Saved')}>
          <Text className={`pb-2 ${activeTab === 'Saved' ? 'border-b-2 border-black font-semibold' : 'text-gray-400'}`}>
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View className="items-center mt-8">
        <Text className="text-gray-400">No content yet.</Text>
      </View>
    </View>
  );
}
