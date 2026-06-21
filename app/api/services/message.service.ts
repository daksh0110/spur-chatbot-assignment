import { MESSAGE_SENDER, Messages } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const createMessage = (
  prompt: string,
  question: string,
  olderMessages: Messages[],
) => {
  const history = olderMessages
    .map(
      (message) =>
        `${message.type === MESSAGE_SENDER.USER ? "User" : "Assistant"}: ${
          message.message
        }`,
    )
    .join("\n");

  return `
${prompt}

Conversation History:
${history}

Current User Question:
${question}

Assistant:
`;
};

const getMessages = async (
  sessionId: string,
  limit?: number,
): Promise<Messages[]> => {
  try {
    if (!sessionId) {
      return [];
    }

    const messages = await prisma.messages.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        created_at: "desc",
      },
      ...(limit ? { take: limit } : {}),
    });
    if (limit) {
      return messages.reverse();
    }
    return messages;
  } catch (error) {
    console.error("Message service - getMessages error:", error);
    throw new Error(
      `Failed to retrieve messages: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const createMessageInDb = async (
  message: string,
  messageSender: MESSAGE_SENDER,
  sessionId: string,
) => {
  try {
    const messageDoc = await prisma.messages.create({
      data: {
        message: message,
        sessionId: sessionId,
        type: messageSender ?? MESSAGE_SENDER.BOT,
      },
    });

    return messageDoc;
  } catch (error) {
    console.error("Message service - createMessageInDb error:", error);
    throw new Error(
      `Failed to save message: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export default { createMessage, getMessages, createMessageInDb };
