import { HelpCircle } from "lucide-react";

type SuggestedQuestionsProps = {
  disabled: boolean;
  onSelect: (question: string) => Promise<void>;
};

const suggestedQuestions = [
  "How do I reset my password?",
  "How do I update my billing information?",
  "How do I enable two-factor authentication?",
  "Where can I find my invoices?",
];

export function SuggestedQuestions({ disabled, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-500 sm:inline-flex">
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Try
        </div>
        {suggestedQuestions.map((question) => (
          <button
            className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-700/20 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            key={question}
            onClick={() => void onSelect(question)}
            type="button"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
