import type { Request, Response } from "express";
import { createTicket } from "../services/ticket.service.js";
import {
  readRequiredEmailBodyField,
  readRequiredStringBodyField,
} from "../utils/request-validation.util.js";

export async function createTicketController(request: Request, response: Response) {
  const userEmail = readRequiredEmailBodyField(request, "userEmail");
  const question = readRequiredStringBodyField(request, "question");
  const ticket = await createTicket({ userEmail, question });

  response.status(201).json(ticket);
}
