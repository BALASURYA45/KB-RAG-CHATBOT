import type { Request } from "express";

export function readRequiredStringBodyField(request: Request, fieldName: string) {
  const value = request.body?.[fieldName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

export function readOptionalNumberBodyField(request: Request, fieldName: string) {
  const value = request.body?.[fieldName];

  if (value === undefined) {
    return undefined;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${fieldName} must be a number.`);
  }

  return numberValue;
}
