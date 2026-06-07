import { FileText } from "lucide-react";
import type { Citation } from "../types/chat";

type CitationPanelProps = {
  citations: Citation[];
};

export function CitationPanel({ citations }: CitationPanelProps) {
  if (citations.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Sources
      </div>
      <div className="flex flex-wrap gap-2">
        {citations.map((citation) => (
          <span
            className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
            key={`${citation.article}-${citation.section}`}
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-teal-700" aria-hidden="true" />
            <span className="truncate">
              {citation.article} &gt; {citation.section}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
