
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InternalField } from '@/integrations/importer/types';
import { suggestColumnMappings } from '@/integrations/importer/headerMappingUtils';
import { TemplateStore } from '@/integrations/importer/templateStore';
import { MappingTemplate } from '@/integrations/importer/types';

interface MappingStepProps {
  headers: string[];
  previewRows?: Record<string, any>[];
  initialMapping?: Record<string, InternalField>;
  onMappingChange: (mapping: Record<string, InternalField>) => void;
  onContinue: () => void;
  onBack: () => void;
}

const fieldLabels: Record<InternalField, string> = {
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

const requiredFields: InternalField[] = ['name', 'docNumber', 'serviceType'];

export function MappingStep({
  headers,
  previewRows = [],
  initialMapping = {},
  onMappingChange,
  onContinue,
  onBack,
}: MappingStepProps) {
  const [mapping, setMapping] = useState<Record<string, InternalField>>(initialMapping);
  const [templates, setTemplates] = useState<MappingTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Get suggested mappings when headers change
  useEffect(() => {
    if (headers.length > 0 && Object.keys(mapping).length === 0) {
      const suggestions = suggestColumnMappings(headers);
      setMapping(suggestions);
      onMappingChange(suggestions);
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
    onMappingChange(newMapping);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    
    const newTemplate = TemplateStore.save({
      name: templateName.trim(),
      columnMap: mapping
    });
    
    setTemplates([...templates, newTemplate]);
    setSaveDialogOpen(false);
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
        }
      });
      
      setMapping(newMapping);
      onMappingChange(newMapping);
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Mapeamento de Colunas</span>
            
            <div className="flex items-center space-x-2">
              <Select 
                value={selectedTemplate || ''}
                onValueChange={handleLoadTemplate}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Carregar template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Salvar Template</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Salvar Template de Importação</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Nome do template"
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    className="mb-4"
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Coluna na Planilha</TableHead>
                  <TableHead className="w-1/3">Campo no Sistema</TableHead>
                  <TableHead className="w-1/3">Exemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {headers.map(header => {
                  const exampleValue = previewRows.length > 0 ? previewRows[0][header] : '';
                  
                  return (
                    <TableRow key={header}>
                      <TableCell>{header}</TableCell>
                      <TableCell>
                        <Select
                          value={mapping[header] || ''}
                          onValueChange={(value) => handleMappingChange(header, value as InternalField | '')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Não mapear esta coluna</SelectItem>
                            {Object.entries(fieldLabels).map(([field, label]) => (
                              <SelectItem key={field} value={field}>
                                {requiredFields.includes(field as InternalField) ? `${label} *` : label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="truncate max-w-xs">
                        {exampleValue ? String(exampleValue) : ''}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {missingFields.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              <p className="font-medium">Campos obrigatórios não mapeados:</p>
              <ul className="list-disc list-inside mt-1">
                {missingFields.map(field => (
                  <li key={field}>{fieldLabels[field]}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={onContinue} disabled={!canContinue}>
            Continuar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
