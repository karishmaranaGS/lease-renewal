import { ActionItem, ActionPriority } from '@/lib/types';

const priorityConfig: Record<ActionPriority, { label: string; classes: string }> = {
  urgent: { label: 'Urgent', classes: 'bg-red-100 text-red-700' },
  high: { label: 'High', classes: 'bg-orange-100 text-orange-700' },
  medium: { label: 'Medium', classes: 'bg-yellow-100 text-yellow-700' },
  low: { label: 'Low', classes: 'bg-slate-100 text-slate-500' },
};

export function ActionItemCard({ item }: { item: ActionItem }) {
  const { label, classes } = priorityConfig[item.priority];
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-white">
      <div className="mt-0.5 w-5 h-5 rounded border border-slate-200 shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm text-slate-800 leading-snug">{item.action}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${classes}`}>{label}</span>
          <span className="text-xs text-slate-400">{item.owner}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400">Due in {item.dueInDays}d</span>
        </div>
      </div>
    </div>
  );
}
