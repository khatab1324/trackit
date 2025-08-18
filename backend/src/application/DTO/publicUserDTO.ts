export type publicUser = {
  id: string;
  username: string;
  email: string;
  profile_image: string | null;
  bio: string | null;
  emailVerified: boolean;
  created_at: Date;
};

export type publicUserWithFollowStatus = publicUser & {
  is_followed: boolean;
  is_requested: boolean;
};

