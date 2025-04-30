
import { useToast } from '@/hooks/use-toast';
import { useApplySnapshot } from '@/hooks/useConexaSnapshot';
import type { ProcessImportParams, ImportResults } from './types';
import type { ConexaSnapshot, CustomerApi, ContractApi, ServiceApi, RoomOccupationApi } from '@/integrations/conexa/types';

export async function processImportData({ mapping, rows }: ProcessImportParams): Promise<ImportResults> {
  console.log('Processing import data with mapping:', mapping);
  
  // Prepare the snapshot structure
  const snapshot: ConexaSnapshot = {
    customers: [],
    contracts: [],
    services: [],
    roomOccupations: [],
    syncedAt: new Date().toISOString()
  };
  
  // Error rows tracking
  const errorRows: ImportResults['errorRows'] = [];
  
  // Process each row
  rows.forEach((row, index) => {
    try {
      // Extract customer data
      if (mapping.name && mapping.docNumber) {
        const customerName = row[mapping.name];
        const docNumber = row[mapping.docNumber];
        
        if (!customerName || !docNumber) {
          throw new Error('Nome ou documento em branco');
        }
        
        // Check if customer already exists in our processed data
        const existingCustomer = snapshot.customers.find(c => c.docNumber === docNumber);
        
        if (!existingCustomer) {
          // Create new customer
          const customer: CustomerApi = {
            id: `cust_${docNumber.replace(/\D/g, '')}`,
            name: customerName,
            docNumber: docNumber,
            email: mapping.email ? row[mapping.email] : undefined,
            phone: mapping.phone ? row[mapping.phone] : undefined,
            updatedAt: new Date().toISOString()
          };
          
          snapshot.customers.push(customer);
        }
        
        // Get customer id (either existing or new)
        const customerId = existingCustomer ? existingCustomer.id : `cust_${docNumber.replace(/\D/g, '')}`;
        
        // Process service if service type is mapped
        if (mapping.serviceType) {
          const serviceType = row[mapping.serviceType];
          if (serviceType) {
            // Generate a deterministic ID for the service based on its name
            const serviceId = `svc_${serviceType.toLowerCase().replace(/\s+/g, '_')}`;
            
            // Check if service already exists
            const existingService = snapshot.services.find(s => s.id === serviceId);
            
            if (!existingService) {
              // Create new service
              const service: ServiceApi = {
                id: serviceId,
                label: serviceType,
                category: 'imported',
                price: 0, // Default price, can be updated later
                updatedAt: new Date().toISOString()
              };
              
              snapshot.services.push(service);
            }
            
            // Create contract
            const contract: ContractApi = {
              id: `contract_${customerId}_${serviceId}_${index}`,
              customerId,
              serviceId,
              status: mapping.status && row[mapping.status]?.toLowerCase() === 'inativo' ? 'closed' : 'active',
              amount: 0, // Default amount
              startDate: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString()
            };
            
            snapshot.contracts.push(contract);
            
            // Process room occupation if room number is mapped
            if (mapping.roomNumber) {
              const roomNumber = row[mapping.roomNumber];
              if (roomNumber) {
                const roomOccupation: RoomOccupationApi = {
                  roomId: roomNumber,
                  contractId: contract.id,
                  date: new Date().toISOString().split('T')[0]
                };
                
                snapshot.roomOccupations.push(roomOccupation);
              }
            }
          }
        }
      } else {
        throw new Error('Mapeamento não inclui nome ou documento');
      }
    } catch (error) {
      console.error(`Error processing row ${index}:`, error);
      errorRows.push({
        index,
        row,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  });
  
  // Create the results object
  const results: ImportResults = {
    headers: rows.length > 0 ? Object.keys(rows[0]) : [],
    rows,
    processedCount: {
      customers: snapshot.customers.length,
      contracts: snapshot.contracts.length, 
      services: snapshot.services.length,
      roomOccupations: snapshot.roomOccupations.length
    },
    errorRows
  };
  
  // Apply the snapshot
  try {
    await persistSnapshot(snapshot);
  } catch (error) {
    console.error('Error persisting snapshot:', error);
    throw new Error('Falha ao salvar os dados processados.');
  }
  
  return results;
}

async function persistSnapshot(snapshot: ConexaSnapshot): Promise<void> {
  // We'll use the existing processConexaSnapshot function
  const { processConexaSnapshot } = await import('@/integrations/conexa/processConexaSnapshot');
  await processConexaSnapshot(snapshot);
}
