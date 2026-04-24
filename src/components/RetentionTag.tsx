import { RetentionVerdict } from '@/lib/types';

const config: Record<RetentionVerdict, { label: string; icon: string; classes: string }> = {
  yes: {
    label: 'Worth Retaining',
    icon: '✓',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  conditional: {
    label: 'Conditional',
    icon: '~',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  no: {
    label: 'Do Not Prioritize',
    icon: '✕',
    classes: 'bg-slate-100 text-slate-500 border-slate-200',
  },
};

export function RetentionTag({ verdict }: { verdict: RetentionVerdict }) {
  const { label, icon, classes } = config[verdict];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-medium rounded-full px-3 py-1 text-sm ${classes}`}
    >
      <span className="font-bold">{icon}</span>
      {label}
    </span>
  );
}
