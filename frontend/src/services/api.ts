import type { AnswerFeedback, ChatApiResponse, FeedbackResponse, TicketResponse } from "../types/chat";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

function isResponseErrorPayload(payload: unknown): payload is { message?: string; error?: string } {
  return typeof payload === "object" && payload !== null;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      isResponseErrorPayload(payload) && payload.message
        ? payload.message
        : "Request failed.";

    throw new Error(message);
  }

  return payload as T;
}

export async function sendChatMessage(input: {
  question: string;
  sessionId: string;
}): Promise<ChatApiResponse> {
  const response = await fetch(`${apiBaseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<ChatApiResponse>(response);
}

export async function createSupportTicket(input: {
  userEmail: string;
  question: string;
}): Promise<TicketResponse> {
  const response = await fetch(`${apiBaseUrl}/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<TicketResponse>(response);
}

export async function submitAnswerFeedback(input: {
  messageId: string;
  feedback: AnswerFeedback;
}): Promise<FeedbackResponse> {
  const response = await fetch(`${apiBaseUrl}/api/chat/${input.messageId}/feedback`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      feedback: input.feedback,
    }),
  });

  return parseJsonResponse<FeedbackResponse>(response);
}
