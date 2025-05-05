
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Lead } from '../../domain/models/Lead';
import { Client } from '../../domain/models/Client';
import { ServiceType } from '../../domain/models/Client'; 
import { UseCaseFactory } from '../../usecases/factory/UseCaseFactory';

export const useLeadToClientConversion = () => {
  const [isConverting, setIsConverting] = useState(false);
  const queryClient = useQueryClient();
  
  const convertLeadToClient = useCallback(
    async (lead: Lead, serviceType?: ServiceType, contractValue?: number): Promise<Client | null> => {
      try {
        setIsConverting(true);
        
        const convertUseCase = UseCaseFactory.getConvertLeadToClientUseCase();
        
        // If service type and contract value are provided, include them in conversion
        const serviceInput = serviceType && contractValue
          ? {
              serviceType,
              contractValue,
              startDate: new Date().toISOString(),
              endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            }
          : undefined;
        
        // Execute the use case
        const result = await convertUseCase.execute(lead.id, serviceInput);
        
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        
        // Show success toast
        toast.success('Lead successfully converted to client');
        
        return result.client;
      } catch (error) {
        console.error('Error converting lead to client:', error);
        toast.error('Failed to convert lead to client');
        return null;
      } finally {
        setIsConverting(false);
      }
    },
    [queryClient]
  );

  return {
    convertLeadToClient,
    isConverting
  };
};
