
import type { ContractApi } from './types';

/**
 * Normalizes different status strings from the Conexa API to our union type
 */
export function normalizeStatus(raw: string): 'active' | 'closed' {
  const s = raw.toLowerCase();
  if (['ativo', 'active', 'vigente'].includes(s)) return 'active';
  return 'closed'; // any other status falls into 'closed'
}

/**
 * Maps contract data from API to our ContractApi type
 */
export function mapContracts(raw: any[]): ContractApi[] {
  return raw.map(c => ({
    ...c,
    status: normalizeStatus(c.status),
  }));
}
