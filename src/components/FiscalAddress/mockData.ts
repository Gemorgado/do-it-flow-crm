import { FiscalAddressContract } from "./types";
import { addDays, format, subDays } from "date-fns";

// Helper to format dates to ISO strings (YYYY-MM-DD)
const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

// Current date references
const today = new Date();
const in30Days = addDays(today, 30);
const in60Days = addDays(today, 60);
const in120Days = addDays(today, 120);
const expired30Days = subDays(today, 30);
const expired60Days = subDays(today, 60);

/**
 * Mock fiscal address contracts for development and testing
 */
export const mockContracts: FiscalAddressContract[] = [
  {
    contractNo: "FA-2024-001",
    customerName: "Empresa Alpha LTDA",
    cycle: "annual",
    startDate: formatDate(subDays(today, 335)),
    endDate: formatDate(in30Days),
    isDelinquent: false
  },
  {
    contractNo: "FA-2024-002",
    customerName: "Consultoria Beta ME",
    cycle: "semiannual",
    startDate: formatDate(subDays(today, 150)),
    endDate: formatDate(in60Days),
    isDelinquent: false
  },
  {
    contractNo: "FA-2023-042",
    customerName: "Startup Gamma EIRELI",
    cycle: "annual",
    startDate: formatDate(subDays(today, 400)),
    endDate: formatDate(expired30Days),
    isDelinquent: true
  },
  {
    contractNo: "FA-2023-055",
    customerName: "Delta Soluções S/A",
    cycle: "semiannual",
    startDate: formatDate(subDays(today, 210)),
    endDate: formatDate(expired60Days),
    isDelinquent: true
  },
  {
    contractNo: "FA-2024-010",
    customerName: "Epsilon Tecnologia LTDA",
    cycle: "annual",
    startDate: formatDate(subDays(today, 275)),
    endDate: formatDate(in60Days),
    isDelinquent: false
  },
  {
    contractNo: "FA-2024-015",
    customerName: "Zeta Consultoria MEI",
    cycle: "semiannual",
    startDate: formatDate(subDays(today, 120)),
    endDate: formatDate(in120Days),
    isDelinquent: false
  },
  {
    contractNo: "FA-2023-099",
    customerName: "Theta Importações LTDA",
    cycle: "annual",
    startDate: formatDate(subDays(today, 390)),
    endDate: formatDate(in30Days),
    isDelinquent: true
  },
  {
    contractNo: "FA-2024-022",
    customerName: "Iota Serviços Contábeis",
    cycle: "semiannual",
    startDate: formatDate(subDays(today, 170)),
    endDate: formatDate(in90Days),
    isDelinquent: false
  }
];

// Helper to calculate days to renewal that wasn't exported to keep the utils pure
const in90Days = addDays(today, 90);
