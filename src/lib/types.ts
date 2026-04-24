export type RiskCategory = 'very-high' | 'high' | 'medium' | 'low';

export type RetentionVerdict = 'yes' | 'conditional' | 'no';

export type FactorImpact = 'negative' | 'neutral' | 'positive';

export type ActionPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface RiskFactor {
  key: string;
  label: string;
  value: string;
  impact: FactorImpact;
  weight: number; // 0–1, relative importance (like SHAP magnitude)
  description: string;
}

export interface ActionItem {
  id: string;
  priority: ActionPriority;
  action: string;
  owner: string;
  dueInDays: number;
}

export interface Resident {
  id: string;
  name: string;
  unit: string;
  property: string;
  leaseEndDate: string;
  monthlyRent: number;
  riskScore: number; // 0–100, higher = more likely to not renew
  riskCategory: RiskCategory;
  retentionVerdict: RetentionVerdict;
  retentionRationale: string;
  lifetimeValue: number; // projected annual revenue
  riskFactors: RiskFactor[];
  actionItems: ActionItem[];
}
