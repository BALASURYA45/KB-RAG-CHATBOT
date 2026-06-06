import type { Request, Response } from "express";
import { getChatHistory } from "../services/chat-history.service.js";
import { answerChatQuestion } from "../services/chat.service.js";
import {
  readRequiredParamField,
  readOptionalStringBodyField,
  readRequiredStringBodyField,
} from "../utils/request-validation.util.js";

export async function createChatResponseController(request: Request, response: Response) {
  const question = readRequiredStringBodyField(request, "question");
  const sessionId = readOptionalStringBodyField(request, "sessionId");
  const chatResponse = await answerChatQuestion({ question, sessionId });

  response.status(200).json(chatResponse);
}

export async function getChatHistoryController(request: Request, response: Response) {
  const sessionId = readRequiredParamField(request, "sessionId");
  const history = await getChatHistory(sessionId);

  response.status(200).json(history);
}
