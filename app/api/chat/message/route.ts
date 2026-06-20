import { NextResponse } from "next/server";
import { SUPPORT_AGENT_PROMPT } from "../../prompt/support_agent";
import geminiService from "@/app/api/services/gemini.service";
import sessionService from "../../services/session.service";
import messageService from "../../services/message.service";
import { MESSAGE_SENDER } from "@/app/generated/prisma/enums";

export interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatMessageResponse {
  reply: string;
  sessionId: string;
}
export async function POST(request: Request) {
  try {
    const data: ChatMessageRequest = await request.json();
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
    const response = {
      reply: reply,
      sessionId: session.id,
    };

    return NextResponse.json<ChatMessageResponse>(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: `Unable to process your request : ${error}`,
      },
      {
        status: 500,
      },
    );
  }
}
