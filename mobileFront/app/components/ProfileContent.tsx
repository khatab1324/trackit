import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { BookmarkedMemory, Memory } from "../core/types/memory";
import { colors } from "../core/theme/colors";
import MemoryThumbnail from "../components/MemoryThumbnail";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useGetMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";

export default function ProfileContent({
  memories: memoriesList,
  saved: savedList,
  refetch,
  isFetching,
}: {
  memories: Memory[] | null;
  saved: BookmarkedMemory[] | null;
  refetch: () => void;
  isFetching: boolean;
}) {
  const theme = useSelector(
    (state: RootState) => state.theme.current
  );
  const themeColors = colors[theme];
  const [activeTab, setActiveTab] = useState(0);
  console.log("savedList", savedList);
  const tabsList = [
    {
      name: "Memories",
      data: memoriesList,
    },
    {
      name: "Saved",
      data: savedList,
    },
  ];

  return (
    <View className="flex-1">
      <View
        className={`flex-row justify-around border-b border-border mb-4`}
      >
        {tabsList.map((tab, index) => (
          <TouchableOpacity key={tab.name} onPress={() => setActiveTab(index)}>
            <Text
              className={`pb-2 ${activeTab === index ? `border-b-2 font-semibold text-primary` : `text-text`}`}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tabsList[activeTab].data?.length ? (
        <FlatList
          data={tabsList[activeTab].data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Memory }) => (
            <MemoryThumbnail item={item} />
          )}
          onRefresh={refetch}
          refreshing={isFetching}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", gap: 10 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text
          className={`text-center mt-10 text-placeholder`}
        >
          No memories found.
        </Text>
      )}
    </View>
  );
}

const styles = {};
