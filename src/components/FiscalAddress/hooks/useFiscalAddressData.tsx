
import { useMemo } from "react";
import { mockContracts } from "../mockData";
import { FiscalAddressContract } from "../types";

export const useFiscalAddressData = () => {
  // In a real app, this would fetch data from an API
  const data = mockContracts;
  const isLoading = false;
  
  return { data, isLoading };
};
