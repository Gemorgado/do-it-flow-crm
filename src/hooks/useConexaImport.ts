
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { processConexaSnapshot } from '@/integrations/conexa/processConexaSnapshot';
import { mapContracts } from '@/integrations/conexa/mapper';
import type { ConexaSnapshot, CustomerApi, ContractApi, ServiceApi, RoomOccupationApi } from '@/integrations/conexa/types';
import type { ColumnMapping } from './useConexaMapper';

type ImportStatus = 'idle' | 'reading' | 'mapping' | 'processing' | 'success' | 'error';

interface ImportResults {
  headers: string[];
  rows: Record<string, any>[];
  processedCount: {
    customers: number;
    contracts: number;
    services: number;
    roomOccupations: number;
  };
  errorRows: Array<{
    index: number;
    row: Record<string, any>;
    error: string;
  }>;
}

export function useConexaImport() {
  const { toast } = useToast();
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ImportResults>({
    headers: [],
    rows: [],
    processedCount: {
      customers: 0,
      contracts: 0,
      services: 0,
      roomOccupations: 0
    },
    errorRows: []
  });

  const readFile = async (file: File): Promise<void> => {
    setStatus('reading');
    setFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
      
      // Extract headers from the first row
      const headers = Object.keys(rows[0] || {});
      
      setResults({
        ...results,
        headers,
        rows
      });
      
      setStatus('mapping');
    } catch (error) {
      console.error('Error reading Excel file:', error);
      toast({
        title: 'Erro ao ler arquivo',
        description: 'O arquivo não pôde ser processado. Verifique se é um arquivo Excel válido.',
        variant: 'destructive',
      });
      setStatus('error');
    }
  };

  const processImport = async (mapping: ColumnMapping): Promise<void> => {
    setStatus('processing');
    
    // Check required fields
    const requiredFields: Array<keyof ColumnMapping> = ['name', 'docNumber', 'serviceType'];
    const missingFields = requiredFields.filter(field => !mapping[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Campos obrigatórios não mapeados',
        description: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`,
        variant: 'destructive',
      });
      setStatus('mapping');
      return;
    }

    // Process rows
    const customers: Record<string, CustomerApi> = {};
    const services: Record<string, ServiceApi> = {};
    const contracts: ContractApi[] = [];
    const roomOccupations: RoomOccupationApi[] = [];
    const errorRows: typeof results.errorRows = [];

    try {
      results.rows.forEach((row, index) => {
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

      // Update results
      setResults({
        ...results,
        processedCount: {
          customers: Object.keys(customers).length,
          contracts: contracts.length,
          services: Object.keys(services).length,
          roomOccupations: roomOccupations.length
        },
        errorRows
      });

      toast({
        title: 'Importação concluída',
        description: `Foram processados ${Object.keys(customers).length} clientes, ${contracts.length} contratos e ${Object.keys(services).length} serviços.`,
      });

      setStatus('success');
    } catch (error) {
      console.error('Error processing import:', error);
      toast({
        title: 'Erro ao processar importação',
        description: String(error),
        variant: 'destructive',
      });
      setStatus('error');
    }
  };

  const downloadErrorsCSV = () => {
    if (results.errorRows.length === 0) return;
    
    const headers = ['Row Index', 'Error', ...Object.keys(results.errorRows[0]?.row || {})];
    const csvContent = [
      headers.join(','),
      ...results.errorRows.map(({ index, error, row }) => {
        const rowValues = Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`);
        return [index, `"${error.replace(/"/g, '""')}"`, ...rowValues].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'conexa_import_errors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    status,
    file,
    results,
    readFile,
    processImport,
    downloadErrorsCSV
  };
}
