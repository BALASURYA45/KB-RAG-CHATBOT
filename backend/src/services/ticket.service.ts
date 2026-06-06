import { createSupportTicket } from "../repositories/support-ticket.repository.js";
import type {
  CreateSupportTicketInput,
  CreateSupportTicketResponse,
} from "../types/ticket.types.js";

export async function createTicket(
  input: CreateSupportTicketInput,
): Promise<CreateSupportTicketResponse> {
  const ticket = await createSupportTicket(input);

  return {
    ticketId: ticket.id,
    status: ticket.status,
  };
}
