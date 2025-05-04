
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead, Client, ServiceType, ClientService, BillingCycle, ClientStatus, ServiceStatus } from '@/types';
import { persistence } from '@/integrations/persistence';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLeadToClientConversion = () => {
  const [isConverting, setIsConverting] = useState(false);

  const convertLeadToClient = useCallback(
    async (lead: Lead, serviceType?: ServiceType, contractValue?: number): Promise<Client | null> => {
      try {
        setIsConverting(true);
        
        // 1. Create new client from lead data
        const newClient: Client = {
          id: uuidv4(),
          name: lead.name,
          company: lead.company || '',
          email: lead.email,
          phone: lead.phone || '',
          status: 'active' as ClientStatus, // Using the correct "active" value from enum
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedTo: lead.assignedTo,
          isActive: true,
          services: [],
          notes: lead.notes || '',
        };

        // 2. Start a transaction
        // First, insert the client
        const clientResult = await persistence.createClient(newClient);
        
        // 3. Add the service if provided
        if (serviceType && contractValue) {
          const service: ClientService = {
            id: uuidv4(),
            clientId: clientResult.id,
            type: serviceType,
            description: `${serviceType} - Contrato Anual`,
            locationId: '',
            contractStart: new Date().toISOString(),
            contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            value: contractValue,
            billingCycle: 'monthly' as BillingCycle, // Using the correct "monthly" value
            status: 'active' as ServiceStatus, // Using the correct "active" value
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Update the client with the service
          clientResult.services = [service];
        }
        
        // 4. Update the lead status to 'converted' and remove from pipeline
        await supabase
          .from('leads')
          .update({
            status: 'converted',
            stage_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', lead.id);

        toast.success('Lead successfully converted to client');
        return clientResult;
        
      } catch (error) {
        console.error('Error converting lead to client:', error);
        toast.error('Failed to convert lead to client');
        return null;
      } finally {
        setIsConverting(false);
      }
    },
    []
  );

  return {
    convertLeadToClient,
    isConverting
  };
};
