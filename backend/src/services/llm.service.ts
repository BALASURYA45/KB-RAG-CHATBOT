import { ChatOpenAI } from "@langchain/openai";
import type { LlmAnswer } from "../types/chat.types.js";
import { env } from "../utils/env.js";
import { buildRagPrompt, parseLlmAnswer } from "./rag-prompt.service.js";

const chatModel = "gpt-4.1-mini";

function createChatClient() {
  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is required to generate chat answers.");
  }

  return new ChatOpenAI({
    apiKey: env.openAiApiKey,
    model: chatModel,
    temperature: 0,
  });
}

export async function generateSupportAnswer(input: {
  context: string;
  question: string;
}): Promise<LlmAnswer> {
  const chat = createChatClient();
  const response = await chat.invoke(buildRagPrompt(input));
  const content = Array.isArray(response.content)
    ? response.content.map((part) => (typeof part === "string" ? part : "")).join("")
    : response.content;

  return parseLlmAnswer(content);
}
