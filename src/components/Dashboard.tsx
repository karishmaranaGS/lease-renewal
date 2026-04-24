'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Resident, RiskCategory } from '@/lib/types';
import { RiskBadge, riskBarColor } from './RiskBadge';
import { RetentionTag } from './RetentionTag';
import { properties } from '@/lib/data';

const RISK_ORDER: RiskCategory[] = ['very-high', 'high', 'medium', 'low'];

const statConfig: { category: RiskCategory; label: string; bg: string; border: string; text: string }[] = [
  { category: 'very-high', label: 'Very High Risk', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  { category: 'high', label: 'High Risk', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  { category: 'medium', label: 'Medium Risk', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  { category: 'low', label: 'Low Risk', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
];

export function Dashboard({ residents }: { residents: Resident[] }) {
  const [filterRisk, setFilterRisk] = useState<RiskCategory | 'all'>('all');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'riskScore' | 'monthlyRent' | 'leaseEndDate'>('riskScore');
  const [search, setSearch] = useState('');

  const counts = useMemo(
    () =>
      Object.fromEntries(
        RISK_ORDER.map((cat) => [cat, residents.filter((r) => r.riskCategory === cat).length])
      ) as Record<RiskCategory, number>,
    [residents]
  );

  const filtered = useMemo(() => {
    return residents
      .filter((r) => {
        if (filterRisk !== 'all' && r.riskCategory !== filterRisk) return false;
        if (filterProperty !== 'all' && r.property !== filterProperty) return false;
        if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.unit.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortKey === 'riskScore') return b.riskScore - a.riskScore;
        if (sortKey === 'monthlyRent') return b.monthlyRent - a.monthlyRent;
        return new Date(a.leaseEndDate).getTime() - new Date(b.leaseEndDate).getTime();
      });
  }, [residents, filterRisk, filterProperty, search, sortKey]);

  const avgRisk = Math.round(residents.reduce((s, r) => s + r.riskScore, 0) / residents.length);
  const atRiskRevenue = residents
    .filter((r) => r.riskCategory === 'very-high' || r.riskCategory === 'high')
    .reduce((s, r) => s + r.monthlyRent * 12, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Greystar</p>
              <h1 className="text-2xl font-bold text-slate-900">Lease Renewal Intelligence</h1>
              <p className="text-sm text-slate-500 mt-1">AI-powered churn risk · {residents.length} residents across {properties.length} properties</p>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Avg Risk Score</p>
                <p className="text-2xl font-bold text-slate-800">{avgRisk}<span className="text-sm font-normal text-slate-400">/100</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Revenue at Risk</p>
                <p className="text-2xl font-bold text-red-600">${(atRiskRevenue / 1000).toFixed(0)}k<span className="text-sm font-normal text-slate-400">/yr</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {statConfig.map(({ category, label, bg, border, text }) => (
            <button
              key={category}
              onClick={() => setFilterRisk(filterRisk === category ? 'all' : category)}
              className={`${bg} border ${border} rounded-xl p-4 text-left transition-all ring-2 ${
                filterRisk === category ? 'ring-slate-400' : 'ring-transparent'
              } hover:ring-slate-300`}
            >
              <p className={`text-3xl font-bold ${text}`}>{counts[category]}</p>
              <p className={`text-sm font-medium mt-1 ${text}`}>{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {residents.filter((r) => r.riskCategory === category).reduce((s, r) => s + r.monthlyRent, 0).toLocaleString()} mo. rent
              </p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or unit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white w-56 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="all">All Properties</option>
            {properties.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="riskScore">Sort: Risk Score</option>
            <option value="leaseEndDate">Sort: Lease End Date</option>
            <option value="monthlyRent">Sort: Monthly Rent</option>
          </select>
          {(filterRisk !== 'all' || filterProperty !== 'all' || search) && (
            <button
              onClick={() => { setFilterRisk('all'); setFilterProperty('all'); setSearch(''); }}
              className="text-sm text-slate-500 hover:text-slate-800 underline"
            >
              Clear filters
            </button>
          )}
          <span className="text-sm text-slate-400 ml-auto">{filtered.length} residents</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Resident</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Property / Unit</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rent</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Lease Ends</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Retention</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-900">{r.name}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-slate-700">{r.property}</span>
                    <span className="text-slate-400 ml-2">#{r.unit}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <RiskBadge category={r.riskCategory} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${riskBarColor(r.riskCategory)}`}
                          style={{ width: `${r.riskScore}%` }}
                        />
                      </div>
                      <span className="text-slate-600 tabular-nums">{r.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 tabular-nums">
                    ${r.monthlyRent.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 tabular-nums">
                    {new Date(r.leaseEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <RetentionTag verdict={r.retentionVerdict} />
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/residents/${r.id}`}
                      className="text-xs font-medium text-slate-400 group-hover:text-slate-700 transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No residents match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
