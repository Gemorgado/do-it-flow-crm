
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import type { ImportStatus, ImportResults } from './types';

export function useFileReader() {
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

  return {
    status,
    setStatus,
    file,
    results,
    setResults,
    readFile
  };
}
