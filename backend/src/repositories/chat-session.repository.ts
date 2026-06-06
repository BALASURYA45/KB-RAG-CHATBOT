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
