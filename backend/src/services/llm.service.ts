import type { LlmAnswer } from "../types/chat.types.js";
import { env } from "../utils/env.js";
import { buildRagPrompt, parseLlmAnswer } from "./rag-prompt.service.js";

type OllamaGenerateResponse = {
  response?: string;
};

export async function generateSupportAnswer(input: {
  context: string;
  question: string;
}): Promise<LlmAnswer> {
  const response = await fetch(`${env.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.ollamaChatModel,
      prompt: buildRagPrompt(input),
      stream: false,
      format: "json",
      options: {
        temperature: 0,
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Ollama chat request failed: ${message}`);
  }

  const payload = (await response.json()) as OllamaGenerateResponse;
  const content = payload.response;

  if (!content) {
    throw new Error("Ollama chat response did not include content.");
  }

  return parseLlmAnswer(content);
}
