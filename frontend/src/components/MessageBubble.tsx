import { Bot, LifeBuoy, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { CitationPanel } from "./CitationPanel";
import type { AnswerFeedback, ChatMessage } from "../types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
  onCreateTicket: (question: string) => void;
  onFeedback: (messageId: string, feedback: AnswerFeedback) => Promise<void>;
  feedbackSubmittingId?: string;
};

export function MessageBubble({
  message,
  onCreateTicket,
  onFeedback,
  feedbackSubmittingId,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const canGiveFeedback = !isUser && Boolean(message.messageId);
  const isFeedbackSubmitting = feedbackSubmittingId === message.messageId;

  return (
    <article className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-700 text-white shadow-sm">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
      <div
        className={`max-w-[min(780px,86%)] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? "bg-slate-950 text-white shadow-slate-300/70"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {!isUser && message.escalate && message.question && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600/25"
              onClick={() => onCreateTicket(message.question ?? "")}
              type="button"
            >
              <LifeBuoy className="h-4 w-4" aria-hidden="true" />
              Create Support Ticket
            </button>
          </div>
        )}

        {!isUser && <CitationPanel citations={message.citations ?? []} />}

        {canGiveFeedback && (
          <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3">
            <span className="text-xs font-medium text-slate-500">Was this helpful?</span>
            <button
              aria-label="Mark answer helpful"
              className={`grid h-8 w-8 place-items-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-sky-700/20 disabled:cursor-not-allowed ${
                message.feedback === "HELPFUL"
                  ? "border-sky-200 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:text-sky-800"
              }`}
              disabled={isFeedbackSubmitting}
              onClick={() => void onFeedback(message.messageId ?? "", "HELPFUL")}
              title="Helpful"
              type="button"
            >
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              aria-label="Mark answer not helpful"
              className={`grid h-8 w-8 place-items-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-rose-600/20 disabled:cursor-not-allowed ${
                message.feedback === "NOT_HELPFUL"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-700"
              }`}
              disabled={isFeedbackSubmitting}
              onClick={() => void onFeedback(message.messageId ?? "", "NOT_HELPFUL")}
              title="Not helpful"
              type="button"
            >
              <ThumbsDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-700 shadow-sm">
          <User className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
    </article>
  );
}
