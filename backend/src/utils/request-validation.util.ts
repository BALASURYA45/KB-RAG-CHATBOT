import type { Request } from "express";
import { HttpError } from "./http-error.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readRequiredStringBodyField(request: Request, fieldName: string) {
  const value = request.body?.[fieldName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(`${fieldName} is required.`, 400);
  }

  return value.trim();
}

export function readRequiredEmailBodyField(request: Request, fieldName: string) {
  const value = readRequiredStringBodyField(request, fieldName).toLowerCase();

  if (!emailPattern.test(value)) {
    throw new HttpError(`${fieldName} must be a valid email address.`, 400);
  }

  return value;
}

export function readOptionalStringBodyField(request: Request, fieldName: string) {
  const value = request.body?.[fieldName];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new HttpError(`${fieldName} must be a string.`, 400);
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function readOptionalNumberBodyField(request: Request, fieldName: string) {
  const value = request.body?.[fieldName];

  if (value === undefined) {
    return undefined;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new HttpError(`${fieldName} must be a number.`, 400);
  }

  return numberValue;
}
