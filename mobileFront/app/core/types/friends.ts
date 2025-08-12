export type Friend = {
  id: string;
  username: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
};

export type FriendsListProps = {
  friends?: Friend[];
  onPressFriend: (friend: Friend) => void;
  refetch: () => void;
  isFetching: boolean;
};
