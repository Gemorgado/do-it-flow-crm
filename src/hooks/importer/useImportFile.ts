
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { readSpreadsheet } from '@/integrations/importer/readSpreadsheet';
import { ImportStep, InternalField } from '@/integrations/importer/types';
import { TemplateStore } from '@/integrations/importer/templateStore';
import type { ImporterState } from './types';

export function useImportFile(
  state: ImporterState,
  setState: React.Dispatch<React.SetStateAction<ImporterState>>
) {
  const { toast } = useToast();

  const handleFileSelect = async (selectedFile: File) => {
    try {
      setState((prev) => ({ ...prev, file: selectedFile, isProcessing: true }));
      
      toast({
        title: 'Processando arquivo',
        description: 'Aguarde enquanto lemos seu arquivo...',
      });
      
      const { headers: fileHeaders, rows: fileRows } = await readSpreadsheet(selectedFile);
      
      if (fileHeaders.length === 0) {
        toast({
          title: 'Erro na leitura do arquivo',
          description: 'Não foi possível detectar as colunas na planilha.',
          variant: 'destructive',
        });
        return;
      }
      
      setState((prev) => ({
        ...prev,
        headers: fileHeaders,
        rows: fileRows
      }));
      
      // Check if this is a "Relatório de Contratos" file
      const isContratosReport = selectedFile.name.includes('Relatório de Contratos') || 
                             (fileHeaders.some(h => h.includes('Razão Social')) && 
                              fileHeaders.some(h => h.includes('CNPJ')) && 
                              fileHeaders.some(h => h.includes('Data Início Contrato')));
                              
      if (isContratosReport) {
        // Try to find the Conexa template
        const templates = TemplateStore.list();
        const conexaTemplate = templates.find(t => t.name === 'Conexa – Relatório de Contratos') || 
                            templates.find(t => t.id === 'conexa_relatorio_contratos');
        
        if (conexaTemplate) {
          toast({
            title: 'Template encontrado',
            description: 'Utilizando template pré-definido para Relatório de Contratos.',
          });
          
          setState(prev => ({
            ...prev,
            mapping: conexaTemplate.columnMap,
            step: 'preview', // Skip the mapping step
            isProcessing: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            step: 'mapping',
            isProcessing: false
          }));
        }
      } else {
        // If not matched or template not found, proceed to normal mapping
        setState(prev => ({
          ...prev,
          step: 'mapping',
          isProcessing: false
        }));
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: 'Erro na leitura do arquivo',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return { handleFileSelect };
}
