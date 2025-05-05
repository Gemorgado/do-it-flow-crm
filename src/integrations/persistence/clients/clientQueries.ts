
import { Client } from "@/types";
import { supabase } from '../../supabase/client';
import { convertDbServiceToClient, mapClientFromDb } from './clientMappers';

export const listClients = async (): Promise<Client[]> => {
  // First get all clients
  const { data: clientsData, error: clientsError } = await supabase
    .from('clients')
    .select('*');

  if (clientsError) {
    console.error('Error fetching clients:', clientsError);
    throw clientsError;
  }

  // Then get all services
  const { data: servicesData, error: servicesError } = await supabase
    .from('client_services')
    .select('*');

  if (servicesError) {
    console.error('Error fetching client services:', servicesError);
    throw servicesError;
  }

  // Group services by client ID
  const servicesByClient: Record<string, any[]> = {};
  servicesData.forEach((service: any) => {
    if (!servicesByClient[service.client_id]) {
      servicesByClient[service.client_id] = [];
    }
    servicesByClient[service.client_id].push(convertDbServiceToClient(service));
  });

  // Map clients with their services
  return clientsData.map((client: any) => mapClientFromDb(client, servicesByClient[client.id] || []));
};

export const getClient = async (id: string): Promise<Client | undefined> => {
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select()
    .eq('id', id)
    .single();

  if (clientError) {
    if (clientError.code === 'PGRST116') {
      // Not found
      return undefined;
    }
    console.error('Error fetching client:', clientError);
    throw clientError;
  }

  const { data: services, error: servicesError } = await supabase
    .from('client_services')
    .select()
    .eq('client_id', id);

  if (servicesError) {
    console.error('Error fetching client services:', servicesError);
    throw servicesError;
  }

  return mapClientFromDb(client, services.map(convertDbServiceToClient));
};
