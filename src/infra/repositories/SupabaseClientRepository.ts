
import { supabase } from '../../infra/supabase/client';
import { Client, NewClient, ClientService } from '../../domain/models/Client';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { toDbClient, toDomainClient, toDbClientService, toDomainClientService } from '../mappers/ClientMappers';

export class SupabaseClientRepository implements ClientRepository {
  async list(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*');

    if (error) throw error;
    
    // Get client services for each client
    const clients = await Promise.all(data.map(async (client) => {
      const { data: servicesData } = await supabase
        .from('client_services')
        .select('*')
        .eq('client_id', client.id);
      
      return {
        ...client,
        services: servicesData || []
      };
    }));

    return clients.map(toDomainClient);
  }

  async get(id: string): Promise<Client | null> {
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw error;
    }
    
    // Get client services
    const { data: services } = await supabase
      .from('client_services')
      .select('*')
      .eq('client_id', id);
    
    return toDomainClient({ ...client, services: services || [] });
  }

  async create(client: NewClient): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(toDbClient(client))
      .select()
      .single();

    if (error) throw error;

    const newClient = toDomainClient(data);
    newClient.services = [];

    // If services are provided, create them
    if (client.services && client.services.length > 0) {
      for (const service of client.services) {
        await this.addService(newClient.id, service);
      }
      
      // Fetch the client again to include services
      const updatedClient = await this.get(newClient.id);
      if (updatedClient) return updatedClient;
    }
    
    return newClient;
  }

  async update(client: Client): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...toDbClient(client), updated_at: new Date().toISOString() })
      .eq('id', client.id)
      .select()
      .single();

    if (error) throw error;

    // Fetch services to return complete client
    const { data: services } = await supabase
      .from('client_services')
      .select('*')
      .eq('client_id', client.id);
    
    return toDomainClient({ ...data, services: services || [] });
  }

  async remove(id: string): Promise<void> {
    // First, delete any services associated with the client
    await supabase
      .from('client_services')
      .delete()
      .eq('client_id', id);
    
    // Then delete the client
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async addService(clientId: string, service: any): Promise<ClientService> {
    const serviceData = {
      ...toDbClientService(service),
      client_id: clientId
    };

    const { data, error } = await supabase
      .from('client_services')
      .insert(serviceData)
      .select()
      .single();

    if (error) throw error;
    return toDomainClientService(data);
  }
}
