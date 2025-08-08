export interface MemoryMemo {
  id: string;
  count: number;
  content_url: string;
  content_type: string;
  lang: number;
  long: number;
  description: string | null;
  num_likes: number;
  num_comments: number;
  isFollowed: boolean;
  is_saved: boolean;
  userInfo: {
    username: string;
    user_id: string;
  };
}
