import { randomUUID } from "node:crypto";
import { createChatSession } from "../repositories/chat-session.repository.js";
import type { ChatRequestInput, ChatResponse } from "../types/chat.types.js";
import { searchKnowledgeBase } from "./kb-retrieval.service.js";
import {
  buildCitations,
  buildRetrievedContext,
} from "./rag-prompt.service.js";
import { calculateConfidence, escalationThreshold } from "./confidence.service.js";
import { generateSupportAnswer } from "./llm.service.js";

const fallbackAnswer = "I could not find a reliable answer in the knowledge base.";

export async function answerChatQuestion(input: ChatRequestInput): Promise<ChatResponse> {
  const question = input.question.trim();
  const sessionId = input.sessionId?.trim() || randomUUID();
  const retrievalResults = await searchKnowledgeBase({ question, limit: 5 });

  if (retrievalResults.length === 0) {
    const response = {
      answer: fallbackAnswer,
      confidence: 0,
      citations: [],
      escalate: true,
    };

    await createChatSession({
      sessionId,
      question,
      answer: response.answer,
      confidence: response.confidence,
    });

    return response;
  }

  const citations = buildCitations(retrievalResults);
  const llmAnswer = await generateSupportAnswer({
    context: buildRetrievedContext(retrievalResults),
    question,
  });
  const confidence = calculateConfidence({
    retrievalResults,
    llmConfidence: llmAnswer.confidence,
  });
  const shouldEscalate = confidence < escalationThreshold || citations.length === 0;
  const response = shouldEscalate
    ? {
        answer: fallbackAnswer,
        confidence,
        citations: [],
        escalate: true,
      }
    : {
        answer: llmAnswer.answer,
        confidence,
        citations,
        escalate: false,
      };

  await createChatSession({
    sessionId,
    question,
    answer: response.answer,
    confidence: response.confidence,
  });

  return response;
}
