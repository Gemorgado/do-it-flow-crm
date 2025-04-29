
import { addDays, differenceInDays, parseISO } from "date-fns";
import { 
  BillingCycle, 
  CycleSplit, 
  DashboardMetrics, 
  DelinquencyMetrics, 
  FiscalAddressContract, 
  TotalCounts 
} from "./types";

/**
 * Splits fiscal address contracts by billing cycle
 * @param contracts - Array of fiscal address contracts
 * @returns Object containing arrays split by billing cycle
 */
export function splitByCycle(contracts: FiscalAddressContract[]): CycleSplit {
  return {
    annual: contracts.filter(contract => contract.cycle === 'annual'),
    semiannual: contracts.filter(contract => contract.cycle === 'semiannual')
  };
}

/**
 * Counts total contracts and breakdowns by cycle
 * @param contracts - Array of fiscal address contracts
 * @returns Object with total, annual, and semiannual counts
 */
export function countTotals(contracts: FiscalAddressContract[]): TotalCounts {
  const byCycle = splitByCycle(contracts);
  
  return {
    total: contracts.length,
    annual: byCycle.annual.length,
    semiannual: byCycle.semiannual.length
  };
}

/**
 * Calculates delinquency metrics
 * @param contracts - Array of fiscal address contracts
 * @returns Object containing delinquent count and rate
 */
export function calcDelinquency(contracts: FiscalAddressContract[]): DelinquencyMetrics {
  const delinquent = contracts.filter(contract => contract.isDelinquent).length;
  
  return {
    delinquent,
    rate: contracts.length ? delinquent / contracts.length : 0
  };
}

/**
 * Filters contracts that will expire within the given horizon days
 * @param contracts - Array of fiscal address contracts
 * @param horizonDays - Number of days to consider for expiration (default 90)
 * @returns Array of contracts expiring within the horizon
 */
export function filterExpiring(
  contracts: FiscalAddressContract[], 
  horizonDays = 90
): FiscalAddressContract[] {
  const today = new Date();
  const horizonDate = addDays(today, horizonDays);
  
  return contracts.filter(contract => {
    const endDate = parseISO(contract.endDate);
    return endDate <= horizonDate && endDate >= today;
  });
}

/**
 * Calculates days remaining until contract expiration
 * @param endDate - Contract end date in ISO format
 * @returns Number of days remaining (negative if past due)
 */
export function getDaysRemaining(endDate: string): number {
  return differenceInDays(parseISO(endDate), new Date());
}

/**
 * Calculates days past due for delinquent contracts
 * @param endDate - Contract end date in ISO format
 * @returns Number of days past due
 */
export function getDaysPastDue(endDate: string): number {
  return Math.abs(getDaysRemaining(endDate));
}

/**
 * Compiles all metrics needed for the fiscal address dashboard
 * @param contracts - Array of fiscal address contracts
 * @returns Comprehensive object with all dashboard metrics
 */
export function getDashboardMetrics(contracts: FiscalAddressContract[]): DashboardMetrics {
  const byCycle = splitByCycle(contracts);
  const counts = countTotals(contracts);
  const delinquency = calcDelinquency(contracts);
  const expiring = filterExpiring(contracts);
  
  return {
    counts,
    delinquency,
    expiring,
    expiringCount: expiring.length,
    byCycle
  };
}
