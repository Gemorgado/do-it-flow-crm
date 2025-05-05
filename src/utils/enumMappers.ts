
/**
 * Utility functions to map between database enums and TypeScript enums
 */
import { 
  ServiceType, 
  PT_BR_TO_SERVICE_TYPE,
  SERVICE_VALUES,
  ProposalStatus,
  PT_BR_TO_PROPOSAL_STATUS,
  PROPOSAL_STATUS_VALUES
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
