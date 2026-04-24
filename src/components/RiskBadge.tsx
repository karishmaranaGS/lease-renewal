import { RiskCategory } from '@/lib/types';

const config: Record<RiskCategory, { label: string; classes: string }> = {
  'very-high': { label: 'Very High Risk', classes: 'bg-red-100 text-red-700 border-red-200' },
  high: { label: 'High Risk', classes: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { label: 'Medium Risk', classes: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: 'Low Risk', classes: 'bg-green-100 text-green-700 border-green-200' },
};

export function RiskBadge({ category, size = 'sm' }: { category: RiskCategory; size?: 'sm' | 'md' }) {
  const { label, classes } = config[category];
  return (
    <span
      className={`inline-flex items-center border font-medium rounded-full ${classes} ${
        size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      {label}
    </span>
  );
}

export function riskDotColor(category: RiskCategory): string {
  const map: Record<RiskCategory, string> = {
    'very-high': 'bg-red-500',
    high: 'bg-orange-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-500',
  };
  return map[category];
}

export function riskBarColor(category: RiskCategory): string {
  const map: Record<RiskCategory, string> = {
    'very-high': 'bg-red-500',
    high: 'bg-orange-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-500',
  };
  return map[category];
}
