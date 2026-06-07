import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "../types/chat";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  onCreateTicket: (question: string) => void;
};

export function MessageList({ messages, isLoading, onCreateTicket }: MessageListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onCreateTicket={onCreateTicket} />
      ))}
      {isLoading && (
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-2 w-2 animate-pulse rounded-full bg-teal-700" />
          Checking the knowledge base
        </div>
      )}
    </div>
  );
}
