import { prisma } from "../db/prisma.js";

export type CreateChatSessionInput = {
  sessionId: string;
  question: string;
  answer: string;
  confidence: number;
};

export async function createChatSession(input: CreateChatSessionInput) {
  return prisma.chatSession.create({
    data: {
      sessionId: input.sessionId,
      question: input.question,
      answer: input.answer,
      confidence: input.confidence,
    },
  });
}

export async function updateChatSessionFeedback(input: { id: string; feedback: string }) {
  return prisma.chatSession.updateMany({
    where: {
      id: input.id,
    },
    data: {
      feedback: input.feedback,
      feedbackAt: new Date(),
    },
  });
}

export async function findChatHistoryBySessionId(sessionId: string) {
  return prisma.chatSession.findMany({
    where: {
      sessionId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      question: true,
      answer: true,
      confidence: true,
      feedback: true,
      feedbackAt: true,
      createdAt: true,
    },
  });
}
