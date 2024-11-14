export interface Sale {
  id: string;
  date: string;
  clientLastName: string;
  numberOfTours: number;
  managerName: string;
  saleAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  notes: string;
  leadNumber: string;
  fdi: string;
  rank?: number;
  netVPG: number;
  isCancelled: boolean;
  saleType: 'DEED' | 'TRUST';
}

export type DateRange = 'monthly' | '45day' | '90day';

export interface SalesTotals {
  totalTours: number;
  totalVolume: number;
  totalCommission: number;
  activeSales: number;
  cancelledSales: number;
  deedSales: number;
  trustSales: number;
  netVPG: number;
}

export interface CommissionLevel {
  level: number;
  minAmount: number;
  maxAmount: number;
  additionalCommission: number;
}

export const getBaseCommission = (saleAmount: number, saleType: 'DEED' | 'TRUST'): number => {
  if (saleType === 'TRUST') return 6;
  if (saleAmount >= 50000) return 6;
  if (saleAmount >= 20000) return 5;
  return 4;
};

export const getAdditionalCommission = (totalVolume: number): number => {
  const level = COMMISSION_LEVELS.find(
    level => totalVolume >= level.minAmount && totalVolume <= level.maxAmount
  );
  return level ? level.additionalCommission : 0;
};

export const calculateTotalCommission = (saleAmount: number, totalVolume: number, saleType: 'DEED' | 'TRUST'): number => {
  const baseCommission = getBaseCommission(saleAmount, saleType);
  const additionalCommission = getAdditionalCommission(totalVolume);
  return baseCommission + additionalCommission;
};

export const COMMISSION_LEVELS: CommissionLevel[] = [
  { level: 1, minAmount: 162500, maxAmount: 243749, additionalCommission: 1 },
  { level: 2, minAmount: 243750, maxAmount: 324999, additionalCommission: 2 },
  { level: 3, minAmount: 325000, maxAmount: 406249, additionalCommission: 3 },
  { level: 4, minAmount: 406250, maxAmount: 487499, additionalCommission: 3.5 },
  { level: 5, minAmount: 487500, maxAmount: 584999, additionalCommission: 4 },
  { level: 6, minAmount: 585000, maxAmount: 682499, additionalCommission: 5 },
  { level: 7, minAmount: 682500, maxAmount: 893749, additionalCommission: 5.5 },
  { level: 8, minAmount: 893750, maxAmount: 999999999, additionalCommission: 6 }
];