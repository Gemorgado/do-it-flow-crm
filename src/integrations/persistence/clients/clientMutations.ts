
import { Client } from "@/types";
import { supabase } from '../../supabase/client';
import { mapClientToDb, mapServiceToDb } from './clientMappers';
import { v4 as uuidv4 } from 'uuid';

export const createClient = async (client: Client): Promise<Client> => {
  const clientId = client.id || uuidv4();
  
  // Prepare the client data for insertion
  const clientToInsert = {
    id: clientId,
    ...mapClientToDb(client)
  };

  // Insert the client
  const { error: clientError } = await supabase
    .from('clients')
    .insert(clientToInsert);

  if (clientError) {
    console.error('Error creating client:', clientError);
    throw clientError;
  }

  // Insert the client services
  if (client.services?.length) {
    for (const service of client.services) {
      const serviceToInsert = {
        id: service.id || uuidv4(),
        client_id: clientId,
        ...mapServiceToDb({...service, clientId})
      };
      
      // Remove duplicate fields
      delete serviceToInsert.client_id;
      
      const { error: serviceError } = await supabase
        .from('client_services')
        .insert({
          id: service.id || uuidv4(),
          client_id: clientId,
          type: service.type,
          description: service.description,
          location_id: service.locationId,
          contract_start: service.contractStart,
          contract_end: service.contractEnd,
          value: service.value,
          billing_cycle: service.billingCycle,
          status: service.status
        });

      if (serviceError) {
        console.error('Error creating client service:', serviceError);
        throw serviceError;
      }
    }
  }

  return {
    ...client,
    id: clientId
  };
};

export const updateClient = async (client: Client): Promise<Client> => {
  // Update the client
  const { error: clientError } = await supabase
    .from('clients')
    .update({
      ...mapClientToDb(client),
      updated_at: new Date().toISOString()
    })
    .eq('id', client.id);

  if (clientError) {
    console.error('Error updating client:', clientError);
    throw clientError;
  }

  // For simplicity, handle services by deleting and recreating
  if (client.services?.length) {
    // Delete existing services
    const { error: deleteError } = await supabase
      .from('client_services')
      .delete()
      .eq('client_id', client.id);

    if (deleteError) {
      console.error('Error deleting client services:', deleteError);
      throw deleteError;
    }

    // Insert new services
    for (const service of client.services) {
      const { error: serviceError } = await supabase
        .from('client_services')
        .insert({
          id: service.id || uuidv4(),
          client_id: client.id,
          type: service.type,
          description: service.description,
          location_id: service.locationId,
          contract_start: service.contractStart,
          contract_end: service.contractEnd,
          value: service.value,
          billing_cycle: service.billingCycle,
          status: service.status
        });

      if (serviceError) {
        console.error('Error creating client service:', serviceError);
        throw serviceError;
      }
    }
  }

  return client;
};

export const deleteClient = async (id: string): Promise<void> => {
  // Delete the client (will cascade delete services)
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
