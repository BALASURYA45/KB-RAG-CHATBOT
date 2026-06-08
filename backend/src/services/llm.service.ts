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

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function getOpenAiApiKey() {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai.");
  }

  return env.openaiApiKey;
}

function getGeminiApiKey() {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini.");
  }

  return env.geminiApiKey;
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

async function generateGeminiSupportAnswer(input: {
  context: string;
  question: string;
}): Promise<LlmAnswer> {
  const response = await fetch(
    `${env.geminiBaseUrl}/models/${env.geminiChatModel}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getGeminiApiKey(),
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildRagPrompt(input),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              answer: {
                type: "string",
              },
              confidence: {
                type: "number",
              },
            },
            required: ["answer", "confidence"],
          },
          temperature: 0,
        },
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini chat request failed: ${message}`);
  }

  const payload = (await response.json()) as GeminiGenerateContentResponse;
  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("");

  if (!content) {
    throw new Error("Gemini chat response did not include content.");
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

  if (env.aiProvider === "gemini") {
    return generateGeminiSupportAnswer(input);
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
