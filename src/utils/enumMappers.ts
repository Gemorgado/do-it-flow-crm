
import { LeadSource, LeadStatus } from '@/types/lead';
import { ServiceType, PT_BR_TO_SERVICE_TYPE, SERVICE_VALUES } from '@/types/service';
import { ProposalStatus, PT_BR_TO_PROPOSAL_STATUS, PROPOSAL_STATUS_VALUES } from '@/types/proposal';
import { 
  ClientStatus, 
  SERVICE_STATUS_VALUES, 
  BillingCycle,
  ServiceStatus,
  PT_BR_TO_CLIENT_STATUS,
  PT_BR_TO_BILLING_CYCLE,
  PT_BR_TO_SERVICE_STATUS,
  CLIENT_STATUS_VALUES,
  BILLING_CYCLE_VALUES
} from '@/types/client';

/**
 * Converts any service type value to the correct enum value
 * Handles both English and Portuguese legacy values
 */
export function toServiceType(value: string | undefined | null): ServiceType {
  if (!value) return 'private_office'; // Default value
  
  // If it's already a valid service type, return it
  if (SERVICE_VALUES.includes(value as ServiceType)) {
    return value as ServiceType;
  }
  
  // Check if it's a legacy Portuguese value
  const mapped = PT_BR_TO_SERVICE_TYPE[value];
  if (mapped) {
    return mapped;
  }
  
  // Return default if nothing found
  console.warn(`Unknown service type value: ${value}. Using default.`);
  return 'private_office';
}

/**
 * Converts any proposal status value to the correct enum value
 * Handles both English and Portuguese legacy values
 */
export function toProposalStatus(value: string | undefined | null): ProposalStatus {
  if (!value) return 'draft'; // Default value
  
  // If it's already a valid proposal status, return it
  if (PROPOSAL_STATUS_VALUES.includes(value as ProposalStatus)) {
    return value as ProposalStatus;
  }
  
  // Check if it's a legacy Portuguese value
  const mapped = PT_BR_TO_PROPOSAL_STATUS[value];
  if (mapped) {
    return mapped;
  }
  
  // Return default if nothing found
  console.warn(`Unknown proposal status value: ${value}. Using default.`);
  return 'draft';
}

/**
 * Converts any client status value to the correct enum value
 * Handles both English and Portuguese legacy values
 */
export function toClientStatus(value: string | undefined | null): ClientStatus {
  if (!value) return 'active'; // Default value
  
  // If it's already a valid client status, return it
  if (CLIENT_STATUS_VALUES.includes(value as ClientStatus)) {
    return value as ClientStatus;
  }
  
  // Check if it's a legacy Portuguese value
  const mapped = PT_BR_TO_CLIENT_STATUS[value];
  if (mapped) {
    return mapped;
  }
  
  // Return default if nothing found
  console.warn(`Unknown client status value: ${value}. Using default.`);
  return 'active';
}

/**
 * Converts any billing cycle value to the correct enum value
 * Handles both English and Portuguese legacy values
 */
export function toBillingCycle(value: string | undefined | null): BillingCycle {
  if (!value) return 'monthly'; // Default value
  
  // If it's already a valid billing cycle, return it
  if (BILLING_CYCLE_VALUES.includes(value as BillingCycle)) {
    return value as BillingCycle;
  }
  
  // Check if it's a legacy Portuguese value
  const mapped = PT_BR_TO_BILLING_CYCLE[value];
  if (mapped) {
    return mapped;
  }
  
  // Return default if nothing found
  console.warn(`Unknown billing cycle value: ${value}. Using default.`);
  return 'monthly';
}

/**
 * Converts any service status value to the correct enum value
 * Handles both English and Portuguese legacy values
 */
export function toServiceStatus(value: string | undefined | null): ServiceStatus {
  if (!value) return 'active'; // Default value
  
  // If it's already a valid service status, return it
  if (SERVICE_STATUS_VALUES.includes(value as ServiceStatus)) {
    return value as ServiceStatus;
  }
  
  // Check if it's a legacy Portuguese value
  const mapped = PT_BR_TO_SERVICE_STATUS[value];
  if (mapped) {
    return mapped;
  }
  
  // Return default if nothing found
  console.warn(`Unknown service status value: ${value}. Using default.`);
  return 'active';
}

/**
 * Convert any lead source value to the correct enum value
 */
export function toLeadSource(value: string | undefined | null): LeadSource {
  if (!value) return 'outros'; // Default value
  return value as LeadSource; 
}

/**
 * Convert any lead status value to the correct enum value
 */
export function toLeadStatus(value: string | undefined | null): LeadStatus {
  if (!value) return 'novo'; // Default value
  return value as LeadStatus;
}
