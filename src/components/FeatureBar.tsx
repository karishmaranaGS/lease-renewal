import { RiskFactor } from '@/lib/types';

const impactColors = {
  negative: 'bg-red-400',
  neutral: 'bg-slate-300',
  positive: 'bg-emerald-400',
};

const impactLabel = {
  negative: 'Increases risk',
  neutral: 'Neutral',
  positive: 'Reduces risk',
};

export function FeatureBar({ factor }: { factor: RiskFactor }) {
  const pct = Math.round(factor.weight * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 w-2 h-2 rounded-full ${impactColors[factor.impact]}`}
          />
          <span className="text-sm font-medium text-slate-800 truncate">{factor.label}</span>
          <span className="text-sm text-slate-500 shrink-0">{factor.value}</span>
        </div>
        <span className="text-xs text-slate-400 shrink-0">{impactLabel[factor.impact]}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${impactColors[factor.impact]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
    </div>
  );
}
