
import { v4 as uuidv4 } from 'uuid';
import { Lead } from '../domain/models/Lead';
import { Client, NewClient, ClientService } from '../domain/models/Client';
import { ServiceAllocationInput } from '../domain/models/Allocation';
import { LeadRepository } from '../domain/repositories/LeadRepository';
import { ClientRepository } from '../domain/repositories/ClientRepository';
import { AllocationRepository } from '../domain/repositories/AllocationRepository';

export class ConvertLeadToClientUseCase {
  constructor(
    private leadRepository: LeadRepository,
    private clientRepository: ClientRepository,
    private allocationRepository: AllocationRepository,
  ) {}

  async execute(
    leadId: string, 
    serviceInput?: ServiceAllocationInput
  ): Promise<{ client: Client, success: boolean }> {
    try {
      // 1. Fetch the lead
      const lead = await this.leadRepository.get(leadId);
      if (!lead) {
        throw new Error(`Lead with id ${leadId} not found`);
      }
      
      // 2. Create client from lead data
      const newClient: NewClient = {
        id: uuidv4(),
        name: lead.name,
        company: lead.company || '',
        email: lead.email,
        phone: lead.phone || '',
        status: 'active',
        isActive: true,
        services: [],
        notes: lead.notes || '',
        assignedTo: lead.assignedTo,
      };
      
      // 3. Create client and get the created entity
      const client = await this.clientRepository.create(newClient);
      
      // 4. If service information is provided, add a service
      if (serviceInput && serviceInput.serviceType && serviceInput.contractValue) {
        const service: any = {
          id: uuidv4(),
          clientId: client.id,
          type: serviceInput.serviceType,
          description: `${serviceInput.serviceType} - Annual Contract`,
          locationId: serviceInput.spaceId || '',
          contractStart: serviceInput.startDate || new Date().toISOString(),
          contractEnd: serviceInput.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          value: serviceInput.contractValue,
          billingCycle: 'monthly',
          status: 'active'
        };
        
        await this.clientRepository.addService(client.id, service);
        
        // 5. If spaceId is provided, create a space allocation
        if (serviceInput.spaceId) {
          await this.allocationRepository.create({
            clientId: client.id,
            spaceId: serviceInput.spaceId,
            contractId: uuidv4(),
            startDate: serviceInput.startDate || new Date().toISOString(),
            endDate: serviceInput.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            unitPrice: serviceInput.contractValue,
            status: 'active'
          });
        }
      }
      
      // 6. Mark the lead as converted
      await this.leadRepository.markAsConverted(leadId);
      
      // 7. Fetch the updated client with services
      const updatedClient = await this.clientRepository.get(client.id);
      
      return { 
        client: updatedClient!,
        success: true
      };
    } catch (error) {
      console.error('Error converting lead to client:', error);
      throw error;
    }
  }
}
