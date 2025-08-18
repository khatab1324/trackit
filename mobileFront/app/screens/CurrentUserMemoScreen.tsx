import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useGetCurrentUserMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { MemoListComp } from "../components/MemoList";
import { ThemedText } from "../components/ThemedText";

export const CurrentUserMemoScreen = () => {
  const { data } = useGetCurrentUserMemoriesQuery();
  return (
    <View>{data ? <MemoListComp data={data} /> : <ThemedText>Loading...</ThemedText>}</View>
  );
};
