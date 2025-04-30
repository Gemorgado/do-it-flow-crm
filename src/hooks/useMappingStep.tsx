
import { useState, useEffect } from 'react';
import { InternalField, MappingTemplate } from '@/integrations/importer/types';
import { suggestColumnMappings } from '@/integrations/importer/headerMappingUtils';
import { TemplateStore } from '@/integrations/importer/templateStore';
import { FIELD_LABELS, REQUIRED_FIELDS } from '@/integrations/importer/fieldLabels';

export function useMappingStep(
  headers: string[],
  initialMapping: Record<string, InternalField | ''> = {},
  onMappingChange: (header: string, field: InternalField | '') => void
) {
  const [mapping, setMapping] = useState<Record<string, InternalField | ''>>(initialMapping);
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
      columnMap: Object.fromEntries(
        Object.entries(mapping).filter(([_, value]) => value !== '')
      ) as Record<string, InternalField>
    });
    
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate.id);
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = TemplateStore.get(templateId);
    if (template) {
      // Map the template to current headers
      const newMapping: Record<string, InternalField | ''> = {};
      
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
    const mappedFields = Object.values(mapping).filter(Boolean) as InternalField[];
    return REQUIRED_FIELDS.filter(field => !mappedFields.includes(field));
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
    fieldLabels: FIELD_LABELS,
    requiredFields: REQUIRED_FIELDS
  };
}
