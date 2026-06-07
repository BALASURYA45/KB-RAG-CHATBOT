export type Citation = {
  article: string;
  section: string;
};

export type ChatResponse = {
  messageId: string;
  answer: string;
  confidence: number;
  citations: Citation[];
  escalate: boolean;
};

export type ChatRequestInput = {
  question: string;
  sessionId?: string;
};

export type LlmAnswer = {
  answer: string;
  confidence: number;
};
