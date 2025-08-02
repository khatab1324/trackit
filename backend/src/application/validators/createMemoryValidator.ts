import { z } from "zod";

export const memoryInputValidator = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string(),
  content_url: z.string(),
  latitude: z.coerce.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.coerce.number().min(-180).max(180, "Invalid longitude"),
  user_id: z.string(),
  content_type: z.string(), //todo : make this have type
  isPublic: z.boolean().optional(),
});
export type CreateUserInput = z.infer<typeof memoryInputValidator>;
