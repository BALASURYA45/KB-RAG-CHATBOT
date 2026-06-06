import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";

const suspiciousPatterns = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(the\s+)?system\s+prompt/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /show\s+(me\s+)?(the\s+)?system\s+prompt/i,
  /use\s+outside\s+knowledge/i,
  /bypass\s+(the\s+)?rules/i,
  /developer\s+message/i,
];

export function blockPromptInjection(request: Request, _response: Response, next: NextFunction) {
  const question = request.body?.question;

  if (typeof question === "string" && suspiciousPatterns.some((pattern) => pattern.test(question))) {
    throw new HttpError("Question contains unsafe instructions.", 400);
  }

  next();
}
