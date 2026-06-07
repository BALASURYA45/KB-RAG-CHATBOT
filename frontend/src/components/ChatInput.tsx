import { FormEvent, KeyboardEvent, useState } from "react";
import { SendHorizontal } from "lucide-react";

type ChatInputProps = {
  disabled: boolean;
  onSubmit: (question: string) => Promise<void>;
};

export function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [question, setQuestion] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitQuestion();
  }

  async function submitQuestion() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || disabled) {
      return;
    }

    setQuestion("");
    await onSubmit(trimmedQuestion);
  }

  async function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await submitQuestion();
    }
  }

  return (
    <form className="border-t border-slate-200 bg-white p-3 sm:p-4" onSubmit={handleSubmit}>
      <div className="flex gap-2 sm:gap-3">
        <textarea
          className="max-h-36 min-h-12 flex-1 resize-none rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15 disabled:bg-slate-50 disabled:text-slate-500"
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a support question"
          rows={1}
          value={question}
        />
        <button
          aria-label="Send question"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-teal-700 text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/25 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          disabled={disabled || question.trim().length === 0}
          title="Send question"
          type="submit"
        >
          <SendHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
