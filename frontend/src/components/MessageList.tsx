import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "../types/chat";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  onCreateTicket: (question: string) => void;
};

export function MessageList({ messages, isLoading, onCreateTicket }: MessageListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-slate-50/80 px-3 py-5 sm:px-5">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onCreateTicket={onCreateTicket} />
      ))}
      {isLoading && (
        <div className="flex items-center gap-3 pl-12 text-sm text-slate-500">
          <div className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-700 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-700 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-700" />
          </div>
          <span>Checking the knowledge base</span>
        </div>
      )}
    </div>
  );
}
