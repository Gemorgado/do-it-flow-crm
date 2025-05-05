
import { LeadRepository } from '../../domain/repositories/LeadRepository';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { AllocationRepository } from '../../domain/repositories/AllocationRepository';
import { SpaceRepository } from '../../domain/repositories/SpaceRepository';

import { SupabaseLeadRepository } from '../repositories/SupabaseLeadRepository';
import { SupabaseClientRepository } from '../repositories/SupabaseClientRepository';
import { SupabaseAllocationRepository } from '../repositories/SupabaseAllocationRepository';

export class RepositoryFactory {
  private static leadRepository: LeadRepository;
  private static clientRepository: ClientRepository;
  private static allocationRepository: AllocationRepository;
  
  static getLeadRepository(): LeadRepository {
    if (!this.leadRepository) {
      this.leadRepository = new SupabaseLeadRepository();
    }
    return this.leadRepository;
  }
  
  static getClientRepository(): ClientRepository {
    if (!this.clientRepository) {
      this.clientRepository = new SupabaseClientRepository();
    }
    return this.clientRepository;
  }
  
  static getAllocationRepository(): AllocationRepository {
    if (!this.allocationRepository) {
      this.allocationRepository = new SupabaseAllocationRepository();
    }
    return this.allocationRepository;
  }
}
