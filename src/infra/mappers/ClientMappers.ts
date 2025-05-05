
import { Client, NewClient, ClientService, ClientStatus, ServiceType, BillingCycle, ServiceStatus } from '../../domain/models/Client';

export const toDbClient = (client: NewClient) => {
  return {
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
    billing_emails: client.billingEmails,
    created_by: client.createdBy,
    last_readjust_date: client.lastReadjustDate,
    readjust_index: client.readjustIndex
  };
};

export const toDomainClient = (dbClient: any): Client => {
  return {
    id: dbClient.id,
    name: dbClient.name,
    company: dbClient.company || '',
    email: dbClient.email,
    phone: dbClient.phone || '',
    address: dbClient.address,
    status: dbClient.status as ClientStatus,
    createdAt: dbClient.created_at,
    updatedAt: dbClient.updated_at,
    notes: dbClient.notes,
    assignedTo: dbClient.assigned_to,
    isActive: dbClient.is_active,
    services: dbClient.services ? dbClient.services.map(toDomainClientService) : [],
    plan: dbClient.plan as ServiceType,
    contractStart: dbClient.contract_start,
    contractEnd: dbClient.contract_end,
    contractTerm: dbClient.contract_term,
    contractValue: dbClient.contract_value,
    dueDay: dbClient.due_day,
    privateRoom: dbClient.private_room,
    billingEmails: dbClient.billing_emails,
    createdBy: dbClient.created_by,
    lastReadjustDate: dbClient.last_readjust_date,
    readjustIndex: dbClient.readjust_index
  };
};

export const toDbClientService = (service: any) => {
  return {
    client_id: service.clientId,
    type: service.type,
    description: service.description,
    location_id: service.locationId,
    contract_start: service.contractStart,
    contract_end: service.contractEnd,
    value: service.value,
    billing_cycle: service.billingCycle,
    status: service.status
  };
};

export const toDomainClientService = (dbService: any): ClientService => {
  return {
    id: dbService.id,
    clientId: dbService.client_id,
    type: dbService.type as ServiceType,
    description: dbService.description,
    locationId: dbService.location_id,
    contractStart: dbService.contract_start,
    contractEnd: dbService.contract_end,
    value: dbService.value,
    billingCycle: dbService.billing_cycle as BillingCycle,
    status: dbService.status as ServiceStatus,
    createdAt: dbService.created_at,
    updatedAt: dbService.updated_at
  };
};
