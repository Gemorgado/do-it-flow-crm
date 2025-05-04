
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead, Client, ClientService } from '@/types';
import { persistence } from '@/integrations/persistence';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLeadToClientConversion = () => {
  const convertLeadToClient = useCallback(
    async (lead: Lead, service: ClientService): Promise<Client | null> => {
      try {
        // 1. Create new client from lead data
        const newClient: Client = {
          id: uuidv4(),
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone || '',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedTo: lead.assignedTo,
          isActive: true,
          services: [service],
          convertedFromLeadId: lead.id,
          notes: lead.notes || '',
        };

        // 2. Start a transaction
        // First, insert the client
        const clientResult = await persistence.createClient(newClient);
        
        // 3. Update the lead status to 'converted' and remove from pipeline
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
      }
    },
    []
  );

  return {
    convertLeadToClient
  };
};
