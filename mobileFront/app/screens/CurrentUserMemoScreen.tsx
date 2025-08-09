import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useGetCurrentUserMemoriesQuery } from "../lib/APIs/RTKQuery/memoryApi";
import { MemoListComp } from "../components/MemoList";

export const CurrentUserMemoScreen = () => {
  const { data } = useGetCurrentUserMemoriesQuery();
  return (
    <View>{data ? <MemoListComp data={data} /> : <Text>Loading...</Text>}</View>
  );
};
