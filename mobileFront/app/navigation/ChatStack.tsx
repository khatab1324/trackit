import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatScreen } from "../screens/ChatScreen";
import { ConversationScreen } from "../screens/ConversationScreen";

export type ChatStackParamList = {
  ChatList: undefined;
  Conversation: {
    friendId: string;
    friendName?: string;
  };
};

const Stack = createStackNavigator<ChatStackParamList>();

export default function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChatList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ChatList" component={ChatScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
} 