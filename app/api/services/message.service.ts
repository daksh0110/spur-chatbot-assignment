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
};

const createMessageInDb = async (
  message: string,
  messageSender: MESSAGE_SENDER,
  sessionId: string,
) => {
  const messageDoc = await prisma.messages.create({
    data: {
      message: message,
      sessionId: sessionId,
      type: messageSender ?? MESSAGE_SENDER.BOT,
    },
  });

  return messageDoc;
};

export default { createMessage, getMessages, createMessageInDb };
