import type { Request, Response } from "express";
import { answerChatQuestion } from "../services/chat.service.js";
import { readOptionalStringBodyField, readRequiredStringBodyField } from "../utils/request-validation.util.js";

export async function createChatResponseController(request: Request, response: Response) {
  const question = readRequiredStringBodyField(request, "question");
  const sessionId = readOptionalStringBodyField(request, "sessionId");
  const chatResponse = await answerChatQuestion({ question, sessionId });

  response.status(200).json(chatResponse);
}
