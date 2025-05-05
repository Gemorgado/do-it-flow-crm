
import { create } from 'zustand';
import { Lead } from '../../domain/models/Lead';
import { ServiceType } from '../../domain/models/Client';

interface LeadConversionState {
  isOpen: boolean;
  selectedLead: Lead | null;
  selectedServiceType: ServiceType | '';
  contractValue: string;
  setIsOpen: (open: boolean) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setSelectedServiceType: (type: ServiceType | '') => void;
  setContractValue: (value: string) => void;
  reset: () => void;
}

export const useLeadConversionStore = create<LeadConversionState>((set) => ({
  isOpen: false,
  selectedLead: null,
  selectedServiceType: '',
  contractValue: '',
  
  setIsOpen: (open) => set({ isOpen: open }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setSelectedServiceType: (type) => set({ selectedServiceType: type }),
  setContractValue: (value) => set({ contractValue: value }),
  
  reset: () => set({
    isOpen: false,
    selectedLead: null,
    selectedServiceType: '',
    contractValue: ''
  })
}));
