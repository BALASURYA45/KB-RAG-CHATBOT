import { FormEvent, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type TicketModalProps = {
  question: string;
  isSubmitting: boolean;
  ticketId?: string;
  error?: string;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
};

export function TicketModal({
  question,
  isSubmitting,
  ticketId,
  error,
  onClose,
  onSubmit,
}: TicketModalProps) {
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(email);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4">
      <section
        aria-modal="true"
        className="w-full max-w-lg rounded-lg bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">Create Support Ticket</h2>
          <button
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            title="Close"
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        {ticketId ? (
          <div className="p-5">
            <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-medium">Ticket created</p>
                <p className="text-sm">ID: {ticketId}</p>
              </div>
            </div>
          </div>
        ) : (
          <form className="p-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700" htmlFor="ticket-email">
              Email Address
            </label>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              id="ticket-email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />

            <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="ticket-question">
              Question
            </label>
            <textarea
              className="mt-2 min-h-24 w-full resize-none rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              id="ticket-question"
              readOnly
              value={question}
            />

            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

            <button
              className="mt-5 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isSubmitting || email.trim().length === 0}
              type="submit"
            >
              Submit Ticket
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
