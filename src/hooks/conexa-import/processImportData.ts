
import { processConexaSnapshot } from '@/integrations/conexa/processConexaSnapshot';
import { mapContracts } from '@/integrations/conexa/mapper';
import type { ColumnMapping } from '../useConexaMapper';
import type { CustomerApi, ServiceApi, ContractApi, RoomOccupationApi, ConexaSnapshot } from '@/integrations/conexa/types';
import type { ProcessImportParams, ImportResults } from './types';

export async function processImportData({ mapping, rows }: ProcessImportParams): Promise<ImportResults> {
  // Process rows
  const customers: Record<string, CustomerApi> = {};
  const services: Record<string, ServiceApi> = {};
  const contracts: ContractApi[] = [];
  const roomOccupations: RoomOccupationApi[] = [];
  const errorRows: Array<{
    index: number;
    row: Record<string, any>;
    error: string;
  }> = [];

  try {
    rows.forEach((row, index) => {
      try {
        // Skip empty rows
        if (!row[mapping.name!] || !row[mapping.docNumber!]) {
          return;
        }

        // Process customer
        const docNumber = String(row[mapping.docNumber!]).replace(/\D/g, '');
        if (!customers[docNumber]) {
          customers[docNumber] = {
            id: `cust-${docNumber}`,
            name: String(row[mapping.name!]),
            docNumber,
            email: mapping.email ? String(row[mapping.email]) : undefined,
            phone: mapping.phone ? String(row[mapping.phone]) : undefined,
            updatedAt: new Date().toISOString()
          };
        }

        // Process service
        const serviceType = String(row[mapping.serviceType!]);
        const serviceId = `serv-${serviceType.toLowerCase().replace(/\s+/g, '-')}`;
        if (!services[serviceId]) {
          services[serviceId] = {
            id: serviceId,
            label: serviceType,
            category: serviceType,
            price: 0, // Default price, can be updated later
            updatedAt: new Date().toISOString()
          };
        }

        // Process contract
        const contractId = `contract-${docNumber}-${serviceId}`;
        const status = mapping.status ? String(row[mapping.status]).toLowerCase() : 'active';
        
        contracts.push({
          id: contractId,
          customerId: customers[docNumber].id,
          serviceId: serviceId,
          status: status.includes('ativ') || status.includes('active') ? 'active' : 'closed',
          amount: 0, // Default amount, can be updated later
          startDate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Process room occupation if available
        if (mapping.roomNumber && row[mapping.roomNumber]) {
          const roomNumber = String(row[mapping.roomNumber]);
          if (roomNumber) {
            roomOccupations.push({
              roomId: `room-${roomNumber}`,
              contractId: contractId,
              date: new Date().toISOString().split('T')[0]
            });
          }
        }
      } catch (error) {
        console.error(`Error processing row ${index}:`, error);
        errorRows.push({
          index,
          row,
          error: String(error)
        });
      }
    });

    // Create snapshot
    const snapshot: ConexaSnapshot = {
      customers: Object.values(customers),
      contracts: mapContracts(contracts),
      services: Object.values(services),
      roomOccupations,
      syncedAt: new Date().toISOString()
    };

    // Process snapshot
    await processConexaSnapshot(snapshot);

    return {
      headers: [], // Will be filled by caller
      rows: [], // Will be filled by caller
      processedCount: {
        customers: Object.keys(customers).length,
        contracts: contracts.length,
        services: Object.keys(services).length,
        roomOccupations: roomOccupations.length
      },
      errorRows
    };
  } catch (error) {
    console.error('Error processing import:', error);
    throw error;
  }
}
