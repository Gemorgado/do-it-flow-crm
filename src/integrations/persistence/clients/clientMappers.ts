
import { Client, ClientService, ServiceType, ServiceStatus, BillingCycle } from "@/types";
import { toServiceType, toClientStatus, toBillingCycle, toServiceStatus } from "@/utils/enumMappers";

// Helper function to convert DB service to frontend service format
export const convertDbServiceToClient = (service: any): ClientService => {
  return {
    id: service.id,
    clientId: service.client_id,
    type: toServiceType(service.type),
    description: service.description,
    locationId: service.location_id || '',
    contractStart: service.contract_start,
    contractEnd: service.contract_end,
    value: service.value,
    billingCycle: toBillingCycle(service.billing_cycle),
    status: toServiceStatus(service.status),
    createdAt: service.created_at,
    updatedAt: service.updated_at
  };
};

// Convert database client to domain model
export const mapClientFromDb = (client: any, services: ClientService[] = []): Client => {
  return {
    id: client.id,
    name: client.name,
    company: client.company || '',
    email: client.email,
    phone: client.phone || '',
    address: client.address || '',
    status: toClientStatus(client.status),
    createdAt: client.created_at,
    updatedAt: client.updated_at,
    notes: client.notes || '',
    assignedTo: client.assigned_to || '',
    isActive: client.is_active,
    services: services,
    plan: client.plan ? toServiceType(client.plan) : undefined,
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
};

// Convert domain client to database format
export const mapClientToDb = (client: Client) => {
  return {
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone,
    address: client.address,
    status: client.status,
    notes: client.notes,
    assigned_to: client.assignedTo,
    is_active: client.isActive !== false,
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
  };
};

// Convert domain service to database format
export const mapServiceToDb = (service: ClientService) => {
  return {
    id: service.id,
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
