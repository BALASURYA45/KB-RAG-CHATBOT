import { AlertTriangle, Bot, User } from "lucide-react";
import { CitationPanel } from "./CitationPanel";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import type { ChatMessage } from "../types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
  onCreateTicket: (question: string) => void;
};

export function MessageBubble({ message, onCreateTicket }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-teal-700 text-white">
          <Bot className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
      )}
      <div
        className={`max-w-[min(760px,82%)] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? "bg-slate-900 text-white"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {!isUser && typeof message.confidence === "number" && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ConfidenceIndicator value={message.confidence} />
            {message.escalate && message.question && (
              <button
                className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                onClick={() => onCreateTicket(message.question ?? "")}
                type="button"
              >
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Create Support Ticket
              </button>
            )}
          </div>
        )}

        {!isUser && <CitationPanel citations={message.citations ?? []} />}
      </div>
      {isUser && (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-200 text-slate-700">
          <User className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
      )}
    </article>
  );
}
