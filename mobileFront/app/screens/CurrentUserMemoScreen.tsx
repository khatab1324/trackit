import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useGetCurrentUserMemoriesQuery, useGetUserMemoQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { MemoListComp } from "../components/MemoList";
import { useGetUserBookmarksQuery } from "../lib/APIs/RTKQuery/InteractionApi";
import type { Memory } from "../core/types/memory";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "../../App";

// Utility function to transform BookmarkedMemory to Memory format
const transformBookmarkedMemoryToMemory = (bookmarkedMemory: any): Memory => {
  return {
    id: bookmarkedMemory.memory_id, // Use memory_id from the flattened structure
    content_type: bookmarkedMemory.content_type,
    content_url: bookmarkedMemory.content_url,
    count: "0", // Default value since BookmarkedMemory doesn't have count
    description: bookmarkedMemory.description,
    isFollowed: false, // Default value since BookmarkedMemory doesn't have this
    is_saved: true, // Bookmarked memories are always saved
    is_liked: false, // Default value since BookmarkedMemory doesn't have this
    is_requested: false, // Default value since BookmarkedMemory doesn't have this
    isPublic: bookmarkedMemory.isPublic,
    lang: bookmarkedMemory.latitude, // Map latitude to lang
    long: bookmarkedMemory.longitude, // Map longitude to long
    num_comments: "0", // Default value since BookmarkedMemory doesn't have this
    num_likes: "0", // Default value since BookmarkedMemory doesn't have this
    userInfo: {
      user_id: bookmarkedMemory.user.id,
      username: bookmarkedMemory.user.username,
    },
  };
};

export const CurrentUserMemoScreen = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'MemoDetails'>>();
  const { tabComingFrom, memoId } = route.params;

  console.log("CurrentUserMemoScreen - tabComingFrom:", tabComingFrom);
  console.log("CurrentUserMemoScreen - memoId:", memoId);
  
  const { data: currentUserMemories, isLoading: isLoadingMemories, error: memoriesError } = useGetCurrentUserMemoriesQuery();
  const {data: bookmarks, isLoading: isLoadingBookmarks, error: bookmarksError } = useGetUserBookmarksQuery();
  const {data: userMemo, isLoading: isLoadingUserMemo, error: userMemoError } = useGetUserMemoQuery(memoId,{
    
  });

  const getDataToDisplay = (): Memory[] | undefined => {
    switch (tabComingFrom) {
      case 'memories':
        return currentUserMemories;
      case 'saved':
        // Transform BookmarkedMemory to Memory format
        return bookmarks?.map(transformBookmarkedMemoryToMemory);
      case 'friend':
        return userMemo;
      default:
        return currentUserMemories;
    }
  };

  const getLoadingState = () => {
    switch (tabComingFrom) {
      case 'memories':
        return isLoadingMemories;
      case 'saved':
        return isLoadingBookmarks;
      case 'friend':
        return isLoadingUserMemo;
      default:
        return isLoadingMemories;
    }
  };

  const getErrorState = () => {
    switch (tabComingFrom) {
      case 'memories':
        return memoriesError;
      case 'saved':
        return bookmarksError;
      case 'friend':
        return userMemoError;
      default:
        return memoriesError;
    }
  };

  const getRefetchFunction = () => {
    switch (tabComingFrom) {
      case 'memories':
        return () => {}; // Add refetch function when available
      case 'saved':
        return () => {}; // Add refetch function when available
      case 'friend':
        return () => {}; // Add refetch function when available
      default:
        return () => {}; // Add refetch function when available
    }
  };

  const getIsFetchingState = () => {
    switch (tabComingFrom) {
      case 'memories':
        return isLoadingMemories;
      case 'saved':
        return isLoadingBookmarks;
      case 'friend':
        return isLoadingUserMemo;
      default:
        return isLoadingMemories;
    }
  };

  // Find the index of the memo with the specified memoId
  const getInitialIndex = (): number => {
    const data = getDataToDisplay();
    if (!data || !memoId) return 0;
    
    const memoIndex = data.findIndex(memo => memo.id === memoId);
    console.log("Finding initial index for memoId:", memoId);
    console.log("Available memo IDs:", data.map(m => m.id));
    console.log("Found index:", memoIndex);
    return memoIndex >= 0 ? memoIndex : 0;
  };

  const dataToDisplay = getDataToDisplay();
  const isLoading = getLoadingState();
  const error = getErrorState();
  const refetch = getRefetchFunction();
  const isFetching = getIsFetchingState();
  const initialIndex = getInitialIndex();

  console.log("CurrentUserMemoScreen - dataToDisplay length:", dataToDisplay?.length);
  console.log("CurrentUserMemoScreen - initialIndex:", initialIndex);
  console.log("CurrentUserMemoScreen - currentUserMemories length:", currentUserMemories?.length);
  console.log("CurrentUserMemoScreen - bookmarks length:", bookmarks?.length);
  console.log("CurrentUserMemoScreen - userMemo length:", userMemo?.length);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Error loading data</Text>
      </View>
    );
  }

  if (!dataToDisplay || dataToDisplay.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-400 text-lg">
          {tabComingFrom === 'saved' ? 'No saved memories yet' : 
           tabComingFrom === 'friend' ? 'No memories from this friend' : 
           'No memories yet'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MemoListComp 
        data={dataToDisplay} 
        refetch={refetch}
        isFetching={isFetching}
        initialIndex={initialIndex}
      />
    </View>
  );
};
