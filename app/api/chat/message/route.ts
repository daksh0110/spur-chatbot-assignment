import { NextResponse } from "next/server";
import { SUPPORT_AGENT_PROMPT } from "../../prompt/support_agent";
import geminiService from "@/app/api/services/gemini.service";
import sessionService from "../../services/session.service";
import messageService from "../../services/message.service";
import { MESSAGE_SENDER } from "@/app/generated/prisma/enums";
import { createResponse } from "@/lib/create_response";
import { createError } from "@/lib/create_error";
import { GetMessagesSchema, PostMessageSchema } from "@/validations/chat.validations";

export interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatMessageResponse {
  reply: string;
  sessionId: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const validationResult = GetMessagesSchema.safeParse({ sessionId });
    
    if (!validationResult.success) {
      return createError(validationResult.error.issues[0].message, 400);
    }

    const session = await sessionService.getSession(validationResult.data.sessionId);
    
    if (!session) {
      return createError("Session not found", 404);
    }

    const messages = await messageService.getMessages(session.id, 50);

    return createResponse({ messages,sessionId:session.id }, "Messages retrieved successfully", 200);
  } catch (error) {
    console.error("Chat message GET error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unable to process your request";
    return createError(errorMessage, 500);
  }
}

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    const validationResult = PostMessageSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return createError(validationResult.error.issues[0].message, 400);
    }
    
    const data: ChatMessageRequest = validationResult.data;
    const session = await sessionService.getSession(data.sessionId ?? "");
    const messages = await messageService.getMessages(session.id, 20);
    const content = messageService.createMessage(
      SUPPORT_AGENT_PROMPT,
      data.message,
      messages,
    );
    await messageService.createMessageInDb(
      data.message,
      MESSAGE_SENDER.USER,
      session.id,
    );
    const reply = await geminiService.generateResponse(content);
    await messageService.createMessageInDb(
      reply,
      MESSAGE_SENDER.BOT,
      session.id,
    );
    const response: ChatMessageResponse = {
      reply: reply,
      sessionId: session.id,
    };

    return createResponse<ChatMessageResponse>(
      response,
      "Message processed successfully",
      200,
    );
  } catch (error) {
    console.error("Chat message error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unable to process your request";
    return createError(errorMessage, 500);
  }
}
