type ConfidenceIndicatorProps = {
  value: number;
};

export function ConfidenceIndicator({ value }: ConfidenceIndicatorProps) {
  const percentage = Math.round(value * 100);
  const tone =
    value >= 0.85
      ? "bg-emerald-500"
      : value >= 0.7
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="min-w-36">
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
        <span>Confidence</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${tone}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
