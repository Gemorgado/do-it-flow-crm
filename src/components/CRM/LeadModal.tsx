import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PipelineStage, Lead } from '@/types';
import { LeadForm } from '@/components/CRM/LeadForm';
import { LeadFormValues } from '@/types/crm';
import { useAuth } from '@/modules/auth/AuthProvider';
import { persistence } from '@/integrations/persistence';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetStage?: PipelineStage;
  leadToEdit?: Lead;
}

export function LeadModal({ isOpen, onClose, presetStage, leadToEdit }: LeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (data: LeadFormValues & { stageId?: string }) => {
    setIsSubmitting(true);
    
    try {
      if (leadToEdit) {
        // Update existing lead
        const updatedLead: Lead = {
          ...leadToEdit,
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          sourceDetail: data.sourceDetail,
          updatedAt: new Date().toISOString(),
          notes: data.notes || '',
        };
        
        await persistence.updateLead(updatedLead);
        
        toast.success("Lead atualizado com sucesso", {
          description: "O lead foi atualizado no sistema"
        });
      } else {
        // Create new lead
        const newLead: Lead = {
          id: uuidv4(),
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          status: 'novo',
          sourceDetail: data.sourceDetail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stage: presetStage || {
            id: '1',
            name: 'Novo',
            order: 1,
            color: '#3b82f6'
          },
          notes: data.notes || '',
        };
        
        await persistence.createLead(newLead);
        
        toast.success("Lead criado com sucesso", {
          description: "O lead foi adicionado ao sistema"
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      toast.error("Erro ao salvar lead", {
        description: "Não foi possível salvar o lead. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{leadToEdit ? "Editar Lead" : "Novo Lead"}</DialogTitle>
        </DialogHeader>
        
        <LeadForm 
          onSubmit={handleSubmit} 
          onCancel={onClose} 
          presetStage={presetStage}
          leadToEdit={leadToEdit}
          isSubmitting={isSubmitting}
        />
        
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
