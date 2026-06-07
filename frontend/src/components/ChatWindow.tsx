import { useState } from "react";
import { AlertCircle, Bot, Database, ShieldCheck } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { TicketModal } from "./TicketModal";
import { useSessionId } from "../hooks/useSessionId";
import { createSupportTicket, sendChatMessage, submitAnswerFeedback } from "../services/api";
import type { AnswerFeedback, ChatMessage } from "../types/chat";

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Ask a question and I will answer using the knowledge base.",
  confidence: 1,
  citations: [],
  escalate: false,
};

export function ChatWindow() {
  const sessionId = useSessionId();
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [ticketQuestion, setTicketQuestion] = useState<string>();
  const [ticketError, setTicketError] = useState<string>();
  const [ticketId, setTicketId] = useState<string>();
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);
  const [feedbackSubmittingId, setFeedbackSubmittingId] = useState<string>();

  async function handleSend(question: string) {
    if (isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await sendChatMessage({ question, sessionId });
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        messageId: response.messageId,
        role: "assistant",
        content: response.answer,
        confidence: response.confidence,
        citations: response.citations,
        escalate: response.escalate,
        question,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send message.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTicketSubmit(email: string) {
    if (!ticketQuestion) {
      return;
    }

    setIsTicketSubmitting(true);
    setTicketError(undefined);

    try {
      const ticket = await createSupportTicket({
        userEmail: email,
        question: ticketQuestion,
      });

      setTicketId(ticket.ticketId);
    } catch (requestError) {
      setTicketError(
        requestError instanceof Error ? requestError.message : "Unable to create ticket.",
      );
    } finally {
      setIsTicketSubmitting(false);
    }
  }

  async function handleFeedback(messageId: string, feedback: AnswerFeedback) {
    if (!messageId || feedbackSubmittingId) {
      return;
    }

    setFeedbackSubmittingId(messageId);
    setError(undefined);

    try {
      const result = await submitAnswerFeedback({ messageId, feedback });

      setMessages((current) =>
        current.map((message) =>
          message.messageId === result.messageId
            ? {
                ...message,
                feedback: result.feedback,
              }
            : message,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Unable to save feedback.",
      );
    } finally {
      setFeedbackSubmittingId(undefined);
    }
  }

  function closeTicketModal() {
    setTicketQuestion(undefined);
    setTicketError(undefined);
    setTicketId(undefined);
  }

  return (
    <section className="flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/70 sm:min-h-[calc(100vh-2.5rem)]">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-700 text-white shadow-sm">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-slate-950">KB Support Assistant</h2>
              <p className="mt-0.5 text-sm text-slate-500">Level-0 support workspace</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              <Database className="h-4 w-4 text-slate-500" aria-hidden="true" />
              Knowledge base
            </div>
            <div className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Citation required
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <MessageList
        feedbackSubmittingId={feedbackSubmittingId}
        isLoading={isLoading}
        messages={messages}
        onCreateTicket={(question) => setTicketQuestion(question)}
        onFeedback={handleFeedback}
      />
      <SuggestedQuestions disabled={isLoading} onSelect={handleSend} />
      <ChatInput disabled={isLoading} onSubmit={handleSend} />

      {ticketQuestion && (
        <TicketModal
          error={ticketError}
          isSubmitting={isTicketSubmitting}
          onClose={closeTicketModal}
          onSubmit={handleTicketSubmit}
          question={ticketQuestion}
          ticketId={ticketId}
        />
      )}
    </section>
  );
}
