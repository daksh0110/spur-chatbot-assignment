import { z } from "zod";

export const GetMessagesSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export const PostMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  sessionId: z.string().optional(),
});
