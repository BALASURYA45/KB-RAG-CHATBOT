import { randomUUID } from "node:crypto";
import {
  createChatSession,
  updateChatSessionFeedback,
} from "../repositories/chat-session.repository.js";
import type { ChatRequestInput, ChatResponse } from "../types/chat.types.js";
import { HttpError } from "../utils/http-error.js";
import { searchKnowledgeBase } from "./kb-retrieval.service.js";
import {
  buildCitations,
  buildExtractiveAnswer,
  buildRetrievedContext,
  selectCitationResults,
} from "./rag-prompt.service.js";
import {
  calculateConfidence,
  citationSimilarityThreshold,
  directAnswerSimilarityThreshold,
  escalationThreshold,
} from "./confidence.service.js";
import { generateSupportAnswer } from "./llm.service.js";

const fallbackAnswer = "I could not find a reliable answer in the knowledge base.";
const allowedFeedback = new Set(["HELPFUL", "NOT_HELPFUL"]);

export async function recordAnswerFeedback(input: { messageId: string; feedback: string }) {
  if (!allowedFeedback.has(input.feedback)) {
    throw new HttpError("feedback must be HELPFUL or NOT_HELPFUL.", 400);
  }

  const result = await updateChatSessionFeedback({
    id: input.messageId,
    feedback: input.feedback,
  });

  if (result.count === 0) {
    throw new HttpError("Chat message was not found.", 404);
  }

  return {
    messageId: input.messageId,
    feedback: input.feedback,
  };
}

async function saveChatResponse(input: {
  sessionId: string;
  question: string;
  response: Omit<ChatResponse, "messageId">;
}): Promise<ChatResponse> {
  const chatSession = await createChatSession({
    sessionId: input.sessionId,
    question: input.question,
    answer: input.response.answer,
    confidence: input.response.confidence,
  });

  return {
    messageId: chatSession.id,
    ...input.response,
  };
}

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

    return saveChatResponse({
      sessionId,
      question,
      response,
    });
  }

  const supportingResults = retrievalResults.filter(
    (result) => result.similarity >= citationSimilarityThreshold,
  );
  const contextResults = supportingResults.length > 0 ? supportingResults : retrievalResults;
  const citationResults = selectCitationResults(retrievalResults);
  const citations = buildCitations(citationResults);
  const topSimilarity = retrievalResults[0]?.similarity ?? 0;

  if (citations.length === 0) {
    const confidence = calculateConfidence({
      retrievalResults,
      llmConfidence: 0,
    });
    const response = {
      answer: fallbackAnswer,
      confidence,
      citations: [],
      escalate: true,
    };

    return saveChatResponse({
      sessionId,
      question,
      response,
    });
  }

  if (topSimilarity >= directAnswerSimilarityThreshold) {
    const confidence = calculateConfidence({
      retrievalResults,
      llmConfidence: 1,
    });
    const answer = buildExtractiveAnswer(citationResults);

    const response = {
      answer,
      confidence,
      citations,
      escalate: false,
    };

    return saveChatResponse({
      sessionId,
      question,
      response,
    });
  }

  let llmAnswer;

  try {
    llmAnswer = await generateSupportAnswer({
      context: buildRetrievedContext(contextResults),
      question,
    });
  } catch {
    const confidence = calculateConfidence({
      retrievalResults,
      llmConfidence: 0,
    });
    const response = {
      answer: fallbackAnswer,
      confidence,
      citations: [],
      escalate: true,
    };

    return saveChatResponse({
      sessionId,
      question,
      response,
    });
  }

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

  return saveChatResponse({
    sessionId,
    question,
    response,
  });
}
