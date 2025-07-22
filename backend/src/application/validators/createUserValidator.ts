import { z } from "zod";

export const createUserValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30),
  bio: z.string().max(300).nullable().optional(),
  profile_image: z.string().url().nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserValidator>;
