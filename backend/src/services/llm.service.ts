import type { LlmAnswer } from "../types/chat.types.js";
import { env } from "../utils/env.js";
import { buildRagPrompt, parseLlmAnswer } from "./rag-prompt.service.js";

type OllamaGenerateResponse = {
  response?: string;
};

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

function getOpenAiApiKey() {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai.");
  }

  return env.openaiApiKey;
}

async function generateOpenAiSupportAnswer(input: {
  context: string;
  question: string;
}): Promise<LlmAnswer> {
  const response = await fetch(`${env.openaiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAiApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiChatModel,
      messages: [
        {
          role: "user",
          content: buildRagPrompt(input),
        },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI chat request failed: ${message}`);
  }

  const payload = (await response.json()) as OpenAiChatResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI chat response did not include content.");
  }

  return parseLlmAnswer(content);
}

export async function generateSupportAnswer(input: {
  context: string;
  question: string;
}): Promise<LlmAnswer> {
  if (env.aiProvider === "openai") {
    return generateOpenAiSupportAnswer(input);
  }

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
