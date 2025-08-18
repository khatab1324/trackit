export type User = {
  id: string;
  username: string;
  email: string;
  profileImage: string | null;
  bio: string | null;
  emailVerified: boolean;
  createdAt: Date;
  is_followed?: boolean;
  is_requested?: boolean;
};