import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;

  response.status(statusCode).json({
    error: statusCode === 500 ? "Internal Server Error" : "Bad Request",
    message: process.env.NODE_ENV === "production" ? undefined : error.message,
  });
}
