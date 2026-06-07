import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { TicketModal } from "./TicketModal";
import { useSessionId } from "../hooks/useSessionId";
import { createSupportTicket, sendChatMessage } from "../services/api";
import type { ChatMessage } from "../types/chat";

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

  async function handleSend(question: string) {
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

  function closeTicketModal() {
    setTicketQuestion(undefined);
    setTicketError(undefined);
    setTicketId(undefined);
  }

  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">KB Support Assistant</h2>
          <p className="mt-1 text-sm text-slate-500">Level-0 support workspace</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Citation required
        </div>
      </header>

      {error && (
        <div className="border-b border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <MessageList
        isLoading={isLoading}
        messages={messages}
        onCreateTicket={(question) => setTicketQuestion(question)}
      />
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
