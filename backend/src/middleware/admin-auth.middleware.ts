import type { NextFunction, Request, Response } from "express";
import { env } from "../utils/env.js";
import { HttpError } from "../utils/http-error.js";

export function requireAdminKey(request: Request, _response: Response, next: NextFunction) {
  if (!env.adminApiKey) {
    if (env.nodeEnv === "production") {
      throw new HttpError("Admin API key is not configured.", 503);
    }

    next();
    return;
  }

  const apiKey = request.header("x-admin-api-key");

  if (apiKey !== env.adminApiKey) {
    throw new HttpError("A valid admin API key is required.", 401);
  }

  next();
}
