
import React from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MappingTemplate } from '@/integrations/importer/types';

interface TemplateControlsProps {
  templates: MappingTemplate[];
  selectedTemplate: string | null;
  onLoadTemplate: (templateId: string) => void;
  onSaveTemplate: (name: string) => void;
}

export function TemplateControls({
  templates,
  selectedTemplate,
  onLoadTemplate,
  onSaveTemplate,
}: TemplateControlsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [templateName, setTemplateName] = React.useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    onSaveTemplate(templateName.trim());
    setSaveDialogOpen(false);
    setTemplateName('');
  };

  return (
    <div className="flex items-center space-x-2">
      <Select 
        value={selectedTemplate || ''}
        onValueChange={onLoadTemplate}
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
  );
}
