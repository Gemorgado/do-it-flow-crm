
import { useState, useEffect } from 'react';

export type ColumnMapping = {
  name?: string;
  docNumber?: string;
  email?: string;
  phone?: string;
  serviceType?: string;
  roomNumber?: string;
  status?: string;
};

export type Headers = string[];

export function useConexaMapper(headers: Headers = []) {
  const [mapping, setMapping] = useState<ColumnMapping>({});

  // Auto-detect column mappings based on common headers
  useEffect(() => {
    if (headers.length === 0) return;

    const commonHeaderMappings: Record<keyof ColumnMapping, string[]> = {
      name: ['nome', 'razão social', 'razao social', 'cliente', 'customer'],
      docNumber: ['cnpj', 'cpf', 'documento', 'document', 'doc number'],
      email: ['email', 'e-mail', 'e mail'],
      phone: ['telefone', 'phone', 'celular', 'tel'],
      serviceType: ['plano', 'serviço', 'servico', 'tipo serviço', 'tipo servico', 'service type'],
      roomNumber: ['sala', 'número sala', 'numero sala', 'espaço', 'espaco', 'room'],
      status: ['status', 'status contrato', 'situação', 'situacao']
    };

    const newMapping: ColumnMapping = {};
    
    // For each field we need to map
    Object.entries(commonHeaderMappings).forEach(([field, possibleHeaders]) => {
      // Check if any of the headers match our list of possible headers for this field
      const matchedHeader = headers.find(header => {
        const headerLower = header.toLowerCase().trim();
        return possibleHeaders.some(possible => headerLower === possible || headerLower.includes(possible));
      });
      
      if (matchedHeader) {
        newMapping[field as keyof ColumnMapping] = matchedHeader;
      }
    });

    setMapping(newMapping);
  }, [headers]);

  return { mapping, setMapping };
}
