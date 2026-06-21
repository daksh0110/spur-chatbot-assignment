import { Session } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const getSession = async (sessionId: string): Promise<Session> => {
  try {
    if (!sessionId) {
      const doc = await prisma.session.create({});
      return doc;
    }

    const doc = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!doc) {
      throw new Error("This session is invalid");
    }

    return doc;
  } catch (error) {
    console.error("Session service error:", error);
    throw new Error(
      `Failed to retrieve session: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export default {
  getSession,
};
