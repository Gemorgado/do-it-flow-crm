
// Helper functions to map between frontend and backend formats
import { Client, ClientService, ServiceType, ServiceStatus, BillingCycle } from "@/types";
import { 
  PT_BR_TO_CLIENT_STATUS, CLIENT_STATUS_TO_PT_BR,
  PT_BR_TO_SERVICE_STATUS, SERVICE_STATUS_TO_PT_BR,
  PT_BR_TO_BILLING_CYCLE, BILLING_CYCLE_TO_PT_BR
} from "@/types/client";
import { 
  PT_BR_TO_SERVICE_TYPE, 
  SERVICE_TYPE_TO_PT_BR 
} from "@/types/service";
import { supabase } from '../supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Helper function to map client status
const mapClientStatus = (status: string): string => {
  if (status in PT_BR_TO_CLIENT_STATUS) {
    return PT_BR_TO_CLIENT_STATUS[status];
  } else if (status in CLIENT_STATUS_TO_PT_BR) {
    return status;
  }
  return status;
};

// Helper function to map service type
const mapServiceType = (type: string): string => {
  if (type in PT_BR_TO_SERVICE_TYPE) {
    return PT_BR_TO_SERVICE_TYPE[type as keyof typeof PT_BR_TO_SERVICE_TYPE];
  } else if (type in SERVICE_TYPE_TO_PT_BR) {
    return type;
  }
  return type;
};

// Helper function to map billing cycle
const mapBillingCycle = (cycle: string): string => {
  if (cycle in PT_BR_TO_BILLING_CYCLE) {
    return PT_BR_TO_BILLING_CYCLE[cycle as keyof typeof PT_BR_TO_BILLING_CYCLE];
  } else if (cycle in BILLING_CYCLE_TO_PT_BR) {
    return cycle;
  }
  return cycle;
};

// Helper function to map service status
const mapServiceStatus = (status: string): string => {
  if (status in PT_BR_TO_SERVICE_STATUS) {
    return PT_BR_TO_SERVICE_STATUS[status as keyof typeof PT_BR_TO_SERVICE_STATUS];
  } else if (status in SERVICE_STATUS_TO_PT_BR) {
    return status;
  }
  return status;
};

// Helper function to convert DB service to frontend service format
const convertDbServiceToClient = (service: any): ClientService => {
  return {
    id: service.id,
    clientId: service.client_id,
    type: mapServiceType(service.type) as ServiceType,
    description: service.description,
    locationId: service.location_id || '',
    contractStart: service.contract_start,
    contractEnd: service.contract_end,
    value: service.value,
    billingCycle: mapBillingCycle(service.billing_cycle) as BillingCycle,
    status: mapServiceStatus(service.status) as ServiceStatus,
    createdAt: service.created_at,
    updatedAt: service.updated_at
  };
};

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
        type: mapServiceType(service.type) as ServiceType,
        description: service.description,
        locationId: service.location_id,
        contractStart: service.contract_start,
        contractEnd: service.contract_end,
        value: service.value,
        billingCycle: mapBillingCycle(service.billing_cycle) as "mensal" | "anual",
        status: mapClientStatus(service.status) as "ativo" | "em_renovacao" | "cancelado",
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
      status: mapClientStatus(client.status) as "ativo" | "inativo" | "inadimplente" | "cancelado",
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      notes: client.notes || '',
      assignedTo: client.assigned_to || '',
      isActive: client.is_active,
      services: servicesByClient[client.id] || [],
      plan: client.plan ? mapServiceType(client.plan) as ServiceType : undefined,
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
      status: mapClientStatus(client.status) as any,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      notes: client.notes || '',
      assignedTo: client.assigned_to || '',
      isActive: client.is_active,
      services: services.map(convertDbServiceToClient),
      plan: client.plan ? mapServiceType(client.plan) as ServiceType : undefined,
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
        status: mapClientStatus(client.status),
        notes: client.notes,
        assigned_to: client.assignedTo,
        is_active: client.isActive !== false,
        plan: client.plan ? mapServiceType(client.plan) : null,
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
      for (const service of client.services) {
        const { error: serviceError } = await supabase
          .from('client_services')
          .insert({
            id: service.id || uuidv4(),
            client_id: clientId,
            type: mapServiceType(service.type),
            description: service.description,
            location_id: service.locationId,
            contract_start: service.contractStart,
            contract_end: service.contractEnd,
            value: service.value,
            billing_cycle: mapBillingCycle(service.billingCycle),
            status: mapServiceStatus(service.status)
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
        status: mapClientStatus(client.status),
        notes: client.notes,
        assigned_to: client.assignedTo,
        is_active: client.isActive,
        plan: client.plan ? mapServiceType(client.plan) : null,
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
      for (const service of client.services) {
        const { error: serviceError } = await supabase
          .from('client_services')
          .insert({
            id: service.id || uuidv4(),
            client_id: client.id,
            type: mapServiceType(service.type),
            description: service.description,
            location_id: service.locationId,
            contract_start: service.contractStart,
            contract_end: service.contractEnd,
            value: service.value,
            billing_cycle: mapBillingCycle(service.billingCycle),
            status: mapServiceStatus(service.status)
          });

        if (serviceError) {
          console.error('Error creating client service:', serviceError);
          throw serviceError;
        }
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
