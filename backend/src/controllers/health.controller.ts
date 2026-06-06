import type { Request, Response } from "express";

export function getHealth(_request: Request, response: Response) {
  response.status(200).json({
    status: "ok",
    service: "kb-support-assistant-api",
    timestamp: new Date().toISOString(),
  });
}
