import type { Request, Response } from "express";
import { checkDatabaseHealth } from "../services/database-health.service.js";

export function getHealth(_request: Request, response: Response) {
  response.status(200).json({
    status: "ok",
    service: "kb-support-assistant-api",
    timestamp: new Date().toISOString(),
  });
}

export async function getDatabaseHealth(_request: Request, response: Response) {
  const database = await checkDatabaseHealth();

  response.status(200).json({
    service: "kb-support-assistant-api",
    database,
    timestamp: new Date().toISOString(),
  });
}
