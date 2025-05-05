
/**
 * Utility functions to map between database enums and TypeScript enums
 */
import { 
  ServiceType, 
  PT_BR_TO_SERVICE_TYPE,
  SERVICE_VALUES,
  ProposalStatus,
  PT_BR_TO_PROPOSAL_STATUS,
  PROPOSAL_STATUS_VALUES,
  ClientStatus,
  CLIENT_STATUS_VALUES,
  PT_BR_TO_CLIENT_STATUS,
  BillingCycle,
  BILLING_CYCLE_VALUES,
  PT_BR_TO_BILLING_CYCLE,
  ServiceStatus,
  SERVICE_STATUS_VALUES,
  PT_BR_TO_SERVICE_STATUS
} from '@/types';

/**
 * Converts any string to a valid ServiceType
 * Handles both legacy Portuguese keys and English keys
 */
export function toServiceType(value: string | null | undefined): ServiceType {
  if (!value) return 'private_office'; // Default value
  
  // If it's already a valid English enum value, return it
  if (SERVICE_VALUES.includes(value as ServiceType)) {
    return value as ServiceType;
  }
  
  // If it's a Portuguese key, convert it
  const mappedValue = PT_BR_TO_SERVICE_TYPE[value];
  if (mappedValue) {
    return mappedValue;
  }
  
  // Fallback to default
  console.warn(`Invalid service type: ${value}, falling back to private_office`);
  return 'private_office';
}

/**
 * Converts any string to a valid ProposalStatus
 * Handles both legacy Portuguese keys and English keys
 */
export function toProposalStatus(value: string | null | undefined): ProposalStatus {
  if (!value) return 'draft'; // Default value
  
  // If it's already a valid English enum value, return it
  if (PROPOSAL_STATUS_VALUES.includes(value as ProposalStatus)) {
    return value as ProposalStatus;
  }
  
  // If it's a Portuguese key, convert it
  const mappedValue = PT_BR_TO_PROPOSAL_STATUS[value];
  if (mappedValue) {
    return mappedValue;
  }
  
  // Fallback to default
  console.warn(`Invalid proposal status: ${value}, falling back to draft`);
  return 'draft';
}

/**
 * Converts any string to a valid ClientStatus
 * Handles both legacy Portuguese keys and English keys
 */
export function toClientStatus(value: string | null | undefined): ClientStatus {
  if (!value) return 'active'; // Default value
  
  // If it's already a valid English enum value, return it
  if (CLIENT_STATUS_VALUES.includes(value as ClientStatus)) {
    return value as ClientStatus;
  }
  
  // If it's a Portuguese key, convert it
  const mappedValue = PT_BR_TO_CLIENT_STATUS[value];
  if (mappedValue) {
    return mappedValue;
  }
  
  // Fallback to default
  console.warn(`Invalid client status: ${value}, falling back to active`);
  return 'active';
}

/**
 * Converts any string to a valid BillingCycle
 * Handles both legacy Portuguese keys and English keys
 */
export function toBillingCycle(value: string | null | undefined): BillingCycle {
  if (!value) return 'monthly'; // Default value
  
  // If it's already a valid English enum value, return it
  if (BILLING_CYCLE_VALUES.includes(value as BillingCycle)) {
    return value as BillingCycle;
  }
  
  // If it's a Portuguese key, convert it
  const mappedValue = PT_BR_TO_BILLING_CYCLE[value];
  if (mappedValue) {
    return mappedValue;
  }
  
  // Fallback to default
  console.warn(`Invalid billing cycle: ${value}, falling back to monthly`);
  return 'monthly';
}

/**
 * Converts any string to a valid ServiceStatus
 * Handles both legacy Portuguese keys and English keys
 */
export function toServiceStatus(value: string | null | undefined): ServiceStatus {
  if (!value) return 'active'; // Default value
  
  // If it's already a valid English enum value, return it
  if (SERVICE_STATUS_VALUES.includes(value as ServiceStatus)) {
    return value as ServiceStatus;
  }
  
  // If it's a Portuguese key, convert it
  const mappedValue = PT_BR_TO_SERVICE_STATUS[value];
  if (mappedValue) {
    return mappedValue;
  }
  
  // Fallback to default
  console.warn(`Invalid service status: ${value}, falling back to active`);
  return 'active';
}

/**
 * Additional enum mappers for other entity types
 */
export function toLeadStatus(value: string | null | undefined): string {
  if (!value) return 'novo';
  return value;
}

export function toLeadSource(value: string | null | undefined): string {
  if (!value) return 'site_organico';
  return value;
}
