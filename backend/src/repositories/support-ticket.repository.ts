import { prisma } from "../db/prisma.js";
import type { CreateSupportTicketInput } from "../types/ticket.types.js";

export async function createSupportTicket(input: CreateSupportTicketInput) {
  return prisma.supportTicket.create({
    data: {
      userEmail: input.userEmail,
      question: input.question,
      status: "OPEN",
    },
    select: {
      id: true,
      status: true,
    },
  });
}
