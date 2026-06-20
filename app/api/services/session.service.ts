import { Session } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const getSession = async (sessionId: string): Promise<Session> => {
  if (!sessionId) {
    const doc = await prisma.session.create({});
    return doc;
  }

  const doc = await prisma.session.findUniqueOrThrow({
    where: { id: sessionId },
  });

  return doc;
};

export default {
  getSession,
};
