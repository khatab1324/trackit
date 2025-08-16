import React, { useEffect, useState } from "react";
import { useGetFriendChatQuery } from "../lib/APIs/RTKQuery/chatApi";
import { socket } from "../services/socket";
import { Socket } from "socket.io-client";
import { Friend } from "../core/types/friends";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../core/types/user";

export const useChatWithFriend = (friendId?: string) => {
  const navigation = useNavigation<any>();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const user = useSelector((s: RootState) => s.user as User);
  const {
    data: chatData,
    isLoading: isChatLoading,
    refetch: refetchChat,
  } = useGetFriendChatQuery(selectedFriend?.id || "", {
    skip: !selectedFriend?.id,
  });

  useEffect(() => {
    if (friendId && !selectedFriend) {
      setSelectedFriend({ id: friendId, username: "Friend" } as Friend);
    }
  }, [friendId, selectedFriend]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("authenticate", user?.id);
      console.log("Authenticated user:", user.id);
    } else {
      socket.emit("authenticate", user?.id);
      console.log("Authenticated user:", user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (chatData && socket && selectedFriend) {
      const { chat, isNew, conversation } = chatData.data;

      setMessages(conversation || []);

      socket.emit("join-chat", chat.id);
      setIsConnected(true);

      console.log(
        `Joined chat room: ${chat.id} (${isNew ? "new" : "existing"} chat)`
      );

      const handleMessage = (message: any) => {
        if (message) {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else {
          console.log("receive null");
        }
      };

      const handleDeleteMessage = (message: any) => {
        if (message) {
          setMessages((prevMessages) => 
            prevMessages.filter((msg) => msg.id !== message.id)
          );
        } else {
          console.log("receive null");
        }
      };

      const handleEditMessage = (message: any) => {
        if (message) {
          setMessages((prevMessages) =>
            prevMessages.map((prevMessage) => {
              if (prevMessage.id === message.id) {
                return { ...prevMessage, message: message.message };
              }
              return prevMessage;
            })
          );
        }
      };

      socket.on("room message", handleMessage);
      socket.on("room deleteMessage", handleDeleteMessage);
      socket.on("room editMessage", handleEditMessage);

      return () => {
        socket.off("room message", handleMessage);
        socket.off("room deleteMessage", handleDeleteMessage);
        socket.off("room editMessage", handleEditMessage);
        socket.emit("leave-chat", chat.id);
        setIsConnected(false);
      };
    }
  }, [chatData, selectedFriend]);

  const onPressFriend = (friend: Friend) => {
    setSelectedFriend(null);
    socket.emit("join-chat", chatData?.data.chat.id);

    console.log("Selected friend:", friend);
    setSelectedFriend(friend);
    navigation.navigate("Conversation", {
      friendId: friend.id,
      friendName: friend.username,
    });
  };

  const sendMessage = (message: string, media_link?: string) => {
    console.log("Sending message2:", message, "media_link", media_link , "chatData", chatData?.data.chat.id, "isConnected", isConnected);
    if (socket && chatData && isConnected) {
      socket.emit("room message", {
        chat_id: chatData.data.chat.id,
        message,
        media_link,
        isGroup: false,
      });
    }
  };

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  return {
    selectedFriend,
    chatData,
    isChatLoading,
    isConnected,
    messages,
    onPressFriend,
    sendMessage,
    refetchChat,
  };
};