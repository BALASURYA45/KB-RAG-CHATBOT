import type { Request } from "express";
import { securityConfig } from "../config/security.config.js";
import { HttpError } from "./http-error.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readRequiredStringBodyField(
  request: Request,
  fieldName: string,
  options: { maxLength?: number } = {},
) {
  const value = request.body?.[fieldName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(`${fieldName} is required.`, 400);
  }

  const trimmedValue = value.trim();

  if (options.maxLength && trimmedValue.length > options.maxLength) {
    throw new HttpError(`${fieldName} must be ${options.maxLength} characters or fewer.`, 400);
  }

  return trimmedValue;
}

export function readRequiredParamField(request: Request, fieldName: string) {
  const value = request.params[fieldName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(`${fieldName} is required.`, 400);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > securityConfig.maxSessionIdLength) {
    throw new HttpError(`${fieldName} must be ${securityConfig.maxSessionIdLength} characters or fewer.`, 400);
  }

  return trimmedValue;
}

export function readRequiredEmailBodyField(request: Request, fieldName: string) {
  const value = readRequiredStringBodyField(request, fieldName, {
    maxLength: securityConfig.maxEmailLength,
  }).toLowerCase();

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
