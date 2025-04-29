
/**
 * Types related to fiscal address services
 */

export type BillingCycle = 'annual' | 'semiannual';

export interface FiscalAddressContract {
  contractNo: string;
  customerName: string;
  cycle: BillingCycle;
  startDate: string;        // ISO yyyy-mm-dd
  endDate: string;          // ISO yyyy-mm-dd
  isDelinquent: boolean;
}

export interface CycleSplit {
  annual: FiscalAddressContract[];
  semiannual: FiscalAddressContract[];
}

export interface TotalCounts {
  total: number;
  annual: number;
  semiannual: number;
}

export interface DelinquencyMetrics {
  delinquent: number;
  rate: number;
}

export interface DashboardMetrics {
  counts: TotalCounts;
  delinquency: DelinquencyMetrics;
  expiring: FiscalAddressContract[];
  expiringCount: number;
  byCycle: CycleSplit;
}
