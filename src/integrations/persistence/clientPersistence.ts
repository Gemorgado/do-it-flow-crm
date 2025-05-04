
import { supabase } from '../supabase/client';
import { Client, ClientService } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const clientPersistence = {
  listClients: async (): Promise<Client[]> => {
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
    const servicesByClient: Record<string, ClientService[]> = {};
    servicesData.forEach((service: any) => {
      if (!servicesByClient[service.client_id]) {
        servicesByClient[service.client_id] = [];
      }
      servicesByClient[service.client_id].push({
        id: service.id,
        clientId: service.client_id,
        type: service.type,
        description: service.description,
        locationId: service.location_id,
        contractStart: service.contract_start,
        contractEnd: service.contract_end,
        value: service.value,
        billingCycle: service.billing_cycle,
        status: service.status,
        createdAt: service.created_at,
        updatedAt: service.updated_at
      });
    });

    // Map clients with their services
    return clientsData.map((client: any) => ({
      id: client.id,
      name: client.name,
      company: client.company || '',
      email: client.email,
      phone: client.phone || '',
      address: client.address || '',
      status: client.status,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      notes: client.notes || '',
      assignedTo: client.assigned_to || '',
      isActive: client.is_active,
      services: servicesByClient[client.id] || [],
      convertedFromLeadId: client.converted_from_lead_id,
      plan: client.plan,
      contractStart: client.contract_start,
      contractEnd: client.contract_end,
      contractTerm: client.contract_term,
      contractValue: client.contract_value,
      dueDay: client.due_day,
      privateRoom: client.private_room,
      lastReadjustDate: client.last_readjust_date,
      readjustIndex: client.readjust_index,
      billingEmails: client.billing_emails || []
    }));
  },

  getClient: async (id: string): Promise<Client | undefined> => {
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

    return {
      id: client.id,
      name: client.name,
      company: client.company || '',
      email: client.email,
      phone: client.phone || '',
      address: client.address || '',
      status: client.status,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      notes: client.notes || '',
      assignedTo: client.assigned_to || '',
      isActive: client.is_active,
      services: services.map((service: any) => ({
        id: service.id,
        clientId: service.client_id,
        type: service.type,
        description: service.description,
        locationId: service.location_id,
        contractStart: service.contract_start,
        contractEnd: service.contract_end,
        value: service.value,
        billingCycle: service.billing_cycle,
        status: service.status,
        createdAt: service.created_at,
        updatedAt: service.updated_at
      })),
      convertedFromLeadId: client.converted_from_lead_id,
      plan: client.plan,
      contractStart: client.contract_start,
      contractEnd: client.contract_end,
      contractTerm: client.contract_term,
      contractValue: client.contract_value,
      dueDay: client.due_day,
      privateRoom: client.private_room,
      lastReadjustDate: client.last_readjust_date,
      readjustIndex: client.readjust_index,
      billingEmails: client.billing_emails || []
    };
  },

  createClient: async (client: Client): Promise<Client> => {
    const clientId = client.id || uuidv4();

    // Insert the client
    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        id: clientId,
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
        status: client.status || 'active',
        notes: client.notes,
        assigned_to: client.assignedTo,
        is_active: client.isActive !== false,
        converted_from_lead_id: client.convertedFromLeadId,
        plan: client.plan,
        contract_start: client.contractStart,
        contract_end: client.contractEnd,
        contract_term: client.contractTerm,
        contract_value: client.contractValue,
        due_day: client.dueDay,
        private_room: client.privateRoom,
        last_readjust_date: client.lastReadjustDate,
        readjust_index: client.readjustIndex,
        billing_emails: client.billingEmails
      });

    if (clientError) {
      console.error('Error creating client:', clientError);
      throw clientError;
    }

    // Insert the client services
    if (client.services?.length) {
      const servicesToInsert = client.services.map(service => ({
        id: service.id || uuidv4(),
        client_id: clientId,
        type: service.type,
        description: service.description,
        location_id: service.locationId,
        contract_start: service.contractStart,
        contract_end: service.contractEnd,
        value: service.value,
        billing_cycle: service.billingCycle || 'monthly',
        status: service.status || 'active'
      }));

      const { error: servicesError } = await supabase
        .from('client_services')
        .insert(servicesToInsert);

      if (servicesError) {
        console.error('Error creating client services:', servicesError);
        throw servicesError;
      }
    }

    return {
      ...client,
      id: clientId
    };
  },

  updateClient: async (client: Client): Promise<Client> => {
    // Update the client
    const { error: clientError } = await supabase
      .from('clients')
      .update({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
        status: client.status,
        notes: client.notes,
        assigned_to: client.assignedTo,
        is_active: client.isActive,
        plan: client.plan,
        contract_start: client.contractStart,
        contract_end: client.contractEnd,
        contract_term: client.contractTerm,
        contract_value: client.contractValue,
        due_day: client.dueDay,
        private_room: client.privateRoom,
        last_readjust_date: client.lastReadjustDate,
        readjust_index: client.readjustIndex,
        billing_emails: client.billingEmails,
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
      const servicesToInsert = client.services.map(service => ({
        id: service.id || uuidv4(),
        client_id: client.id,
        type: service.type,
        description: service.description,
        location_id: service.locationId,
        contract_start: service.contractStart,
        contract_end: service.contractEnd,
        value: service.value,
        billing_cycle: service.billingCycle || 'monthly',
        status: service.status || 'active'
      }));

      const { error: servicesError } = await supabase
        .from('client_services')
        .insert(servicesToInsert);

      if (servicesError) {
        console.error('Error creating client services:', servicesError);
        throw servicesError;
      }
    }

    return client;
  },

  deleteClient: async (id: string): Promise<void> => {
    // Delete the client (will cascade delete services)
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};
