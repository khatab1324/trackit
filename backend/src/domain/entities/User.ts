export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profile_image: string | null;
  bio: string | null;
  created_at: Date;
}
