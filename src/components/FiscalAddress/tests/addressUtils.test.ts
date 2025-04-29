
import { describe, it, expect } from "vitest";
import { 
  splitByCycle, 
  countTotals, 
  calcDelinquency, 
  filterExpiring, 
  getDashboardMetrics,
  getDaysRemaining
} from "../addressUtils";
import { FiscalAddressContract } from "../types";
import { addDays, subDays, format } from "date-fns";

// Helper to create test data
const createTestData = (): FiscalAddressContract[] => {
  const today = new Date();
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
  
  return [
    {
      contractNo: "FA-TEST-001",
      customerName: "Annual Client",
      cycle: "annual",
      startDate: formatDate(subDays(today, 180)),
      endDate: formatDate(addDays(today, 180)),
      isDelinquent: false
    },
    {
      contractNo: "FA-TEST-002",
      customerName: "Semi-Annual Client",
      cycle: "semiannual",
      startDate: formatDate(subDays(today, 90)),
      endDate: formatDate(addDays(today, 90)),
      isDelinquent: false
    },
    {
      contractNo: "FA-TEST-003",
      customerName: "Delinquent Client",
      cycle: "annual",
      startDate: formatDate(subDays(today, 180)),
      endDate: formatDate(subDays(today, 30)),
      isDelinquent: true
    }
  ];
};

describe("Address Utils", () => {
  it("should split contracts by cycle", () => {
    const contracts = createTestData();
    const result = splitByCycle(contracts);
    
    expect(result.annual.length).toBe(2);
    expect(result.semiannual.length).toBe(1);
  });
  
  it("should count total contracts", () => {
    const contracts = createTestData();
    const result = countTotals(contracts);
    
    expect(result.total).toBe(3);
    expect(result.annual).toBe(2);
    expect(result.semiannual).toBe(1);
  });
  
  it("should calculate delinquency metrics", () => {
    const contracts = createTestData();
    const result = calcDelinquency(contracts);
    
    expect(result.delinquent).toBe(1);
    expect(result.rate).toBe(1/3);
  });
  
  it("should filter expiring contracts correctly", () => {
    const contracts = createTestData();
    const result = filterExpiring(contracts, 90);
    
    // Only one contract expires within 90 days
    expect(result.length).toBe(1);
    expect(result[0].contractNo).toBe("FA-TEST-002");
  });
  
  it("should calculate days remaining properly", () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');
    
    // Expect approximately 1 day difference (might be slightly off due to time)
    const result = getDaysRemaining(tomorrowStr);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(2);
  });
  
  it("should return dashboard metrics object", () => {
    const contracts = createTestData();
    const result = getDashboardMetrics(contracts);
    
    expect(result.counts.total).toBe(3);
    expect(result.delinquency.delinquent).toBe(1);
    expect(result.byCycle.annual.length).toBe(2);
    expect(result.byCycle.semiannual.length).toBe(1);
    // Only one contract expires within 90 days
    expect(result.expiring.length).toBe(1);
  });
});
