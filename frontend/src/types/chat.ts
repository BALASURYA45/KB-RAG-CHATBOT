export type Citation = {
  article: string;
  section: string;
};

export type ChatApiResponse = {
  messageId: string;
  answer: string;
  confidence: number;
  citations: Citation[];
  escalate: boolean;
};

export type AnswerFeedback = "HELPFUL" | "NOT_HELPFUL";

export type ChatMessage = {
  id: string;
  messageId?: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  citations?: Citation[];
  escalate?: boolean;
  question?: string;
  feedback?: AnswerFeedback;
};

export type TicketResponse = {
  ticketId: string;
  status: string;
};

export type FeedbackResponse = {
  messageId: string;
  feedback: AnswerFeedback;
};
