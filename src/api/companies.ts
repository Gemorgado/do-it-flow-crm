
import { useQuery } from "@tanstack/react-query";
import { Company } from "@/types/proposal";

// Mock companies for demonstration
const mockCompanies: Company[] = [
  { id: "comp-1", name: "Empresa ABC Ltda", docNumber: "12.345.678/0001-90" },
  { id: "comp-2", name: "Tech Solutions S.A.", docNumber: "98.765.432/0001-21" },
  { id: "comp-3", name: "Consultoria XYZ", docNumber: "45.678.901/0001-23" },
  { id: "comp-4", name: "Indústria Nacional", docNumber: "34.567.890/0001-45" },
  { id: "comp-5", name: "Comércio Global Ltda", docNumber: "56.789.012/0001-67" },
];

// API to search companies
const searchCompanies = async (query: string): Promise<Company[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter companies based on query
  if (!query) return mockCompanies;
  
  const lowercaseQuery = query.toLowerCase();
  return mockCompanies.filter(
    company => company.name.toLowerCase().includes(lowercaseQuery) || 
               company.docNumber?.toLowerCase().includes(lowercaseQuery)
  );
};

export const useCompanies = (query: string = "") => {
  return useQuery({
    queryKey: ['companies', query],
    queryFn: () => searchCompanies(query),
    staleTime: 60000, // 1 minute
    // Ensure we always return an array, never undefined or null
    select: (data) => data || [],
    initialData: [],
  });
};

// New company search hook as specified
export const useCompanySearch = (q: string) => {
  return useQuery({
    queryKey: ['company-search', q],
    queryFn: async () => {
      // In a real app, this would call an API
      // For now, we'll reuse our existing mock search function
      return searchCompanies(q);
    },
    enabled: q.length > 1,
    // Default to empty array when no results
    select: (data) => data || [],
    initialData: [],
  });
};
