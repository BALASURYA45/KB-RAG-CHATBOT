export type CreateSupportTicketInput = {
  userEmail: string;
  question: string;
};

export type CreateSupportTicketResponse = {
  ticketId: string;
  status: string;
};
