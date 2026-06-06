import { findChatHistoryBySessionId } from "../repositories/chat-session.repository.js";

export async function getChatHistory(sessionId: string) {
  return findChatHistoryBySessionId(sessionId);
}
