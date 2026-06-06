import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const errorName =
    statusCode === 401
      ? "Unauthorized"
      : statusCode === 429
        ? "Too Many Requests"
        : statusCode === 500
          ? "Internal Server Error"
          : "Bad Request";

  response.status(statusCode).json({
    error: errorName,
    message: process.env.NODE_ENV === "production" ? undefined : error.message,
  });
}
