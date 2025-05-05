
import { ConvertLeadToClientUseCase } from '../ConvertLeadToClient';
import { RepositoryFactory } from '../../infra/factory/RepositoryFactory';

export class UseCaseFactory {
  static getConvertLeadToClientUseCase(): ConvertLeadToClientUseCase {
    const leadRepository = RepositoryFactory.getLeadRepository();
    const clientRepository = RepositoryFactory.getClientRepository();
    const allocationRepository = RepositoryFactory.getAllocationRepository();
    
    return new ConvertLeadToClientUseCase(
      leadRepository,
      clientRepository,
      allocationRepository
    );
  }
}
