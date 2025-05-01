
import { useState } from "react";

/**
 * Hook to handle client selection functionality
 */
export function useClientSelection(initialClientId: string | null = null) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClientId);
  const [searchQuery, setSearchQuery] = useState("");
  
  return {
    // Client selection
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
  };
}
