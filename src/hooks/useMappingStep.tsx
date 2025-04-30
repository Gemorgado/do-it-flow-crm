
import { useState, useEffect } from 'react';
import { InternalField, MappingTemplate } from '@/integrations/importer/types';
import { suggestColumnMappings } from '@/integrations/importer/headerMappingUtils';
import { TemplateStore } from '@/integrations/importer/templateStore';

export const fieldLabels: Record<InternalField, string> = {
  name: 'Nome',
  docNumber: 'Documento (CNPJ/CPF)',
  email: 'E-mail',
  phone: 'Telefone',
  serviceType: 'Tipo de Serviço',
  roomNumber: 'Número da Sala',
  contractStart: 'Início do Contrato',
  contractEnd: 'Fim do Contrato',
  amount: 'Valor'
};

export const requiredFields: InternalField[] = ['name', 'docNumber', 'serviceType'];

export function useMappingStep(
  headers: string[],
  initialMapping: Record<string, InternalField> = {},
  onMappingChange: (header: string, field: InternalField | '') => void
) {
  const [mapping, setMapping] = useState<Record<string, InternalField>>(initialMapping);
  const [templates, setTemplates] = useState<MappingTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Get suggested mappings when headers change
  useEffect(() => {
    if (headers.length > 0 && Object.keys(mapping).length === 0) {
      const suggestions = suggestColumnMappings(headers);
      setMapping(suggestions);
      
      // Update each mapping individually
      Object.entries(suggestions).forEach(([header, field]) => {
        onMappingChange(header, field);
      });
    }
  }, [headers, mapping, onMappingChange]);

  // Load templates
  useEffect(() => {
    setTemplates(TemplateStore.list());
  }, []);

  const handleMappingChange = (header: string, field: InternalField | '') => {
    const newMapping = { ...mapping };
    
    // If clearing a selection
    if (field === '') {
      delete newMapping[header];
    } else {
      newMapping[header] = field;
    }
    
    setMapping(newMapping);
    onMappingChange(header, field);
  };

  const handleSaveTemplate = (templateName: string) => {
    if (!templateName.trim()) return;
    
    const newTemplate = TemplateStore.save({
      name: templateName.trim(),
      columnMap: mapping
    });
    
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate.id);
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = TemplateStore.get(templateId);
    if (template) {
      // Map the template to current headers
      const newMapping: Record<string, InternalField> = {};
      
      // Find matching headers (exact match or case-insensitive)
      Object.entries(template.columnMap).forEach(([originalHeader, field]) => {
        const matchingHeader = headers.find(
          h => h === originalHeader || h.toLowerCase() === originalHeader.toLowerCase()
        );
        
        if (matchingHeader) {
          newMapping[matchingHeader] = field;
          onMappingChange(matchingHeader, field);
        }
      });
      
      setMapping(newMapping);
      setSelectedTemplate(templateId);
    }
  };

  // Check if all required fields are mapped
  const getMissingRequiredFields = (): InternalField[] => {
    const mappedFields = Object.values(mapping);
    return requiredFields.filter(field => !mappedFields.includes(field));
  };

  const missingFields = getMissingRequiredFields();
  const canContinue = missingFields.length === 0;

  return {
    mapping,
    templates,
    selectedTemplate,
    missingFields,
    canContinue,
    handleMappingChange,
    handleSaveTemplate,
    handleLoadTemplate,
    fieldLabels,
    requiredFields
  };
}
