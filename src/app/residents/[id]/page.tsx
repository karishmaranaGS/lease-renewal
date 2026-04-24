import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getResidentById } from '@/lib/data';
import { RiskBadge, riskBarColor } from '@/components/RiskBadge';
import { RetentionTag } from '@/components/RetentionTag';
import { FeatureBar } from '@/components/FeatureBar';
import { ActionItemCard } from '@/components/ActionItemCard';

export default async function ResidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resident = getResidentById(id);
  if (!resident) notFound();

  const sortedFactors = [...resident.riskFactors].sort((a, b) => b.weight - a.weight);

  const leaseEnd = new Date(resident.leaseEndDate);
  const daysUntilEnd = Math.ceil((leaseEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
          >
            ← Dashboard
          </Link>
          <span className="text-slate-200">/</span>
          <span className="text-sm text-slate-600 font-medium">{resident.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* Resident hero card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">{resident.name}</h1>
              <p className="text-sm text-slate-500">
                Unit {resident.unit} · {resident.property}
              </p>
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <RiskBadge category={resident.riskCategory} size="md" />
                <RetentionTag verdict={resident.retentionVerdict} />
              </div>
            </div>

            {/* Risk score gauge */}
            <div className="flex items-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      strokeWidth="3"
                      strokeDasharray={`${resident.riskScore} ${100 - resident.riskScore}`}
                      strokeLinecap="round"
                      className={
                        resident.riskCategory === 'very-high'
                          ? 'stroke-red-500'
                          : resident.riskCategory === 'high'
                          ? 'stroke-orange-400'
                          : resident.riskCategory === 'medium'
                          ? 'stroke-yellow-400'
                          : 'stroke-green-500'
                      }
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{resident.riskScore}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Churn Risk Score</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Monthly Rent</p>
                  <p className="text-xl font-bold text-slate-800">${resident.monthlyRent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Lease End</p>
                  <p className="text-base font-semibold text-slate-800">
                    {leaseEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className={`text-xs mt-0.5 ${daysUntilEnd <= 60 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                    {daysUntilEnd > 0 ? `${daysUntilEnd} days remaining` : 'Expired'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Annual Value</p>
                  <p className="text-base font-semibold text-slate-800">${resident.lifetimeValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Retention rationale */}
          <div className={`mt-5 p-4 rounded-lg border text-sm leading-relaxed ${
            resident.retentionVerdict === 'yes'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : resident.retentionVerdict === 'conditional'
              ? 'bg-amber-50 border-amber-100 text-amber-800'
              : 'bg-slate-50 border-slate-100 text-slate-600'
          }`}>
            <span className="font-semibold">Retention assessment: </span>
            {resident.retentionRationale}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Risk factors */}
          <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Risk Factor Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by impact on churn prediction</p>
            </div>
            <div className="space-y-5 divide-y divide-slate-50">
              {sortedFactors.map((factor) => (
                <div key={factor.key} className="pt-5 first:pt-0">
                  <FeatureBar factor={factor} />
                </div>
              ))}
            </div>
          </div>

          {/* Action items */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Action Items</h2>
                <p className="text-xs text-slate-400 mt-0.5">{resident.actionItems.length} recommended actions</p>
              </div>
              <div className="space-y-2">
                {resident.actionItems
                  .sort((a, b) => {
                    const order = { urgent: 0, high: 1, medium: 2, low: 3 };
                    return order[a.priority] - order[b.priority];
                  })
                  .map((item) => (
                    <ActionItemCard key={item.id} item={item} />
                  ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <h2 className="text-base font-semibold text-slate-800">Quick Stats</h2>
              <div className="space-y-2">
                {[
                  {
                    label: 'Top Risk Driver',
                    value: sortedFactors[0]?.label ?? '—',
                  },
                  {
                    label: 'Top Positive Signal',
                    value: sortedFactors.find((f) => f.impact === 'positive')?.label ?? 'None',
                  },
                  {
                    label: 'Open Work Orders',
                    value:
                      resident.riskFactors.find((f) => f.key === 'open_work_orders')?.value ?? '0',
                  },
                  {
                    label: 'Late Payments (12mo)',
                    value:
                      resident.riskFactors.find((f) => f.key === 'late_payments')?.value ?? '0',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-medium text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
