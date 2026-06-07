export type Citation = {
  article: string;
  section: string;
};

export type ChatApiResponse = {
  answer: string;
  confidence: number;
  citations: Citation[];
  escalate: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  citations?: Citation[];
  escalate?: boolean;
  question?: string;
};

export type TicketResponse = {
  ticketId: string;
  status: string;
};
