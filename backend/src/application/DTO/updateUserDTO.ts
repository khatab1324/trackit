import { z } from "zod";

export const updateUsernameSchema = z.object({
  username: z.string().min(3).max(255),
});

export const updateBioSchema = z.object({
  bio: z.string().max(500).optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type UpdateBioInput = z.infer<typeof updateBioSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>; 